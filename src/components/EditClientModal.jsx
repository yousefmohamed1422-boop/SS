import { useState } from 'react';
import { Pencil, X } from 'lucide-react';
import AvatarUploader from './AvatarUploader';
import StatusDropdown from './StatusDropdown';

export default function EditClientModal({ client, onClose, onSave }) {
  const [name, setName] = useState(client.name);
  const [contractStart, setContractStart] = useState(
    new Date(client.contractStart).toISOString().slice(0, 10)
  );
  const [status, setStatus] = useState(client.status);
  const [notes, setNotes] = useState(client.notes || '');
  const [avatar, setAvatar] = useState(client.avatar || null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(client.id, {
      name: name.trim(),
      contractStart: new Date(contractStart).toISOString(),
      status,
      notes,
      avatar,
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="إغلاق">
          <X size={16} strokeWidth={2.4} />
        </button>
        <div className="modal-title">
          <span className="modal-icon"><Pencil size={18} strokeWidth={2.2} /></span>
          <h2>تعديل بيانات العميل</h2>
        </div>

        <AvatarUploader
          value={avatar}
          fallbackLetter={name.trim().charAt(0) || '?'}
          status={status}
          onChange={setAvatar}
        />

        <label>
          اسم العميل
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label>
          تاريخ توقيع العقد
          <input
            type="date"
            value={contractStart}
            onChange={(e) => setContractStart(e.target.value)}
            required
          />
          <span className="field-hint">تغيير التاريخ ده هيعيد حساب كل دورات العميل من جديد.</span>
        </label>

        <label>
          حالة العميل
          <StatusDropdown value={status} onChange={setStatus} />
        </label>

        <label>
          ملاحظات
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
        </label>

        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={onClose}>
            إلغاء
          </button>
          <button type="submit" className="btn primary">
            حفظ التعديلات
          </button>
        </div>
      </form>
    </div>
  );
}
