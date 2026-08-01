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
- Le formulaire de maquette gratuite envoie déjà les leads via [FormSubmit](https://formsubmit.co) vers `alexo.webdesign@gmail.com` (`assets/js/main.js`, `LEAD_ENDPOINT`). **Au tout premier envoi réel**, FormSubmit demande une confirmation par e-mail à cette adresse — il faut cliquer sur le lien reçu pour activer la réception des leads suivants.
- Mettre à jour l'e-mail de contact dans le footer si besoin.

## Prévisualiser en local

```bash
cd alexo
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```
