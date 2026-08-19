import Section from '../../components/Section';
import MaskedLines from '../../components/MaskedLines';
import { COPY } from '../../content/copy';
import { useHeroSequence } from './useHeroSequence';

const C = COPY.hero;

export default function Hero({ reduced }: { reduced: boolean }) {
  const { stage } = useHeroSequence(reduced);
  const shown = stage !== 'idle';

  return (
    <Section id="hero" full className={`hero hero--${stage}`}>
      <p className="hero__kicker mono soft" data-par="0.4" data-par-plain>
        <span className={shown ? 'mask in' : 'mask'}>
          <span>{C.kicker}</span>
        </span>
      </p>

      <div className="hero__slab" aria-hidden="true" />

      <div data-par="0.22" data-par-plain>
        <MaskedLines as="h1" className="hero__ask" lines={C.ask} play={shown} />
      </div>
    </Section>
  );
}