import { useEffect, useRef, useState } from 'react';
import Section from '../../components/Section';
import Cta from '../../components/Cta';
import { COPY } from '../../content/copy';
import { SYMPTOMS } from '../../content/symptoms';
import SymptomRow from './SymptomRow';
import { useMirrorState } from './useMirrorState';
import { scrollToId, lockScroll } from '../../hooks/useLenis';

const C = COPY.mirror;

export default function Mirror({ reduced }: { reduced: boolean }) {
  const { picked, toggle } = useMirrorState();
  const listRef = useRef<HTMLDivElement>(null);
  const seen = useRevealed(listRef, SYMPTOMS.length, reduced);
  const [passed, setPassed] = useState(false);
  const gateRef = useRef<HTMLDivElement>(null);
  useScrollGate(gateRef, !passed);
  // Nothing ticked means nothing to answer, so the button stays inert and the
  // gate keeps holding — the whole point of the section is the picking.
  const ready = picked.size > 0;
  const jump = () => {
    if (!ready) return;
    setPassed(true);
    lockScroll(false);
    scrollToId('solution');
  };

  return (
    <Section id="mirror" className="mirror">
      <div className="mirror__grid">
        {/* Left: the ask, held in place while the rows scroll past it. The
            data-par drift these three carried is gone — a sticky parent stops
            moving, so the scrub froze mid-travel and left the copy sitting a
            dozen pixels off its own layout box. */}
        <div className="mirror__aside">
          <div className="mirror__intro">
            <p className="mono soft">{C.kicker}</p>
            <h2 className="mirror__head">{C.head}</h2>
            <p className="mirror__sub soft">{C.sub}</p>
          </div>

          {/* The tally lives with the question, not stranded under the last
              row — it fills the column the sticky intro used to leave empty
              and keeps the count in view while the rows are being read. */}
          <div className={ready ? 'mirror__tally is-ready' : 'mirror__tally'}>
            <p className="mirror__count mono" aria-live="polite">
              {ready ? `${picked.size} of ${SYMPTOMS.length} ticked` : 'Tick at least one to carry on'}
            </p>
            <Cta label={C.cta} where="mirror" arrow="↓" tone="ink" onClick={jump} disabled={!ready} />
          </div>
        </div>

        {/* Right: the rows. On one column the aside splits so the tally
            drops below them and reading order still works. */}
        <div className="mirror__col">
          <div className="mirror__list" ref={listRef}>
            {SYMPTOMS.map((s, i) => (
              <div key={s.text} data-reveal={i} className={seen.has(i) ? 'reveal in' : 'reveal'}>
                <SymptomRow symptom={s} index={i} on={picked.has(i)} onToggle={toggle} />
              </div>
            ))}
            {/* End-of-list sentinel: the gate arms once the rows run out. */}
            <div className="mirror__gate" ref={gateRef} aria-hidden="true" />
          </div>
        </div>
      </div>
    </Section>
  );
}

/** Holds the page here until the CTA is used: the tally comes into view, the
 *  scroll freezes, and only the button releases it. */
function useScrollGate(gate: React.RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const el = gate.current;
    if (!active || !el) return;

    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) lockScroll(true); },
      { threshold: 1 },
    );
    io.observe(el);
    return () => { io.disconnect(); lockScroll(false); };
  }, [gate, active]);
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