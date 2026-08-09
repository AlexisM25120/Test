# Montbellet Paysage & Piscines — refonte

Maquette de refonte du site de **Montbellet Paysage & Piscines**, artisan paysagiste
à Montbellet (71). Page unique en HTML / CSS / JS natifs : aucune dépendance,
aucun build, aucun framework.

## Structure

```
.
├── index.html                page unique
├── assets/
│   ├── css/style.css         styles (tokens de couleur, mise en page, animations)
│   ├── js/main.js            canvas, scroll, carte, formulaire
│   └── img/                  vos photos (voir assets/img/README.md)
└── README.md
```

## Prévisualiser en local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Ouvrir `index.html` directement dans le navigateur fonctionne aussi.

## Le parti pris

Un site de paysagiste en **plein jour**, pas un site sombre de logiciel : fond chaux,
verts de feuillage, terre cuite, serif de jardinier (EB Garamond) et sans humaniste
(Karla). La photo passe avant l'effet.

- **La page change de matière au scroll.** Un attribut `data-tone` (`chaux`, `pierre`,
  `bois`, `feuille`, `eau`) pilote toute la palette. Le parcours va du plein jour au
  vert profond, passe sous l'eau pour les piscines, revient au bois clair pour les
  chalets. L'en-tête suit.
- **Accueil en photo pleine page** avec un léger mouvement de caméra, et une couche de
  **lumière filtrée par le feuillage** dessinée en canvas — des taches de soleil qui
  dérivent lentement et suivent doucement la souris.
- **Galerie des réalisations** en grille asymétrique, alimentée par une simple liste
  dans `main.js`.
- **Panneaux empilés.** Les quatre métiers (Création, Piscines, Chalets, Entretien)
  glissent les uns sur les autres en `position: sticky`.
- **Reflets d'eau** en canvas dans la section piscines — doux, pas géométriques.
- **Carte de la zone** tracée en SVG le long de la Saône : survoler une commune la
  relie à l'atelier.
- Boutons magnétiques, texte révélé mot à mot, apparitions au scroll, grain de papier.

## Contenu

Les informations proviennent du site actuel et des fiches publiques de l'entreprise :
activités (création, piscines bois et standards, chalets, entretien, collectivités),
zone d'intervention, agrément service à la personne, coordonnées, processus de devis.

Deux points à valider avant mise en ligne :

1. **Adresse e-mail du formulaire.** Le formulaire compose un e-mail pré-rempli
   (`mailto:`) vers l'adresse déclarée dans `index.html` :
   `<form ... data-mailto="contact@montbellet-paysage.fr">`. Remplacer par la vraie
   adresse, ou brancher un service de formulaire (Formspree, Netlify Forms…) si
   l'hébergeur le permet.
2. **Photos et logo.** Aucune image n'est embarquée. Voir `assets/img/README.md` :
   déposer `logo.svg`, `hero.jpg`, `creation.jpg`, `piscine.jpg`, `chalet.jpg` et le
   dossier `realisations/` suffit — le code bascule tout seul.

La mention de crédit d'impôt est formulée « sur les prestations éligibles et sous
conditions », avec le renvoi légal en pied de page.

## Accessibilité & performances

- Aucun script tiers, aucun cookie, aucun tracker.
- Les polices (Google Fonts) sont les seules ressources externes ; le site reste lisible
  si elles ne se chargent pas.
- `prefers-reduced-motion` désactive canvas animés, curseur et révélations.
- Navigation clavier complète (menu, onglets, carte, formulaire), libellés `aria`,
  lien d'évitement, contrastes tenus sur les six palettes.
- Données structurées `LocalBusiness` (schema.org) pour le référencement local.
- Testé de 390 px à 1440 px, sans débordement horizontal.

## Déploiement

Site statique : copier le contenu du dépôt à la racine de l'hébergement
(Hostinger, OVH, GitHub Pages, Netlify…), en conservant l'arborescence.
