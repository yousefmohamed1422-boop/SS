import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

export default function Splash({ onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const leaveTimer = setTimeout(() => setLeaving(true), 1900);
    const doneTimer = setTimeout(() => onDone(), 2450);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div className={`splash ${leaving ? 'leaving' : ''}`}>
      <div className="splash-stage">
        <div className="splash-ring" />
        <div className="splash-card">
          <img src={logo} alt="شعار الشركة" />
        </div>
      </div>
      <p className="splash-text">غرفة تحكم العملاء</p>
    </div>
  );
}
