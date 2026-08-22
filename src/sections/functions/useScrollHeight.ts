import { useEffect } from 'react';
import type { RoadTimeline } from './mapScrollToDistance';
import { pinHeightOf } from './stage';

export function useScrollHeight(
  sectionRef: React.RefObject<HTMLElement | null>,
  pinRef: React.RefObject<HTMLElement | null>,
  timeline: RoadTimeline,
  unit: number,
) {
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || timeline.totalUnits === 0) return;

    const apply = () => {
      // The pinned box, not the window: it is sized in svh, and on a phone
      // that is shorter than innerHeight for as long as the URL bar is up.
      const pin = pinHeightOf(pinRef.current);
      el.style.height = `${pin + timeline.totalUnits * pin * unit}px`;
    };

    apply();
    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);
    return () => {
      window.removeEventListener('resize', apply);
      window.removeEventListener('orientationchange', apply);
    };
  }, [sectionRef, pinRef, timeline, unit]);
}
