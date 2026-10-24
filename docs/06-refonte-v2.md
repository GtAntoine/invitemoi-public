# 06 - Refonte V2 : workflow, UX et nouvelle identité

La V2 est une démo autonome : elle tourne entièrement dans le navigateur, sans compte ni backend. Les autres membres sont fictifs et réagissent aux actions du visiteur, pour qu'on puisse parcourir toute l'expérience en deux minutes.

Le code V1 (Supabase, fonctions Netlify) est conservé tel quel dans [`v1/`](../v1).

---

## Ce qui bloquait dans la V1

| Problème V1 | Effet | Réponse V2 |
|---|---|---|
| Inscription obligatoire avant de voir une seule sortie | Le visiteur repart avant d'avoir compris le concept | « Essayer la démo » ouvre l'app en un clic, avec un profil prêt |
| Libellés incohérents (« Pour inviter » filtrait les gens qui veulent être invités) | Le double système, cœur du produit, devenait confus | Un vocabulaire unique : **J'invite** / **Invite-moi** sur les annonces, **Être invité·e** / **Inviter** dans les filtres |
| Bloc de filtres de 5 sections en haut du fil | Les sorties apparaissaient sous la ligne de flottaison | Un sélecteur à 3 positions, une frise de dates, des catégories qui défilent, la ville dans une feuille |
| Bouton de candidature sur la carte, sans contexte | Des candidatures envoyées sans lire l'annonce | Carte → fiche détaillée (points communs, profil de l'hôte) → feuille de candidature |
| Deux formulaires séparés pour créer | Il fallait choisir son rôle avant de savoir quoi publier | Un seul parcours en 4 étapes, avec aperçu avant publication |
| Swipe réservé au mobile, dans une liste | Le geste « signature » passait inaperçu | Une pile de cartes plein écran, swipe souris et tactile, flèches du clavier, boutons toujours visibles |
| Accepter un candidat ne fermait pas les autres candidatures | Ambiguïté sur qui vient vraiment | Choisir quelqu'un clôt les autres candidatures (sortie à deux), écran de match, annulation possible |
| Pas d'endroit pour voir ses prochaines sorties | Le résultat concret de l'app (une sortie prévue) était invisible | « Tes prochaines sorties » en tête de Mes sorties |

---

## Le parcours

```
Accueil ── Essayer la démo ──► Explorer
   │                              │
   └─ Créer mon profil            ├─► Fiche sortie ──► Feuille de candidature ──► Confirmation
      (prénom, intérêts,          │                                                    │
       premier pas)               │                    (≈10 s plus tard) toast « C'est un match »
                                  │
   Bouton + ──► Créer : Envie → Sortie → Quand et où → Aperçu ──► Publiée
                                                                     │
                                       (6 s, 14 s, 26 s) candidatures simulées
                                                                     ▼
   Mes sorties ──► Trier les candidats (pile de cartes) ──► Match ──► Contact révélé
```

### Navigation

- **Mobile** : barre d'onglets en bas (Explorer, Mes sorties, **+**, Activité, Profil). Elle disparaît pendant les parcours ciblés (création, tri des candidats) pour laisser toute la place à la tâche.
- **Desktop** : navigation en haut, bouton « Créer une annonce » toujours visible.
- Pastilles de notification sur Mes sorties (nouvelles candidatures, réponses reçues) et sur Activité.

### Le tri des candidats

- Glisser à droite : **Choisir**. Glisser à gauche : **Passer**. Les boutons font la même chose, les flèches ← → aussi.
- Pas de tutoriel : la première carte se balance une seule fois pour suggérer le geste (fonctionnalité cachée, fidèle à l'intention de la V1).
- Chaque carte met en avant le message du candidat et les **centres d'intérêt en commun**, surlignés.
- Passer quelqu'un s'annule depuis le toast. Les candidatures passées restent consultables (« Reconsidérer »).

### Confiance

- L'Instagram n'est partagé qu'après un match, et seulement si la personne l'a choisi au moment de candidater.
- Profils vérifiés, note moyenne et nombre de sorties visibles avant de choisir.

---

## Identité visuelle

Le glassmorphism bleu/violet de la V1 a laissé place à une direction plus chaude et éditoriale, pensée comme des affiches de sortie.

- **Couleurs** : fond crème, encre presque noire, **corail** pour « J'invite » (celui qui offre), **safran** pour « Invite-moi » (celui qui cherche un hôte). Chaque rôle a sa couleur partout dans l'app.
- **Typographie** : Bricolage Grotesque pour les titres, Inter pour le texte, auto-hébergées.
- **Couvertures** : chaque catégorie a sa couleur d'affiche et son pictogramme géant, avec un tampon de date. Pas de photos à charger, rendu identique hors ligne.
- **Mode sombre** complet, piloté par des variables CSS (clair, sombre ou auto dans les réglages).
- **Mouvement** : transitions courtes, ressorts sur les validations, respect de `prefers-reduced-motion`.

---

## Architecture de la démo

```
src/
├── lib/
│   ├── seed.ts       Membres, annonces et candidatures de départ (dates relatives à aujourd'hui)
│   ├── store.tsx     État global (useReducer), persistance localStorage, moteur de simulation
│   ├── catalog.ts    Catégories, libellés des deux rôles, villes, centres d'intérêt
│   └── theme.tsx     Thème clair / sombre / auto
├── components/       AppShell, EventCard, SwipeDeck, ApplySheet, MatchOverlay, primitives UI
└── pages/            Landing, Welcome, Explore, OutingDetail, Create, MyOutings, ManageOuting,
                      Activity, Profile, Settings
```

Le moteur de simulation stocke des événements datés (`scheduled`) dans l'état : une candidature entrante, une réponse d'hôte. Un minuteur les déclenche à échéance, ce qui survit aux changements de page et aux rechargements. « Réinitialiser la démo » dans les réglages remet le jeu de données de départ.

### Lancer en local

```bash
npm install
npm run dev
```
