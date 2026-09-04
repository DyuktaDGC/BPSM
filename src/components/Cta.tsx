import type { CSSProperties } from 'react';
import { track } from '../lib';

type Props = {
  label: string;
  href?: string;
  onClick?: () => void;
  tone?: 'brand' | 'ink';
  size?: 'sm' | 'md';
  arrow?: '→' | '↓' | '↗';
  /** Opens in a new tab. Used for links that leave the site — the live demos. */
  external?: boolean;
  where: string;
  style?: CSSProperties;
  /** Button-only. A disabled anchor is not a thing, so links ignore it. */
  disabled?: boolean;
};

export default function Cta({ label, href, onClick, tone = 'brand', size = 'md', arrow = '→', external, where, style, disabled }: Props) {
  const cls = `cta cta--${tone} cta--${size}`;
  const fire = () => { track('cta_click', { where, label }); onClick?.(); };

  return href ? (
    <a
      className={cls}
      style={style}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer noopener' : undefined}
      onClick={fire}
    >
      {label}<span aria-hidden="true">{arrow}</span>
    </a>
  ) : (
    <button type="button" className={cls} style={style} onClick={fire} disabled={disabled}>{label}<span aria-hidden="true">{arrow}</span></button>
  );
}
