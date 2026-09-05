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
export function scrollToId(id: string, onArrive?: () => void) {
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
  // Every caller here is a deliberate "take me there" — a CTA or a nav link —
  // so it releases the mirror's scroll gate on the way. Lenis ignores scrollTo
  // while stopped, which would otherwise make the nav look dead behind a lock.
  lockScroll(false);
  if (current) {
    // Resolve the element to a document position here rather than handing the
    // element to Lenis: Lenis measures an element target against its own
    // animatedScroll, which lags actualScroll while the page is still settling
    // from the last gesture. Click a jump mid-glide and it landed short by
    // exactly that lag — the band of the previous section left on screen.
    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    // Re-measure on arrival and take up whatever the glide drifted by. A 1.4s
    // animation is long enough for the page under it to move — a section above
    // finishing its own reveal, a scroll stage applying its measured height —
    // and the jump has no way to know. This makes the landing exact by
    // definition instead of exact only if nothing moved. Under a pixel is
    // rounding, not drift, and re-scrolling for it would read as a twitch.
    const settle = () => {
      const exact = target.getBoundingClientRect().top + window.scrollY + offset;
      if (Math.abs(exact - window.scrollY) > 1) current?.scrollTo(exact, { immediate: true });
      onArrive?.();
    };
    current.scrollTo(top, { duration: 1.4, onComplete: settle });
  } else {
    // The native path has no completion callback, so the wait is the CSS smooth
    // scroll's own duration with a little slack.
    target.scrollIntoView({ behavior: 'smooth' });
    if (onArrive) window.setTimeout(onArrive, 700);
  }
}

/** Same-page hash links — the nav, the logo, the menu, CONTACT US — go through
 *  scrollToId instead of the browser's own fragment jump. Lenis writes scrollTop
 *  every frame off its own animated position, so a native jump gets overwritten
 *  by the next frame and the link reads as dead. Delegated from the document so
 *  every anchor on the page is covered without a handler each. */
export function useHashLinks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank') return;

      const url = new URL(a.href, location.href);
      // Cross-page links keep their normal navigation — /demos links back here
      // with "/#dashboards" and has to actually load the page first.
      if (url.pathname !== location.pathname || !url.hash) return;
      const id = decodeURIComponent(url.hash.slice(1));
      if (!document.getElementById(id)) return;

      e.preventDefault();
      history.pushState(null, '', url.hash);
      scrollToId(id);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
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
    // writing, so it has to be off for as long as Lenis owns the scroll. This
    // is an attribute rather than a class because Lenis assigns className
    // wholesale for its own state classes and would wipe a class off the root.
    const root = document.documentElement;
    root.dataset.lenis = 'on';

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
      delete root.dataset.lenis;
      root.style.removeProperty('--scroll');
    };
  }, [enabled]);
}

/** Freezes the page scroll. Lenis' stop() only owns the wheel — touch,
 *  keyboard (space, PageDown, arrows), scrollbar drag and find-in-page all
 *  still moved the page, which is why the gate leaked. Overflow is what
 *  actually holds, so it goes on whether or not Lenis is running, and on both
 *  elements because iOS ignores it on <html> alone. */
export function lockScroll(on: boolean) {
  if (current) on ? current.stop() : current.start();
  document.documentElement.style.overflow = on ? 'hidden' : '';
  document.body.style.overflow = on ? 'hidden' : '';
  document.body.style.touchAction = on ? 'none' : '';
}
