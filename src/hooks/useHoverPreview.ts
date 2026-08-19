import { useCallback, useEffect, useRef, useState } from 'react';
import type { FocusEvent, PointerEvent } from 'react';

/** Long enough that dragging the cursor across the grid doesn't spawn six
 *  iframes, short enough that a deliberate hover feels instant. */
const ARM_DELAY = 190;

/** The preview is a real iframe of a real site, so only arm it where hovering
 *  actually means something. On touch, the card stays a static thumbnail. */
const canHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/**
 * Arm-and-open for a hover preview. `armed` is sticky — once the frame exists
 * we keep it, so a second hover is instant instead of re-running the whole
 * load. `handlers` spreads onto the element being hovered.
 */
export function useHoverPreview({ enabled }: { enabled: boolean }) {
  const [armed, setArmed] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef(0);

  const show = useCallback(() => {
    if (!enabled || !canHover()) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setArmed(true);
      setOpen(true);
    }, ARM_DELAY);
  }, [enabled]);

  const hide = useCallback(() => {
    window.clearTimeout(timer.current);
    setOpen(false);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return {
    armed,
    open,
    handlers: {
      onPointerEnter: (e: PointerEvent) => { if (e.pointerType === 'mouse') show(); },
      onPointerLeave: hide,
      onFocus: show,
      onBlur: (e: FocusEvent<HTMLElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) hide();
      },
    },
  };
}
