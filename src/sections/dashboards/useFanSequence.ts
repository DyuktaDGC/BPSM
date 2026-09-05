import { useEffect, useRef, useState } from 'react';

type FanStage = 's1' | 's2' | 's3' | 's3c' | 's4';
/* These mirror the --fan-* durations in design.css. A stage must not be swapped
   out from under a transition that is still running, or the cards jump: RISE
   covers --fan-rise plus its 170ms stagger, T_CLOSE covers --fan-close plus its
   120ms stagger (and the 520ms container fold), and T_LIVE covers the s4 spread
   delay plus --fan-spread. Retune both files together. */
const DELAY = 100;
const RISE = 870;
const GAP = 60;

const T_S2 = DELAY;
const T_S3 = DELAY + RISE + GAP;
const T_CLOSE = 520;
const T_LIVE = 1200;

export function useFanSequence(
  sectionRef: React.RefObject<HTMLElement | null>,
  triggerRef: React.RefObject<HTMLElement | null>,
  reduced: boolean,
) {
  const [intro, setIntro] = useState<'s1' | 's2' | 's3'>('s1');
  const [pulled, setPulled] = useState(false); 
  const [slid, setSlid] = useState(false); 
  const [cycling, setCycling] = useState(false);
  const startedAt = useRef<number | null>(null);
  const pulledOnce = useRef(false);

  useEffect(() => {
    if (reduced) return;

    const timers: number[] = [];
    const cleanup = () => timers.forEach((t) => window.clearTimeout(t));

    const run = () => {
      if (startedAt.current === null) startedAt.current = performance.now();
      const elapsed = performance.now() - startedAt.current;
      const at = (mark: number, fn: () => void) =>
        timers.push(window.setTimeout(fn, Math.max(0, mark - elapsed)));

      at(T_S2, () => setIntro('s2'));
      at(T_S3, () => setIntro('s3'));
    };

    if (startedAt.current !== null) {
      run();
      return cleanup;
    }

    const el = sectionRef.current;

    if (!el || typeof IntersectionObserver === 'undefined') {
      run();
      return cleanup;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        run();
      },
      { threshold: 0, rootMargin: '0px 0px -20% 0px' },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cleanup();
    };
  }, [sectionRef, reduced]);

  useEffect(() => {
    if (reduced || pulledOnce.current) return;
    const el = triggerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        pulledOnce.current = true;
        io.disconnect();
        setPulled(true);
      },
      { threshold: 0, rootMargin: '0px 0px -40% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [triggerRef, reduced]);

  useEffect(() => {
    if (!pulled || slid) return;
    const t = window.setTimeout(() => setSlid(true), T_CLOSE);
    return () => window.clearTimeout(t);
  }, [pulled, slid]);

  const stage: FanStage = reduced
    ? 's4'
    : !pulled
      ? intro
      : slid
        ? 's4'
        : 's3c';

  useEffect(() => {
    if (stage !== 's4') return;
    const t = window.setTimeout(() => setCycling(true), T_LIVE);
    return () => window.clearTimeout(t);
  }, [stage]);

  return { stage, cycling: reduced || cycling };
}