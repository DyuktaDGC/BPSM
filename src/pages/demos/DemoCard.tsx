import type { CSSProperties } from 'react';
import Cta from '../../components/Cta';
import DemoPreview from '../../components/DemoPreview';
import { COPY } from '../../content/copy';
import type { Demo } from '../../content/demos';
import { useHoverPreview } from '../../hooks/useHoverPreview';

const C = COPY.demos;

export default function DemoCard({ demo }: { demo: Demo }) {
  const { armed, open, handlers } = useHoverPreview({ enabled: demo.framable !== false });

  return (
    <article
      className={`demo${open ? ' demo--live' : ''}`}
      style={{ '--accent': demo.color } as CSSProperties}
      {...handlers}
    >
      <DemoPreview
        url={demo.url}
        dashboard={demo.dashboard}
        metric={demo.metric}
        figure={demo.figure}
        armed={armed}
      />

      <div className="demo__body">
        <h2 className="demo__biz">{demo.business}</h2>
        <p className="demo__sub mono soft">{demo.dashboard}</p>

        <Cta
          label={C.open}
          href={demo.url}
          where={`demos:${demo.slug}`}
          size="sm"
          arrow="↗"
          external
        />
      </div>
    </article>
  );
}