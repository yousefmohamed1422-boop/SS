import { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import AvatarUploader from './AvatarUploader';

export default function AddClientModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [contractStart, setContractStart] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState('');
  const [avatar, setAvatar] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: crypto.randomUUID(),
      name: name.trim(),
      status: 'active',
      contractStart: new Date(contractStart).toISOString(),
      notes,
      avatar,
      cycles: {},
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="إغلاق">
          <X size={16} strokeWidth={2.4} />
        </button>
        <div className="modal-title">
          <span className="modal-icon"><UserPlus size={18} strokeWidth={2.2} /></span>
          <h2>عميل جديد</h2>
        </div>

        <AvatarUploader
          value={avatar}
          fallbackLetter={name.trim().charAt(0) || '؟'}
          status="active"
          onChange={setAvatar}
        />

        <label>
          اسم العميل
          <input value={name} onChange={(e) => setName(e.target.value)} autoFocus required />
        </label>

        <label>
          تاريخ توقيع العقد
          <input
            type="date"
            value={contractStart}
            onChange={(e) => setContractStart(e.target.value)}
            required
          />
        </label>

        <label>
          ملاحظات (اختياري)
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
        </label>

        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={onClose}>
            إلغاء
          </button>
          <button type="submit" className="btn primary">
            إضافة العميل
          </button>
        </div>
      </form>
    </div>
  );
}
