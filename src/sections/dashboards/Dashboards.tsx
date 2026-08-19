import { useRef } from 'react';
import type { CSSProperties } from 'react';
import Section from '../../components/Section';
import Cta from '../../components/Cta';
import { COPY } from '../../content/copy';
import { DASHBOARDS } from '../../content/dashboards';
import { useFanSequence } from './useFanSequence';
import { useCarouselOrder } from './useCarouselOrder';
import DashboardCard from './DashboardCard';

const C = COPY.dashboards;

const DEMOS_HREF = '/demos';

export default function Dashboards({ reduced }: { reduced: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const { stage, cycling } = useFanSequence(sectionRef, triggerRef, reduced);
  const { front, slotOf, cycle, goTo } = useCarouselOrder(DASHBOARDS.length);

  const live = stage === 's4';

  return (
    <Section
      ref={sectionRef}
      id="dashboards"
      full
      className={`dashboards dashboards--${stage}${cycling ? ' cycling' : ''}`}
    >
      <div className="dashboards__sticky">
        <p className="dashboards__eyebrow">
          <span className="mono soft">{C.eyebrow}</span>
        </p>

        <div className="dashboards__panel">
          <p className="dashboards__kicker mono soft">{C.frame2.kicker}</p>

          <h2 className="dashboards__head2">
            {C.frame2.head.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>

          <div
            className="dashboards__swap"
            key={front}
            style={{ '--accent': DASHBOARDS[front].color } as CSSProperties}
          >
            <p className="dashboards__title">{DASHBOARDS[front].name}</p>
            <p className="dashboards__blurb soft">{DASHBOARDS[front].blurb}</p>
          </div>

          <div className="dashboards__controls">
            <div className="dashboards__dots" role="tablist" aria-label="Choose a dashboard">
              {DASHBOARDS.map((d, i) => (
                <button
                  key={d.name}
                  type="button"
                  role="tab"
                  aria-selected={i === front}
                  aria-label={`Show ${d.name}`}
                  tabIndex={live ? 0 : -1}
                  className={i === front ? 'dot on' : 'dot'}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>

            <div className="dashboards__row">
              <Cta label={C.cta} href={DEMOS_HREF} where="dashboards" />
              <button
                type="button"
                className="arrow"
                aria-label="Previous dashboard"
                tabIndex={live ? 0 : -1}
                onClick={() => cycle(-1)}
              >
                &#8592;
              </button>
              <button
                type="button"
                className="arrow"
                aria-label="Next dashboard"
                tabIndex={live ? 0 : -1}
                onClick={() => cycle(1)}
              >
                &#8594;
              </button>
            </div>
          </div>
        </div>

        <div className="dashboards__cards" aria-hidden={!live}>
          {DASHBOARDS.map((d, i) => (
            <DashboardCard
              key={d.name}
              dashboard={d}
              index={i}
              slot={slotOf(i)}
              isFront={i === front}
              onSelect={() => goTo(i)}
            />
          ))}
        </div>

        <div className="dashboards__stage">
          <div className="dashboards__copy">
            <h2 className="dashboards__head">
              <span className="line"><span>{C.head[0]}</span></span>
              <span className="line"><span>{C.head[1]}</span></span>
            </h2>
            <p className="dashboards__desc soft">{C.desc}</p>
          </div>
        </div>
      </div>

      <div className="dashboards__scroll" aria-hidden="true">
        <div className="dashboards__trigger" ref={triggerRef} />
      </div>
    </Section>
  );
}