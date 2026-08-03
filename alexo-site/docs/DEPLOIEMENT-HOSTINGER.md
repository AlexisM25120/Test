# Mise en ligne sur Hostinger

Le site est **statique** (HTML/CSS/JS, aucun build, aucune base de données). Sur Hostinger, la formule d'hébergement web mutualisée la moins chère suffit — pas besoin de VPS.

> **Règle à retenir :** c'est le **contenu du dossier `public/`** qui va dans `public_html/` sur Hostinger — **pas** le dossier `public/` lui-même, ni le reste du dépôt (`docs/`, `brand/`, `README.md` ne doivent pas être en ligne).

## Option A — Upload manuel (le plus simple pour démarrer)

1. Connecte-toi à **hPanel** → *Fichiers* → **Gestionnaire de fichiers**.
2. Ouvre le dossier `public_html/`.
3. Supprime le fichier `default.php` ou `index.html` de démo si présent.
4. Téléverse **le contenu** de `alexo-site/public/` :
   - `index.html`
   - `404.html`
   - `mentions-legales.html`
   - `favicon.svg`
   - `robots.txt`
   - `sitemap.xml`
   - `.htaccess`
   - le dossier `assets/` entier
5. Vérifie que `index.html` est bien **directement** dans `public_html/`, pas dans un sous-dossier.

⚠️ Le fichier `.htaccess` commence par un point : dans le gestionnaire de fichiers, active **« Afficher les fichiers cachés »** (menu Paramètres) pour le voir après l'upload.

## Option B — Déploiement Git (mise à jour automatique)

Hostinger sait tirer un dépôt Git, mais il déploie **la racine du dépôt**, pas un sous-dossier. Deux façons de faire :

- **Simple :** créer un dépôt GitHub dédié qui contient uniquement le contenu de `public/` à sa racine.
- **Sinon :** rester sur l'option A pour les premières mises en ligne, c'est largement suffisant pour un site qui bouge peu.

Dans hPanel : *Avancé* → **Git** → renseigner l'URL du dépôt et la branche → *Créer*. Ensuite un bouton **Deploy** récupère la dernière version.

## Après le premier upload

1. **Nom de domaine** — hPanel → *Domaines*. Soit tu l'achètes chez Hostinger (souvent inclus la 1re année), soit tu pointes un domaine acheté ailleurs vers les DNS Hostinger. Comptez jusqu'à 24 h de propagation.
2. **Certificat SSL** — hPanel → *Sécurité* → **SSL** → installer le certificat gratuit sur le domaine. Attends qu'il soit actif.
3. **Forcer HTTPS** — une fois le SSL actif, ouvre `.htaccess` et **décommente le bloc de redirection** en haut du fichier (retire les `#`). Remplace `alexo.fr` par ton vrai domaine si différent.
4. **Formulaire de maquette** — envoie une première demande depuis le site en ligne : FormSubmit envoie un e-mail de confirmation à `alexo.webdesign@gmail.com`. **Tant que tu n'as pas cliqué sur ce lien, aucun lead ne t'arrivera.**
5. **Mentions légales** — complète les champs `[À COMPLÉTER]` dans `mentions-legales.html` avec ton nom, ton adresse et ton SIRET une fois l'entreprise immatriculée.
6. **Google** — inscris le site sur [Google Search Console](https://search.google.com/search-console) et soumets `sitemap.xml`.

## Mettre à jour le site plus tard

Modifie les fichiers dans `public/`, teste en local, puis re-téléverse uniquement les fichiers modifiés dans `public_html/`.

Test en local avant chaque mise en ligne :

```bash
cd alexo-site/public
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```
