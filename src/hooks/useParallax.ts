import { useEffect } from 'react';
import gsap from 'gsap';

/** Drives `[data-par]` elements with a simple scroll-scrubbed vertical
 *  drift — no blur, scale, or opacity swing. (The blur/scale "focus pull"
 *  this used to do was removed: it made text unreadable as it entered and
 *  left the viewport.)
 *
 *  The `data-par` value (e.g. "0.3") sets how far the element travels. */
export function useParallax(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const els = gsap.utils.toArray<HTMLElement>('[data-par]');
    if (els.length === 0) return;

    const ctx = gsap.context(() => {
      els.forEach((el) => {
        const speed = parseFloat(el.dataset.par ?? '0.2');
        // Halved. Drift should be felt, not watched — at 100 the copy was
        // visibly sliding against a page that is already moving.
        const distance = 52 * speed;

        const scrollTrigger = {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        };

        gsap.fromTo(el, { y: distance }, { y: -distance, ease: 'none', scrollTrigger });
      });
    });

    return () => ctx.revert();
  }, [enabled]);
}