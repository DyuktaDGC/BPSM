import { useEffect, useState } from 'react';
import { getLenis, navOffset } from './hooks/useLenis';

const EVENT = 'dgc:navigate';

export const normalize = (p: string) => (p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p);

export type Loc = { path: string; hash: string; n: number };

let tick = 0;

const read = (): Loc => ({
  path: normalize(window.location.pathname),
  hash: window.location.hash,
  n: tick,
});

export function navigate(to: string, replace = false) {
  const url = new URL(to, window.location.origin);
  const next = url.pathname + url.search + url.hash;

  if (replace) window.history.replaceState(null, '', next);
  else window.history.pushState(null, '', next);

  window.dispatchEvent(new Event(EVENT));
}

export function useLocation(): Loc {
  const [loc, setLoc] = useState<Loc>(read);

  useEffect(() => {
    const sync = () => {
      tick += 1;
      setLoc(read());
    };

    window.addEventListener('popstate', sync);
    window.addEventListener(EVENT, sync);

    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener(EVENT, sync);
    };
  }, []);

  return loc;
}

export function useLinkNavigation() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      const a = target?.closest?.('a');
      if (!a) return;

      const href = a.getAttribute('href');
      if (!href) return;

      if (href.startsWith('#')) {
        const el = document.getElementById(decodeURIComponent(href.slice(1)));
        if (!el) return;
        e.preventDefault();
        window.history.replaceState(null, '', href);
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(el, { duration: 1.4, offset: navOffset() });
        else el.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      if (!href.startsWith('/')) return;
      if (a.hasAttribute('download')) return;

      const t = a.getAttribute('target');
      if (t && t !== '_self') return;

      e.preventDefault();
      navigate(href);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}