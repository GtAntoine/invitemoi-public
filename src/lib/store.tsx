import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';
import type { Activity, Application, ApplicationStatus, DemoState, Outing, ScheduledEvent, User } from './types';
import { createSeed, DEMO_USER_ID, SEED_VERSION, SIMULATED_RESPONDERS } from './seed';
import { useToast } from '../components/ui/Toast';

const STORAGE_KEY = 'invitemoi-demo';

type Action =
  | { type: 'sign-in'; userId: string; patch?: Partial<User> }
  | { type: 'sign-out' }
  | { type: 'reset' }
  | { type: 'update-user'; userId: string; patch: Partial<User> }
  | { type: 'add-outing'; outing: Outing; scheduled: ScheduledEvent[] }
  | { type: 'delete-outing'; outingId: string }
  | { type: 'add-application'; application: Application; scheduled: ScheduledEvent[] }
  | { type: 'withdraw'; applicationId: string }
  | { type: 'set-statuses'; statuses: Record<string, ApplicationStatus> }
  | { type: 'mark-owner-seen'; outingId: string }
  | { type: 'mark-applicant-seen' }
  | { type: 'mark-activity-read' }
  | { type: 'run-scheduled'; events: ScheduledEvent[]; now: string };

const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case 'sign-in':
      return {
        ...state,
        meId: action.userId,
        users: action.patch ? { ...state.users, [action.userId]: { ...state.users[action.userId], ...action.patch } } : state.users,
      };
    case 'sign-out':
      return { ...state, meId: null };
    case 'reset':
      return { ...createSeed(), meId: state.meId };
    case 'update-user':
      return {
        ...state,
        users: { ...state.users, [action.userId]: { ...state.users[action.userId], ...action.patch } },
      };
    case 'add-outing':
      return { ...state, outings: [action.outing, ...state.outings], scheduled: [...state.scheduled, ...action.scheduled] };
    case 'delete-outing':
      return {
        ...state,
        outings: state.outings.filter((o) => o.id !== action.outingId),
        applications: state.applications.filter((a) => a.outingId !== action.outingId),
        activity: state.activity.filter((a) => a.outingId !== action.outingId),
        scheduled: state.scheduled.filter(
          (s) => !(s.action.type === 'incoming-application' && s.action.outingId === action.outingId),
        ),
      };
    case 'add-application':
      return {
        ...state,
        applications: [...state.applications, action.application],
        scheduled: [...state.scheduled, ...action.scheduled],
      };
    case 'withdraw':
      return {
        ...state,
        applications: state.applications.filter((a) => a.id !== action.applicationId),
        scheduled: state.scheduled.filter(
          (s) => !(s.action.type === 'owner-responds' && s.action.applicationId === action.applicationId),
        ),
      };
    case 'set-statuses':
      return {
        ...state,
        applications: state.applications.map((a) =>
          action.statuses[a.id] ? { ...a, status: action.statuses[a.id], seenByOwner: true } : a,
        ),
      };
    case 'mark-owner-seen':
      return {
        ...state,
        applications: state.applications.map((a) => (a.outingId === action.outingId ? { ...a, seenByOwner: true } : a)),
      };
    case 'mark-applicant-seen':
      return {
        ...state,
        applications: state.applications.map((a) => (a.userId === state.meId ? { ...a, seenByApplicant: true } : a)),
      };
    case 'mark-activity-read':
      return { ...state, activity: state.activity.map((a) => ({ ...a, read: true })) };
    case 'run-scheduled': {
      let next = { ...state, scheduled: state.scheduled.filter((s) => !action.events.some((e) => e.id === s.id)) };
      for (const event of action.events) {
        const a = event.action;
        if (a.type === 'incoming-application') {
          if (!next.outings.some((o) => o.id === a.outingId)) continue;
          if (next.applications.some((x) => x.outingId === a.outingId && x.userId === a.userId)) continue;
          const application: Application = {
            id: uid('a'),
            outingId: a.outingId,
            userId: a.userId,
            message: a.message,
            shareInstagram: true,
            status: 'pending',
            createdAt: action.now,
            seenByOwner: false,
            seenByApplicant: true,
          };
          next = {
            ...next,
            applications: [...next.applications, application],
            activity: [activity('new-application', a.outingId, a.userId, action.now), ...next.activity],
          };
        } else {
          const target = next.applications.find((x) => x.id === a.applicationId);
          if (!target || target.status !== 'pending') continue;
          const outing = next.outings.find((o) => o.id === target.outingId);
          next = {
            ...next,
            applications: next.applications.map((x) =>
              x.id === a.applicationId ? { ...x, status: a.accept ? 'accepted' : 'declined', seenByApplicant: false } : x,
            ),
            activity: [
              activity(a.accept ? 'accepted' : 'declined', target.outingId, outing?.ownerId, action.now),
              ...next.activity,
            ],
          };
        }
      }
      return next;
    }
  }
}

function activity(type: Activity['type'], outingId: string, userId: string | undefined, createdAt: string): Activity {
  return { id: uid('act'), type, outingId, userId, createdAt, read: false };
}

function load(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DemoState;
      if (parsed.version === SEED_VERSION) return parsed;
    }
  } catch {
    // Stockage indisponible (navigation privée…) : on repart du jeu de données.
  }
  return createSeed();
}

interface DemoApi {
  state: DemoState;
  me: User | null;
  user: (id: string) => User;
  outing: (id: string) => Outing | undefined;
  applicationsFor: (outingId: string) => Application[];
  myApplicationTo: (outingId: string) => Application | undefined;
  signIn: (profile?: Partial<User>) => void;
  signOut: () => void;
  reset: () => void;
  updateMe: (patch: Partial<User>) => void;
  createOuting: (data: Omit<Outing, 'id' | 'ownerId' | 'createdAt'>) => string;
  deleteOuting: (outingId: string) => void;
  apply: (outingId: string, message: string, shareInstagram: boolean) => void;
  withdraw: (applicationId: string) => void;
  setStatuses: (statuses: Record<string, ApplicationStatus>) => void;
  markOwnerSeen: (outingId: string) => void;
  markApplicantSeen: () => void;
  markActivityRead: () => void;
}

const DemoContext = createContext<DemoApi | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  const toast = useToast();
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Sans stockage, la démo fonctionne quand même pour la session en cours.
    }
  }, [state]);

  // Moteur de simulation : fait vivre la démo (candidatures entrantes, réponses des hôtes).
  useEffect(() => {
    const timer = window.setInterval(() => {
      const current = stateRef.current;
      const now = Date.now();
      const due = current.scheduled.filter((s) => s.dueAt <= now);
      if (due.length === 0) return;
      dispatch({ type: 'run-scheduled', events: due, now: new Date(now).toISOString() });
      for (const event of due) {
        const a = event.action;
        if (a.type === 'incoming-application') {
          const outing = current.outings.find((o) => o.id === a.outingId);
          if (!outing) continue;
          const name = current.users[a.userId]?.firstName;
          toast.show({
            title: outing.kind === 'offer' ? `${name} veut venir` : `${name} propose de t'inviter`,
            body: outing.title,
            tone: 'info',
            href: `/mes-sorties/${outing.id}`,
            actionLabel: 'Voir',
          });
        } else {
          const app = current.applications.find((x) => x.id === a.applicationId);
          const outing = app && current.outings.find((o) => o.id === app.outingId);
          if (!outing || app?.status !== 'pending') continue;
          const owner = current.users[outing.ownerId]?.firstName;
          toast.show({
            title: a.accept ? `C'est un match avec ${owner} !` : `${owner} a choisi quelqu'un d'autre`,
            body: outing.title,
            tone: a.accept ? 'success' : 'neutral',
            href: '/mes-sorties?onglet=demandes',
            actionLabel: 'Voir',
          });
        }
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [toast]);

  const user = useCallback((id: string) => state.users[id], [state.users]);

  const createOuting = useCallback<DemoApi['createOuting']>((data) => {
    const id = uid('o');
    const now = Date.now();
    const responders = [...SIMULATED_RESPONDERS].sort(() => Math.random() - 0.5).slice(0, 3);
    const delays = [6000, 14000, 26000];
    const scheduled: ScheduledEvent[] = responders.map((r, i) => ({
      id: uid('s'),
      dueAt: now + delays[i],
      action: { type: 'incoming-application', outingId: id, userId: r.userId, message: data.kind === 'offer' ? r.offer : r.wish },
    }));
    dispatch({
      type: 'add-outing',
      outing: { ...data, id, ownerId: stateRef.current.meId ?? DEMO_USER_ID, createdAt: new Date(now).toISOString() },
      scheduled,
    });
    return id;
  }, []);

  const apply = useCallback<DemoApi['apply']>((outingId, message, shareInstagram) => {
    const now = Date.now();
    const id = uid('a');
    dispatch({
      type: 'add-application',
      application: {
        id,
        outingId,
        userId: stateRef.current.meId ?? DEMO_USER_ID,
        message,
        shareInstagram,
        status: 'pending',
        createdAt: new Date(now).toISOString(),
        seenByOwner: false,
        seenByApplicant: true,
      },
      // Dans la démo, l'hôte répond toujours favorablement, après quelques secondes.
      scheduled: [{ id: uid('s'), dueAt: now + 9000, action: { type: 'owner-responds', applicationId: id, accept: true } }],
    });
  }, []);

  const api = useMemo<DemoApi>(
    () => ({
      state,
      me: state.meId ? state.users[state.meId] : null,
      user,
      outing: (id) => state.outings.find((o) => o.id === id),
      applicationsFor: (outingId) => state.applications.filter((a) => a.outingId === outingId),
      myApplicationTo: (outingId) => state.applications.find((a) => a.outingId === outingId && a.userId === state.meId),
      signIn: (profile) => dispatch({ type: 'sign-in', userId: DEMO_USER_ID, patch: profile }),
      signOut: () => dispatch({ type: 'sign-out' }),
      reset: () => dispatch({ type: 'reset' }),
      updateMe: (patch) => state.meId && dispatch({ type: 'update-user', userId: state.meId, patch }),
      createOuting,
      deleteOuting: (outingId) => dispatch({ type: 'delete-outing', outingId }),
      apply,
      withdraw: (applicationId) => dispatch({ type: 'withdraw', applicationId }),
      setStatuses: (statuses) => dispatch({ type: 'set-statuses', statuses }),
      markOwnerSeen: (outingId) => dispatch({ type: 'mark-owner-seen', outingId }),
      markApplicantSeen: () => dispatch({ type: 'mark-applicant-seen' }),
      markActivityRead: () => dispatch({ type: 'mark-activity-read' }),
    }),
    [state, user, createOuting, apply],
  );

  return <DemoContext.Provider value={api}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo doit être utilisé dans <DemoProvider>');
  return ctx;
}

/** Compteurs affichés en pastille sur « Mes sorties ». */
export function useBadges() {
  const { state } = useDemo();
  return useMemo(() => {
    const mine = new Set(state.outings.filter((o) => o.ownerId === state.meId).map((o) => o.id));
    const incoming = state.applications.filter((a) => mine.has(a.outingId) && !a.seenByOwner && a.status === 'pending').length;
    const answers = state.applications.filter((a) => a.userId === state.meId && !a.seenByApplicant).length;
    const unreadActivity = state.activity.filter((a) => !a.read).length;
    return { incoming, answers, total: incoming + answers, unreadActivity };
  }, [state]);
}
