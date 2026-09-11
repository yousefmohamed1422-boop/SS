import { useEffect, useRef, useState } from 'react';
import { CircleCheck, PauseCircle, RotateCcw, CircleSlash, ChevronDown } from 'lucide-react';
import { STATUS } from '../utils/storage';

const ICONS = {
  active: CircleCheck,
  hold: PauseCircle,
  refund: RotateCcw,
  stopped: CircleSlash,
};

export default function StatusDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const CurrentIcon = ICONS[value];

  return (
    <div className="dropdown" ref={ref}>
      <button
        type="button"
        className={`dropdown-trigger chip-${value}`}
        onClick={() => setOpen((o) => !o)}
      >
        <CurrentIcon size={15} strokeWidth={2.3} />
        {STATUS[value].label}
        <ChevronDown size={14} strokeWidth={2.4} className={`chevron ${open ? 'open' : ''}`} />
      </button>

      {open && (
        <div className="dropdown-panel">
          {Object.values(STATUS).map((s) => {
            const Icon = ICONS[s.key];
            return (
              <button
                type="button"
                key={s.key}
                className={`dropdown-option ${value === s.key ? 'selected' : ''}`}
                onClick={() => {
                  onChange(s.key);
                  setOpen(false);
                }}
              >
                <Icon size={15} strokeWidth={2.2} />
                {s.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
