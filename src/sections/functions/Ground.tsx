import { memo, useEffect, useState } from 'react';
import { sampleGround, type GroundData } from './buildGround';

type Props = {
  pathRef: React.RefObject<SVGPathElement | null>;
  pathLength: number;
  nodeLengths: number[];
  width: number;
  height: number;
};

function motif(k: string, i: number) {
  switch (k) {
    case 'tuft':
      return <path className="g-tuft" d="M -5 0 Q -3 -9 -1 0 Q 0 -14 2 0 Q 4 -8 6 0 Z" />;
    case 'stone':
      return <ellipse className="g-stone" rx="2.4" ry="1.5" />;
    case 'dash':
      return <rect className="g-dash" x="-17" y="-1.6" width="34" height="3.2" rx="1.6" />;
    case 'kerb':
      return <rect className={i % 2 ? 'g-kerb-b' : 'g-kerb-a'} x="-9" y="-2.6" width="18" height="5.2" />;
    case 'bar':
      return <rect className="g-dash" x="-24" y="-2.2" width="48" height="4.4" rx="1" />;
    case 'cloud':
      return (
        <path
          className="g-cloud"
          d="M -30 6 Q -34 -6 -22 -8 Q -18 -20 -4 -18 Q 6 -26 16 -14 Q 32 -14 32 0 Q 34 6 24 6 Z"
        />
      );
    case 'star':
      return <circle className="g-star" r="1.8" />;
    case 'hazard':
      return <path className="g-haz" d="M -11 7 L -3 -7 L 11 -7 L 3 7 Z" />;
    default:
      return null;
  }
}

function hero(k: string) {
  switch (k) {
    case 'tree':
      return (
        <>
          <rect x="-3.5" y="-42" width="7" height="42" />
          <circle cx="-15" cy="-44" r="14" />
          <circle cx="16" cy="-46" r="13" />
          <circle cx="0" cy="-56" r="21" />
        </>
      );
    case 'sign':
      return (
        <>
          <rect x="-2.5" y="-58" width="5" height="58" />
          <rect className="g-acc" x="-2.5" y="-58" width="44" height="15" rx="2" />
        </>
      );
    case 'board':
      return (
        <>
          <rect x="-26" y="-16" width="5" height="16" />
          <rect x="21" y="-16" width="5" height="16" />
          <rect className="g-frame" x="-31" y="-60" width="62" height="46" rx="2" />
        </>
      );
    case 'lamp':
      return (
        <>
          <rect x="-2.5" y="-74" width="5" height="74" />
          <path className="g-frame" d="M 0 -74 Q 0 -86 17 -86" />
          <ellipse className="g-acc" cx="19" cy="-84" rx="7.5" ry="4" />
        </>
      );
    case 'gantry':
      return (
        <>
          <rect x="-48" y="-74" width="7" height="74" />
          <rect x="41" y="-74" width="7" height="74" />
          <rect x="-48" y="-82" width="96" height="13" rx="2" />
          <rect className="g-frame" x="-20" y="-66" width="40" height="12" rx="2" />
        </>
      );
    case 'sock':
      return (
        <>
          <rect x="-2.5" y="-66" width="5" height="66" />
          <path className="g-acc" d="M 2 -64 L 32 -57 L 32 -44 L 2 -47 Z" />
        </>
      );
    case 'tower':
      return (
        <>
          <rect x="-34" y="-112" width="8" height="112" />
          <rect x="-2" y="-112" width="8" height="112" />
          <rect x="-34" y="-118" width="40" height="8" />
          <rect x="-34" y="-74" width="40" height="6" />
          <rect x="-34" y="-38" width="40" height="6" />
          <rect className="g-acc" x="6" y="-96" width="26" height="6" />
        </>
      );
    default:
      return null;
  }
}

/** Memoised: this is the heaviest subtree on the page by an order of
 *  magnitude, and none of its props change once the path has been measured. */
function Ground({ pathRef, pathLength, nodeLengths, width, height }: Props) {
  const [data, setData] = useState<GroundData | null>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path || !pathLength || !nodeLengths.length) return;
    setData(sampleGround(path, pathLength, nodeLengths, width, height));
  }, [pathRef, pathLength, nodeLengths, width, height]);

  if (!data) return null;

  return (
    <g className="ground" aria-hidden="true">
      <defs>
        {data.bands.flatMap((b) =>
          (['band', 'sky'] as const).map((kind) => (
            <linearGradient
              key={`${kind}${b.b}`}
              id={`g-${kind}-${b.b}`}
              className={`g-${kind}--${b.b}`}
              gradientUnits="userSpaceOnUse"
              x1={b.x0}
              y1="0"
              x2={b.x1}
              y2="0"
            >
              <stop offset="0" stopColor="currentColor" stopOpacity={b.capL ? 1 : 0} />
              <stop offset={b.f0} stopColor="currentColor" stopOpacity="1" />
              <stop offset={b.f1} stopColor="currentColor" stopOpacity="1" />
              <stop offset="1" stopColor="currentColor" stopOpacity={b.capR ? 1 : 0} />
            </linearGradient>
          )),
        )}
      </defs>

      {data.bands.map((b) => (
        <g key={b.b} className={`g-sky g-sky--${b.b}`} fill={`url(#g-sky-${b.b})`}>
          {b.sky.map((d, i) => (
            <path key={i} className={`g-s${i}`} d={d} />
          ))}
        </g>
      ))}

      {data.air.map((a, i) => (
        <g
          key={`a${a.b}-${i}`}
          className={`g-air g-air--${a.b}`}
          transform={`translate(${a.x} ${a.y}) scale(${a.s})`}
        >
          {motif(a.k, i)}
        </g>
      ))}

      {data.bands.map((b) => (
        <g key={b.b} className={`g-band g-band--${b.b}`} fill={`url(#g-band-${b.b})`}>
          {b.layers.map((d, i) => (
            <path key={i} className={`g-l${i}`} d={d} />
          ))}
        </g>
      ))}

      {data.heroes.map((h) => (
        <g key={`h${h.b}`} className={`g-hero g-hero--${h.b}`} transform={`translate(${h.x} ${h.y})`}>
          {hero(h.k)}
        </g>
      ))}
      {data.items.map((it, i) => (
        <g
          key={`${it.b}-${i}`}
          className={`g-item g-item--${it.b}`}
          transform={`translate(${it.x} ${it.y}) scale(${it.s})`}
        >
          {motif(it.k, i)}
        </g>
      ))}
    </g>
  );
}

export default memo(Ground);