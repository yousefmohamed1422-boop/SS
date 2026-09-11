import { CalendarClock, X, CircleCheck, RotateCcw, Trash2 } from 'lucide-react';
import { MEETING_STATUS } from '../utils/storage';

export default function MeetingDetailModal({ meeting, client, onClose, onChangeStatus, onDelete }) {
  const date = new Date(meeting.proposedAt).toLocaleDateString('ar-EG', {
    weekday: 'long', day: '2-digit', month: 'long',
  });
  const time = new Date(meeting.proposedAt).toLocaleTimeString('ar-EG', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="إغلاق">
          <X size={16} strokeWidth={2.4} />
        </button>
        <div className="modal-title">
          <span className="modal-icon"><CalendarClock size={18} strokeWidth={2.2} /></span>
          <h2>{meeting.title}</h2>
        </div>

        <p className="request-detail-meta">{client?.name || 'عميل محذوف'} · {date} · {time}</p>
        {meeting.notes && <p className="request-detail-text">{meeting.notes}</p>}

        <span className={`status-chip chip-meeting-${meeting.status} standalone`}>
          {MEETING_STATUS[meeting.status].label}
        </span>

        <div className="meeting-actions">
          <button
            type="button"
            className="btn confirm-btn"
            onClick={() => onChangeStatus(meeting.id, 'confirmed')}
            disabled={meeting.status === 'confirmed'}
          >
            <CircleCheck size={16} strokeWidth={2.3} />
            تأكيد الموعد
          </button>
          <button
            type="button"
            className="btn reschedule-btn"
            onClick={() => onChangeStatus(meeting.id, 'reschedule')}
            disabled={meeting.status === 'reschedule'}
          >
            <RotateCcw size={16} strokeWidth={2.3} />
            طلب إعادة توقيت
          </button>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn danger-outline" onClick={() => onDelete(meeting.id)}>
            <Trash2 size={15} strokeWidth={2.2} />
            حذف
          </button>
          <button type="button" className="btn ghost" onClick={onClose}>إغلاق</button>
        </div>
      </div>
    </div>
  );
}
