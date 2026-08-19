import { colorOf } from '../../lib';
import type { Symptom } from '../../content/symptoms';

type Props = { symptom: Symptom; index: number; on: boolean; onToggle: (i: number) => void };

export default function SymptomRow({ symptom, index, on, onToggle }: Props) {
  return (
    <button
      type="button"
      aria-pressed={on}
      className={on ? 'sym on' : 'sym'}
      style={{ '--tone': colorOf(symptom.fn) } as React.CSSProperties}
      onClick={() => onToggle(index)}
    >
      <span className="sym__box" aria-hidden="true" />
      <span className="sym__text">{symptom.text}</span>
      <span className="sym__tag mono" aria-hidden="true">{`0${symptom.fn}`}</span>
    </button>
  );
}