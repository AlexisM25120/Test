# Rouage — site vitrine

Site de **Rouage**, automatisation IA pour les PME de Besançon, du Doubs et de
Franche-Comté. HTML, CSS et JavaScript natifs. Aucun framework, aucune étape de
compilation, aucune dépendance à installer.

## Structure

```
.
├── index.html                    accueil
├── automatisations/index.html    le catalogue, secteur par secteur
├── methode/index.html            déroulé d'une mission, données, garanties
├── tarifs/index.html             formules, comparatif, FAQ facturation
├── contact/index.html            formulaire de diagnostic
├── mentions-legales/index.html   mentions légales et RGPD
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── fonts/*.woff2             polices auto-hébergées
```

## Prévisualiser en local

Les liens sont absolus (`/tarifs/`…) : il faut servir le dossier comme racine.

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Ouvrir `index.html` par double-clic ne fonctionnera pas correctement.

## À compléter avant mise en ligne

1. **Le nom et le domaine.** « Rouage » et `rouage-automatisation.fr` sont des
   propositions. Vérifier la disponibilité du nom (INPI) et du domaine, puis
   remplacer partout : `<link rel="canonical">`, `og:url`, le JSON-LD, le
   `sitemap.xml` et la ligne `Sitemap:` de `robots.txt`.
2. **Un numéro de téléphone.** Il n'y en a volontairement aucun sur le site :
   inventer un numéro qui appartient à quelqu'un d'autre n'était pas une
   option. C'est le premier levier de conversion à ajouter — dans l'en-tête,
   en pied de page et sur la page contact.
3. **Les mentions légales.** SIREN, forme juridique, TVA, adresse postale,
   directeur de la publication et hébergeur sont marqués « à compléter » sur
   `/mentions-legales/`. Ces mentions sont obligatoires en France.
4. **L'adresse e-mail.** `contact@rouage-automatisation.fr` est un
   emplacement, à remplacer par la vraie adresse (7 occurrences).
5. **La preuve sociale.** Aucun témoignage, aucune note, aucun logo client
   n'a été inventé. À ajouter avec de vraies données une fois les premiers
   clients signés — c'est ce qui manquera le plus à ce site pour convertir.

## Choix techniques

- **Polices auto-hébergées.** Newsreader et Schibsted Grotesk, sous-ensemblées
  au jeu de caractères français et l'axe optique figé : 37 Ko et 42 Ko. Aucune
  requête vers un CDN, donc pas de dépendance externe ni de cookie tiers.
- **Aucune image bitmap.** Toute l'iconographie est en SVG, y compris le train
  d'engrenages animé de l'accueil, tracé en coordonnées absolues avec des
  rapports de denture réels (18 / 13 / 8 dents).
- **JavaScript en amélioration progressive.** Le contenu s'affiche
  intégralement sans lui, le formulaire reste fonctionnel, la validation
  native prend le relais.
- **Le formulaire n'envoie rien à un serveur** : il compose un message dans
  la messagerie du visiteur. Pour recevoir les demandes directement,
  brancher un service de formulaire (Formspree, Netlify Forms) sur l'attribut
  `action`.

## Mesures

Lighthouse, en local, sur les pages accueil, automatisations, tarifs et
contact : **100 en performance, accessibilité, bonnes pratiques et SEO**, en
profils desktop et mobile. LCP 1,5 à 1,7 s, CLS 0, TBT 0 ms.

Validation HTML sans erreur, aucune violation axe-core WCAG 2.1 AA.
Le détail des défauts rencontrés et corrigés est dans `../ERRORS_LOG.md`.
