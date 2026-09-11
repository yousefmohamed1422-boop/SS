import { CalendarClock } from 'lucide-react';
import { MEETING_STATUS } from '../utils/storage';

export default function MeetingCard({ meeting, client, index = 0, onOpen }) {
  const date = new Date(meeting.proposedAt).toLocaleDateString('ar-EG', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
  });
  return (
    <button className="request-card glass-panel" style={{ '--i': index }} onClick={() => onOpen(meeting)}>
      <span className="request-icon"><CalendarClock size={17} strokeWidth={2.1} /></span>
      <div className="request-body">
        <strong>{meeting.title}</strong>
        <span className="request-meta">{client?.name || 'عميل محذوف'} · {date}</span>
      </div>
      <span className={`status-chip chip-meeting-${meeting.status}`}>{MEETING_STATUS[meeting.status].label}</span>
    </button>
  );
}
