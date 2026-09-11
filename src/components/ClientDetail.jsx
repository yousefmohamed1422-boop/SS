import { ArrowRight, Calendar, Pencil, Trash2 } from 'lucide-react';
import { currentCycle, allPastCycles, formatDate } from '../utils/dates';
import Timeline from './Timeline';
import StatusDropdown from './StatusDropdown';

export default function ClientDetail({ client, onBack, onToggleTask, onChangeStatus, onDelete, onEdit }) {
  const cycle = currentCycle(client);
  const history = allPastCycles(client);
  const initial = client.name.trim().charAt(0);

  return (
    <div className="client-detail">
      <button className="back-link" onClick={onBack}>
        <ArrowRight size={15} strokeWidth={2.3} />
        كل العملاء
      </button>

      <div className="client-detail-head">
        <div className="client-detail-identity">
          <span className={`client-avatar avatar-${client.status} large`}>
            {client.avatar ? <img src={client.avatar} alt={client.name} /> : initial}
          </span>
          <div>
            <h1>{client.name}</h1>
            <p className="client-card-meta">
              <Calendar size={13} strokeWidth={2.2} />
              بداية التعاقد {formatDate(client.contractStart)}
              {client.notes ? ` · ${client.notes}` : ''}
            </p>
          </div>
        </div>

        <div className="client-detail-actions">
          <StatusDropdown value={client.status} onChange={(status) => onChangeStatus(client.id, status)} />
          <button className="btn ghost" onClick={onEdit}>
            <Pencil size={15} strokeWidth={2.2} />
            تعديل
          </button>
          <button className="btn danger-outline" onClick={() => onDelete(client.id)}>
            <Trash2 size={15} strokeWidth={2.2} />
            حذف
          </button>
        </div>
      </div>

      <h2 className="section-title">الدورة الحالية — رقم {cycle.index + 1}</h2>
      <Timeline cycle={cycle} onToggleTask={(key) => onToggleTask(client.id, cycle.index, key)} />

      {history.length > 0 && (
        <>
          <h2 className="section-title">دورات سابقة</h2>
          <div className="history-list">
            {history.map((h, i) => (
              <div key={h.index} className="history-row" style={{ '--i': i }}>
                <span className="history-index">دورة {h.index + 1}</span>
                <span className="history-date">{formatDate(h.officialStart)}</span>
                <div className="mini-dots">
                  {h.tasks.map((t) => (
                    <span key={t.key} className={`mini-dot ${t.done ? 'done' : ''}`} />
                  ))}
                </div>
                <span className={`phase-pill small phase-${h.allDone ? 'ready' : 'danger'}`}>
                  {h.allDone ? 'اتقفلت كويس' : 'فيها نواقص'}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
