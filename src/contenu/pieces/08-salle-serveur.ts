import type { Piece } from '../types';

export const salleServeur: Piece = {
  id: 'salle-serveur',
  numero: 8,
  nom: 'La Salle Serveur',
  notion: 'Unix — fichiers, droits, git',
  minutes: 20,
  fond: '/pieces/37-fond.webp',
  arrivee: `Il fait dix degrés de moins ici. Deux baies de machines beiges, des dizaines
de diodes vertes et ambres, un climatiseur mobile dont le tuyau sort par une fenêtre
condamnée.

Sur une tablette coulissante, un terminal à tube. Le curseur bat.

Dans le chemin de câbles, au-dessus, un câble rouge a été sectionné net.`,
  objets: [
    {
      id: 'cables',
      nom: 'Le câble sectionné',
      zone: { x: 30, y: 8, l: 40, h: 14 },
      examen: `Coupé à la pince, proprement, et pas récemment : le cuivre est déjà oxydé.
C'est le seul câble rouge du faisceau. Quelqu'un a voulu couper la maison de l'extérieur
— ou l'extérieur de la maison.`,
      zoom: '/pieces/08-salle-serveur/zoom-cables.webp',
    },
    {
      id: 'bandes',
      nom: 'Les bandes de sauvegarde',
      zone: { x: 8, y: 50, l: 16, h: 16 },
      examen: `Trois bobines à bande magnétique, empilées. Les étiquettes sont vierges.
Sans lecteur, elles ne me diront rien — mais quelque part sur ces machines, il doit bien
rester une sauvegarde en ligne.`,
    },
    {
      id: 'brassage',
      nom: 'Le panneau de brassage',
      zone: { x: 74, y: 26, l: 18, h: 22 },
      examen: `Un enchevêtrement de jarretières bleues, rouges et jaunes. Trois ports
sont libres. Rien n'est repéré, évidemment.`,
    },
    {
      id: 'terminal',
      nom: 'Le terminal',
      zone: { x: 36, y: 48, l: 26, h: 26 },
      examen: `Une session est ouverte. Le système répond.`,
      terminal: {
        id: 'serveur-unix',
        accueil: `Villa Nul — machine de service
Session ouverte au nom de severin.
Tape « help » si tu ne sais plus.`,
        fichiers: {
          '/': null,
          '/home': null,
          '/home/severin': null,
          '/home/severin/.bash_history': [
            'cd /var/sauvegardes',
            'ls -a',
            'chmod 000 .dernier',
            'cd ~/notes',
            'git log',
          ].join('\n'),
          '/home/severin/notes': null,
          '/home/severin/notes/journal.txt': `Je ne fais plus confiance à ma mémoire.
Tout ce qui compte est dans la dernière sauvegarde.
Je l'ai fermée à clé — pas par une clé, par des droits.`,
          '/var': null,
          '/var/sauvegardes': null,
          '/var/sauvegardes/2026-01.tar': '(archive vide)',
          '/var/sauvegardes/2026-06.tar': '(archive vide)',
          '/var/sauvegardes/.dernier': `derniere sauvegarde avant fermeture de la maison

porte du testament : 2142

ne la note nulle part ailleurs.`,
          '/etc/motd': `Cette machine tient la maison. Ne l'arrête pas.`,
          '/etc': null,
        },
        interdits: ['/var/sauvegardes/.dernier'],
        journalGit: [
          { empreinte: 'a41f0c2', message: 'fermer la derniere sauvegarde aux curieux' },
          { empreinte: '9de3b71', message: 'noter le code de la porte du bas' },
          { empreinte: '17c4e88', message: 'deplacer les sauvegardes dans /var' },
          { empreinte: '004a2f1', message: 'premier jet' },
        ],
      },
    },
  ],
  verrou: {
    type: 'code',
    longueur: 4,
    empreinte: 'a98d88fd6440b3ee627da2431cfba73d6c42d59c6f8bf9c855dafc4b6df69e14',
    intitule: 'Le clavier de la porte du bas',
  },
  sortie: `Le pêne recule. L'escalier descend plus bas que la cave — plus bas que ce que
montrait le plan, en fait. Sauf sur le croquis de l'atelier.`,
  indices: [
    `Le terminal marche vraiment. Commence par regarder où tu es, puis ce qu'il y a
autour : \`pwd\`, puis \`ls\`, puis \`ls -a\` — les fichiers qui commencent par un point
ne se montrent pas sans qu'on le demande.`,
    `L'historique des commandes raconte ce que Séverin a fait juste avant de partir.
\`cat ~/.bash_history\`. Et \`git log\` dans ses notes dit pourquoi.`,
    `Le fichier est dans /var/sauvegardes, il commence par un point, et il est fermé aux
droits. \`chmod +r /var/sauvegardes/.dernier\` puis \`cat\` dessus.`,
  ],
};
