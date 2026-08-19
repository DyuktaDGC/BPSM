import type { Dashboard } from '../../content/dashboards';
import DashboardFigure from '../../components/DashboardFigure';

type Props = { dashboard: Dashboard; index: number; slot: string; onSelect: () => void; isFront: boolean };

export default function DashboardCard({ dashboard: d, index, slot, onSelect, isFront }: Props) {
  return (
    <article
      className={`dcard i${index} ${slot}${d.shot ? ' dcard--shot' : ''}`}
      style={{ background: d.color }}
      onClick={isFront ? undefined : onSelect}
      role={isFront ? undefined : 'button'}
      tabIndex={isFront ? undefined : 0}
      aria-label={isFront ? undefined : `Show ${d.name} dashboard`}
    >
      {d.shot && (
        <img
          className="dcard__shot"
          src={d.shot}
          alt=""
          width={1536}
          height={1024}
          loading="eager"
          decoding="async"
          draggable={false}
        />
      )}

      <div className="dcard__top">
        <span className="dcard__name">{d.name}</span>
        <span className="dcard__chakra">◦ {d.reads}</span>
      </div>

      <DashboardFigure kind={d.figure} />

      <div className="dcard__bottom">
        <span className="dcard__metric">{d.metric}</span>
        <span className="dcard__delta">{d.delta}</span>
      </div>
    </article>
  );
}