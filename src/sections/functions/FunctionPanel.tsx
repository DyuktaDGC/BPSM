import type { Fn } from '../../content/functions';
import { COPY } from '../../content/copy';

type Props = { fn: Fn; active: boolean; dark: boolean };

export default function FunctionPanel({ fn, active, dark }: Props) {
  return (
    <div className={`fpanel${active ? ' on' : ''}${dark ? ' dark' : ''}`} aria-hidden={!active}>
      <span className="fpanel__num" style={{ color: fn.color }}>{fn.n}</span>

      <div className="fpanel__body">
        <span className="fpanel__kicker mono" style={{ color: fn.color }}>
          {COPY.functions.label} {fn.n}
        </span>

        <h3 className="fpanel__title">{fn.title}</h3>
        <p className="fpanel__said soft">{fn.said}</p>

        <ul className="fpanel__gets">
          {fn.gets.map((g) => (
            <li key={g} style={{ '--tone': fn.color } as React.CSSProperties}>{g}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}