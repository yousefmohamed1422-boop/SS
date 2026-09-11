import { useState } from 'react';
import { Settings2, X } from 'lucide-react';
import { PLAN_ITEMS, getPlan } from '../utils/storage';

export default function PlanEditorModal({ client, onClose, onSave }) {
  const currentPlan = getPlan(client);
  const [values, setValues] = useState(() => {
    const v = {};
    PLAN_ITEMS.forEach((item) => {
      v[item.key] = { total: currentPlan[item.key].total, used: currentPlan[item.key].used };
    });
    return v;
  });

  function updateField(key, field, raw) {
    const num = Math.max(0, Number(raw) || 0);
    setValues((prev) => ({ ...prev, [key]: { ...prev[key], [field]: num } }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(client.id, values);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="إغلاق">
          <X size={16} strokeWidth={2.4} />
        </button>
        <div className="modal-title">
          <span className="modal-icon"><Settings2 size={18} strokeWidth={2.2} /></span>
          <h2>خطة {client.name}</h2>
        </div>

        {PLAN_ITEMS.map((item) => (
          <div className="plan-editor-row" key={item.key}>
            <span className="plan-editor-label">{item.label}</span>
            <div className="plan-editor-inputs">
              <label>
                المتعاقد عليه
                <input
                  type="number"
                  min="0"
                  value={values[item.key].total}
                  onChange={(e) => updateField(item.key, 'total', e.target.value)}
                />
              </label>
              <label>
                خلص
                <input
                  type="number"
                  min="0"
                  value={values[item.key].used}
                  onChange={(e) => updateField(item.key, 'used', e.target.value)}
                />
              </label>
            </div>
          </div>
        ))}

        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={onClose}>إلغاء</button>
          <button type="submit" className="btn primary">حفظ الخطة</button>
        </div>
      </form>
    </div>
  );
}
