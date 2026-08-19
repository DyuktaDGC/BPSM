const DEPTH = 150;
const OVERLAP = 300;
const SKY = 470;
export const PAD = 1200;
const LAYERS = [1, 0.62, 0.3];

type GroundItem = { k: string; x: number; y: number; s: number; b: number };
type GroundBand = {
  b: number;
  layers: string[];
  sky: string[];
  x0: number;
  x1: number;
  f0: number;
  f1: number;
  capL: boolean;
  capR: boolean;
};
export type GroundData = {
  bands: GroundBand[];
  items: GroundItem[];
  heroes: GroundItem[];
  air: GroundItem[];
};

type Motif = { k: string; step: number; dy: number; scatter: boolean };

const MOTIF: Motif[] = [
  { k: 'tuft', step: 30, dy: 0, scatter: true },
  { k: 'tuft', step: 74, dy: 0, scatter: true },
  { k: 'stone', step: 21, dy: 0, scatter: true },
  { k: 'dash', step: 88, dy: 16, scatter: false },
  { k: 'kerb', step: 26, dy: 12, scatter: false },
  { k: 'bar', step: 128, dy: 18, scatter: false },
  { k: 'hazard', step: 34, dy: 14, scatter: false },
];

const HERO = ['tree', 'sign', 'board', 'lamp', 'gantry', 'sock', 'tower'];
const AIR: [string, number][] = [
  ['cloud', 3],
  ['cloud', 3],
  ['cloud', 2],
  ['cloud', 2],
  ['cloud', 2],
  ['star', 18],
  ['star', 30],
];

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (v: number) => Math.round(v * 10) / 10;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function sampleGround(
  path: SVGPathElement,
  pathLength: number,
  nodeLengths: number[],
  width: number,
  height: number,
): GroundData {
  const bands: GroundBand[] = [];
  const items: GroundItem[] = [];
  const heroes: GroundItem[] = [];
  const air: GroundItem[] = [];
  const count = nodeLengths.length;

  for (let b = 0; b < count; b++) {
    const start = b === 0 ? 0 : nodeLengths[b - 1];
    const end = b === count - 1 ? pathLength : nodeLengths[b];
    if (end <= start) continue;

    const capL = b === 0;
    const capR = b === count - 1;
    const sL = Math.max(0, start - OVERLAP);
    const sR = Math.min(pathLength, end + OVERLAP);

    const top: { x: number; y: number }[] = [];
    const step = Math.max(30, (sR - sL) / 30);
    for (let s = sL; s < sR; s += step) top.push(path.getPointAtLength(s));
    top.push(path.getPointAtLength(sR));

    if (capL) top.unshift({ x: -PAD, y: top[0].y });
    if (capR) top.push({ x: width + PAD, y: top[top.length - 1].y });

    const slab = (h: number, abs = false) => {
      let d = `M ${r1(top[0].x)} ${r1(top[0].y)}`;
      for (let i = 1; i < top.length; i++) d += ` L ${r1(top[i].x)} ${r1(top[i].y)}`;
      for (let i = top.length - 1; i >= 0; i--) {
        d += ` L ${r1(top[i].x)} ${r1(abs ? h : top[i].y + h)}`;
      }
      return `${d} Z`;
    };
    const layers = [slab(height + PAD, true), slab(DEPTH * LAYERS[1]), slab(DEPTH * LAYERS[2])];
    const sky = [slab(-PAD, true), slab(-SKY), slab(-SKY * 0.42)];

    const x0 = capL ? -PAD : path.getPointAtLength(sL).x;
    const x1 = capR ? width + PAD : path.getPointAtLength(sR).x;
    const span = Math.max(1, x1 - x0);
    const xIn = path.getPointAtLength(Math.min(sR, start + OVERLAP)).x;
    const xOut = path.getPointAtLength(Math.max(sL, end - OVERLAP)).x;
    const fa = capL ? 0 : clamp01((xIn - x0) / span);
    const fb = capR ? 1 : clamp01((xOut - x0) / span);

    bands.push({
      b,
      layers,
      sky,
      x0: r1(x0),
      x1: r1(x1),
      f0: Math.round(Math.min(fa, fb) * 1000) / 1000,
      f1: Math.round(Math.max(fa, fb) * 1000) / 1000,
      capL,
      capR,
    });

    const rand = rng(b * 7919 + 13);
    const m = MOTIF[b];
    const ext = m.scatter ? OVERLAP * 0.75 : 0;
    for (let s = start - ext; s < end + ext; s += m.step) {
      if (s < 0 || s > pathLength) continue;
      if (ext > 0) {
        const edge = s < start ? (s - (start - ext)) / ext : s > end ? (end + ext - s) / ext : 1;
        if (rand() > edge) continue;
      }
      const p = path.getPointAtLength(s);
      const dy = m.scatter ? 8 + rand() * (DEPTH - 34) : m.dy;
      items.push({
        k: m.k,
        x: r1(p.x + (m.scatter ? (rand() - 0.5) * m.step * 0.8 : 0)),
        y: r1(p.y + dy),
        s: m.scatter ? Math.round((0.55 + dy / 130) * 100) / 100 : 1,
        b,
      });
    }

    const hp = path.getPointAtLength(start + (end - start) * 0.62);
    heroes.push({ k: HERO[b], x: r1(hp.x), y: r1(hp.y + 9), s: 1, b });

    const [ak, an] = AIR[b];
    for (let i = 0; i < an; i++) {
      const ap = path.getPointAtLength(start + (end - start) * ((i + 0.5) / an + (rand() - 0.5) * 0.5));
      const up = ak === 'star' ? 60 + rand() * (SKY - 110) : 150 + rand() * (SKY - 260);
      air.push({
        k: ak,
        x: r1(ap.x + (rand() - 0.5) * 400),
        y: r1(ap.y - up),
        s: Math.round((ak === 'star' ? 0.5 + rand() * 0.9 : 0.7 + rand() * 0.8) * 100) / 100,
        b,
      });
    }
  }

  return { bands, items, heroes, air };
}