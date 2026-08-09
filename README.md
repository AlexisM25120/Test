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

Le site sort du gabarit habituel « bandeau vert + trois cartes de services ». Il est
construit autour d'une idée : **le relief**.

- **Matière qui change au scroll.** Toute la palette est pilotée par un attribut
  `data-tone` (`forest`, `water`, `wood`, `moss`, `stone`, `paper`). Chaque section
  impose sa matière et la page entière bascule dessus — fond, accent, nav, barre de
  progression. On traverse une forêt, puis de l'eau, puis du bois.
- **Relief topographique animé** dans le hero : lignes de niveau dessinées en canvas,
  qui se creusent sous le curseur.
- **Panneaux empilés.** Les quatre métiers (Création, Piscines, Chalets, Entretien)
  glissent les uns sur les autres en `position: sticky` plutôt que de défiler à plat.
- **Caustiques d'eau** en canvas pour la section piscines.
- **Carte schématique** de la zone d'intervention, tracée en SVG le long de la Saône :
  survoler une commune la relie à l'atelier.
- Curseur personnalisé, boutons magnétiques, texte révélé mot à mot, compteurs.

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
2. **Photos.** Aucune photo n'est embarquée. Voir `assets/img/README.md` : déposer
   `creation.jpg`, `piscine.jpg` et `chalet.jpg` dans ce dossier suffit à remplacer
   les visuels générés.

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
