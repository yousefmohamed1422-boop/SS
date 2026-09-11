import { useState } from 'react';
import { CalendarClock, X } from 'lucide-react';

function defaultDateTime() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(13, 0, 0, 0);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AddMeetingModal({ clients, onClose, onSave }) {
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [title, setTitle] = useState('');
  const [proposedAt, setProposedAt] = useState(defaultDateTime());
  const [notes, setNotes] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!clientId || !title.trim()) return;
    onSave({
      id: crypto.randomUUID(),
      clientId,
      title: title.trim(),
      proposedAt: new Date(proposedAt).toISOString(),
      notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="إغلاق">
          <X size={16} strokeWidth={2.4} />
        </button>
        <div className="modal-title">
          <span className="modal-icon"><CalendarClock size={18} strokeWidth={2.2} /></span>
          <h2>طلب حضور ميتنج</h2>
        </div>

        <label>
          العميل
          <select value={clientId} onChange={(e) => setClientId(e.target.value)} required className="plain-select">
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        <label>
          عنوان الميتنج
          <input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus required placeholder="مثلاً: مراجعة الخطة الشهرية" />
        </label>

        <label>
          الميعاد المقترح
          <input type="datetime-local" value={proposedAt} onChange={(e) => setProposedAt(e.target.value)} required />
        </label>

        <label>
          ملاحظات (اختياري)
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
        </label>

        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={onClose}>إلغاء</button>
          <button type="submit" className="btn primary">إرسال الطلب</button>
        </div>
      </form>
    </div>
  );
}
