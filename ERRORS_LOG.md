# Journal des erreurs

Deux projets suivis dans ce dépôt : **Rouage** (`rouage/`) et **Montbellet
Paysage** (racine). Les entrées E-001 à E-008 viennent de Rouage, E-009 à
E-014 de la reprise de Montbellet.

Tenu en continu. À relire avant toute nouvelle tâche : si une erreur
ressemble à une entrée existante, appliquer directement le correctif connu
au lieu de rediagnostiquer.

Catégories : `build` · `style` · `logique` · `perf` · `seo` · `a11y` · `contenu`

---

## E-001 — Un conteneur `hidden` reste visible

- **Catégorie** : style
- **Symptôme** : le tiroir de navigation mobile (`.drawer`, marqué `hidden`
  dans le HTML) s'affichait en pleine page sur desktop, recouvrant le hero.
- **Cause racine** : le navigateur applique `display: none` à `[hidden]` via
  sa feuille de style par défaut. Cette déclaration a la priorité la plus
  faible : **toute** déclaration `display` écrite par l'auteur l'écrase, quelle
  que soit sa spécificité. `.drawer { display: flex }` suffit donc à annuler
  le masquage.
- **Correctif** : règle globale posée dans le socle CSS, juste après le reset.
  ```css
  [hidden] { display: none !important; }
  ```
- **Récidive** : oui. Le même bug était apparu sur un projet précédent de la
  même session, sur un composant `.overlay { display: grid }`. La règle avait
  été ajoutée là-bas mais pas reportée dans la nouvelle feuille de style.
- **Règle préventive** : poser `[hidden] { display: none !important; }` dans
  le socle de **toute** nouvelle feuille de style, avant d'écrire le premier
  composant. Coût nul, évite une classe entière de bugs.

---

## E-002 — Un visuel de repli se peint par-dessus le contenu réel

- **Catégorie** : style
- **Symptôme** : sur un projet antérieur de la même session, la photo d'accueil
  était entièrement masquée par le dégradé censé la remplacer en son absence,
  et le logo s'affichait en double.
- **Cause racine** : le repli était placé **après** l'image dans le DOM avec
  `position: absolute`. À `z-index` égal, l'ordre du document décide : le
  dernier élément gagne. Le repli couvrait donc systématiquement le contenu.
- **Correctif** : masquer le repli par défaut et ne le révéler que si le
  contenu réel a échoué, via le sélecteur de frère adjacent.
  ```css
  .fallback { display: none; }
  img.is-missing + .fallback { display: block; }
  ```
- **Règle préventive** : un repli se conçoit masqué par défaut. Ne jamais
  compter sur le seul empilement pour le cacher. Vérifier systématiquement le
  rendu avec **et** sans la ressource réelle.

---

## E-003 — Images paresseuses jamais chargées dans une section masquée

- **Catégorie** : logique / perf
- **Symptôme** : une galerie ne s'affichait jamais, même avec toutes ses
  photos présentes.
- **Cause racine** : la section était `hidden` en attendant de savoir si au
  moins une photo existait, et les images portaient `loading="lazy"`. Le
  navigateur ne charge jamais une image paresseuse dans un sous-arbre non
  rendu : ni `load` ni `error` ne se déclenchaient, la condition de sortie
  n'était jamais atteinte. Interblocage.
- **Correctif** : sonder les ressources une par une en chargement immédiat
  jusqu'à la première qui répond, puis basculer les suivantes en paresseux.
- **Règle préventive** : `loading="lazy"` et détection de présence sont
  incompatibles. Si le code doit *savoir* qu'une ressource existe, elle doit
  être chargée en immédiat.

---

## E-004 — Les engrenages du hero orbitaient au lieu de tourner

- **Catégorie** : style
- **Symptôme** : les trois roues du hero se déplaçaient au fil de l'animation
  et venaient recouvrir leurs propres annotations. Premier réflexe erroné :
  croire à un mauvais calcul des coordonnées de texte.
- **Diagnostic** : le markup des textes était correct. En comparant deux
  captures prises à des instants différents, les roues avaient changé de
  position — donc le défaut venait de la rotation, pas des libellés.
- **Cause racine** : cumul de deux transformations. Chaque groupe portait un
  attribut SVG `transform="translate(cx cy) rotate(phase)"` **et** une
  propriété CSS `rotate` animée, avec `transform-box: fill-box`. En CSS
  Transforms 2, `translate`, `rotate`, `scale` et `transform` sont des
  propriétés distinctes qui se composent dans un ordre imposé. Le centre de
  rotation ne tombait donc pas sur le centre de la roue, qui décrivait une
  orbite.
- **Correctif** : supprimer tout `translate` de l'élément animé. Les dentures
  sont générées en coordonnées absolues du viewBox, et chaque roue reçoit un
  centre explicite.
  ```css
  .gear   { transform-box: view-box; }
  .gear--a { transform-origin: 95px 115px; animation: spin 36s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  ```
- **Règle préventive** : ne jamais animer en CSS un élément SVG qui porte déjà
  un attribut `transform`. Positionner par les coordonnées, animer par le CSS,
  et donner le centre de rotation en dur. Vérifier une animation sur **au
  moins deux instants** : une capture unique ne montre pas une dérive.

---

## E-005 — Cartes de tarifs désalignées

- **Catégorie** : style
- **Symptôme** : d'une carte à l'autre, les titres, les prix et les lignes
  « puis X €/mois » ne tombaient pas sur la même ligne, et les boutons ne
  s'alignaient pas en bas.
- **Cause racine** : trois causes distinctes, pas une seule.
  1. `.plan` est un conteneur flex avec `gap: 1rem`, mais les `<p>` gardaient
     leur `margin-bottom: 1em` par défaut, qui **s'ajoute** au `gap`. Les
     espacements devenaient irréguliers selon le contenu de chaque carte.
  2. Le badge « Recommandé » était dans le flux : il poussait tout le contenu
     de la carte du milieu d'une ligne vers le bas.
  3. `.plans` était en `align-items: start`, donc chaque carte prenait sa
     hauteur propre et `margin-top: auto` sur le bouton n'avait aucun effet.
- **Correctif** : `.plan p { margin: 0 }` (l'espacement vient du seul `gap`),
  badge sorti du flux en `position: absolute` chevauchant la bordure, et
  `align-items: stretch` sur la grille.
- **Règle préventive** : dans un conteneur flex ou grid piloté par `gap`,
  neutraliser les marges par défaut des enfants dès la déclaration du
  composant. Marges et `gap` qui coexistent produisent toujours des
  espacements imprévisibles.

---

## E-006 — Le formulaire ne faisait rien sans JavaScript

- **Catégorie** : logique / a11y
- **Symptôme** : JavaScript désactivé, le formulaire de contact était un
  cul-de-sac : `novalidate` écrit en dur dans le HTML et aucun attribut
  `action`. Le visiteur remplissait six champs, cliquait, et rien ne se
  passait — sur la page qui porte toute la conversion du site.
- **Cause racine** : `novalidate` avait été posé dans le markup pour laisser
  le script gérer la validation. Mais un attribut HTML s'applique **avant**
  et **indépendamment** du script : il désarmait la validation native même
  quand le script ne s'exécutait pas.
- **Correctif** : trois changements complémentaires.
  1. `novalidate` retiré du HTML, posé par le script (`form.noValidate = true`)
     une fois celui-ci prêt à prendre le relais.
  2. `action="mailto:…" method="post" enctype="text/plain"` comme repli.
  3. Un lien `mailto:` direct et visible sous le formulaire, qui ne dépend
     ni du script ni du support des formulaires `mailto`.
- **Règle préventive** : tout attribut HTML qui **désactive** un comportement
  natif du navigateur au profit d'un script doit être posé par ce script, pas
  écrit dans le markup. Tester chaque parcours critique avec JavaScript coupé.

---

## E-007 — Un correctif d'accessibilité a cassé la validation HTML

- **Catégorie** : a11y / build
- **Symptôme** : après avoir corrigé la violation axe-core
  `scrollable-region-focusable` avec `<div tabindex="0" role="region">`, la
  validation HTML est repassée au rouge : `prefer-native-element`.
- **Cause racine** : un rôle ARIA a été employé là où un élément HTML natif
  porte déjà la sémantique. `<section>` avec un `aria-label` **est** une
  région, sans avoir à le déclarer.
- **Correctif** : `<section class="table-scroll" tabindex="0" aria-label="…">`.
- **Règle préventive** : première règle de l'ARIA — ne pas utiliser ARIA quand
  un élément natif fait le travail. Et surtout : **rejouer la validation après
  chaque correction**, y compris quand elle porte sur un autre domaine. C'est
  précisément une régression que seule une revérification systématique attrape.

---


## E-009 — Palette non conforme AA : un défaut systémique, pas six bugs

- **Catégorie** : a11y
- **Symptôme** : 26 violations `color-contrast` sur la page d'accueil de
  Montbellet, réparties sur six couples couleur/fond différents.
- **Diagnostic** : la tentation était de corriger les six sélecteurs
  concernés. En listant les ratios, tous pointaient vers deux jetons dérivés
  (`--dim` à 68 % de l'encre, `--faint` à 42 %) et vers le terracotta
  `--warm` employé comme couleur de texte.
- **Cause racine** : les jetons avaient été choisis à l'œil, pour leur rendu,
  sans vérifier le ratio de contraste. Un pourcentage d'opacité n'a aucune
  raison de produire 4,5:1.
- **Correctif** : recalibrage des trois jetons. Le terracotta passe de
  `#b45b34` à `#9c4a25` pour tenir AA sur les fonds clairs.
- **Règle préventive** : tout jeton destiné à porter du **texte** se calibre
  contre le seuil AA au moment où on le définit, pas après coup. Un jeton
  purement décoratif (filets, aplats) peut rester libre, mais alors il ne doit
  jamais servir à du texte.

---

## E-010 — La même correction, une deuxième fois : elle était incomplète

- **Catégorie** : a11y
- **Symptôme** : après E-009, trois nouvelles violations `color-contrast` sont
  apparues sur les pages au fond « pierre ».
- **Cause racine** : j'avais calibré `--faint` contre le fond chaux seulement.
  Le fond pierre (`#ebe5d5`) est plus clair : le même jeton n'y donnait plus
  que 4,24:1. La correction initiale traitait un fond, pas le système.
- **Correctif** : recalibrage sur le **pire cas** de la palette — le fond le
  plus clair — et non sur le fond le plus courant. `--faint` à 76 %,
  `--dim` à 86 %.
- **Règle préventive** : quand un jeton est partagé par plusieurs thèmes, il
  se calibre sur la combinaison la plus défavorable. Vérifier une seule
  variante donne une fausse sécurité. C'est la deuxième occurrence de la même
  catégorie : le signal que la première correction était partielle.

---

## E-011 — Correction perdue : appliquée au fichier généré, pas à la source

- **Catégorie** : build
- **Symptôme** : une faute dans un `<title>` (un fragment d'un autre projet
  resté collé dans le texte) a été corrigée, vérifiée… puis est réapparue
  telle quelle à la génération suivante.
- **Cause racine** : le site est produit par un générateur. J'avais édité le
  `index.html` de sortie ; la régénération l'a écrasé.
- **Correctif** : correction portée dans le générateur, puis régénération.
- **Règle préventive** : dès qu'un fichier est produit par un outil, il est en
  lecture seule. Toute correction remonte à la source. Se demander « ce
  fichier est-il généré ? » avant d'éditer.

---

## E-012 — Chemin relatif dans un script partagé par plusieurs pages

- **Catégorie** : logique
- **Symptôme** : huit 404 sur `/realisations/` uniquement, pas sur les autres
  pages.
- **Cause racine** : le script commun construisait les URLs de la galerie
  depuis `'assets/img/realisations/'`, un chemin **relatif**. Depuis la
  racine il résolvait bien ; depuis `/realisations/` il devenait
  `/realisations/assets/img/...`. Le passage d'un site d'une page à un site
  de huit pages a rendu visible une hypothèse implicite.
- **Correctif** : chemin absolu `'/assets/img/realisations/'`.
- **Règle préventive** : dans un script ou un CSS partagé par des pages
  situées à des profondeurs différentes, les chemins sont **toujours**
  absolus. Le relatif ne vaut que dans un fichier dont on connaît la position.

---

## E-013 — Une animation décorative coûtait 770 ms de blocage

- **Catégorie** : perf
- **Symptôme** : Lighthouse mobile à 66 sur l'accueil. `Total Blocking Time`
  770 ms, 5,9 s de travail sur le fil principal dont 4,2 s classés « Other ».
- **Diagnostic** : la catégorie « Other » désigne surtout le temps de
  peinture. Le seul élément qui peint en continu est le canvas de lumière
  filtrée : seize dégradés radiaux plein écran, redessinés à 60 images par
  seconde, à la résolution de l'écran multipliée par le rapport de pixels.
- **Cause racine** : un effet volontairement flou était rendu à pleine
  résolution et à pleine cadence. Le coût de remplissage est proportionnel au
  nombre de pixels : un rendu à 0,4× coûte six fois moins pour un résultat
  visuellement identique.
- **Correctif** : canvas peint à 0,4× puis étiré par le CSS, cadence ramenée à
  20 images par seconde, nombre de taches réduit sur petit écran.
  Résultat : TBT 770 ms → **0 ms**, fil principal 5,9 s → 1,5 s, score 66 → 86.
- **Règle préventive** : un effet flou n'a pas besoin de la résolution de
  l'écran, et une animation lente n'a pas besoin de 60 images par seconde.
  Fixer ces deux paramètres à la conception, pas après la mesure.

---

## E-014 — Le contenu principal d'une page n'existait qu'en JavaScript

- **Catégorie** : logique / seo
- **Symptôme** : JavaScript désactivé, la page Réalisations n'affichait aucune
  photo. Le reste du texte était bien là, mais la galerie — sa raison d'être —
  était vide.
- **Cause racine** : héritage du site d'une page, où la galerie était
  construite par le script à partir d'une liste. Pratique pour ajouter une
  photo, mais cela plaçait le contenu principal hors du HTML. Un moteur de
  recherche qui n'exécute pas le script, ou un navigateur sans JS, ne voyait
  rien.
- **Correctif** : les huit figures sont écrites dans le HTML. Le script ne
  fait plus qu'entretenir la grille — retirer une case dont le fichier manque,
  et la section entière si aucune photo ne répond.
- **Règle préventive** : le contenu se met dans le HTML ; le script l'améliore.
  Si une page perd sa raison d'être quand le script ne s'exécute pas, ce n'est
  pas une amélioration progressive, c'est une dépendance.

---

## Patterns récurrents

1. **La cascade avant le composant.** E-001, E-002, E-004 et E-005 viennent
   toutes d'une règle de cascade, d'un ordre du document ou d'une composition
   de transformations mal anticipés — jamais d'une faute de frappe. Poser le
   socle en entier (reset, `[hidden]`, jetons, neutralisation des marges dans
   les conteneurs à `gap`) **avant** d'écrire le premier composant.
2. **Tester les deux états.** Un repli, un état vide, une ressource absente,
   JavaScript coupé : chaque branche doit être vue au moins une fois en rendu
   réel. Un état qui n'a jamais été affiché n'a jamais été testé. E-002, E-003
   et E-006 étaient tous invisibles dans l'état nominal.
3. **Reporter les correctifs entre projets.** E-001 est une récidive pure : le
   correctif était connu, il n'a pas suivi. Ce fichier existe pour ça.
4. **Une capture ne suffit pas pour une animation.** E-004 n'est apparu qu'en
   comparant deux instants. Toute animation se vérifie sur au moins deux
   images.
5. **Revérifier après correction, sur tous les axes.** E-007 est une
   régression introduite *par* un correctif. Une correction n'est pas finie
   tant que la batterie complète — validation, axe, rendu, console — n'a pas
   été rejouée.
6. **Ne pas soigner le symptôme.** Sur E-004, le premier réflexe était de
   recalculer les coordonnées des libellés. Elles étaient justes : le défaut
   était ailleurs. Deux minutes de diagnostic ont évité une correction inutile
   qui n'aurait rien réglé.

---

## E-008 — Fausse régression de performance

- **Catégorie** : perf
- **Symptôme** : un passage Lighthouse mobile a rendu 81 en performance sur
  l'accueil, alors que les mesures précédentes donnaient 100. Réflexe : croire
  à une régression introduite par la dernière modification CSS.
- **Diagnostic** : trois exécutions consécutives ont rendu 100, avec des
  métriques rigoureusement identiques (FCP 0,9 s · LCP 1,7 s · TBT 0 ms ·
  CLS 0 · Speed Index 0,9 s). La mesure à 81 avait été lancée dans une
  commande qui exécutait simultanément d'autres processus : la contention CPU
  a faussé le throttling simulé de Lighthouse.
- **Cause racine** : erreur de méthode de mesure, pas défaut du site.
- **Règle préventive** : ne jamais conclure sur une exécution Lighthouse
  isolée. Lancer la mesure seule, sans autre travail concurrent, et confirmer
  une variation par au moins deux exécutions. Une régression réelle déplace
  une métrique précise ; la variance déplace le score sans raison lisible.

---

## État de la vérification finale

### Rouage (`rouage/`) — 6 pages

| Contrôle | Résultat |
|---|---|
| Validation HTML · axe-core WCAG 2.1 AA · console | 0 erreur |
| Débordement 375 / 768 / 1440 px · liens · Hn | conforme |
| Sans JavaScript | contenu et formulaire fonctionnels |
| Lighthouse desktop et mobile | 100 / 100 / 100 / 100 |

### Montbellet Paysage (racine) — 8 pages

Rejoué après la dernière correction, le 10 août 2026 :

| Contrôle | Outil | Résultat |
|---|---|---|
| Validation HTML | html-validate, 8 pages | 0 erreur |
| Accessibilité | axe-core WCAG 2.1 AA | 0 violation |
| Console navigateur | 8 pages × 3 tailles | 0 erreur, 0 requête en échec |
| Débordement horizontal | 375 / 768 / 1440 px | aucun |
| Structure Hn | 8 pages | un seul H1 par page |
| Images | 15 balises | alt et dimensions sur toutes |
| Liens internes | 10 cibles | aucun lien cassé |
| Sans JavaScript | accueil, création, réalisations, contact | rien de masqué, galerie et formulaire fonctionnels |
| Requêtes externes | toutes pages | aucune (polices auto-hébergées) |

Lighthouse mobile, page par page, mesuré isolément :

| Page | Perf | A11y | BP | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| `/` | 97 | 100 | 100 | 100 | 2,6 s | 0 |
| `/creation-de-jardins/` | 99 | 100 | 100 | 100 | 2,2 s | 0 |
| `/piscines-bois/` | 97 | 100 | 100 | 100 | 2,4 s | 0 |
| `/entretien-de-jardin/` | 99 | 100 | 100 | 100 | 2,2 s | 0 |
| `/realisations/` | 91 | 100 | 100 | 100 | 3,4 s | 0 |
| `/collectivites/` | 99 | 100 | 100 | 100 | 2,1 s | 0 |
| `/contact/` | 98 | 100 | 100 | 100 | 2,3 s | 0 |
| `/mentions-legales/` | 99 | 100 | 100 | 100 | 2,0 s | 0,018 |

`/realisations/` reste la page la plus lourde : c'est une galerie de huit
photos, et le seuil de 90 y est atteint sans marge. Deux tentatives
d'optimisation supplémentaires (réencodage de l'image LCP, préchargement)
n'ont gagné que 0,2 s — le poids des photos est structurel. Conforme, mais
c'est la page à surveiller si d'autres images y sont ajoutées.

Note de méthode : `cache-insight` remonte 980 Ko d'économies possibles sur
les images. Il s'agit des en-têtes de cache absents du serveur de test
Python ; en production, la configuration de l'hébergeur les fournit. Non
corrigeable dans le code du site.
