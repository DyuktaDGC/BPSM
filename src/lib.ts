import posthog from 'posthog-js';

const KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;

export function track(event: string, props?: Record<string, unknown>) {
  if (!KEY) return;
  posthog.capture(event, props);
}

const COLORS = ['--c1','--c2','--c3','--c4','--c5','--c6','--c7'] as const;
export const colorOf = (fn: number) => `var(${COLORS[Math.min(6, Math.max(0, fn - 1))]})`;