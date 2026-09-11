import { LayoutGrid, CircleCheck, PauseCircle, RotateCcw, CircleSlash } from 'lucide-react';
import { STATUS } from '../utils/storage';

const ICONS = {
  all: LayoutGrid,
  active: CircleCheck,
  hold: PauseCircle,
  refund: RotateCcw,
  stopped: CircleSlash,
};

export default function StatusTabs({ clients, active, onChange }) {
  const counts = { all: clients.length };
  Object.keys(STATUS).forEach((k) => {
    counts[k] = clients.filter((c) => c.status === k).length;
  });

  const tabs = [{ key: 'all', label: 'الكل' }, ...Object.values(STATUS)];

  return (
    <div className="status-tabs">
      {tabs.map((t) => {
        const Icon = ICONS[t.key];
        return (
          <button
            key={t.key}
            className={`status-tab ${active === t.key ? 'active' : ''} tab-${t.key}`}
            onClick={() => onChange(t.key)}
          >
            <Icon size={16} strokeWidth={2.2} />
            <span>{t.label}</span>
            <span className="status-tab-count">{counts[t.key] ?? 0}</span>
          </button>
        );
      })}
    </div>
  );
}
