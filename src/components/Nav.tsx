import { useEffect, useState } from 'react';
import { COPY } from '../content/copy';
import Cta from './Cta';
import logo from '../../assets/logo.svg';

const CONTACT = '#close';
const DELAY = 420;

const HREFS = ['#hero', '#functions', '#dashboards'];

/** Scroll past the first screen and the bar condenses. */
const TIGHTEN_AT = 80;

/** The bar is fixed and opaque, so it has to know what it is sitting on top of
 *  — a black slab over the light Framework section reads as a bug. Each block
 *  declares its own tone once here; whichever one is under the bar wins. */
const TONES: ReadonlyArray<[selector: string, light: boolean]> = [
  ['#hero', false],
  ['#mirror', false],
  ['#solution', false],
  ['#functions', true],
  ['#dashboards', false],
  ['#close', false],
  ['.footer', true],
];

/** Prefixed onto the section anchors so the nav also works from a page that
 *  isn't the landing page — /demos.html passes base="/" to get "/#dashboards". */
export default function Nav({ base = '' }: { base?: string }) {
  const [shown, setShown] = useState(false);
  const [light, setLight] = useState(false);
  const [tight, setTight] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setShown(true), DELAY);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const nav = document.querySelector<HTMLElement>('.nav');
    if (!nav) return;

    let raf = 0;

    // Sampled against a line through the middle of the bar rather than an
    // observer per section: the sections overlap while one is pinned, and a
    // single probe point has no ambiguity about which is actually behind it.
    const read = () => {
      raf = 0;
      const probe = nav.getBoundingClientRect().height / 2;
      setTight(window.scrollY > TIGHTEN_AT);

      let next = false;
      for (const [selector, isLight] of TONES) {
        const el = document.querySelector(selector);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) next = isLight;
      }
      setLight(next);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <nav
      className={['nav', shown && 'in', light && 'nav--light', tight && 'nav--tight']
        .filter(Boolean)
        .join(' ')}
    >
      <a className="nav__logo" href={`${base}#hero`} aria-label="DGC — home">
        <img src={logo} alt="" width={34} height={36} />
      </a>

      <div className="nav__links mono">
        {COPY.nav.links.map((label, i) => (
          <a key={label} href={`${base}${HREFS[i]}`}>
            {label}
          </a>
        ))}
      </div>

      <Cta label={COPY.nav.cta} href={`${base}${CONTACT}`} where="nav" size="sm" />
    </nav>
  );
}
