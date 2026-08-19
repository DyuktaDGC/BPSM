import { useEffect, useRef, useState } from 'react';
import Section from '../../components/Section';
import Cta from '../../components/Cta';
import { COPY } from '../../content/copy';
import { SYMPTOMS } from '../../content/symptoms';
import SymptomRow from './SymptomRow';
import { useMirrorState } from './useMirrorState';
import { scrollToId } from '../../hooks/useLenis';

const C = COPY.mirror;

export default function Mirror({ reduced }: { reduced: boolean }) {
  const { picked, toggle } = useMirrorState();
  const listRef = useRef<HTMLDivElement>(null);
  const seen = useRevealed(listRef, SYMPTOMS.length, reduced);
  const jump = () => scrollToId('solution');

  return (
    <Section id="mirror" className="mirror">
      <div className="mirror__grid">
        {/* Left: the ask, held in place while the rows scroll past it. The
            data-par drift these three carried is gone — a sticky parent stops
            moving, so the scrub froze mid-travel and left the copy sitting a
            dozen pixels off its own layout box. */}
        <div className="mirror__intro">
          <p className="mono soft">{C.kicker}</p>
          <h2 className="mirror__head">{C.head}</h2>
          <p className="mirror__sub soft">{C.sub}</p>
        </div>

        {/* Right: the rows, with the CTA under them so reading order still
            works once this collapses to a single column. */}
        <div className="mirror__col">
          <div className="mirror__list" ref={listRef}>
            {SYMPTOMS.map((s, i) => (
              <div key={s.text} data-reveal={i} className={seen.has(i) ? 'reveal in' : 'reveal'}>
                <SymptomRow symptom={s} index={i} on={picked.has(i)} onToggle={toggle} />
              </div>
            ))}
          </div>

          <div className="mirror__tally">
            <Cta label={C.cta} where="mirror" arrow="↓" tone="ink" onClick={jump} />
          </div>
        </div>
      </div>
    </Section>
  );
}

function useRevealed(
  scope: React.RefObject<HTMLElement | null>,
  total: number,
  reduced: boolean,
) {
  const [seen, setSeen] = useState<ReadonlySet<number>>(() =>
    reduced ? new Set(Array.from({ length: total }, (_, i) => i)) : new Set(),
  );

  useEffect(() => {
    const root = scope.current;
    if (reduced || !root) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hits = entries
          .filter((e) => e.isIntersecting)
          .map((e) => Number((e.target as HTMLElement).dataset.reveal));
        if (!hits.length) return;
        entries.forEach((e) => { if (e.isIntersecting) io.unobserve(e.target); });
        setSeen((prev) => new Set([...prev, ...hits]));
      },
      { threshold: 0.5 },
    );

    root.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [scope, reduced]);

  return seen;
}