import { useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { resizeImageFile } from '../utils/image';

export default function AvatarUploader({ value, fallbackLetter, status, onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await resizeImageFile(file, 200);
      onChange(dataUrl);
    } catch (err) {
      console.error(err);
      alert('تعذر رفع الصورة، جربي صورة تانية');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  }

  return (
    <div className="avatar-uploader">
      <div className={`client-avatar large avatar-${status || 'active'}`}>
        {value ? <img src={value} alt="صورة العميل" /> : fallbackLetter}
      </div>
      <div className="avatar-uploader-actions">
        <button
          type="button"
          className="btn ghost small"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          <Camera size={14} strokeWidth={2.2} />
          {busy ? 'جاري الرفع...' : value ? 'تغيير الصورة' : 'إضافة صورة'}
        </button>
        {value && (
          <button type="button" className="btn ghost small" onClick={() => onChange(null)}>
            <X size={14} strokeWidth={2.2} />
            إزالة
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: 'none' }}
      />
    </div>
  );
}
