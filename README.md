# Escape 42 — La Villa Nul

Un escape game narratif pour s'entraîner à la piscine 42. Neuf pièces, une seule évasion,
et des serrures qui ne s'ouvrent qu'en écrivant du C — compilé et exécuté dans le
navigateur, pour de vrai.

> Séverin Nul a vécu quarante ans dans cette maison et personne ne l'a vu en sortir.
> À la tombée de la nuit, les volets sont descendus tout seuls.
> « La maison s'ouvre à qui sait lui parler. Tu as jusqu'à l'aube. »

## Démarrer

```sh
npm install
npm run dev
```

Le premier lancement télécharge la chaîne de compilation C (58 Mo) dans
`public/chaine-c/`. Elle n'est pas versionnée — `npm run chaine-c` la remet en place.

## Les neuf pièces

| # | Pièce | Notion travaillée | Ce qui ouvre |
|---|-------|-------------------|--------------|
| 1 | Le Hall | `main`, `printf` | une clé sous le paillasson |
| 2 | Le Bureau | boucles `while`, tableaux, tri | un coffre à 4 chiffres |
| 3 | La Bibliothèque | chaînes C, le `'\0'` terminal | 7 lettres |
| 4 | La Chambre | pointeurs, passage par adresse | 3 barillets |
| 5 | L'Atelier | bases, binaire, poids des bits | 4 molettes |
| 6 | La Cave | `malloc` / `free` | le cadran d'une vanne |
| 7 | Le Grenier | récursivité | un cadenas à 4 chiffres |
| 8 | La Salle Serveur | Unix : droits, `find`, `grep`, `git log` | un terminal |
| 9 | Le Testament | la Norme 42 | trois serrures |

## Comment c'est fait

**Le C tourne vraiment.** `clang` et `wasm-ld` sont compilés en WebAssembly et vivent dans
un fil d'exécution à part (`src/c/travailleur.ts`). Le code du joueur est recollé derrière
un **harnais** — un `main` de test qui appelle la fonction demandée, exactement comme un
correcteur de piscine — puis compilé, lié, exécuté. Les erreurs affichées sont celles de
clang, carets compris.

Compter environ 500 ms de compilation, 600 ms d'édition de liens, 3 ms d'exécution. Les
15 Mo compressés de la chaîne descendent pendant l'écran titre, et sont ensuite en cache.

**La Norme est vérifiée à part** (`src/moteur/norme.ts`) : la vraie norminette est un
programme Python, inutilisable ici. Ce qui est couvert, ce sont les écarts qui coûtent le
plus cher en piscine — `for`, ternaire, indentation à l'espace, 80 colonnes, 25 lignes par
fonction, 4 paramètres, 5 fonctions par fichier, accolade sur la ligne de l'en-tête.

**Le contenu est du code, pas des données.** Chaque pièce est un fichier de
`src/contenu/pieces/`. Ajouter une pièce, c'est ajouter un fichier et une ligne dans
`src/contenu/index.ts`.

**Les solutions ne sont pas en clair** dans le paquet : seules leurs empreintes SHA-256 le
sont (`src/moteur/verrous.ts`). Ça n'arrête personne de déterminé — le jeu est entièrement
côté client — mais ça évite de gâcher une énigme par curiosité.

**La progression est dans le navigateur** (`src/moteur/sauvegarde.ts`), sous une interface
`lire` / `ecrire` qui attend Supabase le jour où la reprise devra suivre d'un appareil à
l'autre.

**Les dates passent par `Pacific/Noumea`** (`src/moteur/horloge.ts`), jamais par le fuseau
du processus : onze heures sur vingt-quatre, un serveur en UTC n'est pas au bon jour.

## Les tests

```sh
npm test
```

Le plus utile des trois fichiers est `tests/enigmes.test.ts` : il **compile et exécute une
solution de référence pour chaque énigme**, avec le harnais réellement livré. Si une
serrure devient impossible à ouvrir, le test tombe. Il vérifie aussi qu'aucun squelette de
départ ne résout déjà l'énigme.

## Les images

Le jeu tourne sans elles : un décor absent s'affiche en aplat, la pièce reste jouable. Les
fichiers se déposent dans `public/pieces/<numéro-nom>/`, en `fond.webp`, `objet-*.webp` et
`zoom-*.webp`. Les prompts de génération sont dans le kit d'assets fourni à part.

## Déploiement

Cloudflare Workers, sur `escape.lifepilot.win` — un service séparé de LifePilot, qui
garde `lifepilot.win`.

```sh
npm run deploy
```

## Crédits

La chaîne de compilation vient de [wasm-clang](https://github.com/binji/wasm-clang) de Ben
Smith, sous licence Apache 2.0. L'attribution complète est dans `public/chaine-c/LICENCE.txt`
une fois la chaîne récupérée.
