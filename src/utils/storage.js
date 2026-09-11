const KEY = 'ops-dashboard-clients-v1';
const BRIEFS_KEY = 'ops-dashboard-briefs-v1';
const MEETINGS_KEY = 'ops-dashboard-meetings-v1';

export function loadClients() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('تعذر تحميل البيانات المحفوظة', e);
    return null;
  }
}

export function saveClients(clients) {
  try {
    localStorage.setItem(KEY, JSON.stringify(clients));
  } catch (e) {
    console.error('تعذر حفظ البيانات', e);
  }
}

export function loadBriefs() {
  try {
    const raw = localStorage.getItem(BRIEFS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('تعذر تحميل البريفات', e);
    return null;
  }
}
export function saveBriefs(briefs) {
  try {
    localStorage.setItem(BRIEFS_KEY, JSON.stringify(briefs));
  } catch (e) {
    console.error('تعذر حفظ البريفات', e);
  }
}

export function loadMeetings() {
  try {
    const raw = localStorage.getItem(MEETINGS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('تعذر تحميل الميتنجات', e);
    return null;
  }
}
export function saveMeetings(meetings) {
  try {
    localStorage.setItem(MEETINGS_KEY, JSON.stringify(meetings));
  } catch (e) {
    console.error('تعذر حفظ الميتنجات', e);
  }
}

export const STATUS = {
  active: { key: 'active', label: 'نشط' },
  hold: { key: 'hold', label: 'معلّق' },
  refund: { key: 'refund', label: 'مسترد' },
  stopped: { key: 'stopped', label: 'متوقف' },
};

// ---------- خطة كل عميل: كام تصميم/محتوى/فيديو/جلسة تصوير متعاقد عليهم ----------
export const PLAN_ITEMS = [
  { key: 'design', label: 'تصميمات', unit: 'تصميم' },
  { key: 'content', label: 'محتوى كتابي', unit: 'محتوى' },
  { key: 'video', label: 'فيديوهات', unit: 'فيديو' },
  { key: 'photoSession', label: 'جلسات تصوير', unit: 'جلسة' },
];

export function defaultPlan() {
  return {
    design: { total: 0, used: 0 },
    content: { total: 0, used: 0 },
    video: { total: 0, used: 0 },
    photoSession: { total: 0, used: 0 },
  };
}

export function getPlan(client) {
  const plan = client.plan || {};
  const full = defaultPlan();
  PLAN_ITEMS.forEach((item) => {
    full[item.key] = { ...full[item.key], ...(plan[item.key] || {}) };
  });
  return full;
}

// ---------- البريف: تيم السيلز بيضيفه لتيم الماركتينج ----------
export const BRIEF_STATUS = {
  new: { key: 'new', label: 'جديد' },
  in_progress: { key: 'in_progress', label: 'قيد التنفيذ' },
  done: { key: 'done', label: 'خلص' },
};

// ---------- الميتنج: تيم السيلز بيطلب فيه حضور تيم الماركتينج ----------
export const MEETING_STATUS = {
  pending: { key: 'pending', label: 'بانتظار الرد' },
  confirmed: { key: 'confirmed', label: 'مؤكد' },
  reschedule: { key: 'reschedule', label: 'مطلوب تغيير الميعاد' },
};

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

export function seedClients() {
  return [
    {
      id: crypto.randomUUID(),
      name: 'مطاعم الأصايل',
      status: 'active',
      contractStart: daysAgo(37),
      notes: 'باقة سوشيال ميديا + إعلانات',
      cycles: { 0: { brief: true, strategy: true, content: true, design: true, video: true } },
      plan: {
        design: { total: 12, used: 5 },
        content: { total: 20, used: 9 },
        video: { total: 4, used: 1 },
        photoSession: { total: 1, used: 0 },
      },
    },
    {
      id: crypto.randomUUID(),
      name: 'كلينك د. سارة',
      status: 'active',
      contractStart: daysAgo(6),
      notes: 'باقة محتوى وتصميمات',
      cycles: {},
      plan: {
        design: { total: 8, used: 2 },
        content: { total: 12, used: 3 },
        video: { total: 0, used: 0 },
        photoSession: { total: 0, used: 0 },
      },
    },
    {
      id: crypto.randomUUID(),
      name: 'متجر لمسة',
      status: 'hold',
      contractStart: daysAgo(80),
      notes: 'العميل طلب إيقاف مؤقت',
      cycles: {},
      plan: defaultPlan(),
    },
  ];
}

export function seedBriefs(clients) {
  if (!clients.length) return [];
  return [
    {
      id: crypto.randomUUID(),
      clientId: clients[0].id,
      title: 'بريف كامبين رمضان',
      details: 'محتاجين محتوى وتصميمات لكامبين العروض، التركيز على الفيديوهات القصيرة.',
      status: 'in_progress',
      createdAt: daysAgo(2),
    },
  ];
}

export function seedMeetings(clients) {
  if (!clients.length) return [];
  return [
    {
      id: crypto.randomUUID(),
      clientId: clients[0].id,
      title: 'مناقشة استراتيجية الشهر الجديد',
      proposedAt: daysFromNow(2),
      notes: 'العميل عايز يراجع الخطة قبل ما نبدأ.',
      status: 'pending',
      createdAt: daysAgo(1),
    },
  ];
}
