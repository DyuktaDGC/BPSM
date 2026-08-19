type Point = { x: number; y: number };

export const GAP = 1180;
const START_X = 620;
const TAIL = 1150;
const BASE_Y = 1120;
export const RISE = 108;

export function buildNodes(count: number): Point[] {
  return Array.from({ length: count }, (_, i) => ({
    x: START_X + i * GAP,
    y: BASE_Y - i * RISE + (i % 2 ? -26 : 26),
  }));
}

export function buildPath(nodes: Point[]): string {
  const pts: Point[] = [
    { x: 60, y: BASE_Y + 70 },
    ...nodes,
    { x: nodes[nodes.length - 1].x + TAIL * 0.55, y: nodes[nodes.length - 1].y - 60 },
    { x: nodes[nodes.length - 1].x + TAIL, y: nodes[nodes.length - 1].y - 78 },
  ];

  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function worldSize(nodeCount: number) {
  return {
    width: START_X + GAP * (nodeCount - 1) + TAIL + 400,
    height: 1500,
  };
}

export function flagPoint(nodes: Point[]): Point {
  const last = nodes[nodes.length - 1];
  return { x: last.x + TAIL * 0.93, y: last.y - 75 };
}