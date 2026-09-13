/// <reference lib="webworker" />
// Le compilateur C vit ici, dans son propre fil d'exécution : une compilation prend
// une demi-seconde, et le décor ne doit pas se figer pendant ce temps.
//
// La chaîne (clang, l'éditeur de liens, la bibliothèque standard) est du WebAssembly
// servi depuis /chaine-c/. Elle est pilotée par `shared.js`, qui est un script classique
// et non un module : on le récupère en texte et on l'évalue, faute de pouvoir l'importer.
import type { Demande, Reponse, Resultat } from './protocole';

// Serveur externe pour la chaîne C (clang + lld + sysroot)
// Source: https://github.com/binji/wasm-clang (licence Apache 2.0)
const RACINE = 'https://binji.github.io/wasm-clang';

// Les arguments de clang pour du C. Ceux d'origine visaient le C++, d'où l'absence
// des en-têtes C++ et la présence de `-std=c99` : c'est la norme de la piscine.
const ARGS_C = [
  '-disable-free', '-isysroot', '/',
  '-internal-isystem', '/include',
  '-internal-isystem', '/lib/clang/8.0.1/include',
  '-ferror-limit', '19', '-fmessage-length', '80',
  '-std=c99', '-Wall', '-Wextra',
];

/** Les codes couleur ANSI de clang n'ont aucun sens dans une page web. */
const sansCouleurs = (texte: string) => texte.replace(/\x1b\[[0-9;]*m/g, '');

const envoyer = (reponse: Reponse) => (self as unknown as Worker).postMessage(reponse);

let capture = '';
let api: any = null;
let preparation: Promise<void> | null = null;

async function recuperer(nom: string, etape: string, part: number): Promise<ArrayBuffer> {
  envoyer({ type: 'progression', etape, part });
  const reponse = await fetch(`${RACINE}/${nom}`);
  if (!reponse.ok) throw new Error(`${nom} : HTTP ${reponse.status}`);
  return reponse.arrayBuffer();
}

async function preparer(): Promise<void> {
  const source = await (await fetch(`${RACINE}/shared.js`)).text();
  // eslint-disable-next-line no-new-func
  const API = new Function(`${source}\n;return API;`)();

  const cache = new Map<string, ArrayBuffer>();
  const etapes: Record<string, [string, number]> = {
    'memfs': ['Réveil de la machine', 0.05],
    'sysroot.tar': ['Bibliothèque standard', 0.15],
    'clang': ['Compilateur', 0.6],
    'lld': ['Éditeur de liens', 1],
  };

  const lire = async (nom: string) => {
    if (!cache.has(nom)) {
      const [etape, part] = etapes[nom] ?? [nom, 0];
      cache.set(nom, await recuperer(nom, etape, part));
    }
    return cache.get(nom)!;
  };

  api = new API({
    readBuffer: lire,
    compileStreaming: async (nom: string) => WebAssembly.compile(await lire(nom)),
    hostWrite: (texte: string) => { capture += texte; },
  });
  await api.ready;
  envoyer({ type: 'pret' });
}

async function executer(source: string): Promise<Resultat> {
  const duree = { compilation: 0, liaison: 0, execution: 0 };
  await (preparation ??= preparer());

  api.memfs.addFile('joueur.c', source);
  capture = '';

  const t0 = Date.now();
  try {
    const clang = await api.getModule('clang');
    await api.run(clang, 'clang', '-cc1', '-emit-obj', ...ARGS_C, '-O2',
                  '-o', 'joueur.o', '-x', 'c', 'joueur.c');
  } catch (erreur) {
    return { reussi: false, sortie: '', diagnostics: nettoyer(capture),
             code: codeDe(erreur), duree: { ...duree, compilation: Date.now() - t0 } };
  }
  duree.compilation = Date.now() - t0;

  const t1 = Date.now();
  try {
    const lld = await api.getModule('lld');
    await api.run(lld, 'wasm-ld', '--no-threads', '-z', 'stack-size=1048576',
                  '-Llib/wasm32-wasi', 'lib/wasm32-wasi/crt1.o', 'joueur.o',
                  '-lc', '-o', 'joueur.wasm');
  } catch (erreur) {
    return { reussi: false, sortie: '', diagnostics: nettoyer(capture),
             code: codeDe(erreur), duree: { ...duree, liaison: Date.now() - t1 } };
  }
  duree.liaison = Date.now() - t1;

  const diagnostics = nettoyer(capture);
  const binaire = api.memfs.getFileContents('joueur.wasm');
  const programme = await WebAssembly.compile(binaire);

  capture = '';
  const t2 = Date.now();
  let code: number | null = 0;
  try {
    await api.run(programme, 'joueur.wasm');
  } catch (erreur) {
    code = codeDe(erreur);
  }
  duree.execution = Date.now() - t2;

  return { reussi: code === 0, sortie: nettoyer(capture), diagnostics, code, duree };
}

/**
 * `shared.js` préfixe chacune de ses lignes d'une flèche jaune et répète la ligne de
 * commande : c'est du bruit de terminal dont le joueur n'a rien à faire.
 */
function nettoyer(brut: string): string {
  return sansCouleurs(brut)
    .split('\n')
    .filter((ligne) => !ligne.startsWith('> ') && !ligne.startsWith('Error: process exited'))
    .join('\n')
    .trim();
}

function codeDe(erreur: unknown): number | null {
  const code = (erreur as { code?: unknown } | null)?.code;
  return typeof code === 'number' ? code : null;
}

self.onmessage = async (evenement: MessageEvent<Demande>) => {
  const demande = evenement.data;
  if (demande.type === 'preparer') {
    preparation ??= preparer();
    await preparation;
    return;
  }
  const resultat = await executer(demande.source).catch((erreur): Resultat => ({
    reussi: false,
    sortie: '',
    diagnostics: `La machine s'est enrayée : ${erreur instanceof Error ? erreur.message : erreur}`,
    code: null,
    duree: { compilation: 0, liaison: 0, execution: 0 },
  }));
  envoyer({ type: 'resultat', id: demande.id, resultat });
};
