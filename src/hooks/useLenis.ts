import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let current: Lenis | null = null;

/** The running instance, for code that needs to drive the scroll itself.
 *  Native `window.scrollTo({ behavior: 'smooth' })` and Lenis both write
 *  scrollTop every frame, so running them together makes the page fight
 *  itself. Null when smooth scrolling is off, so callers fall back to native. */
export const getLenis = () => current;

/** Exponential ease-out. It covers most of the distance in the first third of
 *  the animation and then settles, which is what reads as "weight" — a linear
 *  or sine ramp feels like the page is dragging behind the wheel instead. */
const EASE = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Anchor jumps land under the fixed bar, not behind it. Measured rather than
 *  hard-coded — the bar's height moves with the gutter clamp. */
export const navOffset = () => -(document.querySelector('.nav')?.getBoundingClientRect().height ?? 0);

/** Scrolls to an element by id through Lenis when it's running, and falls back
 *  to the native smooth scroll when it isn't (reduced motion, or /demos.html). */
export function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  // A section about one screen tall centres its own content well clear of the
  // bar, so the nav offset there only drops the whole frame a bar's height low
  // and the landing reads as "stopped halfway". Long scroll stages (#functions,
  // #dashboards) start their content at the very top and still need it, and so
  // does anything short enough to sit entirely behind the bar.
  const h = target.offsetHeight;
  const oneScreen = h >= window.innerHeight * 0.8 && h <= window.innerHeight * 1.15;
  const offset = oneScreen ? 0 : navOffset();
  if (current) current.scrollTo(target, { offset, duration: 1.4 });
  else target.scrollIntoView({ behavior: 'smooth' });
}

export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: EASE,
      smoothWheel: true,
      // Slightly under 1 so a single wheel notch travels a touch less than the
      // OS default — the easing then has room to show, rather than snapping.
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });
    const raf = (time: number) => lenis.raf(time * 1000);

    current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // CSS `scroll-behavior: smooth` animates the same scrollTop Lenis is
    // writing, so it has to be off for as long as Lenis owns the scroll.
    const root = document.documentElement;
    root.classList.add('lenis-on');

    // Read progress off the instance rather than window.scrollY: it is already
    // computed each frame, and it stays correct while a scrollTo is animating.
    const onLenisScroll = () => {
      // progress is NaN until the document has a measurable scroll range, and
      // a NaN in the custom property invalidates the whole transform.
      const p = lenis.progress;
      root.style.setProperty('--scroll', Number.isFinite(p) ? p.toFixed(4) : '0');
    };
    lenis.on('scroll', onLenisScroll);
    onLenisScroll();

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      current = null;
      root.classList.remove('lenis-on');
      root.style.removeProperty('--scroll');
    };
  }, [enabled]);
}

/** Freezes the page scroll. Lenis owns the wheel when it is running, so its
 *  own stop() is the only thing that holds; without it we fall back to the
 *  document overflow. */
export function lockScroll(on: boolean) {
  if (current) on ? current.stop() : current.start();
  document.documentElement.style.overflow = on && !current ? 'hidden' : '';
}
