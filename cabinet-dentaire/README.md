# Cabinet Aria — Maquette de site pour un cabinet dentaire

Maquette de site vitrine pour un cabinet dentaire **fictif** situé à Lyon 6ᵉ.
Page unique en HTML / CSS / JavaScript natifs : aucune dépendance, aucun build,
aucune image externe (tous les visuels sont dessinés en CSS ou en SVG inline).

## Structure

```
cabinet-dentaire/
├── index.html            page unique du site
├── assets/
│   ├── css/style.css     tous les styles (12 sections commentées)
│   └── js/main.js        interactions : agenda, schéma dentaire, avis, formulaire
└── README.md
```

## Contenu de la page

| Section | Ce qu'elle contient |
| --- | --- |
| Héro | Accroche, carte « prochaines disponibilités » interactive, indicateurs de confiance |
| Chiffres | Quatre compteurs animés au défilement |
| Nos soins | Six domaines de soin, icônes SVG dessinées à la main |
| Schéma dentaire | Odontogramme interactif de 32 dents, généré en JavaScript |
| Le parcours | Les quatre étapes de la prise en charge |
| L'équipe | Quatre membres, avatars typographiques |
| Le cabinet | Plateau technique + illustration CSS des salles de soin |
| Avis | Carrousel de cinq avis (flèches, puces, glissement tactile, lecture automatique) |
| Tarifs | Tableau honoraires / base de remboursement / reste à charge, 100 % Santé |
| FAQ | Sept questions en accordéon natif (`<details>`) |
| Infos pratiques | Plan SVG stylisé, horaires, accès |
| Rendez-vous | Formulaire validé côté client, avec état de confirmation |

## Détails d'implémentation

**Schéma dentaire.** Les 32 dents sont générées par `buildArch()` : chaque dent est
positionnée sur une ellipse (arcade supérieure ouverte vers le bas, arcade inférieure
vers le haut), sa forme et sa couleur dépendent de son type, et son orientation suit
la normale à l'arcade. La numérotation suit la norme FDI. Le composant est navigable
au clavier via un `tabindex` glissant : les flèches horizontales parcourent une arcade,
les flèches verticales changent d'arcade, `Entrée` sélectionne.

**Accessibilité.** Lien d'évitement, styles `:focus-visible` sur tous les éléments
interactifs, libellés `aria-label` sur chaque dent, `role="radiogroup"` sur l'agenda,
erreurs de formulaire associées aux champs via `aria-invalid`, et respect complet de
`prefers-reduced-motion` (animations et défilement fluide désactivés).

**Performance.** Un seul fichier CSS, un seul fichier JS, zéro requête réseau
supplémentaire. Les gestionnaires de défilement passent par `requestAnimationFrame`
et les listeners sont déclarés `passive`. Les révélations et les compteurs utilisent
`IntersectionObserver`, avec repli si l'API est absente.

**Impression.** Une feuille `@media print` masque la navigation, l'agenda et le dock
mobile pour que la page reste lisible sur papier.

## Prévisualiser en local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000/cabinet-dentaire/
```

Le fichier `index.html` peut aussi être ouvert directement dans un navigateur.

## Déploiement

Site entièrement statique : copier le dossier tel quel chez n'importe quel hébergeur
(GitHub Pages, Netlify, Hostinger…) en conservant la structure des sous-dossiers.

## Avertissement

Le Cabinet Aria, son équipe, son adresse, son numéro de téléphone, ses tarifs et ses
avis sont **inventés pour les besoins d'un portfolio**. Les tarifs affichés sont
indicatifs et ne constituent pas une information médicale ou tarifaire réelle.
Le formulaire de rendez-vous ne transmet aucune donnée.
