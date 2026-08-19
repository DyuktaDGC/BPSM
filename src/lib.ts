type PostHog = Awaited<typeof import('posthog-js')>['default'];

const KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;

let client: PostHog | null = null;
let loading: Promise<void> | null = null;
const queue: [string, Record<string, unknown> | undefined][] = [];

function load() {
  if (loading) return loading;
  loading = import('posthog-js')
    .then(({ default: posthog }) => {
      posthog.init(KEY as string, { person_profiles: 'identified_only' });
      client = posthog;
      for (const [event, props] of queue) posthog.capture(event, props);
      queue.length = 0;
    })
    .catch(() => { loading = null; });
  return loading;
}

export function track(event: string, props?: Record<string, unknown>) {
  if (!KEY) return;
  if (client) {
    client.capture(event, props);
    return;
  }
  queue.push([event, props]);
  void load();
}

const COLORS = ['--c1','--c2','--c3','--c4','--c5','--c6','--c7'] as const;
export const colorOf = (fn: number) => `var(${COLORS[Math.min(6, Math.max(0, fn - 1))]})`;
