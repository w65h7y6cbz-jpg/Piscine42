// Récupère la chaîne de compilation C (clang + éditeur de liens + bibliothèque
// standard) dans `public/chaine-c/`. 58 Mo : trop gros pour l'historique git, donc
// téléchargé à la demande et ignoré par `.gitignore`.
//
// Origine : https://github.com/binji/wasm-clang — clang 8 compilé en WebAssembly,
// licence Apache 2.0. L'attribution est dans public/chaine-c/LICENCE.txt.
import { mkdirSync, existsSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const CIBLE = join(RACINE, 'public', 'chaine-c');
const SOURCE = 'https://binji.github.io/wasm-clang';

// Taille attendue, en octets : un fichier tronqué produit une erreur incompréhensible
// au moment de compiler, autant le détecter ici.
const FICHIERS = {
  'clang': 31214472,
  'lld': 19490094,
  'sysroot.tar': 9297920,
  'memfs': 345442,
  'shared.js': null,
};

mkdirSync(CIBLE, { recursive: true });

let telecharges = 0;
for (const [nom, taille] of Object.entries(FICHIERS)) {
  const chemin = join(CIBLE, nom);
  if (existsSync(chemin) && (taille === null || statSync(chemin).size === taille)) continue;

  process.stdout.write(`  ${nom}… `);
  const reponse = await fetch(`${SOURCE}/${nom}`);
  if (!reponse.ok) throw new Error(`${nom} : HTTP ${reponse.status}`);
  const octets = Buffer.from(await reponse.arrayBuffer());
  if (taille !== null && octets.length !== taille) {
    throw new Error(`${nom} : ${octets.length} octets reçus, ${taille} attendus`);
  }
  writeFileSync(chemin, octets);
  console.log(`${(octets.length / 1048576).toFixed(1)} Mo`);
  telecharges++;
}

writeFileSync(join(CIBLE, 'LICENCE.txt'),
`La chaîne de compilation C de ce dossier (clang, lld, sysroot.tar, memfs, shared.js)
provient du projet wasm-clang de Ben Smith — https://github.com/binji/wasm-clang —
distribué sous licence Apache 2.0.

  Copyright 2020 WebAssembly Community Group participants

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

Ces fichiers ne sont pas versionnés : \`npm run chaine-c\` les retélécharge.
`);

console.log(telecharges === 0 ? 'Chaîne C déjà en place.' : 'Chaîne C prête.');
