import { useState } from 'react';
import BrowserChrome from './BrowserChrome';
import DashboardFigure from './DashboardFigure';
import { COPY } from '../content/copy';
import type { Figure } from '../content/dashboards';
import { useFitScale } from '../hooks/useFitScale';

/** The iframe is rendered at this width and scaled down, so the preview shows
 *  the demo's desktop layout rather than its mobile breakpoint. */
const SHOT_W = 1280;

type Props = {
  url: string;
  dashboard: string;
  metric: string;
  figure: Figure;
  /** Set once the hover has held long enough to be worth an iframe. */
  armed: boolean;
};

export default function DemoPreview({ url, dashboard, metric, figure, armed }: Props) {
  const [loaded, setLoaded] = useState(false);
  const viewport = useFitScale(SHOT_W);

  return (
    <div className="demo__screen">
      {/* Resting state: the same card art the landing-page carousel uses. */}
      <div className="demo__still">
        <div className="demo__still-top">
          <span className="demo__still-name">{dashboard}</span>
          <span className="demo__still-metric">{metric}</span>
        </div>
        <DashboardFigure kind={figure} />
      </div>

      {/* Hover state: the live demo, scaled down inside a browser frame. */}
      <div className="demo__preview" aria-hidden="true">
        <BrowserChrome url={url} />
        <div className="demo__viewport" ref={viewport}>
          {armed && (
            <iframe
              className="demo__frame"
              src={url}
              title=""
              tabIndex={-1}
              loading="lazy"
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-popups"
              onLoad={() => setLoaded(true)}
            />
          )}
          {!loaded && <span className="demo__loading mono">{COPY.demos.loading}</span>}
        </div>
      </div>
    </div>
  );
}
