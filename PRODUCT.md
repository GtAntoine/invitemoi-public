# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Deux publics regardent la démo, et la page doit servir les deux (confirmé) :

- **Vrais utilisateurs** : des 20-35 ans qui vivent en ville et sortent (restos, théâtre, expos, concerts, cinéma). Soit ils ont envie d'une sortie sans pouvoir ou vouloir la payer, soit ils ont deux places, une table, une envie de partager, et personne avec qui y aller. Ils regardent sur leur téléphone.
- **Recruteurs et clients** : InviteMoi est un projet portfolio. En moins d'une minute, ils doivent comprendre le concept, juger la qualité produit et design, et cliquer pour tester.

## Product Purpose

InviteMoi met en relation, pour une sortie culturelle en tête-à-tête, une personne qui invite et une personne qui se fait inviter. Le succès de la démo : on comprend le principe sans lire de paragraphe, on entre dans l'app en un clic, et on y vit le parcours complet (répondre à une annonce, publier, choisir son invité·e, match).

## Positioning

Ni Meetup (groupes, chacun paie), ni Tinder (le profil au centre, le romantisme) : la sortie est au centre, et l'économie est la générosité. Chacun peut tenir les deux rôles. Demander à être invité·e est rendu normal, pas gênant.

## Operating Context

- Deux types d'annonces : **J'invite** (l'hôte offre la sortie) et **Invite-moi** (la personne cherche un hôte).
- L'hôte trie les candidatures en pile de cartes (swipe, clavier, boutons). Choisir quelqu'un révèle le contact : c'est le match.
- La démo tourne entièrement dans le navigateur, avec des données fictives et un profil prêt (Camille). Les autres membres réagissent seuls (candidatures qui arrivent, hôte qui accepte).

## Capabilities and Constraints

- Front React + Vite + TypeScript + Tailwind, sans backend (la V1 Supabase est archivée dans `v1/`).
- Déployé sur Netlify, site `invitemoi` (domaine invitemoiasortir.com).
- Langue : français, écriture inclusive avec point médian (invité·e).
- Modes clair et sombre.

## Brand Commitments

- Nom : **Invite Moi** (logotype « invitemoi »).
- Slogan, à garder : « Flemme de dépenser ? Fais-toi inviter. » (confirmé).
- Logo d'origine à garder : deux tickets qui se chevauchent avec un cœur, trait blanc sur fond en dégradé. Seules ses couleurs peuvent changer (confirmé). Source : `public/logo.png`.
- Vocabulaire des rôles : J'invite / Invite-moi.

## Evidence on Hand

- Captures et études de cas : `docs/` (vision, personas, architecture, innovation UX, post-mortem, refonte V2).
- Aucun utilisateur réel, aucun chiffre d'usage, aucun témoignage : rien de cela ne doit être inventé. Toutes les annonces et profils de la démo sont fictifs et doivent être présentés comme tels.

## Product Principles

- La sortie avant la personne : on choisit d'abord quoi faire, ensuite avec qui.
- Les deux rôles se valent : rien dans l'interface ne doit rendre « se faire inviter » honteux.
- Montrer plutôt que décrire : la démo se comprend en l'utilisant.
- Pas de ton startup SaaS (sections de fonctionnalités à icônes, chiffres, témoignages) et pas de page sage et oubliable (confirmé).
