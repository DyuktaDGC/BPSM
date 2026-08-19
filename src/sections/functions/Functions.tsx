import { useEffect, useMemo, useRef, useState } from 'react';
import { FUNCTIONS } from '../../content/functions';
import type { Fn } from '../../content/functions';
import { COPY } from '../../content/copy';
import { useRoadGeometry } from './useRoadGeometry';
import { buildTimeline } from './mapScrollToDistance';
import { useRoadProgress } from './useRoadProgress';
import { useWalkerState } from './useWalkerState';
import { useStopJump } from './useStopJump';
import { useScrollHeight } from './useScrollHeight';
import { useMedia, COMPACT } from '../../hooks/useMedia';
import { useReveal } from '../../hooks/useReveal';
import Road from './Road';
import Walker from './Walker';
import FunctionPanel from './FunctionPanel';

const C = COPY.functions;

/** Where the road is pinned on screen. At 0.74 the horizon sat so low that the
 *  top half of the section was an empty sky band; 0.66 pulls the landscape up
 *  under the copy and gives the textured ground the space instead. */
const cameraPoint = () => ({ x: window.innerWidth * 0.3, y: window.innerHeight * 0.66 });

export default function Functions({ reduced }: { reduced: boolean }) {
  const compact = useMedia(COMPACT);
  if (reduced || compact) return <FlatList reduced={reduced} />;
  return <AnimatedFunctions />;
}

function AnimatedFunctions() {
  const sectionRef = useRef<HTMLElement>(null);
  const geometry = useRoadGeometry(FUNCTIONS.length);
  const colors = useMemo(() => FUNCTIONS.map((f) => f.color), []);

  const timeline = useMemo(
    () => buildTimeline(geometry.nodeLengths, geometry.pathLength || 1),
    [geometry.nodeLengths, geometry.pathLength],
  );

  useScrollHeight(sectionRef, timeline);
  const { stop, onFrame } = useRoadProgress(sectionRef, timeline, false);
  const walkerRef = useWalkerState(onFrame, timeline, geometry.nodeLengths, geometry.pathLength, geometry.pathRef, colors, false);
  const { jumpTo } = useStopJump(sectionRef, timeline, stop, FUNCTIONS.length);

  // The point on screen the road is pinned under. useScrollHeight already
  // re-maps the scroll on resize; leaving this frozen at its mount value meant
  // the walker drifted off the road as soon as the window changed size.
  const [camera, setCamera] = useState(cameraPoint);

  useEffect(() => {
    const onResize = () => setCamera(cameraPoint());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const el = walkerRef.current;
    if (!el) return;
    el.style.left = `${camera.x}px`;
    el.style.top = `${camera.y}px`;
  }, [walkerRef, camera]);

  return (
    <section id="functions" className={stop >= 4 ? 'functions functions--dark' : 'functions'} ref={sectionRef}>
      <div className="functions__pin">
        <header className="functions__head">
          <p className="mono soft">{C.kicker}</p>
          <h2>{C.head}</h2>
          <p className="functions__sub soft">{C.sub}</p>
        </header>

        <div className="functions__panels">
          {FUNCTIONS.map((fn, i) => (
            <FunctionPanel key={fn.n} fn={fn} active={stop === i} dark={i >= 4} />
          ))}
        </div>

        <div className="functions__stage">
          <Road
            functions={FUNCTIONS}
            geometry={geometry}
            timeline={timeline}
            onFrame={onFrame}
            camera={camera}
          />
          <Walker ref={walkerRef} />
        </div>

        <div className="functions__dots" role="tablist" aria-label="Jump to a function">
          {FUNCTIONS.map((fn, i) => (
            <button
              key={fn.n}
              type="button"
              role="tab"
              aria-selected={stop === i}
              aria-label={`${fn.n} ${fn.title}`}
              className={stop === i ? 'dot here' : 'dot'}
              style={{ background: stop >= i ? fn.color : undefined }}
              onClick={() => jumpTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FlatList({ reduced }: { reduced: boolean }) {
  return (
    <section id="functions" className="functions functions--flat">
      <header className="functions__flat-head">
        <p className="mono soft">{C.kicker}</p>
        <h2>{C.head}</h2>
        <p className="functions__sub soft">{C.sub}</p>
      </header>

      <ol className="functions__flat-list">
        {FUNCTIONS.map((fn) => (
          <FlatItem key={fn.n} fn={fn} reduced={reduced} />
        ))}
      </ol>
    </section>
  );
}

function FlatItem({ fn, reduced }: { fn: Fn; reduced: boolean }) {
  const { ref, seen } = useReveal<HTMLLIElement>(0.15);
  const on = reduced || seen;

  return (
    <li
      ref={ref}
      className={`functions__flat-item${on ? ' in' : ''}`}
      style={{ '--tone': fn.color } as React.CSSProperties}
    >
      <FunctionPanel fn={fn} active dark={false} />
    </li>
  );
}
