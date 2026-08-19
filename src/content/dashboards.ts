import financeShot from '../../assets/shots/finance.webp';
import profitLossShot from '../../assets/shots/profit_loss.webp';
import employeeShot from '../../assets/shots/employee.webp';
import analyticsShot from '../../assets/shots/analytics.webp';
import productShot from '../../assets/shots/product.webp';

export type Figure = 'bars' | 'line' | 'split' | 'rows' | 'donut';

export type Dashboard = {
  name: string;
  label: string;
  color: string;
  reads: string;
  metric: string;
  delta: string;
  figure: Figure;
  blurb: string;
  shot?: string;
};

export const DASHBOARDS: Dashboard[] = [
  { name: 'Sales', blurb: 'Every lead, quote and close in one pipeline view — so you can see which stage is leaking deals before the month ends.', label: 'Pipeline & conversion', color: 'var(--c4)', reads: '03 + 04', metric: '₹42.6L', delta: '+18% MoM', figure: 'bars' },
  { name: 'Finance', blurb: 'Cash in, cash out and what\'s actually left, updated daily — no more waiting on a month-end statement to know where you stand.', label: 'Cash flow & expenses', color: 'var(--c7)', reads: '07', metric: '₹9.1L', delta: 'cash in hand', figure: 'line', shot: financeShot },
  { name: 'Profit & Loss', blurb: 'Margin broken down by product, client and channel — so the work that quietly loses money stops hiding inside the total.', label: 'Where profit leaks', color: 'var(--c1)', reads: '07', metric: '11.4%', delta: 'net margin', figure: 'split', shot: profitLossShot },
  { name: 'Employee performance', blurb: 'Targets, output and review scores per person — so performance conversations start from a number, not a hunch.', label: 'KPIs, reviews, output', color: 'var(--c5)', reads: '05 + 06', metric: '84 / 100', delta: 'team KPI score', figure: 'rows', shot: employeeShot },
  { name: 'Analytics', blurb: 'The handful of numbers that actually move the business, trended against last year — signal, not a wall of charts.', label: 'Where you stand today', color: 'var(--c2)', reads: '01', metric: '3.2×', delta: 'vs last year', figure: 'line', shot: analyticsShot },
  { name: 'Product', blurb: 'Demand, mix and margin by SKU — so you know which few products carry the revenue and which are just taking up shelf.', label: 'Demand, mix & margin', color: 'var(--c3)', reads: '02', metric: '7 SKUs', delta: '62% of revenue', figure: 'donut', shot: productShot },
];