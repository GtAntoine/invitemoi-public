---
name: Invite Moi
description: "Des sorties à deux, où l'un offre et l'autre accompagne : un guichet crème, deux rôles en couleur, des billets à talon."
colors:
  bg: "rgb(250 246 240)"
  surface: "rgb(255 255 255)"
  sunken: "rgb(243 237 228)"
  ink: "rgb(26 23 20)"
  muted: "rgb(107 99 90)"
  line: "rgb(231 222 210)"
  shadow-tint: "rgb(60 40 20)"
  coral: "rgb(214 63 34)"
  coral-soft: "rgb(252 228 220)"
  coral-ink: "rgb(150 40 18)"
  saffron: "rgb(246 182 52)"
  saffron-soft: "rgb(253 240 205)"
  saffron-ink: "rgb(122 82 0)"
  success: "rgb(31 138 91)"
  success-soft: "rgb(218 242 229)"
  danger: "rgb(201 58 58)"
  danger-soft: "rgb(250 225 225)"
  coral-paper: "#D63F22"
  coral-paper-pressed: "#C2381E"
  saffron-paper: "#F6B634"
  saffron-paper-pressed: "#EEAA22"
  on-coral: "#FFFFFF"
  on-saffron: "#2A1F00"
  poster-cream: "#FBF4EA"
  poster-resto: "#C2461F"
  poster-theatre: "#7A2E3B"
  poster-expo: "#2F5D50"
  poster-cine: "#24304F"
  poster-concert: "#5B3FB8"
  poster-autre: "#9A6A12"
  avatar-plum: "#8A3F6E"
  avatar-slate: "#3E6A8A"
typography:
  display:
    fontFamily: "Bricolage Grotesque Variable, system-ui, sans-serif"
    fontSize: "52px"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline-lg:
    fontFamily: "Bricolage Grotesque Variable, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: "2.5rem"
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Bricolage Grotesque Variable, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: "2.25rem"
    letterSpacing: "-0.025em"
  ticket-title:
    fontFamily: "Bricolage Grotesque Variable, system-ui, sans-serif"
    fontSize: "38px"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  stub-action:
    fontFamily: "Bricolage Grotesque Variable, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "Bricolage Grotesque Variable, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: "1.75rem"
    letterSpacing: "-0.025em"
  title-sm:
    fontFamily: "Bricolage Grotesque Variable, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.375
    letterSpacing: "-0.025em"
  logotype:
    fontFamily: "Bricolage Grotesque Variable, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.025em"
  body-lead:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.25rem"
  button:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1
  label:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: "1rem"
    letterSpacing: "0.05em"
  label-badge:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.025em"
  label-control:
    fontFamily: "Inter Variable, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.14em"
    fontFeature: "\"tnum\""
rounded:
  xl: "12px"
  2xl: "16px"
  ticket: "22px"
  3xl: "24px"
  sheet: "28px"
  full: "9999px"
spacing:
  "1": "4px"
  "1.5": "6px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "7": "28px"
  "8": "32px"
  "10": "40px"
  "16": "64px"
  "24": "96px"
  gutter: "16px"
  gutter-md: "24px"
  container: "1152px"
components:
  button-primary:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.on-coral}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "44px"
  button-primary-dark:
    backgroundColor: "{colors.coral-paper}"
    textColor: "{colors.on-coral}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.sunken}"
  button-ghost:
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.sunken}"
  button-danger:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "44px"
  button-sm:
    padding: "0 14px"
    height: "36px"
  button-lg:
    padding: "0 28px"
    height: "56px"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "0 14px"
    height: "36px"
  chip-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
  tag:
    backgroundColor: "{colors.sunken}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  tag-highlight:
    backgroundColor: "{colors.coral-soft}"
    textColor: "{colors.coral-ink}"
  kind-badge-offer:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.on-coral}"
    typography: "{typography.label-badge}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  kind-badge-wish:
    backgroundColor: "{colors.saffron}"
    textColor: "{colors.on-saffron}"
    typography: "{typography.label-badge}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  status-pending:
    backgroundColor: "{colors.saffron-soft}"
    textColor: "{colors.saffron-ink}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  status-accepted:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  status-declined:
    backgroundColor: "{colors.sunken}"
    textColor: "{colors.muted}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.2xl}"
    padding: "14px 16px"
  nav-link:
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "0 16px"
    height: "40px"
  nav-link-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
  segmented-track:
    backgroundColor: "{colors.sunken}"
    rounded: "{rounded.2xl}"
    padding: "4px"
  segmented-thumb:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    height: "40px"
  card-event:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.3xl}"
    padding: "16px"
  sheet:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.sheet}"
    padding: "0 20px 20px"
  toast:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.2xl}"
    padding: "12px"
  ticket-offer:
    backgroundColor: "{colors.coral-paper}"
    textColor: "{colors.on-coral}"
    typography: "{typography.ticket-title}"
    rounded: "{rounded.ticket}"
    padding: "28px"
  ticket-offer-stub-hover:
    backgroundColor: "{colors.coral-paper-pressed}"
  ticket-wish:
    backgroundColor: "{colors.saffron-paper}"
    textColor: "{colors.on-saffron}"
    typography: "{typography.ticket-title}"
    rounded: "{rounded.ticket}"
    padding: "28px"
  ticket-wish-stub-hover:
    backgroundColor: "{colors.saffron-paper-pressed}"
  ticket-back:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.ticket}"
    padding: "40px"
  billboard-stub:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    width: "248px"
---

# Design System: Invite Moi

## Overview

**Creative North Star: "Le Billet pour deux"**

Invite Moi est un guichet de quartier pour sorties à deux. Le fond est un papier crème chaud, l'encre presque noire, et deux couleurs seulement portent du sens : le corail de « J'invite » et le safran de « Invite-moi ». Tout le reste (surfaces blanches, creux sable, filets beige) reste en retrait pour que ces deux rôles se lisent d'un coup d'œil, sur la carte d'une annonce comme sur un billet.

La matière du système est imprimée, pas numérique : des affiches de catégorie en aplat avec un pictogramme géant et un tampon de date, et, depuis l'accueil, des billets à talon en papier corail ou safran, encochés en demi-lune, perforés d'une ligne de trous, numérotés et contrôlés en petites capitales. Le billet est l'objet du logo (deux tickets et un cœur) rendu concret. La densité est celle d'une app mobile : une colonne, des pastilles arrondies, des cartes généreuses, des titres Bricolage serrés et un texte Inter à 15px.

Le geste est physique mais bref : un talon se détache le long des pointillés, une carte se trie d'un glissement, une feuille monte du bas. Rien ne clignote, rien ne flotte sans raison, et `prefers-reduced-motion` coupe le mouvement du talon.

**Key Characteristics:**
- Fond crème chaud, encre presque noire, ombres teintées de brun.
- Deux rôles, deux couleurs : corail « J'invite », safran « Invite-moi », jamais permutées.
- Billets à talon en papier fixe, identiques en clair et en sombre.
- Titres Bricolage Grotesque serrés, texte Inter, petites capitales réservées aux lignes de contrôle.
- Actions en pastilles (`rounded-full`), conteneurs en grands arrondis doux.
- Mode clair et sombre complets, pilotés par des variables CSS en triplets RGB.

## Colors

Une palette de papier crème et d'encre chaude, où seules deux couleurs de rôle parlent fort.

Les couleurs de thème sont déclarées dans `src/index.css` en triplets RGB (`--bg: 250 246 240`) et exposées à Tailwind par `rgb(var(--x) / <alpha-value>)`, ce qui garde les modificateurs d'opacité (`bg-sunken/60`, `border-line/70`). Les valeurs du frontmatter sont celles du thème clair. La classe `.dark` sur `<html>` les remplace (voir « En sombre »). Les papiers, affiches et encres fixes sont des littéraux hexadécimaux dans les composants : ils ne changent pas avec le thème.

### Primary
- **Corail « J'invite »** (`coral`) : la couleur de la personne qui offre la sortie. Fond du bouton principal, badge `J'invite`, pastilles de compteur, point d'onglet actif, bouton flottant « Créer », anneau de focus de toute l'app. Ses déclinaisons `coral-soft` (fond) et `coral-ink` (texte) servent aux tags mis en avant et aux toasts d'information.
- **Papier corail** (`coral-paper`) : le même corail figé, indépendant du thème. Papier du billet « J'invite », talon corail du rail « À l'affiche », et fond du bouton principal en mode sombre. `coral-paper-pressed` est son survol, sur le talon seulement. Texte toujours `on-coral` (blanc).

### Secondary
- **Safran « Invite-moi »** (`saffron`) : la couleur de la personne qui cherche un hôte. Badge `Invite-moi`, sélection de texte (`::selection` à 55 % d'opacité). `saffron-soft` et `saffron-ink` portent l'état « en attente » des candidatures.
- **Papier safran** (`saffron-paper`) : papier du billet « Invite-moi » et talon safran du rail, identique en clair et en sombre. `saffron-paper-pressed` est son survol. Texte toujours `on-saffron`, un brun très sombre (9:1 sur le papier).

### Tertiary
- **Affiches de catégorie** (`poster-resto`, `poster-theatre`, `poster-expo`, `poster-cine`, `poster-concert`, `poster-autre`) : un aplat par catégorie, sourd et profond, sous les couvertures d'annonces. Texte et tampon de date en `poster-cream`. Les mêmes teintes, plus `avatar-plum` et `avatar-slate`, colorent les avatars à initiale (`AVATAR_TONES`).
- **Succès** (`success`, `success-soft`) : le match, la candidature retenue, le tampon « oui » du tri. **Danger** (`danger`, `danger-soft`) : actions destructives, en bouton doux, jamais en aplat plein.

### Neutral
- **Crème de guichet** (`bg`) : fond de page partout, et couleur des trous de perforation, qui laissent voir la page à travers le billet.
- **Blanc carte** (`surface`) : cartes, champs, feuilles, toasts, barre d'onglets mobile, revers du billet.
- **Sable creux** (`sunken`) : survol des boutons secondaires et fantômes, piste du sélecteur segmenté, tags neutres, bande du rail à 60 %.
- **Encre chaude** (`ink`) : texte principal, bouton `ink`, puce et lien de navigation actifs (inversés en `ink` sur `bg`).
- **Encre passée** (`muted`) : texte secondaire, méta-données, libellés d'onglets inactifs (5,5:1 sur `bg`).
- **Filet beige** (`line`) : bordures de cartes, champs et puces, séparateurs de listes, soulignement de lien au repos.
- **Teinte d'ombre** (`shadow-tint`) : uniquement dans les ombres, pour qu'elles restent brunes et chaudes en clair.

### En sombre
`.dark` redéfinit : `bg` 20 17 14, `surface` 30 26 22, `sunken` 39 34 29, `ink` 244 238 230, `muted` 163 154 143, `line` 54 47 40, `shadow` 0 0 0, `coral` 226 74 44, `coral-soft` 66 30 22, `coral-ink` 255 160 135, `saffron` inchangé, `saffron-soft` 60 45 14, `saffron-ink` 250 205 110, `success` 74 196 136, `success-soft` 22 52 38, `danger` 240 100 100, `danger-soft` 64 26 26. Les papiers, affiches, `on-coral`, `on-saffron` et `poster-cream` ne changent pas.

### Named Rules
**The Two Roles Rule.** Le corail désigne toujours « J'invite » (l'hôte offre), le safran toujours « Invite-moi » (la personne cherche un hôte). Une surface qui montre un rôle prend sa couleur ; aucune autre couleur ne représente un rôle, et les deux ne s'échangent jamais.

**The Equal Footing Rule.** Les deux rôles se valent : un billet safran a la même taille, la même typographie, la même mise en page et le même poids visuel qu'un billet corail. Seuls le papier et l'encre changent.

**The Fixed Paper Rule.** Les papiers de billet et les affiches de catégorie gardent la même teinte en clair et en sombre, comme un objet imprimé. Ils ne portent que leurs encres fixes (`on-coral`, `on-saffron`, `poster-cream`), jamais une couleur de thème comme `ink` ou `muted`.

## Typography

**Display Font:** Bricolage Grotesque Variable (avec system-ui, sans-serif)
**Body Font:** Inter Variable (avec system-ui, sans-serif)

**Character:** Une grotesque d'affiche, un peu excentrique et serrée, pour tout ce qui s'imprime en grand sur un billet ou une affiche, et une Inter neutre pour tout ce qui se lit. Les deux sont auto-hébergées via `@fontsource-variable`.

### Hierarchy
- **Display** (700, 34px mobile, 48px dès 640px, 52px dès 1024px, interligne 1.05) : le slogan de l'accueil, sur une ligne en grand écran. Un seul par page.
- **Headline** (700, 30px puis 36px dès 768px) : titres de page de l'app (« Mes sorties », « Réglages ») et titres de section de l'accueil. Le parcours de création garde 30px à toutes les tailles, l'accueil d'inscription 36px.
- **Ticket Title** (700, 26px, 32px dès 640px, 38px dès 1024px, interligne 1.08) : le titre de la sortie sur un billet, en `text-wrap: balance`.
- **Stub Action** (700, 20px puis 24px, interligne 1.25) : l'action imprimée sur le talon (« Je veux venir », « Je l'invite ») et l'accroche du revers.
- **Title** (600, 20px) : titres de groupe (`SectionTitle`), titres de feuille en 18px.
- **Title Small** (600, 18px, interligne 1.375) : titres des cartes d'annonce, équilibrés.
- **Body Lead** (400, 18px, interligne 1.625, `muted`) : le chapeau sous le slogan, limité à `max-w-xl`.
- **Body** (400, 15px) : texte de contenu, méta-données des billets, conditions. Les paragraphes longs passent en `leading-relaxed` ; largeur tenue par `max-w-sm` à `max-w-xl`.
- **Body Small** (400, 14px) : la taille la plus fréquente de l'app, pour méta-données, puces et texte d'appoint.
- **Label** (700, 12px, 0.05em, capitales) : libellés de groupe dans l'app (« Points communs », « Candidatures passées »).
- **Label Badge** (700, 11px, 0.025em, capitales) : badges de rôle et compteurs.
- **Label Control** (600, 11px, 0.14em, capitales, chiffres tabulaires) : la ligne de contrôle imprimée des billets (`J'INVITE · Concert · N° 0412`, `POUR DEUX · N° 0412`).

Les `h1` à `h4` reçoivent `font-display tracking-tight` par la couche de base : un titre est en Bricolage serré sans classe supplémentaire. Le logotype « invite**moi** » est en Bricolage 700 à 22px, la syllabe « moi » en `coral`.

### Named Rules
**The Two Voices Rule.** Bricolage pour ce qu'on imprimerait en grand (titres, action du talon, chiffre du tampon de date, logotype) ; Inter pour tout ce qu'on lit, y compris les boutons. Pas de troisième famille.

**The Control Line Rule.** Les petites capitales espacées à 0.14em appartiennent à la ligne de contrôle d'un billet : rôle, catégorie, numéro de série. Elles se placent dans le billet, en bord de filet, jamais en surtitre au-dessus d'un titre.

## Layout

Mobile d'abord, une colonne. Le conteneur est `max-w-6xl` (1152px) centré, avec une gouttière de 16px qui passe à 24px dès 768px ; l'en-tête de l'app et celui de l'accueil s'alignent sur ce même conteneur. Les points de rupture sont ceux de Tailwind (640, 768, 1024px), et 768px est la charnière principale : la barre d'onglets du bas disparaît au profit d'une navigation en pastilles dans l'en-tête.

Dans l'app, l'en-tête est collant, translucide (`bg/85` avec flou), et la barre d'onglets mobile laisse 112px de marge basse au contenu ; son bouton « Créer » corail déborde de 20px au-dessus de la barre, cerné d'un anneau `bg`. Les parcours ciblés (création, tri) masquent la barre. Les feuilles montent du bas sur mobile et deviennent une fenêtre centrée de `max-w-lg` sur grand écran.

Le rythme suit l'échelle Tailwind de 4px : 6 à 12px entre éléments liés, 16 à 24px de rembourrage de carte, 40px pour le revers du billet, 64 à 96px entre sections de l'accueil.

Sur l'accueil, les deux billets sont pleine largeur et empilés (24px d'écart) sur mobile. Dès 768px, ils sont limités à 820px, inclinés de -1,2° et +1°, le second aligné à droite et remonté de 12px pour chevaucher le premier. Le rail « À l'affiche » déborde jusqu'au bord de l'écran tout en alignant son premier talon sur le texte (gouttière calculée), avec défilement aimanté.

## Elevation & Depth

Hybride, chaud et discret. Les surfaces reposent à plat sur le crème et se détachent surtout par le blanc et un filet `line` ; deux ombres à double couche, teintées par `--shadow` (brun en clair, noir en sombre), donnent la profondeur. Les billets, découpés par masque, portent leur ombre par `drop-shadow` sur leur conteneur. Le corail plein peut rayonner d'une lueur de sa propre couleur.

### Shadow Vocabulary
- **Carte** (`box-shadow: 0 1px 2px rgb(var(--shadow) / 0.06), 0 8px 24px -12px rgb(var(--shadow) / 0.18)`) : cartes d'annonce, lignes de « Mes sorties », talons du rail, pastille active du sélecteur segmenté.
- **Soulevé** (`box-shadow: 0 2px 4px rgb(var(--shadow) / 0.08), 0 24px 48px -16px rgb(var(--shadow) / 0.28)`) : feuilles et toasts, ce qui passe au-dessus de la page.
- **Billet** (`filter: drop-shadow(0 18px 28px rgb(var(--shadow) / 0.22))`) : billets de couleur, posés sur la page.
- **Revers de billet** (`filter: drop-shadow(0 14px 24px rgb(var(--shadow) / 0.14))`) : le billet blanc du dos, plus bas.
- **Lueur corail** (`box-shadow: 0 6px 16px -6px rgb(var(--coral) / 0.6)`) : bouton principal ; le bouton flottant « Créer » en porte une version plus large.

### Named Rules
**The Warm Shadow Rule.** Toute ombre passe par `--shadow` (ou par `--coral` pour une lueur) ; jamais un noir neutre écrit en dur en mode clair.

**The Masked Paper Rule.** Une pièce de billet découpée par `mask` ne porte jamais de `box-shadow`, que le masque couperait : l'ombre va sur le conteneur, en `drop-shadow`, pour suivre les encoches.

## Shapes

Deux familles de formes. Les actions et les étiquettes sont des pastilles complètes : boutons, puces, tags, badges, statuts, liens de navigation, compteurs. Les conteneurs ont de grands arrondis doux : 16px pour les champs, toasts, tuiles et talons du rail ; 24px pour les cartes et listes ; 28px pour les feuilles, les grands choix du parcours de création et les panneaux de match ; 12px pour les petits éléments imbriqués (pastille segmentée, tampon de date). Le logo est un carré arrondi à 28 %.

Le billet a sa propre géométrie. Il se compose d'une partie principale et d'un talon, arrondis à 22px sur leurs coins extérieurs et joints par une perforation. De part et d'autre de la perforation, deux encoches en demi-lune de 14px de rayon sont creusées par `mask` (classes `.ticket-main` et `.ticket-stub`). La perforation (`.ticket-perf`) est une rangée de trous de 2,2px de rayon tous les 12px, couleur `bg` pour percer le papier coloré, ou `muted` à 85 % sur un billet blanc (`.ticket-perf-ink`). Sous 768px, le talon passe sous la partie principale et la perforation devient horizontale ; au-delà, le talon est à droite et la perforation verticale. Le talon compact du rail « À l'affiche » est la version miniature : un bandeau de 64px de papier corail ou safran, séparé par une bordure pointillée de 2px.

## Components

### Buttons
Pleins, ronds, qui s'enfoncent sous le doigt.
- **Shape :** pastille complète, en trois hauteurs : petite (36px, 14px de texte), moyenne (44px, 15px), grande (56px, 16px). Texte Inter 600, icône à droite pour les actions qui avancent.
- **Primary :** fond `coral`, texte blanc, lueur corail. En sombre, le fond passe à `coral-paper` pour garder le contraste du texte blanc.
- **Ink :** fond `ink`, texte `bg`. L'action neutre et forte, comme « Lancer la démo » dans l'en-tête de l'accueil.
- **Secondary :** fond `surface`, filet `line`, texte `ink` ; survol en `sunken`. **Ghost :** sans fond, survol `sunken`. **Danger :** fond `danger-soft`, texte `danger`.
- **Hover / Focus :** le primaire s'éclaircit (`brightness 1.1`), le ink baisse à 90 % d'opacité ; tous rétrécissent à 97 % à l'appui (150ms). Le focus clavier est l'anneau global : 2px `coral`, décalé de 2px sur `bg`. Désactivé : 40 % d'opacité.

### Chips
- **Style :** pastille de 36px, filet `line`, fond `surface`, texte `ink` 14px 500. Filtres de jour et de catégorie, en rangée défilante sans barre.
- **State :** active, elle s'inverse en `ink` sur `bg` avec `aria-pressed`. Les **tags** de profil sont des pastilles sans bordure en `sunken`, ou en `coral-soft` / `coral-ink` gras pour un point commun.
- **Badges de rôle :** `J'invite` en `coral` texte blanc, `Invite-moi` en `saffron` texte brun foncé, petites capitales 11px. **Statuts :** « Demande envoyée » en safran doux, « C'est un match » en succès doux, « Pas retenu·e » en `sunken` / `muted`, chacun avec son icône.

### Cards / Containers
- **Corner Style :** 24px pour les cartes d'annonce et les listes, 16px pour les tuiles d'information.
- **Background :** `surface` sur `bg`, filet `line`.
- **Shadow Strategy :** ombre Carte ; au survol, la carte d'annonce monte de 2px (200ms).
- **Internal Padding :** 16px, 20px pour les cartes de profil.
- **Couverture d'annonce :** l'aplat d'affiche de la catégorie, son pictogramme géant à 16 % d'opacité qui déborde en bas à droite, un halo clair en lumière douce dans le coin haut gauche, un tampon de date `poster-cream` arrondi à 12px et le badge de rôle cerné de crème. Pas de photo.

### Inputs / Fields
- **Style :** fond `surface`, filet `line`, arrondi 16px, 14px × 16px de rembourrage, texte 15px, placeholder `muted`.
- **Focus :** le filet passe à `ink` ; l'anneau corail global s'ajoute au focus clavier.
- **Sélecteur segmenté :** piste `sunken` arrondie à 16px avec 4px de jeu ; l'option choisie est une pastille `surface` (en sombre `line`) à 12px, ombre Carte, qui glisse d'une option à l'autre (ressort amorti).

### Navigation
- **Desktop :** en-tête collant, logo, pastille pointillée « Démo », liens en pastilles de 40px (actif inversé `ink` / `bg`, survol `sunken`), bouton « Créer une annonce » primaire, cloche et avatar ronds.
- **Mobile :** barre d'onglets fixe en `surface` à 95 % avec flou ; icône 24px sur libellé 11px 600, actif `ink` et marqué d'un trait corail de 3px en haut qui glisse d'onglet en onglet ; bouton flottant corail de 56px au centre. Les compteurs sont des pastilles corail de 18px cernées de `surface`.

### Sheets & Toasts
- **Feuille :** `surface`, arrondi 28px en haut sur mobile et partout sur grand écran, ombre Soulevé, poignée `line` de 40px, fond voilé à 50 % avec léger flou. Monte du bas par ressort, se ferme en tirant vers le bas, par Échap ou en touchant le voile.
- **Toast :** carte `surface` de 16px d'arrondi, filet `line`, ombre Soulevé, pastille d'icône teintée (succès, corail, neutre), en haut sur mobile et en bas à droite sur grand écran.

### Billet à talon (Ticket)
Le composant signature : une annonce imprimée sur un billet qu'on détache.
- **Papier :** `coral-paper` pour une annonce « J'invite », `saffron-paper` pour « Invite-moi », sans variation de thème. Arrondi 22px, encoches de 14px, ombre Billet.
- **Partie principale :** ligne de contrôle en Label Control (rôle à gauche ; catégorie et numéro de série à droite) au-dessus d'un filet d'encre à 20-30 %, puis le titre en Ticket Title, la date et le lieu en Body avec icônes 16px, et l'hôte avec son avatar de 30px. Rembourrage 20px, puis 28px dès 640px.
- **Talon :** porte l'action en Stub Action, l'invite « Détacher le talon » avec une flèche qui avance au survol, et `POUR DEUX · N°` en Label Control. 176px de large en desktop (208px dès 1024px), pleine largeur dessous en mobile. Au survol, il s'incline de -1,5° et se décale de 4px, et son papier fonce d'un cran.
- **Détacher :** on tire le talon horizontalement (au-delà de 64px il part) ou on clique. Il s'envole en 0,5s sur `cubic-bezier(0.16, 1, 0.3, 1)` (rotation de 14°, fondu), puis l'app s'ouvre sur l'annonce. Avec `prefers-reduced-motion`, pas de glisser ni d'envol : le clic ouvre directement.
- **Revers :** le même billet en `surface`, perforation à l'encre, pour du contenu de référence (conditions en liste de définitions, action finale sur le talon). Ombre Revers de billet.
- **Numéro de série :** quatre chiffres stables dérivés de l'identifiant (`serial(id)`), toujours précédés de « N° ».

## Do's and Don'ts

### Do:
- **Do** donner à chaque surface de rôle la couleur de son rôle : `coral` / `coral-paper` pour « J'invite », `saffron` / `saffron-paper` pour « Invite-moi ».
- **Do** passer par les variables de thème (`bg`, `surface`, `sunken`, `ink`, `muted`, `line`) pour tout ce qui n'est pas papier imprimé, afin que le mode sombre suive sans code en plus.
- **Do** utiliser `coral-paper` (#D63F22) sous un texte blanc de petite taille en mode sombre, comme le bouton principal : le `coral` sombre ne donne que 4:1 avec le blanc.
- **Do** construire tout nouveau billet avec `.ticket-main`, `.ticket-stub` et `.ticket-perf`, l'ombre en `drop-shadow` sur le conteneur, et la ligne de contrôle avec un numéro `serial()`.
- **Do** garder les actions en pastilles complètes et les conteneurs en grands arrondis (16, 24 ou 28px).
- **Do** respecter `prefers-reduced-motion` pour tout geste décoratif, comme le fait le talon.

### Don't:
- **Don't** utiliser le corail ou le safran pour décorer une surface qui ne parle pas d'un rôle, ni les permuter.
- **Don't** faire varier les papiers de billet ou les affiches selon le thème, ni y poser `ink` ou `muted`.
- **Don't** mettre les petites capitales de contrôle en surtitre au-dessus d'un titre : elles vivent dans le billet.
- **Don't** dessiner la perforation d'un grand billet en bordure pointillée : c'est une rangée de trous ; la bordure pointillée est réservée au talon miniature du rail.
- **Don't** illustrer une annonce par une photo : une couverture est une affiche de catégorie, un pictogramme et un tampon de date.
- **Don't** ajouter de sections de fonctionnalités à icônes, de chiffres ou de témoignages : pas de ton startup SaaS.
- **Don't** redessiner le logo (deux tickets et un cœur) : seules ses couleurs peuvent changer.
