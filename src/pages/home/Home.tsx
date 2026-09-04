import Nav from '../../components/Nav';
import Footer from '../../layout/Footer';
import Hero from '../../sections/hero/Hero';
import Mirror from '../../sections/mirror/Mirror';
import Solution from '../../sections/solution/Solution';
import Functions from '../../sections/functions/Functions';
import Dashboards from '../../sections/dashboards/Dashboards';
import Close from '../../sections/Close';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useMedia, COMPACT } from '../../hooks/useMedia';
import { useLenis, useHashLinks } from '../../hooks/useLenis';
import { useParallax } from '../../hooks/useParallax';

export default function Home() {
  const reduced = useReducedMotion();
  const compact = useMedia(COMPACT);

  useLenis(!reduced && !compact);
  useHashLinks();
  useParallax(!reduced && !compact);

  return (
    <>
      <Nav />
      <main>
        <Hero reduced={reduced} />
        <Mirror reduced={reduced} />
        <Solution />
        <Functions reduced={reduced} />
        <Dashboards reduced={reduced} />
        <Close />
      </main>
      <Footer />
    </>
  );
}
