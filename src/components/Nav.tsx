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
 *  isn't the landing page — /demos passes base="/" to get "/#dashboards". */
export default function Nav({ base = '' }: { base?: string }) {
  const [shown, setShown] = useState(false);
  const [light, setLight] = useState(false);
  const [tight, setTight] = useState(false);
  const [open, setOpen] = useState(false);

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

      const root = document.documentElement;
      if (!root.hasAttribute('data-lenis')) {
        const max = root.scrollHeight - window.innerHeight;
        root.style.setProperty('--scroll', max > 0 ? (window.scrollY / max).toFixed(4) : '0');
      }

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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const mq = window.matchMedia('(min-width: 761px)');
    const onWide = () => { if (mq.matches) setOpen(false); };
    document.body.classList.add('nav-open');
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onWide);
    return () => {
      document.body.classList.remove('nav-open');
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onWide);
    };
  }, [open]);

  return (
    <>
      <nav
        className={['nav', shown && 'in', light && 'nav--light', tight && 'nav--tight', open && 'nav--open']
          .filter(Boolean)
          .join(' ')}
      >
        <a className="nav__logo" href={`${base}#hero`} aria-label="DGC — home" onClick={() => setOpen(false)}>
          <img src={logo} alt="" width={34} height={36} />
        </a>

        <div className="nav__links mono">
          {COPY.nav.links.map((label, i) => (
            <a key={label} href={`${base}${HREFS[i]}`}>
              {label}
            </a>
          ))}
        </div>

        <div className="nav__end">
          <Cta label={COPY.nav.cta} href={`${base}${CONTACT}`} where="nav" size="sm" />

          <button
            type="button"
            className="nav__burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="nav-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div
        id="nav-menu"
        className={open ? 'navmenu open' : 'navmenu'}
        hidden={!open}
      >
        <div className="navmenu__inner">
          {COPY.nav.links.map((label, i) => (
            <a
              key={label}
              className="navmenu__link"
              style={{ transitionDelay: `${60 + i * 55}ms` }}
              href={`${base}${HREFS[i]}`}
              onClick={() => setOpen(false)}
            >
              <span className="navmenu__i mono">{`0${i + 1}`}</span>
              {label}
            </a>
          ))}

          <a
            className="navmenu__link navmenu__link--cta"
            style={{ transitionDelay: `${60 + COPY.nav.links.length * 55}ms` }}
            href={`${base}${CONTACT}`}
            onClick={() => setOpen(false)}
          >
            <span className="navmenu__i mono">{`0${COPY.nav.links.length + 1}`}</span>
            {COPY.nav.cta}
          </a>
        </div>
      </div>

      <button
        type="button"
        className={open ? 'navscrim show' : 'navscrim'}
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
    </>
  );
}
