import { useMedia } from './useMedia';

const QUERY = '(prefers-reduced-motion: reduce)';

export function useReducedMotion(): boolean {
  return useMedia(QUERY);
}
