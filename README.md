# Dune & Glass — Maquette

Maquette de site pour une agence immobilière de luxe fictive à Dubaï. Page unique en HTML/CSS/JS pur (aucune dépendance, aucun build requis).

## Structure

```
.
├── index.html            page unique du site
├── assets/
│   ├── css/style.css     tous les styles
│   └── js/main.js        scène 3D du hero, navigation, animations au scroll
└── README.md
```

## Prévisualiser en local

Ouvrir `index.html` directement dans un navigateur, ou lancer un petit serveur local :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Déploiement

Le site est statique : n'importe quel hébergeur qui sert des fichiers HTML/CSS/JS fonctionne (Hostinger, GitHub Pages, Netlify…). Il suffit de copier le contenu de ce dépôt (en conservant la structure des dossiers) à la racine du site sur l'hébergeur choisi.
