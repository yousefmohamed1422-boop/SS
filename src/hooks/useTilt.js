import { useRef } from 'react';

// إحساس بطاقة ثري دي بسيطة: بتميل مع حركة الماوس وترجع مكانها لما تسيبها.
export function useTilt(maxTilt = 9) {
  const ref = useRef(null);

  function onMouseMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg) translateY(-3px) scale(1.015)`;
  }

  function onMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
  }

  return { ref, onMouseMove, onMouseLeave };
}
