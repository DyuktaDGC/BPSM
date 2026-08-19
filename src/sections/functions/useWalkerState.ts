import { useEffect, useRef } from 'react';
import type { RoadTimeline } from './mapScrollToDistance';
import { distanceAt } from './mapScrollToDistance';
import type { FrameFn } from './useRoadProgress';
import { VEHICLES, type Vehicle } from './vehicleList';
import { burst } from './confetti';

/** Path units per second below which the walker is standing still. Was a
 *  per-frame delta, so on a 144Hz panel the same scroll speed read as 2.4×
 *  slower and the walk cycle flickered on and off between the two states. */
const MOVE_PER_SEC = 13;

const SWAP_MS = 480;

/** Path units from the start line inside which he faces you and waves. He
 *  holds the greeting for as long as you leave him standing there — a fixed
 *  timer ran out while the section was still scrolling into place. */
const GREET_WITHIN = 8;

/** The climb runs along the nose, not straight up: the rocket sits about 18
 *  degrees above horizontal, so a vertical exit had it flying sideways to
 *  where it pointed. These two give that same shallow angle — atan(520/1600)
 *  — so it leaves the frame off to the right like a plane off a runway. */
const APEX_X = 1600;
const APEX_Y = 520;
const ASCEND_MS = 3200;
const MAX_TILT = 18;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (f: number) => f * f;

export function useWalkerState(
  onFrame: (fn: FrameFn) => () => void,
  timeline: RoadTimeline,
  nodeLengths: number[],
  pathLength: number,
  pathRef: React.RefObject<SVGPathElement | null>,
  colors: readonly string[],
  reduced: boolean,
) {
  const walkerRef = useRef<HTMLDivElement>(null);
  const lastDistRef = useRef(0);
  const swapTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const walker = walkerRef.current;
    const path = pathRef.current;
    if (!walker || reduced || !pathLength || !colors.length) return;

    const lastNode = nodeLengths[nodeLengths.length - 1] ?? 0;
    const tailLen = Math.max(1, pathLength - lastNode);
    const flagLen = lastNode + tailLen * 0.93;
    let lastVehicle: Vehicle | '' = '';
    let ascendStart: number | null = null;

    // Every style write costs a recalc, and most frames change none of these.
    let lastTone = -1;
    let lastFly = '';
    let lastFlyX = '';
    let lastTilt = '';

    const unsubscribe = onFrame((progress, dt) => {
      const distance = distanceAt(timeline, progress);
      const speed = ((distance - lastDistRef.current) / dt) * 1000;

      let tone = 0;
      while (tone < nodeLengths.length - 1 && distance > nodeLengths[tone] + 2) tone++;
      if (tone !== lastTone) {
        lastTone = tone;
        walker.style.color = colors[tone] ?? colors[colors.length - 1];
      }

      let seg = 0;
      while (seg < nodeLengths.length - 1 && distance > nodeLengths[seg] - 3) seg++;

      let vehicle: Vehicle = VEHICLES[Math.min(seg, VEHICLES.length - 1)];
      let flyX = 0;
      let flyY = 0;

      if (distance > flagLen) {
        // Crossing the flag, not merely being past it — scrolling back before
        // the flag re-arms it, so the reward is repeatable but never doubles.
        if (ascendStart === null) {
          ascendStart = performance.now();
          burst(walker, colors);
        }
        const t = clamp01((performance.now() - ascendStart) / ASCEND_MS);
        vehicle = 'rocket';
        flyX = ease(t) * APEX_X;
        flyY = ease(t) * APEX_Y;
      } else {
        ascendStart = null;
      }

      const moving = Math.abs(speed) > MOVE_PER_SEC;
      // Parked at the start line: he turns to camera and waves until you
      // actually set off, so the greeting is always there when you arrive.
      const greeting = !moving && distance <= GREET_WITHIN;
      walker.classList.toggle('waving', greeting);
      walker.classList.toggle('walking', moving && !greeting);
      walker.classList.toggle('idle', !moving && !greeting);
      if (speed > MOVE_PER_SEC) walker.classList.remove('back');
      else if (speed < -MOVE_PER_SEC) walker.classList.add('back');

      const flyPx = `${flyY.toFixed(1)}px`;
      if (flyPx !== lastFly) {
        lastFly = flyPx;
        walker.style.setProperty('--fly', flyPx);
      }

      const flyXPx = `${flyX.toFixed(1)}px`;
      if (flyXPx !== lastFlyX) {
        lastFlyX = flyXPx;
        walker.style.setProperty('--fly-x', flyXPx);
      }

      let tilt = lastTilt;
      if (flyY > 0) {
        tilt = '0deg';
      } else if (path) {
        const a = path.getPointAtLength(Math.max(0, distance - 7));
        const b = path.getPointAtLength(Math.min(pathLength, distance + 7));
        const deg = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
        tilt = `${Math.min(MAX_TILT, Math.max(-MAX_TILT, deg)).toFixed(2)}deg`;
      }
      if (tilt !== lastTilt) {
        lastTilt = tilt;
        walker.style.setProperty('--tilt', tilt);
      }

      if (vehicle !== lastVehicle) {
        lastVehicle = vehicle;
        walker.dataset.vehicle = vehicle;
        walker.classList.add('swap');
        window.clearTimeout(swapTimerRef.current);
        swapTimerRef.current = window.setTimeout(() => walker.classList.remove('swap'), SWAP_MS);
      }


      lastDistRef.current = distance;
    });

    return () => {
      unsubscribe();
      window.clearTimeout(swapTimerRef.current);
    };
  }, [onFrame, timeline, nodeLengths, pathLength, pathRef, colors, reduced]);

  return walkerRef;
}