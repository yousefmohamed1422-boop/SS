import { Calendar, CheckCircle2, Circle, Clock, TriangleAlert, Sparkles } from 'lucide-react';
import { currentCycle, formatDate } from '../utils/dates';
import { STATUS } from '../utils/storage';
import { useTilt } from '../hooks/useTilt';

const PHASE_ICON = {
  upcoming: Clock,
  prep: Clock,
  ready: Sparkles,
  danger: TriangleAlert,
};

export default function ClientCard({ client, onOpen, index = 0 }) {
  const cycle = currentCycle(client);
  const doneCount = cycle.tasks.filter((t) => t.done).length;
  const initial = client.name.trim().charAt(0);
  const PhaseIcon = PHASE_ICON[cycle.phase];
  const tilt = useTilt(8);

  return (
    <button
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="client-card"
      style={{ '--i': index }}
      onClick={() => onOpen(client.id)}
    >
      {cycle.phase === 'danger' && (
        <span className="danger-badge">
          <TriangleAlert size={12} strokeWidth={2.4} />
          متأخر
        </span>
      )}

      <div className="client-card-top">
        <span className={`client-avatar avatar-${client.status}`}>
          {client.avatar ? <img src={client.avatar} alt={client.name} /> : initial}
        </span>
        <div className="client-card-titles">
          <h3>{client.name}</h3>
          <span className={`status-chip chip-${client.status}`}>{STATUS[client.status].label}</span>
        </div>
      </div>

      <p className="client-card-meta">
        <Calendar size={13} strokeWidth={2.2} />
        بداية التعاقد {formatDate(client.contractStart)}
      </p>

      <div className="mini-dots">
        {cycle.tasks.map((t) =>
          t.done ? (
            <CheckCircle2 key={t.key} size={16} strokeWidth={2.2} className="mini-icon done" />
          ) : (
            <Circle key={t.key} size={16} strokeWidth={2} className="mini-icon" />
          )
        )}
        <span className="mini-dots-label">{doneCount}/{cycle.tasks.length}</span>
      </div>

      <div className="client-card-bottom">
        <span className={`phase-pill phase-${cycle.phase} small`}>
          <PhaseIcon size={13} strokeWidth={2.3} />
          {cycle.phase === 'danger'
            ? `متأخر ${Math.abs(cycle.daysLeft)} يوم`
            : cycle.phase === 'ready'
            ? 'جاهز'
            : `${cycle.daysLeft} يوم متبقي`}
        </span>
      </div>
    </button>
  );
}
