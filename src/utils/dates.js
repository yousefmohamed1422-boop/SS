// كل حسابات "الرحلة" الخاصة بالعميل بتترجم للقاعدة اللي شرحتها:
// - أول تعاقد: العشر ايام تحضير بتبدأ من يوم التعاقد نفسه، وبتنتهي بعد 10 ايام (أول يوم شغل رسمي)
// - كل شهر بعد كدا: العشر ايام التحضيرية بتبدأ يوم 20 من الشهر الشغال حاليا (يعني قبل نهايته بـ10 ايام)
//   عشان لما الشهر يخلص يكون الشغل الجديد جاهز من غير عطلة.
//
// الصيغة العامة اللي بتلخص القاعدتين مع بعض:
//   officialStart(n) = contractStart + 10 + 30*n
//   prepStart(n)      = officialStart(n) - 10
// (بالنسبة للدورة صفر: prepStart(0) = contractStart بالظبط، وده بيطابق حالة التعاقد الأول)

export const DAY_MS = 24 * 60 * 60 * 1000;

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function diffInDays(a, b) {
  return Math.round((startOfDay(a) - startOfDay(b)) / DAY_MS);
}

export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('ar-EG', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// خطوات الرحلة الافتراضية لكل دورة (الـ 10 ايام)
export const DEFAULT_TASKS = [
  { key: 'brief', label: 'الاجتماع والبريف' },
  { key: 'strategy', label: 'الاستراتيجية' },
  { key: 'content', label: 'المحتوى' },
  { key: 'design', label: 'التصميمات' },
  { key: 'video', label: 'الفيديوهات' },
];

export function officialStartOf(contractStart, n) {
  return addDays(contractStart, 10 + 30 * n);
}

export function prepStartOf(contractStart, n) {
  return addDays(officialStartOf(contractStart, n), -10);
}

// بيحدد رقم الدورة الحالية (n) بناء على تاريخ النهاردة
export function currentCycleIndex(contractStart, today = new Date()) {
  let n = 0;
  while (startOfDay(prepStartOf(contractStart, n + 1)) <= startOfDay(today)) {
    n += 1;
  }
  return Math.max(n, 0);
}

// بيبني بيانات دورة واحدة كاملة: تواريخها، حالتها، وهل فيها خطر
export function buildCycle(client, index, today = new Date()) {
  const contractStart = new Date(client.contractStart);
  const prepStart = prepStartOf(contractStart, index);
  const officialStart = officialStartOf(contractStart, index);
  const savedTasks = (client.cycles && client.cycles[index]) || {};
  const tasks = DEFAULT_TASKS.map((t) => ({
    ...t,
    done: !!savedTasks[t.key],
  }));
  const allDone = tasks.every((t) => t.done);
  const daysLeft = diffInDays(officialStart, today); // موجب = لسه فاضل، سالب = فات الميعاد
  const started = startOfDay(today) >= startOfDay(prepStart);
  const overdue = started && daysLeft < 0 && !allDone;
  const dueSoon = started && daysLeft >= 0 && daysLeft <= 2 && !allDone;

  let phase = 'upcoming';
  if (started && !allDone && startOfDay(today) < startOfDay(officialStart)) phase = 'prep';
  else if (started && allDone) phase = 'ready';
  else if (overdue) phase = 'danger';
  else if (started) phase = 'prep';

  return {
    index,
    prepStart,
    officialStart,
    tasks,
    allDone,
    daysLeft,
    overdue,
    dueSoon,
    phase,
  };
}

export function currentCycle(client, today = new Date()) {
  const idx = currentCycleIndex(new Date(client.contractStart), today);
  return buildCycle(client, idx, today);
}

export function allPastCycles(client, today = new Date()) {
  const idx = currentCycleIndex(new Date(client.contractStart), today);
  const list = [];
  for (let i = idx - 1; i >= 0; i -= 1) {
    list.push(buildCycle(client, i, today));
  }
  return list;
}
