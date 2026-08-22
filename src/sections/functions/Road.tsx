import { memo, useEffect, useMemo, useRef } from 'react';
import { distanceAt, type RoadTimeline } from './mapScrollToDistance';
import type { RoadGeometry } from './useRoadGeometry';
import type { FrameFn } from './useRoadProgress';
import type { Fn } from '../../content/functions';
import { buildNodes, flagPoint } from './buildPath';
import Ground from './Ground';
import { PAD } from './buildGround';
import type { Stage } from './stage';

type Props = {
  functions: Fn[];
  geometry: RoadGeometry;
  timeline: RoadTimeline;
  onFrame: (fn: FrameFn) => () => void;
  camera: Stage;
};

/** Memoised: the section re-renders on every stop change, and without this
 *  that reconciled the whole world — ground, seven segments and every prop on
 *  them — seven times per pass, right at the moments the user is watching. */
function Road({ functions, geometry, timeline, onFrame, camera }: Props) {
  const { d, width, height, pathLength, nodeLengths, pathRef } = geometry;
  const nodes = useMemo(() => buildNodes(functions.length), [functions.length]);
  const finish = useMemo(() => flagPoint(nodes), [nodes]);
  const finishColor = functions[functions.length - 1].color;

  const segRefs = useRef<(SVGPathElement | null)[]>([]);
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);
  const worldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const world = worldRef.current;
    const path = pathRef.current;
    if (!world || !path || pathLength === 0) return;

    let reachedUntil = -1;
    let lastTransform = '';
    // Only the segment the walker is inside changes between frames: the ones
    // behind are fully drawn, the ones ahead are empty. Rewriting all seven
    // every frame re-rasterised seven full-length paths to redraw one.
    const lastDash = segRefs.current.map(() => -1);

    return onFrame((progress) => {
      const distance = distanceAt(timeline, progress);
      const point = path.getPointAtLength(distance);

      // Scaled about the camera point, so zooming out on a narrow window
      // shows more road without moving the spot the walker stands on.
      const s = camera.scale;
      const transform =
        `translate3d(${(camera.x - point.x * s).toFixed(2)}px, ${(camera.y - point.y * s).toFixed(2)}px, 0)`
        + (s === 1 ? '' : ` scale(${s})`);
      if (transform !== lastTransform) {
        lastTransform = transform;
        world.style.transform = transform;
      }

      segRefs.current.forEach((seg, i) => {
        if (!seg) return;
        const segStart = i === 0 ? 0 : nodeLengths[i - 1];
        const segEnd = nodeLengths[i] ?? pathLength;
        const visible = Math.min(Math.max(distance - segStart, 0), segEnd - segStart);
        if (Math.abs(visible - lastDash[i]) < 0.5) return;
        lastDash[i] = visible;
        seg.setAttribute('stroke-dasharray', `0 ${segStart} ${visible} ${pathLength}`);
      });

      const reachedIndex = nodeLengths.reduce((acc, len, i) => (distance >= len - 4 ? i : acc), -1);
      if (reachedIndex !== reachedUntil) {
        reachedUntil = reachedIndex;
        nodeRefs.current.forEach((n, i) => n?.classList.toggle('reached', i <= reachedIndex));
      }
    });
  }, [timeline, onFrame, camera, nodeLengths, pathLength, pathRef]);

  return (
    <div className="road__world" ref={worldRef} style={{ width, height }}>
      <svg
        className="road__svg"
        viewBox={`${-PAD} ${-PAD} ${width + PAD * 2} ${height + PAD * 2}`}
        width={width + PAD * 2}
        height={height + PAD * 2}
        style={{ marginLeft: -PAD, marginTop: -PAD }}
      >
        <Ground
          pathRef={pathRef}
          pathLength={pathLength}
          nodeLengths={nodeLengths}
          width={width}
          height={height}
        />

        <path ref={pathRef} className="road__base" d={d} />

        {functions.map((fn, i) => (
          <path
            key={fn.n}
            ref={(el) => { segRefs.current[i] = el; }}
            className="road__seg"
            d={d}
            stroke={fn.color}
            strokeWidth={3 + i * 0.9}
          />
        ))}

        {nodes.map((n, i) => (
          <g key={functions[i].n} ref={(el) => { nodeRefs.current[i] = el; }} className="road__node">
            <circle className="road__ring" cx={n.x} cy={n.y} r={14} stroke={functions[i].color} />
            <circle cx={n.x} cy={n.y} r={15} fill={functions[i].color} />
            <text x={n.x} y={n.y + 0.5}>{i + 1}</text>
          </g>
        ))}

        <g className="road__flag">
          <line
            x1={finish.x} y1={finish.y}
            x2={finish.x} y2={finish.y - 82}
            stroke="var(--ink)" strokeWidth="4" strokeLinecap="round"
          />
          <path
            d={`M ${finish.x + 2} ${finish.y - 80} L ${finish.x + 54} ${finish.y - 66} L ${finish.x + 2} ${finish.y - 52} Z`}
            fill={finishColor}
          />
          <circle cx={finish.x} cy={finish.y} r="6" fill="var(--ink)" />
        </g>
      </svg>

    </div>
  );
}

export default memo(Road);