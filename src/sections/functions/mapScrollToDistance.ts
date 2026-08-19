type Key = { u: number; len: number; ease?: boolean };

export type RoadTimeline = {
  keys: Key[];
  totalUnits: number;
  dwellRanges: { start: number; end: number }[];
};

const U_LEAD = 0.7, U_DWELL = 1.25, U_TRAVEL = 1.05, U_TAIL = 1.3;

export function buildTimeline(nodeLengths: number[], pathLength: number): RoadTimeline {
  const keys: Key[] = [{ u: 0, len: 0 }];
  const dwellRanges: { start: number; end: number }[] = [];
  let u = U_LEAD;
  keys.push({ u, len: nodeLengths[0], ease: true });

  nodeLengths.forEach((len, i) => {
    const start = u;
    u += U_DWELL;
    keys.push({ u, len });
    dwellRanges.push({ start, end: u });
    if (i < nodeLengths.length - 1) {
      u += U_TRAVEL;
      keys.push({ u, len: nodeLengths[i + 1], ease: true });
    }
  });

  u += U_TAIL;
  keys.push({ u, len: pathLength, ease: true });
  return { keys, totalUnits: u, dwellRanges };
}

const easeInOutCubic = (f: number) => (f < 0.5 ? 4 * f ** 3 : 1 - (-2 * f + 2) ** 3 / 2);

export function distanceAt(timeline: RoadTimeline, progress: number): number {
  const t = progress * timeline.totalUnits;
  for (let i = 1; i < timeline.keys.length; i++) {
    if (t <= timeline.keys[i].u) {
      const a = timeline.keys[i - 1], b = timeline.keys[i];
      const span = b.u - a.u || 1;
      let f = (t - a.u) / span;
      if (b.ease) f = easeInOutCubic(f);
      return a.len + (b.len - a.len) * f;
    }
  }
  return timeline.keys[timeline.keys.length - 1].len;
}

export function dwellWindows(timeline: RoadTimeline) {
  return timeline.dwellRanges.map((r) => ({
    start: r.start / timeline.totalUnits,
    end: r.end / timeline.totalUnits,
  }));
}