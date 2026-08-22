import { useSyncExternalStore } from 'react';

export const COMPACT = '(max-width: 860px)';
export const COARSE = '(hover: none), (pointer: coarse)';

/** One subscriber per query, cached: useSyncExternalStore resubscribes
 *  whenever this identity changes, and a fresh closure per render would tear
 *  down and rebuild the listener on every commit. */
const subscribers = new Map<string, (notify: () => void) => () => void>();

function subscriberFor(query: string) {
  let subscribe = subscribers.get(query);
  if (subscribe) return subscribe;

  subscribe = (notify: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener('change', notify);
    // The backstop. A `change` that lands between the first render and the
    // listener being attached is missed entirely, and the component then sits
    // on the wrong answer for the life of the page — which is how a 1280px
    // desktop ended up rendering the mobile fallback of the framework
    // section. Resize fires on the same transitions and costs nothing here.
    window.addEventListener('resize', notify);
    window.addEventListener('orientationchange', notify);
    return () => {
      mq.removeEventListener('change', notify);
      window.removeEventListener('resize', notify);
      window.removeEventListener('orientationchange', notify);
    };
  };

  subscribers.set(query, subscribe);
  return subscribe;
}

/** Reads the query at render time rather than seeding state from it once.
 *  The old version cached the first answer in useState, so a viewport that
 *  was still settling during the first paint left the wrong branch mounted. */
export function useMedia(query: string): boolean {
  return useSyncExternalStore(
    subscriberFor(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}
