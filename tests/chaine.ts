// La même chaîne de compilation que dans le navigateur, pilotée depuis Node pour les
// tests. C'est ce qui permet de vérifier qu'une énigme est réellement résoluble, et
// pas seulement qu'elle a l'air de l'être.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

const CHAINE = join(process.cwd(), 'public', 'chaine-c');

let api: any = null;
let capture = '';

export type Sortie = { reussi: boolean; sortie: string; diagnostics: string };

const sansCouleurs = (texte: string) => texte.replace(/\x1b\[[0-9;]*m/g, '');

const nettoyer = (brut: string) => sansCouleurs(brut)
  .split('\n')
  .filter((ligne) => !ligne.startsWith('> ') && !ligne.startsWith('Error: process exited'))
  .join('\n')
  .trim();

async function chaine() {
  if (api) return api;
  const contexte = vm.createContext({
    WebAssembly, TextDecoder, TextEncoder, console, setTimeout, Date, Math,
    Uint8Array, Uint32Array, DataView, ArrayBuffer, Error, JSON, Promise,
    String, Number, Object, Array, performance,
  });
  const API = vm.runInContext(
    `${readFileSync(join(CHAINE, 'shared.js'), 'utf8')}\n;API;`, contexte);

  api = new API({
    readBuffer: async (nom: string) => readFileSync(join(CHAINE, nom)).buffer,
    compileStreaming: async (nom: string) => WebAssembly.compile(readFileSync(join(CHAINE, nom))),
    hostWrite: (texte: string) => { capture += texte; },
  });
  await api.ready;
  return api;
}

const ARGS_C = ['-disable-free', '-isysroot', '/', '-internal-isystem', '/include',
  '-internal-isystem', '/lib/clang/8.0.1/include', '-ferror-limit', '19',
  '-fmessage-length', '80', '-std=c99', '-Wall', '-Wextra'];

export async function compilerEtExecuter(source: string): Promise<Sortie> {
  const a = await chaine();
  a.memfs.addFile('joueur.c', source);
  capture = '';

  try {
    await a.run(await a.getModule('clang'), 'clang', '-cc1', '-emit-obj', ...ARGS_C,
                '-O2', '-o', 'joueur.o', '-x', 'c', 'joueur.c');
    await a.run(await a.getModule('lld'), 'wasm-ld', '--no-threads', '-z',
                'stack-size=1048576', '-Llib/wasm32-wasi', 'lib/wasm32-wasi/crt1.o',
                'joueur.o', '-lc', '-o', 'joueur.wasm');
  } catch {
    return { reussi: false, sortie: '', diagnostics: nettoyer(capture) };
  }

  const diagnostics = nettoyer(capture);
  const programme = await WebAssembly.compile(a.memfs.getFileContents('joueur.wasm'));
  capture = '';
  try {
    await a.run(programme, 'joueur.wasm');
  } catch {
    return { reussi: false, sortie: nettoyer(capture), diagnostics };
  }
  return { reussi: true, sortie: nettoyer(capture), diagnostics };
}
