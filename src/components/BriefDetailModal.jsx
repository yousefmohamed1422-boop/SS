import { FileText, X, Trash2 } from 'lucide-react';
import { BRIEF_STATUS } from '../utils/storage';

export default function BriefDetailModal({ brief, client, onClose, onChangeStatus, onDelete }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="إغلاق">
          <X size={16} strokeWidth={2.4} />
        </button>
        <div className="modal-title">
          <span className="modal-icon"><FileText size={18} strokeWidth={2.2} /></span>
          <h2>{brief.title}</h2>
        </div>

        <p className="request-detail-meta">
          {client?.name || 'عميل محذوف'} · أُضيف {new Date(brief.createdAt).toLocaleDateString('ar-EG')}
        </p>

        {brief.details && <p className="request-detail-text">{brief.details}</p>}

        <div className="status-switch">
          {Object.values(BRIEF_STATUS).map((s) => (
            <button
              key={s.key}
              className={`status-switch-btn ${brief.status === s.key ? 'active' : ''}`}
              onClick={() => onChangeStatus(brief.id, s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn danger-outline" onClick={() => onDelete(brief.id)}>
            <Trash2 size={15} strokeWidth={2.2} />
            حذف البريف
          </button>
          <button type="button" className="btn primary" onClick={onClose}>تم</button>
        </div>
      </div>
    </div>
  );
}
