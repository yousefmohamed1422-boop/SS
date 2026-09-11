import { FileText } from 'lucide-react';
import { BRIEF_STATUS } from '../utils/storage';

export default function BriefCard({ brief, client, index = 0, onOpen }) {
  return (
    <button className="request-card glass-panel" style={{ '--i': index }} onClick={() => onOpen(brief)}>
      <span className="request-icon"><FileText size={17} strokeWidth={2.1} /></span>
      <div className="request-body">
        <strong>{brief.title}</strong>
        <span className="request-meta">{client?.name || 'عميل محذوف'}</span>
      </div>
      <span className={`status-chip chip-brief-${brief.status}`}>{BRIEF_STATUS[brief.status].label}</span>
    </button>
  );
}
