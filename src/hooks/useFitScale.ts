import { useEffect, useRef } from 'react';

/**
 * Writes `--shot` on the returned element: the ratio that scales a
 * `designWidth`-wide render down to whatever the element actually ended up
 * being. CSS can't express that against a fluid grid, so it's measured.
 */
export function useFitScale(designWidth: number) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Measured once up front — a ResizeObserver only delivers on a rendering
    // frame, which a backgrounded tab never gets — then kept in step on resize.
    const fit = () => el.style.setProperty('--shot', String(el.clientWidth / designWidth));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [designWidth]);

  return ref;
}
