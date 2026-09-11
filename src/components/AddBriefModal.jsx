import { useState } from 'react';
import { FileText, X } from 'lucide-react';

export default function AddBriefModal({ clients, onClose, onSave }) {
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!clientId || !title.trim()) return;
    onSave({
      id: crypto.randomUUID(),
      clientId,
      title: title.trim(),
      details,
      status: 'new',
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
          <span className="modal-icon"><FileText size={18} strokeWidth={2.2} /></span>
          <h2>بريف جديد لتيم الماركتينج</h2>
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
          عنوان البريف
          <input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus required />
        </label>

        <label>
          تفاصيل البريف
          <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={4} placeholder="المطلوب إيه بالظبط، الديدلاين، أي ملاحظات من العميل..." />
        </label>

        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={onClose}>إلغاء</button>
          <button type="submit" className="btn primary">إرسال البريف</button>
        </div>
      </form>
    </div>
  );
}
