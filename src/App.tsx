import { useEffect } from 'react';
import Home from './pages/home/Home';
import Demos from './pages/demos/Demos';
import { useLocation, useLinkNavigation } from './router';
import { getLenis } from './hooks/useLenis';

export default function App() {
  const { path, hash, n } = useLocation();

  useLinkNavigation();

  useEffect(() => {
    let inner = 0;

    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        const id = hash ? decodeURIComponent(hash.slice(1)) : '';
        const el = id ? document.getElementById(id) : null;
        const lenis = getLenis();

        if (el) {
          if (lenis) lenis.scrollTo(el, { immediate: true });
          else el.scrollIntoView();
          return;
        }

        if (lenis) lenis.scrollTo(0, { immediate: true });
        else window.scrollTo(0, 0);
      });
    });

    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [path, hash, n]);

  return path === '/demos' ? <Demos /> : <Home />;
}