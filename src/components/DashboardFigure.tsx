import type { Figure } from '../content/dashboards';

/** The little chart glyph on a dashboard card. Shared by the landing-page
 *  carousel and the resting thumbnail on the demos page, so both read as the
 *  same object. Strokes are white — the caller supplies the coloured ground. */
export default function DashboardFigure({ kind }: { kind: Figure }) {
  if (kind === 'bars') {
    const heights = [38, 55, 44, 72, 60, 88, 70];
    return (
      <div className="dcard__fig dcard__fig--bars">
        {heights.map((h, i) => (
          <span key={i} className={i === 5 ? 'hot' : ''} style={{ height: `${h}%` }} />
        ))}
      </div>
    );
  }

  if (kind === 'line') {
    return (
      <div className="dcard__fig">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none">
          <path d="M0 32 L16 26 L32 30 L48 17 L64 21 L80 9 L100 12" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
          <path d="M0 32 L16 26 L32 30 L48 17 L64 21 L80 9 L100 12 L100 40 L0 40 Z" fill="#fff" opacity="0.16" />
        </svg>
      </div>
    );
  }

  if (kind === 'split') {
    return (
      <div className="dcard__fig">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none">
          <rect y="6" width="88" height="9" rx="2" fill="#fff" opacity="0.9" />
          <rect y="19" width="61" height="9" rx="2" fill="#fff" opacity="0.45" />
          <rect y="32" width="24" height="9" rx="2" fill="#fff" opacity="0.28" />
        </svg>
      </div>
    );
  }

  if (kind === 'rows') {
    const rows = [
      { w: 74, o: 0.9 },
      { w: 52, o: 0.5 },
      { w: 63, o: 0.62 },
      { w: 38, o: 0.35 },
    ];
    return (
      <div className="dcard__fig">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none">
          {rows.map((r, i) => (
            <g key={i}>
              <circle cx="6" cy={5 + i * 10} r="3.2" fill="#fff" opacity="0.85" />
              <rect x="14" y={2 + i * 10} width={r.w} height="6" rx="3" fill="#fff" opacity={r.o} />
            </g>
          ))}
        </svg>
      </div>
    );
  }

  return (
    <div className="dcard__fig">
      <svg viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="13" fill="none" stroke="#fff" strokeWidth="7" opacity="0.28" />
        <circle
          cx="20" cy="20" r="13" fill="none" stroke="#fff" strokeWidth="7"
          strokeDasharray="51 81" strokeLinecap="round" transform="rotate(-90 20 20)"
        />
      </svg>
    </div>
  );
}
