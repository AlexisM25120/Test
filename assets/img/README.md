# Photos et logo

Ce dossier est vide volontairement : le site fonctionne **sans aucune image**.
Chaque emplacement affiche à la place un visuel dessiné en CSS, et la galerie
des réalisations reste masquée tant qu'aucune photo n'est présente.

Dès qu'un fichier ci-dessous est déposé ici, il remplace automatiquement le
repli — aucune modification de code n'est nécessaire.

## Depuis le dossier Drive

Le dossier Drive partagé contient 15 fichiers. Voici où ils vont.

### 1. La galerie — rien à renommer

Déposer les **12 fichiers `com_sitesv_*.jpg`** tels quels dans
`assets/img/realisations/` :

```
assets/img/realisations/com_sitesv_.jpg
assets/img/realisations/com_sitesv_ (1).jpg
…
assets/img/realisations/com_sitesv_ (11).jpg
```

C'est tout : la liste `REALISATIONS` en haut de `assets/js/main.js` les attend
déjà sous ces noms. À noter, `com_sitesv_ (5).jpg` et `com_sitesv_ (6).jpg` font
exactement la même taille — ce sont probablement deux fois la même photo, à
vérifier et à retirer le cas échéant.

### 2. Les quatre images à renommer

| Fichier Drive | Renommer en | Emplacement |
|---|---|---|
| `com_sitesv_.png` (le seul PNG, 16 Ko) | `logo.png` | En-tête et pied de page |
| `Entreprise Montbellet-Paysage, paysagiste professionnel.jpg` | `hero.jpg` | Grande image d'accueil |
| `Création et réalisation d'aménagements paysagers.jpg` | `creation.jpg` | Section **Création** |
| une photo de bassin, à choisir | `piscine.jpg` | Section **Piscines** |
| une photo de chalet, à choisir | `chalet.jpg` | Section **Chalets** |

Le logo est déclaré en `logo.svg` dans `index.html` (deux occurrences) : soit le
fichier est renommé en `.svg`, soit l'extension est changée en `.png` aux deux
endroits. Un SVG reste préférable — il reste net à toutes les tailles.

Les affectations `hero` / `creation` ci-dessus sont déduites des **noms** des
fichiers, pas de leur contenu : le proxy réseau de la session bloque le
téléchargement depuis Drive, donc les photos n'ont pas pu être ouvertes. À
ajuster si le contenu ne correspond pas.

## Réglages de la galerie

Ordre, nombre et légendes se règlent en haut de `assets/js/main.js` :

```js
var REALISATIONS = [
  { fichier: 'com_sitesv_.jpg', legende: 'Terrasse en bois et plage de piscine' },
  …
];
```

L'ordre de la liste est l'ordre d'affichage, et la grille alterne les formats
toute seule (une grande, deux moyennes, deux larges…). Une `legende` vide
n'affiche aucun texte par-dessus la photo — **les légendes sont à écrire**,
elles servent aussi de texte alternatif pour l'accessibilité et le
référencement. Une photo absente disparaît sans laisser de trou ; si aucune
n'est trouvée, la section entière et son lien de menu sont masqués.

## Recommandations

- **`hero.jpg`** : format paysage large (au moins 2000 px), la photo est recadrée
  en plein écran. Éviter un sujet important tout en bas — le texte se pose dessus.
- **Photos de sections** : cadrage plutôt vertical (4:5) sur grand écran, recadré
  automatiquement ailleurs.
- **Poids** : viser moins de 300 Ko par image (JPEG qualité 80, ou `.webp`).
- Préférer la lumière du matin ou de fin de journée : elle s'accorde avec les
  teintes chaudes du site.
