---
version: 1
slug: "src-pages-landing-tsx"
primary_target: "src/pages/Landing.tsx"
related_targets: []
---

# Accueil (`src/pages/Landing.tsx`)

Mode : Persuade. Publics : vrais utilisateurs (20-35 ans, en ville, sur téléphone) et recruteurs (projet portfolio). Action : entrer dans la démo, dans un rôle. Preuve : de vraies sorties de la démo, rien d'inventé hors démo. Contraintes : slogan et logo d'origine gardés, couleurs et typo de l'app V2 inchangées, pas de ton SaaS, pas de page sage.

## Direction contract

THESIS: La page est la paire de tickets du logo, en vrai. Refuse le gabarit pastille + titre géant + fin soulignée, la grille de fonctionnalités à icônes, les étapes 01/02/03 et le bandeau sombre final.

OWN-WORLD: Billetterie de spectacle. Deux tickets à talon détachable, corail « J'invite » et safran « Invite-moi », sur le fond crème de l'app. Perforations en pointillés, encoches demi-lune, numéro de série, contrôle imprimé en petites capitales Inter, titres Bricolage. Logo d'origine recolorié corail vers safran.

STORY: On lit le slogan, on voit qu'une sortie peut s'offrir ou se demander, on comprend que les annonces sont réelles dans la démo, on détache un talon et on entre, dans le rôle choisi.

FIRST VIEWPORT: Barre avec logo à gauche, « Lancer la démo » à droite. Slogan sur une ligne, taille modérée, à gauche. Deux tickets en grand, légèrement décalés, qui occupent le reste : chacun porte une sortie de la démo (titre, lieu, date, hôte), le talon droit porte l'action (« Je réponds », « Je l'invite »). Sur mobile, les tickets s'empilent et le talon passe en bas.

FORM: Structure « la paire de tickets », 3e de ma liste ordonnée, tirée en tête. seed:b2e0756324131e58 (tirage dégradé, sans challengers).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Interaction signature : le talon se détache le long des pointillés (glisser ou cliquer), puis l'app s'ouvre sur la sortie. Mouvement unique, ease-out exponentiel, respect de prefers-reduced-motion.
