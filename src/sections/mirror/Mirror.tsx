import { useCallback, useEffect, useRef, useState } from 'react';
import Section from '../../components/Section';
import Cta from '../../components/Cta';
import { COPY } from '../../content/copy';
import { SYMPTOMS } from '../../content/symptoms';
import SymptomRow from './SymptomRow';
import { useMirrorState } from './useMirrorState';
import { scrollToId, lockScroll, getLenis } from '../../hooks/useLenis';

const C = COPY.mirror;

export default function Mirror({ reduced }: { reduced: boolean }) {
  const { picked, toggle } = useMirrorState();
  const listRef = useRef<HTMLDivElement>(null);
  const seen = useRevealed(listRef, SYMPTOMS.length, reduced);
  const [passed, setPassed] = useState(false);
  const gateRef = useRef<HTMLDivElement>(null);
  // Bumped every time a scroll gesture hits the closed gate. It is a counter
  // rather than a flag so the shake replays on the second push — a class that
  // is already on does not restart its own animation.
  const [nudge, setNudge] = useState(0);
  const onBlocked = useCallback(() => setNudge((n) => n + 1), []);
  useScrollGate(gateRef, !passed, onBlocked);
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
          <div
            key={nudge}
            className={`mirror__tally${ready ? ' is-ready' : ''}${nudge ? ' is-nudge' : ''}`}
          >
            <p className="mirror__count mono" aria-live="polite">
              {ready
                ? `${picked.size} of ${SYMPTOMS.length} ticked — hit submit to carry on`
                : 'Tick at least one to carry on'}
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

/** Holds the page here once: the rows run out, the scroll freezes, and the CTA
 *  — or any nav jump, which releases the lock through scrollToId — frees it.
 *  `onBlocked` fires when a scroll gesture arrives while the gate is holding,
 *  so the section can point back at the checkboxes instead of reading as a
 *  dead page. */
function useScrollGate(
  gate: React.RefObject<HTMLElement | null>,
  active: boolean,
  onBlocked: () => void,
) {
  useEffect(() => {
    const el = gate.current;
    if (!active || !el) return;

    let held = false;

    // The last row coming into view means the section is nearly, but not
    // exactly, filling the screen — freezing right there strands the block a
    // hundred-odd pixels low. So settle onto the composed frame first and hold
    // once it lands. Disconnects on the first hold: this is a one-time stop,
    // not something that grabs the page again on every pass.
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const section = document.getElementById('mirror');
        if (!section) return;

        const hold = () => {
          held = true;
          lockScroll(true);
        };

        // Kill the wheel *before* the settle, not after. Lenis abandons a
        // scrollTo the moment the user keeps scrolling, so the section used to
        // slide half way onto its frame and then carry straight on past —
        // stopped, then scrolled again. `force` runs the animation through the
        // stop, `lock` ignores input for its duration.
        const lenis = getLenis();
        // Land on the section's own top when it fits, and otherwise only as far
        // down as it takes to put the end of the list on screen: freezing above
        // the last rows would hide the very things you have to tick to get out.
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const listEnd = el.getBoundingClientRect().bottom + window.scrollY + 24;
        const top = Math.max(sectionTop, listEnd - window.innerHeight);
        if (lenis) {
          lenis.stop();
          lenis.scrollTo(top, { duration: 1.1, force: true, lock: true, onComplete: hold });
        } else {
          window.scrollTo({ top, behavior: 'smooth' });
          window.setTimeout(hold, 700);
        }
      },
      { threshold: 1 },
    );
    io.observe(el);

    // A frozen page still delivers the gesture, which is the only signal that
    // someone is pushing against the gate and wondering why nothing moves.
    const bump = () => { if (held) onBlocked(); };
    const onKey = (e: KeyboardEvent) => {
      if (/^(Arrow(Up|Down)|Page(Up|Down)|Home|End|\s)$/.test(e.key)) bump();
    };
    window.addEventListener('wheel', bump, { passive: true });
    window.addEventListener('touchmove', bump, { passive: true });
    window.addEventListener('keydown', onKey);

    return () => {
      io.disconnect();
      lockScroll(false);
      window.removeEventListener('wheel', bump);
      window.removeEventListener('touchmove', bump);
      window.removeEventListener('keydown', onKey);
    };
  }, [gate, active, onBlocked]);
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