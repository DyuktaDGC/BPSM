import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FUNCTIONS } from '../../content/functions';
import type { Fn } from '../../content/functions';
import { COPY } from '../../content/copy';
import { useRoadGeometry } from './useRoadGeometry';
import { buildTimeline } from './mapScrollToDistance';
import { useRoadProgress } from './useRoadProgress';
import { useWalkerState } from './useWalkerState';
import { useStopJump } from './useStopJump';
import { useScrollHeight } from './useScrollHeight';
import { readStage, sameStage, pinHeightOf, type Stage } from './stage';
import { useReveal } from '../../hooks/useReveal';
import Road from './Road';
import Walker from './Walker';
import FunctionPanel from './FunctionPanel';

const C = COPY.functions;

export default function Functions({ reduced }: { reduced: boolean }) {
  // Only reduced motion drops to the static list now. A phone gets the same
  // walk everyone else does, laid out for a thumb — the road *is* the section.
  if (reduced) return <FlatList reduced={reduced} />;
  return <AnimatedFunctions />;
}

function AnimatedFunctions() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const geometry = useRoadGeometry(FUNCTIONS.length);
  const colors = useMemo(() => FUNCTIONS.map((f) => f.color), []);

  const timeline = useMemo(
    () => buildTimeline(geometry.nodeLengths, geometry.pathLength || 1),
    [geometry.nodeLengths, geometry.pathLength],
  );

  // Every size-dependent number in the section, remeasured together. Keeping
  // the camera frozen at its mount value drifted the walker off the road as
  // soon as the window changed size; keeping it separate from the scroll
  // height let the two disagree about how tall the pinned box was.
  const [stage, setStage] = useState<Stage>(() => readStage(0));

  useLayoutEffect(() => {
    const apply = () =>
      setStage((prev) => {
        const next = readStage(pinHeightOf(pinRef.current));
        // A phone fires resize on every URL-bar nudge. Handing back the same
        // object keeps that from resubscribing the whole frame loop mid-scroll.
        return sameStage(prev, next) ? prev : next;
      });

    apply();
    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);
    return () => {
      window.removeEventListener('resize', apply);
      window.removeEventListener('orientationchange', apply);
    };
  }, []);

  useScrollHeight(sectionRef, pinRef, timeline, stage.unit);
  const { stop, onFrame } = useRoadProgress(sectionRef, pinRef, timeline, false);
  const walkerRef = useWalkerState(onFrame, timeline, geometry.nodeLengths, geometry.pathLength, geometry.pathRef, colors, false);
  const { jumpTo } = useStopJump(sectionRef, pinRef, timeline, stop, FUNCTIONS.length);

  useEffect(() => {
    const el = walkerRef.current;
    if (!el) return;
    el.style.left = `${stage.x}px`;
    el.style.top = `${stage.y}px`;
    // The rig is drawn at full size but the world around it shrinks on narrow
    // screens, so it has to come down with it or he ends up straddling the road.
    el.style.setProperty('--rig', `${stage.scale}`);
  }, [walkerRef, stage]);

  const className = [
    'functions',
    stop >= 4 ? 'functions--dark' : '',
    stop >= 0 ? 'functions--engaged' : '',
  ].filter(Boolean).join(' ');

  return (
    <section id="functions" className={className} ref={sectionRef}>
      <div className="functions__pin" ref={pinRef}>
        <div className="functions__stage">
          <Road
            functions={FUNCTIONS}
            geometry={geometry}
            timeline={timeline}
            onFrame={onFrame}
            camera={stage}
          />
          <Walker ref={walkerRef} />
        </div>

        <div className="functions__ui">
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
