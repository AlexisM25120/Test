# Photos du site

Ce dossier est vide volontairement : le site fonctionne **sans aucune photo**.
Chaque emplacement affiche à la place un visuel généré en CSS (bois, eau, chalet…).

Dès qu'un fichier ci-dessous est déposé ici, il remplace automatiquement le visuel
généré — aucune modification de code n'est nécessaire.

| Fichier attendu | Emplacement | Sujet conseillé |
|---|---|---|
| `creation.jpg` | Section **01 · Création** | Terrasse en bois, pavage ou massif terminé |
| `piscine.jpg`  | Section **02 · Piscines** | Bassin bois avec sa plage, en lumière naturelle |
| `chalet.jpg`   | Section **03 · Chalets** | Chalet de jardin en bois, vue trois-quarts |

## Recommandations

- **Cadrage vertical** (portrait, ratio proche de 4:5) sur grand écran ; l'image est
  recadrée automatiquement (`object-fit: cover`) sur les autres formats.
- **Poids** : viser moins de 300 Ko par image. Passer les JPEG en qualité 80 environ,
  ou fournir du `.webp` (dans ce cas, changer l'extension dans `index.html`).
- **Largeur** : 1400 px suffit largement.
- Éviter les photos prises en plein midi : la lumière rasante du matin ou de fin de
  journée s'accorde mieux avec les teintes sombres du site.

## Ajouter d'autres photos

Le mécanisme est générique. Pour un nouvel emplacement, reprendre ce motif :

```html
<figure class="frame">
  <img src="assets/img/mon-image.jpg" alt="Description utile" loading="lazy" data-photo>
  <div class="frame__art art--deck" aria-hidden="true"></div>
  <figcaption>Légende</figcaption>
</figure>
```

L'attribut `data-photo` déclenche la bascule vers le visuel généré si le fichier
est absent. Les classes de repli disponibles sont `art--deck` (bois),
`art--pool` (eau) et `art--cabin` (chalet).
