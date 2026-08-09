# Photos et logo

Ce dossier est vide volontairement : le site fonctionne **sans aucune image**.
Chaque emplacement affiche à la place un visuel dessiné en CSS, et la galerie
des réalisations reste masquée tant qu'aucune photo n'est présente.

Dès qu'un fichier ci-dessous est déposé ici, il remplace automatiquement le
repli — aucune modification de code n'est nécessaire.

## Fichiers attendus

| Fichier | Emplacement | Sujet |
|---|---|---|
| `logo.svg` | En-tête et pied de page | Le logo de l'entreprise. Un `.png` marche aussi (changer l'extension dans `index.html`, deux occurrences). |
| `hero.jpg` | Grande image d'accueil | Vue large du jardin : pelouse, arbres, massifs. C'est la première chose que l'on voit. |
| `creation.jpg` | Section **Création** | Terrasse en bois, pavage ou massif terminé |
| `piscine.jpg` | Section **Piscines** | Bassin bois avec sa plage, en lumière naturelle |
| `chalet.jpg` | Section **Chalets** | Chalet de jardin en bois, vue trois-quarts |
| `realisations/01.jpg` … `06.jpg` | Galerie **Réalisations** | Six chantiers représentatifs |

## La galerie

Les légendes et le nombre de photos se règlent en haut de
`assets/js/main.js`, dans la liste `REALISATIONS` :

```js
var REALISATIONS = [
  { src: 'assets/img/realisations/01.jpg', legende: 'Terrasse en bois et plage de piscine' },
  …
];
```

Ajouter ou retirer des lignes suffit. La grille alterne automatiquement les
formats (une grande, deux moyennes, deux larges…). Une photo absente disparaît
sans laisser de trou ; si aucune n'est trouvée, la section entière et son lien
de menu sont masqués.

## Recommandations

- **`hero.jpg`** : format paysage large (au moins 2000 px), la photo est recadrée
  en plein écran. Éviter un sujet important tout en bas — le texte se pose dessus.
- **Photos de sections** : cadrage plutôt vertical (4:5) sur grand écran, recadré
  automatiquement ailleurs.
- **Poids** : viser moins de 300 Ko par image (JPEG qualité 80, ou `.webp`).
- Préférer la lumière du matin ou de fin de journée : elle s'accorde avec les
  teintes chaudes du site.
