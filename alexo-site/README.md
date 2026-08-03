# Alexo — site vitrine

Site du studio web **Alexo** : présentation de l'offre, valeur ajoutée, forfait 997€ et formulaire de demande de maquette gratuite.

Site **statique** — HTML / CSS / JS natif, aucune dépendance, aucun build. Il se déploie par simple copie de fichiers.

## Organisation du dépôt

```
alexo-site/
├── public/                       ← TOUT ce qui part en ligne (= public_html/)
│   ├── index.html                page d'accueil
│   ├── mentions-legales.html     mentions légales + RGPD
│   ├── 404.html                  page d'erreur
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── .htaccess                 config Apache : HTTPS, cache, sécurité
│   └── assets/
│       ├── css/style.css         tous les styles
│       ├── js/main.js            animations + formulaire
│       ├── img/                  images du site
│       └── fonts/                police du logo (à venir)
│
├── brand/                        éléments de marque (NE PART PAS en ligne)
│   └── alexo-logo.svg
│
├── docs/
│   └── DEPLOIEMENT-HOSTINGER.md  guide de mise en ligne pas à pas
│
└── README.md
```

**À retenir :** seul le *contenu* de `public/` est téléversé sur l'hébergeur. `brand/`, `docs/` et ce README restent sur GitHub.

## Tester en local

```bash
cd alexo-site/public
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Mise en ligne

Voir **[docs/DEPLOIEMENT-HOSTINGER.md](docs/DEPLOIEMENT-HOSTINGER.md)**.

## Points en attente

- [ ] Remplacer la police placeholder (Space Grotesk) par celle du logo → variable `--font-display` dans `public/assets/css/style.css`
- [ ] Compléter les champs `[À COMPLÉTER]` de `mentions-legales.html` (nom, adresse, SIRET)
- [ ] Confirmer FormSubmit au premier envoi réel du formulaire
- [ ] Remplacer `alexo.fr` par le vrai domaine dans `.htaccess`, `robots.txt`, `sitemap.xml` et les balises `og:`/`canonical` de `index.html`
- [ ] Ajouter une image de partage (`assets/img/og-image.jpg`, 1200×630) + la balise `og:image`
