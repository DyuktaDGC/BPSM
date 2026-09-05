import { useEffect, useRef, useState } from 'react';
import Section from '../../components/Section';
import Cta from '../../components/Cta';
import MaskedLines from '../../components/MaskedLines';
import { COPY } from '../../content/copy';
import { scrollToId } from '../../hooks/useLenis';

const C = COPY.solution;

export default function Solution() {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  const jump = () => scrollToId('functions');

  // One observer for the whole beat, so the three parts land in a fixed order
  // rather than each racing its own trigger. Disconnects on first hit — this
  // is an entrance, not something to replay every time the section passes.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setSeen(true);
        io.disconnect();
      },
      // Fires half a screen early, not at 35% visible. The entrance is a 900ms
      // slide and this section is what SUBMIT jumps to: triggered on arrival it
      // finished after the 1.4s glide had stopped, so the whole block slid up
      // under a page that had already come to rest. Starting it as the jump
      // sets off means it has landed by the time you have.
      { threshold: 0, rootMargin: '50% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Section id="solution" full className={seen ? 'solution rise' : 'solution'} ref={ref}>
      <MaskedLines as="h2" className="solution__head" lines={C.head} play={seen} stagger={90} />

      <p
        className={seen ? 'solution__body soft reveal in' : 'solution__body soft reveal'}
        style={{ transitionDelay: '260ms' }}
      >
        {C.body.lead}
        <strong>{C.body.strong[0]}</strong>{' '}
        <strong>{C.body.strong[1]}</strong>
        {C.body.tail}
      </p>

      <div
        className={seen ? 'reveal in' : 'reveal'}
        style={{ transitionDelay: '380ms' }}
      >
        <Cta label={C.cta} where="solution" arrow="↓" tone="ink" onClick={jump} />
      </div>
    </Section>
  );
}