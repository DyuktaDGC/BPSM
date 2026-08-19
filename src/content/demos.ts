import type { Figure } from './dashboards';

/**
 * The six business dashboards we showcase, one card each on /demos.html.
 *
 * ── PLACEHOLDER LINKS ────────────────────────────────────────────────────
 * `DEMO_BASE` and every `url` below point at a host that does not exist yet.
 * Swap DEMO_BASE for the real one (or replace individual `url`s) and the
 * whole page — links, hover previews, tracking — follows. Nothing else in
 * the app hardcodes a demo address.
 *
 * ── HOVER PREVIEW ────────────────────────────────────────────────────────
 * Hovering a card loads `url` in a live iframe. A demo served with
 * `X-Frame-Options: DENY` or `frame-ancestors 'none'` cannot be framed and
 * will render blank inside the preview — set `framable: false` on that entry
 * and its card keeps the static thumbnail instead.
 */
const DEMO_BASE = 'https://demo.dgc.in';

export type Demo = {
  slug: string;
  /** Which of the six panels this is. */
  dashboard: string;
  /** The business it was built for — the division this card sits under. */
  business: string;
  /** Shown on the resting thumbnail, not in the card body. */
  metric: string;
  color: string;
  figure: Figure;
  url: string;
  /** Default true. Set false when the demo refuses to be iframed. */
  framable?: boolean;
};

export const DEMOS: Demo[] = [
  {
    slug: 'sales',
    dashboard: 'Sales',
    business: 'Manufacturing & B2B distribution',
    metric: '₹42.6L',
    color: 'var(--c4)',
    figure: 'bars',
    url: `${DEMO_BASE}/sales`,
  },
  {
    slug: 'finance',
    dashboard: 'Finance',
    business: 'Multi-branch retail',
    metric: '₹9.1L',
    color: 'var(--c7)',
    figure: 'line',
    url: `${DEMO_BASE}/finance`,
  },
  {
    slug: 'profit-loss',
    dashboard: 'Profit & Loss',
    business: 'Services & agency businesses',
    metric: '11.4%',
    color: 'var(--c1)',
    figure: 'split',
    url: `${DEMO_BASE}/profit-loss`,
  },
  {
    slug: 'employee-performance',
    dashboard: 'Employee performance',
    business: 'Field-force & operations teams',
    metric: '84 / 100',
    color: 'var(--c5)',
    figure: 'rows',
    url: `${DEMO_BASE}/employee-performance`,
  },
  {
    slug: 'analytics',
    dashboard: 'Analytics',
    business: 'D2C & e-commerce',
    metric: '3.2×',
    color: 'var(--c2)',
    figure: 'line',
    url: `${DEMO_BASE}/analytics`,
  },
  {
    slug: 'product',
    dashboard: 'Product',
    business: 'FMCG & product companies',
    metric: '7 SKUs',
    color: 'var(--c3)',
    figure: 'donut',
    url: `${DEMO_BASE}/product`,
  },
];
