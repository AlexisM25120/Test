# Alexo — Site vitrine

Site standard pour le studio web « Alexo » : présentation de l'offre, valeur ajoutée, grille tarifaire (forfait 997€) et formulaire de demande de maquette gratuite. Page unique en HTML/CSS/JS pur, aucune dépendance de build.

## Structure

```
alexo/
├── index.html
├── assets/
│   ├── css/style.css     styles (palette noir/blanc/gris)
│   ├── js/main.js        menu mobile, animations au scroll, formulaire
│   └── fonts/            à remplacer par la police du logo une fois reçue
└── README.md
```

## À faire avant mise en ligne

- Remplacer la police "Space Grotesk" (placeholder) par la police du logo dans `assets/css/style.css` (`--font-display`).
- Brancher le formulaire de maquette gratuite (`assets/js/main.js`) sur un service d'envoi réel (Formspree, Netlify Forms...) — actuellement il ne fait qu'afficher un message de confirmation côté client.
- Mettre à jour l'e-mail de contact dans le footer si besoin.

## Prévisualiser en local

```bash
cd alexo
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```
