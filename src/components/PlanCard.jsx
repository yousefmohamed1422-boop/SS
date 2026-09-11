import { Palette, PenLine, Video as VideoIcon, Camera, Settings2 } from 'lucide-react';
import { PLAN_ITEMS, getPlan } from '../utils/storage';

const ICONS = { design: Palette, content: PenLine, video: VideoIcon, photoSession: Camera };

export default function PlanCard({ client, index = 0, onBump, onEdit }) {
  const plan = getPlan(client);
  const initial = client.name.trim().charAt(0);

  return (
    <div className="plan-card glass-panel" style={{ '--i': index }}>
      <div className="plan-card-head">
        <span className={`client-avatar avatar-${client.status}`}>
          {client.avatar ? <img src={client.avatar} alt={client.name} /> : initial}
        </span>
        <h3>{client.name}</h3>
        <button className="btn ghost small" onClick={() => onEdit(client)}>
          <Settings2 size={14} strokeWidth={2.2} />
          تعديل الخطة
        </button>
      </div>

      <div className="plan-rows">
        {PLAN_ITEMS.map((item) => {
          const Icon = ICONS[item.key];
          const { total, used } = plan[item.key];
          const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
          const full = total > 0 && used >= total;
          return (
            <div className="plan-row" key={item.key}>
              <span className="plan-row-icon"><Icon size={15} strokeWidth={2.1} /></span>
              <div className="plan-row-body">
                <div className="plan-row-top">
                  <span>{item.label}</span>
                  <span className="plan-row-count">{used}/{total}</span>
                </div>
                <div className="plan-bar-track">
                  <div className={`plan-bar-fill ${full ? 'full' : ''}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
              {total > 0 && (
                <button
                  className="plan-bump"
                  disabled={full}
                  onClick={() => onBump(client.id, item.key, 1)}
                  title={`سجّل ${item.unit} خلص`}
                >
                  +1
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
