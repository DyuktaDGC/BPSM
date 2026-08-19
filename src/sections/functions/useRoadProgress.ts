import { useCallback, useEffect, useRef, useState } from 'react';
import { dwellWindows, type RoadTimeline } from './mapScrollToDistance';

/** Time constant of the follow, in ms — the one knob for how tightly the road
 *  tracks the scroll. Lower is snappier, higher is floatier.
 *
 *  Expressed as a decay over elapsed time rather than a fixed per-frame
 *  fraction, so the road covers the same ground per millisecond on any panel.
 *  The old `+= (target - v) * 0.055` worked out to a 295ms constant at 60Hz
 *  but 123ms at 144Hz, so the section had a different feel on every machine.
 *  170 sits inside that range: familiar wherever you were testing, identical
 *  everywhere now. */
const TAU = 170;

/** Below this the follow is done; stops it creeping for another second. */
const SNAP = 0.00006;

/** How far either side of a dwell window still counts as being at that stop. */
const DWELL_PAD = 0.022;

/** A frame after a stall (tab wake, GC pause) can be hundreds of ms. Clamping
 *  keeps the road easing in instead of teleporting a screen's worth. */
const MAX_DT = 50;

/** Runs once per frame, after progress has been updated for that frame. */
export type FrameFn = (progress: number, dt: number) => void;

export function useRoadProgress(
  sectionRef: React.RefObject<HTMLElement | null>,
  timeline: RoadTimeline,
  reduced: boolean,
) {
  const progressRef = useRef(0);
  const [stop, setStop] = useState(-1);
  const subsRef = useRef(new Set<FrameFn>());

  /** Subscribe to the section's frame loop. Everything that reads progress
   *  draws from this one loop, in subscribe order, after progress is written.
   *  Three independent rAF loops used to race: React flushes child effects
   *  before parent ones, so the camera's loop was registered first and drew
   *  last frame's position while the walker drew this frame's. The two were
   *  permanently one frame apart, which is the shimmer you see under the feet. */
  const onFrame = useCallback((fn: FrameFn) => {
    const subs = subsRef.current;
    subs.add(fn);
    return () => { subs.delete(fn); };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const windows = dwellWindows(timeline);
    let raf = 0;
    let lastStop = -1;
    let smoothed = 0;
    let started = false;
    let last = performance.now();

    // Cached so the loop never forces a layout to ask where the section is.
    // Both only move on resize, and useScrollHeight runs its resize listener
    // first, so the height read here is the one it just applied.
    let docTop = 0;
    let height = 0;
    let scrollable = 1;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      docTop = rect.top + window.scrollY;
      height = el.offsetHeight;
      scrollable = Math.max(1, height - window.innerHeight);
    };
    measure();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);

      const dt = Math.max(1, Math.min(MAX_DT, now - last));
      last = now;

      const y = window.scrollY;
      const vh = window.innerHeight;
      const target = clamp((y - docTop) / scrollable);

      // A viewport of slack either side. Off-screen the section does no
      // per-frame work at all, so the rest of the page isn't paying for a
      // road nobody can see — and it snaps to true, so it's already settled
      // by the time it scrolls in.
      const near = y + vh * 2 > docTop && y < docTop + height + vh;

      if (reduced || !started || !near) {
        smoothed = target;
        started = true;
      } else {
        smoothed += (target - smoothed) * (1 - Math.exp(-dt / TAU));
        if (Math.abs(target - smoothed) < SNAP) smoothed = target;
      }

      progressRef.current = smoothed;

      let active = -1;
      for (let i = 0; i < windows.length; i++) {
        if (smoothed >= windows[i].start - DWELL_PAD && smoothed <= windows[i].end + DWELL_PAD) {
          active = i;
          break;
        }
      }
      if (active !== lastStop) {
        lastStop = active;
        setStop(active);
      }

      if (near) subsRef.current.forEach((fn) => fn(smoothed, dt));
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
    };
  }, [sectionRef, timeline, reduced]);

  return { progressRef, stop, onFrame };
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));
