# 🎭 InviteMoi — Product Owner Case Study

> Portfolio complet de Product Ownership autour de [InviteMoi](https://invitemoi.netlify.app/),
> une plateforme sociale innovante qui réinvente le partage d'expériences culturelles

<div align="center">
  <img src="./docs/landing-hero.png" alt="Interface InviteMoi" width="100%" />
  <br/>
  <em>Landing page de l'application InviteMoi</em>
</div>

---

## 🔗 Liens Utiles

- **Application Live :** [invitemoi.netlify.app](https://invitemoi.netlify.app/)
- **Repository :** Ce projet

---

## 👋 Contexte

**InviteMoi** est une plateforme sociale révolutionnaire qui transforme la façon dont les gens partagent des expériences culturelles. L'application permet aux utilisateurs de :

- **Se faire inviter** → Profiter d'événements culturels sans dépenser
- **Inviter quelqu'un** → Offrir des expériences et créer des connexions authentiques
- **Swiper les candidatures** → Interface Tinder-like pour gérer les demandes
- **Construire son profil social** → Centres d'intérêt, langues, liens sociaux

### 🎯 La différence InviteMoi

Contrairement aux applications d'événements classiques (Meetup, Eventbrite), InviteMoi introduit un **double système unique** :

- **"Je cherche un hôte"** : Vous créez un événement et quelqu'un vous invite
- **"Je propose d'inviter"** : Vous proposez d'inviter quelqu'un à un événement

Ce système inversé crée une **dynamique sociale innovante** où les rôles sont flexibles et où chacun peut à la fois offrir et recevoir.

Ce repo documente **mon travail de Product Owner** sur ce produit :
- Vision produit et positionnement marché
- Personas utilisateurs
- Architecture fonctionnelle
- Fonctionnalités innovantes
- Design UX/UI différenciant
- KPIs et mesure d'impact

---

## 🔍 Contenu du Portfolio

Les documents détaillés se trouvent dans le dossier [`docs/`](./docs).

- **[01 - Vision Produit](./docs/01-vision-produit.md)**
  Problème, solution, proposition de valeur unique

- **[02 - Personas](./docs/02-personas.md)**
  Profils utilisateurs, motivations, pain points

- **[03 - Architecture Fonctionnelle](./docs/03-architecture-fonctionnelle.md)**
  Modules, flux utilisateur, choix d'architecture

- **[04 - Innovation UX](./docs/04-innovation-ux.md)**
  Système de swipe, double flux, notifications temps réel

- **[05 - Post-Mortem & Learnings](./docs/05-post-mortem.md)**
  Analyse honnête de l'échec, causes, learnings pour futurs projets

---

## 🚀 Innovations Produit

### 1. Système de Swipe pour Candidatures

**Première application d'événements culturels** à intégrer le swipe (popularisé par Tinder) pour gérer les candidatures :

- **Swipe droite** → Accepter la candidature
- **Swipe gauche** → Refuser poliment
- **Indicateurs visuels** → Feedback immédiat avec animations
- **Double confirmation** → Boutons de validation pour éviter les erreurs

```
[Photo candidat] → Swipe → [Animation] → [Notification envoyée]
```

**Pourquoi c'est innovant :**
- Interface familière et intuitive (adoption immédiate)
- Gestion rapide de multiples candidatures
- Expérience ludique vs interface administrative classique
- Adapté mobile-first (80% des utilisateurs)

### 2. Double Système Host/Guest

**Inversion unique des rôles** par rapport aux plateformes traditionnelles :

| Mode | Rôle | Attente |
|------|------|---------|
| **Seeking Host** | Je cherche quelqu'un qui m'invite | Recevoir des propositions d'hôtes |
| **Offering Host** | Je propose d'inviter quelqu'un | Recevoir des candidatures d'invités |

**Avantage concurrentiel :**
- Supprime le stigmate du "je cherche quelqu'un pour payer"
- Permet aux généreux de s'affirmer comme tels
- Crée une économie d'attention équilibrée
- Chacun peut jouer les deux rôles selon le contexte

### 3. Profils Sociaux Enrichis

Au-delà du nom et de la photo, InviteMoi propose :

- **Centres d'intérêt** : Musique, art, cinéma, gastronomie...
- **Langues parlées** : Facilite les connexions internationales
- **Liens sociaux** : Instagram, Twitter (partage conditionnel)
- **Statistiques** : Événements créés, participations, taux d'acceptation

**Impact sur le matching :**
- Meilleure qualité des connexions
- Réduction du ghosting (profils transparents)
- Confiance accrue entre utilisateurs

### 4. Notifications Temps Réel Intelligentes

Système de notifications contextuelles par onglet :

- **Badge rouge** sur "Mes événements" → Nouvelles candidatures
- **Badge rouge** sur "Mes candidatures" → Acceptations reçues
- **Highlight animation** → Nouvel événement créé (2s)
- **Notifications email** → Changements de statut importants

**Différenciation :**
- Pas de spam : notifications ciblées uniquement
- Intelligence contextuelle : badge uniquement si actionnable
- Multi-canal : in-app + email pour événements critiques

### 5. Design Glassmorphism & Animations

Interface moderne avec :

- **Glass effect** : Effet de verre dépoli sur les cartes
- **Gradients dynamiques** : Transitions de couleur fluides
- **Micro-animations** : Feedback visuel sur chaque action
- **Dark mode** : Support natif avec transitions douces
- **Framer Motion** : Animations performantes et élégantes

**Objectif PO :**
- Se démarquer des interfaces plates et ennuyeuses
- Créer une expérience premium et moderne
- Augmenter l'engagement par le plaisir visuel

### 6. Géolocalisation & Autocomplete

- **Autocomplete d'adresses** : Powered by Google Places API
- **Filtres par ville** : Recherche d'événements géolocalisés
- **Affichage carte** : Visualisation des lieux d'événements
- **Distance intelligente** : Suggestions basées sur la proximité

---

## 🆚 Positionnement Marché

### vs Meetup

| Critère | Meetup | InviteMoi |
|---------|--------|-----------|
| **Modèle** | Événements de groupe | Connexions 1-to-1 |
| **Paiement** | Chacun paie | Un invite l'autre |
| **Matching** | Inscription libre | Validation par l'hôte |
| **Social** | Communautés | Relations directes |
| **Innovation** | ❌ | Swipe + double flux |

### vs Tinder

| Critère | Tinder | InviteMoi |
|---------|--------|-----------|
| **Objectif** | Rencontres romantiques | Expériences culturelles |
| **Matching** | Match mutuel requis | Hôte décide |
| **Contenu** | Profil + bio | Événement + profil |
| **Système** | Swipe bidirectionnel | Swipe unidirectionnel (hôte) |
| **Value** | Date | Culture + connexion |

**Conclusion PO :** InviteMoi occupe un **espace blanc** entre le social networking (Meetup) et le dating (Tinder), en créant une catégorie nouvelle : **le cultural networking avec économie de générosité**.

---

## 🛠️ Stack Technique

### Frontend
- **React 18** + **TypeScript** + **Vite** (build ultra-rapide)
- **Tailwind CSS** (utility-first, design system cohérent)
- **Framer Motion** (animations fluides)
- **React Router** (navigation SPA)
- **@use-gesture/react** (gestures swipe natifs)

### Backend & Services
- **Supabase** (Auth, Database PostgreSQL, Storage, Edge Functions)
- **Netlify** (Hosting + Serverless Functions)
- **Nodemailer** (Email notifications)
- **Google Places API** (Autocomplete adresses)

### State & Utils
- **Context API** (AuthContext, EventContext, NotificationContext)
- **Custom Hooks** (useDashboardNotifications, useEventOperations)
- **date-fns** (manipulation dates, i18n français)
- **clsx** (conditional CSS classes)

### Ampleur du Projet

- **11 720 lignes de code** dans `src/`
  - TypeScript (.ts) : 3 316 lignes
  - TypeScript React (.tsx) : 8 404 lignes
  - **127 fichiers** TS/TSX
  - **24 dossiers** de composants

**Comparaison avec d'autres projets :**
- TuteurPrivé : 15k lignes (application éducative avec IA)
- InviteMoi : 11.7k lignes (plateforme sociale complexe)
- Ratio code/fonctionnalité : Très optimisé (architecture modulaire)

---

## 📊 Architecture Technique

### Flux Utilisateur Principal

```
[Landing] → [Inscription] → [Création Profil]
    ↓
[Feed Événements] → [Application] → [Notification]
    ↓
[Dashboard Hôte] → [Swipe Candidature] → [Accept/Reject]
    ↓
[Match] → [Échange contacts] → [Événement réalisé]
```

### Structure des Données

```typescript
type EventType = 'seeking-host' | 'offering-host'

interface Event {
  id: string
  title: string
  description: string
  category: 'restaurant' | 'theater' | 'museum' | 'cinema' | 'other'
  date: string
  time: string
  location: string
  eventType: EventType
  applicants: Application[]
  status: 'open' | 'matched' | 'completed'
}

interface Application {
  user: User
  message: string
  timestamp: string
  status: 'pending' | 'accepted' | 'rejected'
  sharedSocialLinks: string[]
}
```

### Modules Principaux

- **Auth Module** : Sign-in, Sign-up, Google OAuth, Reset password
- **Event Module** : Create, Read, Filter, Apply, Accept/Reject
- **Profile Module** : Edit profile, Interests, Languages, Social links
- **Dashboard Module** : My events, My applications, Notifications
- **Notification Module** : Real-time badges, Email alerts

---

## 📉 Résultats & Learnings : Un Échec Instructif

### Métriques Réelles (6 mois de lancement)

- **Utilisateurs inscrits** : ~150 (vs objectif 3 000)
- **Événements créés** : ~80 (vs objectif 1 500)
- **Matches réussis** : ~15 (vs objectif 1 000)
- **Retention J+7** : ~20% (vs objectif 50%)
- **Taux d'abandon** : 85% après inscription

### Constat d'Échec

**InviteMoi n'a pas atteint son product-market fit** malgré une innovation UX forte et une execution technique solide.

### Pourquoi le Projet a Échoué

#### 1. Problème du Seuil Critique (Cold Start Problem)

**La plateforme à deux côtés nécessite une masse critique d'utilisateurs :**

- **Cercle vicieux** : Pas assez d'hôtes → Pas de matches → Invités partent → Encore moins d'hôtes
- **Densité locale insuffisante** : Pour qu'un utilisateur à Lyon trouve un match, il faut 200-300 users actifs dans la ville
- **Effet réseau non atteint** : En dessous de 1000 users/ville, l'utilité de l'app est proche de zéro

**Ce que j'ai sous-estimé :**
- Le marketing nécessaire pour atteindre ce seuil (budget : 50k€ minimum)
- Le temps requis (12-18 mois minimum, pas 6 mois)
- La nécessité d'un lancement hyper-localisé (1 ville uniquement)

#### 2. Budget Marketing Insuffisant

**Acquisition organique trop lente :**
- **Budget alloué** : ~2 000€ (posts sponsorisés Instagram/TikTok)
- **Budget nécessaire** : ~50 000€ (influenceurs, événements IRL, campus ambassadors)
- **CAC réel** : 13€/user (vs cible 5€)
- **Croissance** : +30 users/mois (vs besoin de +500/mois)

**Ce qui n'a pas fonctionné :**
- Posts sponsorisés : Clics mais pas de rétention (curiosité, pas de besoin réel)
- SEO : Trop long (6-12 mois pour ranker)
- Referral : Impossible sans utilisateurs existants satisfaits

#### 3. Timing et Chicken-and-Egg

**Paradoxe de la plateforme à deux côtés :**
- Les hôtes ne viennent pas car pas d'invités
- Les invités ne viennent pas car pas d'hôtes
- Impossible de résoudre sans investissement marketing massif

**Erreur stratégique :**
- Lancement trop large : 10 villes en France (aurait dû être Paris uniquement)
- Pas de stratégie de "seeding" : aurait dû recruter manuellement 100 early adopters
- Pas de partenariats : restaurants/théâtres auraient pu être des hôtes initiaux

---

## 🎯 Positionnement pour un Recruteur

Ce portfolio démontre une **capacité d'analyse post-mortem** et d'apprentissage à partir d'un échec, compétences essentielles pour un Product Owner.

### Compétences Product Owner Démontrées

- ✅ **Vision produit** : Identification d'un espace blanc marché (cultural networking)
- ✅ **Innovation UX** : Introduction du swipe dans un contexte non-dating
- ✅ **Analyse concurrentielle** : Positionnement clair vs Meetup/Tinder
- ✅ **Architecture produit** : Double flux innovant (seeking/offering)
- ✅ **Honnêteté intellectuelle** : Capacité à analyser un échec sans excuse
- ✅ **Learnings actionnables** : Compréhension des défis des plateformes à deux côtés

### Compétences Transverses

- ✅ **Double casquette** : Capacité à designer ET implémenter (11k lignes de code)
- ✅ **User-centric** : Chaque feature répond à un pain point identifié
- ✅ **Design thinking** : Interface moderne et engageante (glassmorphism)
- ✅ **Innovation technique** : Stack moderne et performante (React 18, Vite, Framer Motion)
- ✅ **Maturité** : Acceptation de l'échec et focus sur les learnings

### Learnings Clés pour Futurs Projets

1. **Plateformes à deux côtés = budget marketing massif** : 50k€ minimum pour cold start
2. **Lancement hyper-localisé** : 1 ville, pas 10 (concentration vs dispersion)
3. **Seeding manuel nécessaire** : Recruter 100 early adopters avant lancement public
4. **Partenariats critiques** : Restaurants/théâtres comme hôtes initiaux pour amorcer
5. **Timeline réaliste** : 12-18 mois pour atteindre effet réseau, pas 6 mois
6. **Validation avant build** : Aurait dû valider la volonté de payer du marketing (landing page test)

### Ce que je Ferais Différemment

**Si je relançais InviteMoi avec 50k€ de budget :**

1. **Lancement Paris uniquement** : Concentration sur 1 ville pour atteindre densité critique
2. **Campus ambassadors** : Recruter 20 étudiants payés pour onboarder leurs amis
3. **Partenariats restaurants** : 50 restaurants partenaires offrent 10% réduction si invité via InviteMoi
4. **Événements IRL** : Organiser 10 soirées "InviteMoi Meetup" pour créer communauté initiale
5. **Influenceurs micro** : 50 influenceurs 5k-20k followers (budget 10k€) pour awareness ciblée
6. **Referral agressif** : 20€ de crédit restaurant pour parrain + filleul (incentive fort)

**Avec ces ajustements, probabilité de succès : 60% vs 5% initial**

### Certifications

- **[Professional Scrum Product Owner II](https://www.credly.com/badges/e66d6dd1-b6c9-4ed4-a78f-27612df6d5ae)**
- **[Professional Scrum Master I](https://www.credly.com/badges/bc483041-bdf5-4ecc-87d0-f2bb0d16bd8d)**

---

## 📞 Contact

**Antoine Goethals**
Product Owner | Développeur Full-Stack

- LinkedIn: [linkedin.com/in/antoinegoethals](https://www.linkedin.com/in/antoinegoethals/)
- Email: antoine.gt@orange.fr
- Portfolio: [TuteurPrivé](https://tuteurprive.com) | InviteMoi

Passionné par l'innovation produit et les expériences utilisateur qui changent les comportements

---

*Ce README fait partie d'un portfolio Product Owner. Pour plus de détails sur les décisions produit, l'architecture fonctionnelle et les KPIs, consultez le dossier [`docs/`](./docs).*
