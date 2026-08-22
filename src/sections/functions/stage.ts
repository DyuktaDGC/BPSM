/** Everything about the framework section that depends on the size of the
 *  window, resolved in one place so the road, the walker, the scroll height
 *  and the dot jumps can never disagree about where the camera is.
 *
 *  It used to be a lone `cameraPoint()` reading `window.innerHeight`, while
 *  the pinned box was sized in `svh`. Those are the same number on a desktop
 *  and different numbers on a phone with a retracting URL bar, which put the
 *  walker below the bottom of the box that clips him. */

/** Below this the copy moves into a sheet under the road instead of sitting
 *  beside it, and the world is scaled down so a narrow window still shows a
 *  useful length of road instead of one flat segment filling the screen.
 *  The same number drives the layout in design.css — they have to agree, or
 *  the road ends up behind the copy. */
export const WIDE_W = 1100;

/** Below this the section is being read with a thumb. */
export const COMPACT_W = 860;

const MIN_SCALE = 0.46;

export type Stage = {
  /** Where on screen the road is pinned. */
  x: number;
  y: number;
  /** World zoom, about the camera point. */
  scale: number;
  /** Scroll distance per timeline unit, as a fraction of the pinned height. */
  unit: number;
  compact: boolean;
};

export function readStage(pinHeight: number): Stage {
  const w = window.innerWidth;
  const h = pinHeight || window.innerHeight;
  const wide = w >= WIDE_W;
  const compact = w <= COMPACT_W;

  return {
    // Narrow screens read top-to-bottom, so the road sits high and centred
    // with the copy sheet under it; wide ones put it low-left, copy beside.
    x: w * (wide ? 0.3 : 0.46),
    y: h * (wide ? 0.66 : 0.42),
    scale: wide ? 1 : Math.max(MIN_SCALE, w / WIDE_W),
    // A thumb covers less ground than a wheel: seven stops at the desktop
    // rate is about nine screens of flicking on a phone.
    unit: compact ? 0.42 : 0.66,
    compact,
  };
}

export const sameStage = (a: Stage, b: Stage) =>
  a.x === b.x && a.y === b.y && a.scale === b.scale && a.unit === b.unit && a.compact === b.compact;

/** The height the road is pinned at — the box the walker has to stay inside.
 *  Measured rather than assumed, because it is set in `svh`. */
export const pinHeightOf = (pin: HTMLElement | null) => pin?.clientHeight || window.innerHeight;
