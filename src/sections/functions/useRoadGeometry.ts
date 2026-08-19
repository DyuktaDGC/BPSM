import { useEffect, useMemo, useRef, useState } from 'react';
import { buildNodes, buildPath, worldSize } from './buildPath';

export type RoadGeometry = {
  d: string;
  width: number;
  height: number;
  pathLength: number;
  nodeLengths: number[];
  pathRef: React.RefObject<SVGPathElement | null>;
};

export function useRoadGeometry(count: number): RoadGeometry {
  const nodes = useMemo(() => buildNodes(count), [count]);
  const d = useMemo(() => buildPath(nodes), [nodes]);
  const { width, height } = useMemo(() => worldSize(count), [count]);

  const pathRef = useRef<SVGPathElement>(null);
  const [measured, setMeasured] = useState<{ length: number; nodeLengths: number[] }>({
    length: 0,
    nodeLengths: nodes.map(() => 0),
  });

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    const nodeLengths = nodes.map((n) => {
      let lo = 0;
      let hi = length;
      for (let i = 0; i < 40; i++) {
        const mid = (lo + hi) / 2;
        if (path.getPointAtLength(mid).x < n.x) lo = mid;
        else hi = mid;
      }
      return (lo + hi) / 2;
    });

    setMeasured({ length, nodeLengths });
  }, [nodes, d]);

  // One stable object per measurement. Returning a fresh literal every render
  // defeated memoisation downstream — Road took it as a changed prop and
  // re-rendered the whole world on every stop change.
  return useMemo(
    () => ({
      d,
      width,
      height,
      pathLength: measured.length,
      nodeLengths: measured.nodeLengths,
      pathRef,
    }),
    [d, width, height, measured],
  );
}