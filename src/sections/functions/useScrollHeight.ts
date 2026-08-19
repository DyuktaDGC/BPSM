import { useEffect } from 'react';
import type { RoadTimeline } from './mapScrollToDistance';

export function useScrollHeight(
  sectionRef: React.RefObject<HTMLElement | null>,
  timeline: RoadTimeline,
) {
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || timeline.totalUnits === 0) return;

    const apply = () => {
      const vh = window.innerHeight;
      el.style.height = `${vh + timeline.totalUnits * vh * 0.66}px`;
    };

    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, [sectionRef, timeline]);
}