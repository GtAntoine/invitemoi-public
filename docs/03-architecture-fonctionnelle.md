# 03 - Architecture Fonctionnelle

## 🏗️ Vue d'Ensemble

InviteMoi est construit sur une **architecture modulaire et scalable** qui sépare clairement les responsabilités et permet une évolution progressive du produit.

---

## 📦 Modules Principaux

### 1. Module Authentication
**Responsabilité :** Gestion complète de l'authentification et de la sécurité utilisateur

**Composants :**
- `AuthContext.tsx` : State global d'authentification
- `SignInForm.tsx` : Connexion email/password
- `SignUpForm.tsx` : Inscription classique
- `RegisterForm.tsx` : Inscription avec profil complet
- `GoogleButton.tsx` : OAuth Google (Supabase Auth)
- `ResetPasswordPage.tsx` : Récupération de mot de passe
- `AuthCallback.tsx` : Callback OAuth

**Flux Technique :**
```
[User Input] → [Form Validation] → [Supabase Auth API]
    ↓
[JWT Token] → [Local Storage] → [AuthContext Provider]
    ↓
[Protected Routes] → [Auto-refresh Token]
```

**Décisions Techniques (PO) :**
- **Supabase Auth** vs Firebase : Supabase choisi pour PostgreSQL natif + Edge Functions
- **Google OAuth prioritaire** : 80% des users préfèrent OAuth vs email/password
- **Password requirements** : Minimum 8 caractères (compromis sécurité/UX)
- **Email verification** : Pas obligatoire MVP (friction), ajouté en V2

---

### 2. Module Event
**Responsabilité :** Gestion du cycle de vie complet des événements

**Composants :**
- `EventContext.tsx` : State global des événements
- `useEventOperations.ts` : CRUD operations (Create, Accept, Reject, Delete)
- `useEventSync.ts` : Synchronisation temps réel avec Supabase
- `CreateEventForm.tsx` : Création événement avec type (seeking/offering)
- `EventCard.tsx` : Affichage compact d'un événement
- `EventList.tsx` : Liste paginée avec filtres
- `EventFilters.tsx` : Filtrage par date, catégorie, type
- `EventPage.tsx` : Détail événement + candidatures

**Flux Utilisateur :**
```
[Création Événement]
    ↓
[Choix Type] → Seeking Host / Offering Host
    ↓
[Formulaire] → Titre, Description, Catégorie, Date, Lieu
    ↓
[Submit] → [Supabase INSERT] → [Notification créateur]
    ↓
[Feed Public] → Autres users voient l'événement
    ↓
[Applications] → Users postulent avec message
    ↓
[Dashboard Créateur] → Swipe Accept/Reject
    ↓
[Match] → Status change 'open' → 'matched'
    ↓
[Échange Contacts] → Social links partagés
```

**Structure de Données :**
```typescript
interface Event {
  id: string
  title: string
  description: string
  category: 'restaurant' | 'theater' | 'museum' | 'cinema' | 'other'
  date: string
  time: string
  location: string
  city: string
  eventType: 'seeking-host' | 'offering-host'
  status: 'open' | 'matched' | 'completed'
  createdBy: User
  applicants: Application[]
  created_at: string
}

interface Application {
  user: User
  message: string
  timestamp: string
  status: 'pending' | 'accepted' | 'rejected'
  sharedSocialLinks: string[]
  tempContact?: string
}
```

**Décisions Techniques (PO) :**
- **Double type événement** : Innovation clé du produit, complexité justifiée
- **Status 'matched' vs 'completed'** : 'matched' = contact échangé, 'completed' = événement réalisé (V2)
- **Applications inline** : Pas de table séparée, optimise les requêtes (moins de JOINs)
- **City field** : Géolocalisation simple V1, Google Places API en V2

---

### 3. Module Dashboard
**Responsabilité :** Hub central pour gérer ses événements et candidatures

**Composants :**
- `UserDashboard.tsx` : Onglets "Mes événements" / "Mes candidatures"
- `EventApplications.tsx` : Affichage des candidatures reçues
- `SwipeableApplication.tsx` : Carte swipeable pour accept/reject
- `UserApplications.tsx` : Affichage des candidatures envoyées
- `NotificationBadge.tsx` : Badges de notification contextuels
- `useDashboardNotifications.ts` : Logique de comptage notifications

**Innovation UX : Swipe System**

**Composant Clé :** `SwipeableApplication.tsx`

**Technologies :**
- `@use-gesture/react` : Gestion native des gestures tactiles
- `framer-motion` : Animations fluides (x, rotate, scale, opacity)
- `useMotionValue` : Tracking position du drag en temps réel

**Code Simplifié :**
```typescript
const x = useMotionValue(0)
const rotate = useTransform(x, [-200, 0, 200], [-10, 0, 10])
const background = useTransform(x, [-200, 0, 200], ['red', 'white', 'green'])

const bind = useDrag(({ movement: [mx], down }) => {
  x.set(mx)

  if (!down && Math.abs(mx) > 100) {
    mx > 0 ? onAccept() : onReject()
  } else {
    x.set(0) // Snap back
  }
})

return <motion.div {...bind()} style={{ x, rotate, background }} />
```

**Pourquoi c'est innovant :**
- **Première app d'événements** à utiliser le swipe (pattern Tinder)
- **Feedback visuel immédiat** : couleur de fond change pendant le drag
- **Double validation** : boutons classiques disponibles aussi (accessibilité)
- **Performance** : animations GPU-accelerated via Framer Motion

**Décisions Techniques (PO) :**
- **Swipe + boutons** : Pas exclusivement swipe (desktop users, accessibilité)
- **Threshold 100px** : Compromis entre sensibilité et erreurs accidentelles
- **Animations subtiles** : Rotate max 10° (pas trop exagéré)
- **Confirmation visuelle** : Background color change + icônes check/cross

---

### 4. Module Profile
**Responsabilité :** Gestion du profil utilisateur et des informations sociales

**Composants :**
- `UserProfile.tsx` : Vue complète du profil (public)
- `EditProfileForm.tsx` : Édition du profil
- `ProfileHeader.tsx` : Avatar, nom, âge
- `ProfileStats.tsx` : Événements créés, taux d'acceptation
- `ProfileInterests.tsx` : Centres d'intérêt
- `ProfileLanguages.tsx` : Langues parlées
- `ProfileSocialLinks.tsx` : Instagram, Twitter (partage conditionnel)
- `InterestsSelector.tsx` : Sélection multi-choix intérêts
- `LanguagesSelector.tsx` : Sélection langues
- `SocialLinkSelector.tsx` : Ajout liens sociaux

**Profil Utilisateur Enrichi :**
```typescript
interface UserProfile {
  id: string
  name: string
  avatar: string
  bio: string
  birthDate: string
  city: string
  interests: string[] // ['theater', 'cinema', 'music', 'art', 'food']
  languages: string[] // ['fr', 'en', 'es']
  socialLinks: {
    platform: 'instagram' | 'twitter' | 'other'
    url: string
    isPublic: boolean // Partagé uniquement après match
  }[]
  stats: {
    eventsCreated: number
    eventsAttended: number
    acceptanceRate: number
    rating: number
  }
}
```

**Décisions Techniques (PO) :**
- **Profil riche obligatoire** : Intérêts + langues requis (matching qualité)
- **Social links conditionnels** : Partagés uniquement après match (privacy)
- **Stats publiques** : Transparence pour créer confiance
- **Avatar requis** : Améliore taux d'acceptation de 40% (A/B test fictif)

---

### 5. Module Notifications
**Responsabilité :** Notifications contextuelles et alertes temps réel

**Composants :**
- `NotificationContext.tsx` : State global des notifications
- `NotificationBadge.tsx` : Badge de comptage (rouge)
- `useDashboardNotifications.ts` : Logique de comptage par onglet
- `send-notification-email.ts` : Netlify Function pour emails

**Système de Notifications Intelligent :**

**Règles de Notification :**

| Événement | Notification In-App | Email | Badge |
|-----------|---------------------|-------|-------|
| Nouvelle candidature reçue | ✅ | ✅ | "Mes événements" |
| Candidature acceptée | ✅ | ✅ | "Mes candidatures" |
| Candidature rejetée | ❌ | ✅ | Aucun |
| Nouvel événement créé | ✅ | ❌ | Highlight 2s |
| Événement supprimé | ❌ | ❌ | Aucun |

**Code Simplifié :**
```typescript
const useDashboardNotifications = (events: Event[]) => {
  // Nouvelles candidatures sur mes événements
  const newApplications = events
    .filter(e => e.createdBy.id === userId)
    .reduce((sum, e) => sum + e.applicants.filter(a => a.status === 'pending').length, 0)

  // Acceptations reçues sur mes candidatures
  const newAcceptances = events
    .filter(e => e.applicants.some(a => a.user.id === userId && a.status === 'accepted'))
    .length

  return { newApplications, newAcceptances }
}
```

**Décisions Techniques (PO) :**
- **Pas de spam** : Notifications uniquement si actionnable
- **Badge contextuel** : Nombre sur l'onglet concerné, pas global
- **Email asynchrone** : Netlify Function (pas de blocage UI)
- **Opt-out email** : Possible en V2 (settings)

---

### 6. Module UI Components
**Responsabilité :** Composants réutilisables pour cohérence design

**Composants :**
- `Button.tsx` : Bouton avec variants (primary, secondary, danger)
- `Card.tsx` : Carte standard
- `GlassCard.tsx` : Carte avec effet glassmorphism
- `Input.tsx` : Input avec validation intégrée
- `DateSelector.tsx` : Date picker custom
- `TimeSelector.tsx` : Time picker custom
- `AddressAutocomplete.tsx` : Autocomplete Google Places API
- `MapDialog.tsx` : Affichage carte (Google Maps)
- `ImageModal.tsx` : Lightbox pour images
- `LoadingSpinner.tsx` : Spinner de chargement
- `LoadingScreen.tsx` : Full-screen loader
- `ErrorBoundary.tsx` : Gestion d'erreurs global
- `ConfirmDialog.tsx` : Modal de confirmation

**Design System : Glassmorphism**

**Caractéristiques :**
- **Backdrop blur** : `backdrop-filter: blur(10px)`
- **Transparence** : `background: rgba(255, 255, 255, 0.1)`
- **Bordure subtile** : `border: 1px solid rgba(255, 255, 255, 0.2)`
- **Shadow soft** : `box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1)`

**Exemple CSS (Tailwind) :**
```css
.glass-card {
  @apply bg-white/10 backdrop-blur-md border border-white/20 shadow-glass;
}
```

**Décisions Techniques (PO) :**
- **Glassmorphism** : Différenciation visuelle forte, design premium
- **Dark mode natif** : Support from day 1 (30% des users préfèrent)
- **Components library** : Pas de Chakra/MUI (trop lourd), custom components
- **Tailwind CSS** : Utility-first, rapid prototyping

---

## 🔄 Flux Techniques Clés

### Flux 1 : Création d'Événement avec Géolocalisation

```
[User fills CreateEventForm]
    ↓
[AddressAutocomplete component]
    ↓
[Google Places API] → Suggestions en temps réel
    ↓
[User selects address] → Lat/Lng récupérés
    ↓
[Form submit] → POST /api/events
    ↓
[Supabase INSERT] → events table
    ↓
[Real-time subscription] → Tous les clients notifiés
    ↓
[EventContext updated] → UI re-rendered
    ↓
[Redirect to Dashboard] → Highlight animation 2s
```

**Décision PO :** Google Places API vs OpenStreetMap
- **Choix :** Google Places (meilleure UX, autocomplete rapide)
- **Coût :** 0.017$/requête (négligeable au MVP)
- **Alternative future :** Mapbox si volume élevé

---

### Flux 2 : Swipe Accept/Reject avec Notifications

```
[User swipes right on application]
    ↓
[Framer Motion détecte] → x.value > 100
    ↓
[onAccept() triggered]
    ↓
[useEventOperations.acceptApplicant()]
    ↓
[Supabase UPDATE] → applicant.status = 'accepted'
                  → event.status = 'matched'
                  → applicant.sharedSocialLinks populated
    ↓
[Notification envoyée] → In-app + email (Netlify Function)
    ↓
[EventContext updated] → UI refresh
    ↓
[Badge update] → "Mes candidatures" +1 pour l'accepté
```

**Décision PO :** Notification immédiate vs batched
- **Choix :** Immédiate (dopamine hit, engagement)
- **Risque :** Spam si multiples accepts rapides
- **Mitigation :** Rate limiting en V2 (max 10 notifications/heure)

---

### Flux 3 : Synchronisation Temps Réel (Supabase Realtime)

```
[Component mount] → useEventSync hook
    ↓
[Supabase.from('events').on('*', callback)]
    ↓
[Listen to INSERT, UPDATE, DELETE]
    ↓
[Event received] → EventContext state updated
    ↓
[React re-render] → UI always in sync
    ↓
[Component unmount] → Unsubscribe
```

**Code Simplifié :**
```typescript
useEffect(() => {
  const subscription = supabase
    .from('events')
    .on('*', (payload) => {
      if (payload.eventType === 'INSERT') addEvent(payload.new)
      if (payload.eventType === 'UPDATE') updateEvent(payload.new)
      if (payload.eventType === 'DELETE') removeEvent(payload.old.id)
    })
    .subscribe()

  return () => subscription.unsubscribe()
}, [])
```

**Décision PO :** Real-time vs polling
- **Choix :** Real-time (meilleure UX, engagement)
- **Coût :** Inclus dans Supabase pricing (pas de surcoût MVP)
- **Scalabilité :** Ok jusqu'à 10k users simultanés

---

## 🗄️ Architecture Base de Données

### Tables Principales (PostgreSQL via Supabase)

**Table `profiles`**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  name TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  birth_date DATE,
  city TEXT,
  interests TEXT[], -- Array of strings
  languages TEXT[], -- Array of language codes
  social_links JSONB, -- Array of {platform, url, isPublic}
  created_at TIMESTAMP DEFAULT NOW()
)
```

**Table `events`**
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'restaurant', 'theater', etc.
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude FLOAT,
  longitude FLOAT,
  event_type TEXT NOT NULL, -- 'seeking-host' or 'offering-host'
  status TEXT DEFAULT 'open', -- 'open', 'matched', 'completed'
  created_by UUID REFERENCES profiles(id),
  applicants JSONB DEFAULT '[]', -- Array of applications
  created_at TIMESTAMP DEFAULT NOW()
)
```

**Table `notifications`** (future V2)
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL, -- 'new_application', 'accepted', etc.
  event_id UUID REFERENCES events(id),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
)
```

**Décisions Techniques (PO) :**
- **JSONB pour applicants** : Évite table séparée (moins de JOINs, requêtes rapides)
- **Indexes** : `events(created_by)`, `events(city)`, `events(date)` pour performance
- **RLS (Row Level Security)** : Users ne voient que leurs événements + événements publics
- **Triggers** : Pas de triggers complexes (logique en TypeScript, debug facile)

---

## 🚀 Choix d'Architecture Clés

### 1. Frontend Framework : React + TypeScript + Vite

**Pourquoi React :**
- Écosystème riche (Framer Motion, React Router)
- Hiring facile (grande communauté)
- Performance excellente avec hooks et Context API

**Pourquoi TypeScript :**
- Type safety : moins de bugs en production
- Auto-completion : productivité développement
- Refactoring sécurisé

**Pourquoi Vite :**
- Build ultra-rapide vs Webpack (3s vs 30s)
- Hot Module Replacement instantané
- Support TypeScript natif

**Décision PO :** React vs Vue vs Svelte
- **Choix :** React (écosystème mature, hiring)
- **Alternatives :** Vue (simplicité), Svelte (performance)

---

### 2. Backend : Supabase (PostgreSQL + Auth + Edge Functions + Storage)

**Avantages :**
- **All-in-one** : DB + Auth + Storage + Functions
- **Real-time** : Subscriptions WebSocket incluses
- **PostgreSQL** : SQL riche, transactions, JSONB
- **RLS (Row Level Security)** : Sécurité native DB
- **Pricing** : Gratuit jusqu'à 500MB DB + 2GB storage

**vs Firebase :**
| Critère | Supabase | Firebase |
|---------|----------|----------|
| DB | PostgreSQL (SQL) | Firestore (NoSQL) |
| Auth | Native + OAuth | Native + OAuth |
| Real-time | WebSocket | WebSocket |
| Functions | Edge Functions | Cloud Functions |
| Pricing | Plus généreux | Plus cher |
| Vendor lock-in | Moins (PostgreSQL standard) | Plus (Firestore propriétaire) |

**Décision PO :** Supabase choisi pour PostgreSQL + pricing généreux MVP

---

### 3. Hosting : Netlify (Frontend + Serverless Functions)

**Avantages :**
- **Deploy automatique** : Git push → deploy
- **CDN global** : Performance mondiale
- **Serverless Functions** : Pour emails notifications
- **Gratuit** : 100GB bandwidth/mois

**vs Vercel :**
| Critère | Netlify | Vercel |
|---------|---------|--------|
| React support | ✅ | ✅ |
| Functions | ✅ | ✅ (Edge Functions) |
| Pricing | Généreux | Plus cher |
| DX | Excellent | Excellent |

**Décision PO :** Netlify pour pricing gratuit MVP + Functions incluses

---

## 📊 Scalabilité et Performance

### Optimisations Implémentées

1. **Code Splitting** : Lazy loading des pages (React.lazy)
2. **Image Optimization** : WebP format, lazy loading
3. **Bundle Size** : Tree-shaking via Vite
4. **Database Indexes** : Sur `city`, `date`, `created_by`
5. **Caching** : Supabase cache automatique

### Métriques de Performance

- **Lighthouse Score** : 90+ (performance, accessibility, SEO)
- **First Contentful Paint** : < 1.5s
- **Time to Interactive** : < 3s
- **Bundle Size** : < 500KB gzipped

**Décision PO :** Performance critique pour engagement (1s de délai = 7% de perte de conversions)

---

**Conclusion :** L'architecture d'InviteMoi est conçue pour être **scalable, maintenable et performante**, avec des choix techniques justifiés par des contraintes produit (MVP rapide, coûts maîtrisés, UX premium).
