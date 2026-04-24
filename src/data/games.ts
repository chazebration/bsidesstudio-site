export type Screenshot = {
  src: string;
  alt: string;
  caption?: string;
};

export type HeroImage = {
  src: string;
  alt: string;
};

export type Game = {
  slug: string;
  title: string;
  tagline: string;
  status: string;
  platform: string;
  genre: string;
  year: string;
  note: string;
  palette: [string, string, string, string];
  pattern: 'stitch' | 'rpg' | 'weather';
  stamp: string;
  heroImage?: HeroImage;
  screenshots?: Screenshot[];
};

export const GAMES: Game[] = [
  {
    slug: 'skein',
    title: 'SKEIN',
    tagline: "Making it easy to follow knitting or crochet patterns.",
    status: 'EARLY',
    platform: 'iOS',
    genre: 'Utility · Craft',
    year: 'TBD',
    note: 'row counters\nthat don\'t suck',
    palette: ['#e0483a', '#efe7d4', '#2b62c4', '#f2c14e'],
    pattern: 'stitch',
    stamp: 'IN DEV',
  },
  {
    slug: 'latchkey',
    title: 'LATCHKEY',
    tagline: 'Evil has come to the suburbs. How inconvenient.',
    status: 'EARLY',
    platform: 'iOS',
    genre: 'Idle RPG',
    year: 'TBD',
    note: 'idle rpg,\ncul-de-sac energy',
    palette: ['#2b1f3d', '#e0483a', '#f2c14e', '#7d6e9b'],
    pattern: 'rpg',
    stamp: 'IN DEV',
    heroImage: {
      src: '/images/latchkey-combat.png',
      alt: 'Sam mid-fight with a corrupted businessman in front of a craftsman house in Suburbs 1-10.',
    },
    screenshots: [
      {
        src: '/images/latchkey-sam.png',
        alt: 'Sam, the kid hero of Latchkey, in the Hero panel with a baseball bat and a few pieces of equipped gear.',
        caption: 'Sam in the Hero panel, kitted with a rake, a ball cap, and a friendship bracelet.',
      },
    ],
  },
  {
    slug: 'wether',
    title: 'WETHER',
    tagline: 'Simply find out w(h)ether the we(a)ther is good or bad.',
    status: 'EARLY',
    platform: 'iOS',
    genre: 'Weather · Utility',
    year: 'TBD',
    note: 'good or bad?\nthat\'s the app',
    palette: ['#7aa7d4', '#efe7d4', '#f2c14e', '#2b62c4'],
    pattern: 'weather',
    stamp: 'IN DEV',
  },
];

export const getGame = (slug: string) => GAMES.find((g) => g.slug === slug);
