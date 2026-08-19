import { useEffect } from 'react';
import { dwellWindows, type RoadTimeline } from './mapScrollToDistance';
import { getLenis } from '../../hooks/useLenis';

export function useStopJump(
  sectionRef: React.RefObject<HTMLElement | null>,
  timeline: RoadTimeline,
  currentStop: number,
  stopCount: number,
) {
  const jumpTo = (index: number) => {
    const el = sectionRef.current;
    if (!el) return;

    const windows = dwellWindows(timeline);
    const target = windows[Math.min(stopCount - 1, Math.max(0, index))];
    const mid = (target.start + target.end) / 2 - 0.012;

    const scrollable = el.offsetHeight - window.innerHeight;
    const top = el.offsetTop + mid * scrollable;

    // Native smooth scrolling and Lenis both write scrollTop every frame, so
    // firing this while Lenis is running made the page visibly fight itself.
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(top, { duration: 1.1 });
    else window.scrollTo({ top, behavior: 'smooth' });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowRight') jumpTo(Math.min(stopCount - 1, (currentStop < 0 ? -1 : currentStop) + 1));
      if (e.key === 'ArrowLeft') jumpTo(Math.max(0, (currentStop < 0 ? 1 : currentStop) - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStop, stopCount]);

  return { jumpTo };
}