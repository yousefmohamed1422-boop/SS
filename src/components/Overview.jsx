import { Users, CircleCheck, PauseCircle, RotateCcw, CircleSlash, TriangleAlert, ArrowLeft, FileText, CalendarClock } from 'lucide-react';
import { currentCycle, formatDate } from '../utils/dates';
import { STATUS } from '../utils/storage';
import { useTilt } from '../hooks/useTilt';

const STAT_DEFS = [
  { key: 'all', label: 'كل العملاء', icon: Users, glow: 'brand' },
  { key: 'active', label: STATUS.active.label, icon: CircleCheck, glow: 'success' },
  { key: 'hold', label: STATUS.hold.label, icon: PauseCircle, glow: 'gold' },
  { key: 'refund', label: STATUS.refund.label, icon: RotateCcw, glow: 'danger' },
  { key: 'stopped', label: STATUS.stopped.label, icon: CircleSlash, glow: 'mute' },
];

function StatCard({ def, count, index, onClick }) {
  const Icon = def.icon;
  const tilt = useTilt(10);
  return (
    <button
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className={`stat-card glow-${def.glow}`}
      style={{ '--i': index }}
      onClick={onClick}
    >
      <span className="glow-icon">
        <Icon size={22} strokeWidth={2.1} />
      </span>
      <span className="stat-number">{count}</span>
      <span className="stat-label">{def.label}</span>
    </button>
  );
}

function AttentionRow({ client, cycle, index, onClick }) {
  const tilt = useTilt(5);
  return (
    <button
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="attention-row glass-panel"
      style={{ '--i': index }}
      onClick={onClick}
    >
      <span className="client-avatar avatar-active">
        {client.avatar ? <img src={client.avatar} alt={client.name} /> : client.name.charAt(0)}
      </span>
      <div className="attention-info">
        <strong>{client.name}</strong>
        <span>موعد التسليم كان {formatDate(cycle.officialStart)}</span>
      </div>
      <span className="phase-pill phase-danger small">
        <TriangleAlert size={13} strokeWidth={2.3} />
        متأخر {Math.abs(cycle.daysLeft)} يوم
      </span>
    </button>
  );
}

function RequestRow({ icon: Icon, title, meta, badge, index, onClick }) {
  return (
    <button className="request-card glass-panel" style={{ '--i': index }} onClick={onClick}>
      <span className="request-icon"><Icon size={17} strokeWidth={2.1} /></span>
      <div className="request-body">
        <strong>{title}</strong>
        <span className="request-meta">{meta}</span>
      </div>
      {badge}
    </button>
  );
}

export default function Overview({ clients, briefs = [], meetings = [], onGoToTab, onOpenClient, onGoToRequests }) {
  const counts = { all: clients.length };
  Object.keys(STATUS).forEach((k) => {
    counts[k] = clients.filter((c) => c.status === k).length;
  });

  const attention = clients
    .filter((c) => c.status === 'active')
    .map((c) => ({ client: c, cycle: currentCycle(c) }))
    .filter((x) => x.cycle.phase === 'danger');

  const pendingBriefs = briefs.filter((b) => b.status !== 'done');
  const pendingMeetings = meetings.filter((m) => m.status === 'pending');
  const findClient = (id) => clients.find((c) => c.id === id);

  const today = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

  return (
    <div className="overview">
      <div className="overview-hero glass-panel">
        <div>
          <span className="eyebrow">نظرة عامة · {today}</span>
          <h2>إزيك، دي حالة عملاءك دلوقتي</h2>
          <p>
            {attention.length > 0
              ? `فيه ${attention.length} عميل محتاج انتباه دلوقتي — شايفهم تحت.`
              : 'كل عملاءك النشطين ماشيين في معادهم، مفيش أي حاجة متأخرة حاليًا.'}
          </p>
        </div>
        <button className="btn primary" onClick={() => onGoToTab('all')}>
          كل العملاء
          <ArrowLeft size={16} strokeWidth={2.4} />
        </button>
      </div>

      <div className="stat-grid">
        {STAT_DEFS.map((s, i) => (
          <StatCard
            key={s.key}
            def={s}
            count={counts[s.key] ?? 0}
            index={i}
            onClick={() => onGoToTab(s.key)}
          />
        ))}
      </div>

      <h2 className="section-title">
        <TriangleAlert size={14} strokeWidth={2.4} />
        محتاجين انتباه دلوقتي
      </h2>

      {attention.length === 0 ? (
        <div className="empty-state glass-panel">
          <CircleCheck size={26} strokeWidth={1.6} />
          <p>مفيش حد متأخر عن معاده — كله تمام.</p>
        </div>
      ) : (
        <div className="attention-list">
          {attention.map(({ client, cycle }, i) => (
            <AttentionRow
              key={client.id}
              client={client}
              cycle={cycle}
              index={i}
              onClick={() => onOpenClient(client.id)}
            />
          ))}
        </div>
      )}
      {(pendingBriefs.length > 0 || pendingMeetings.length > 0) && (
        <>
          <h2 className="section-title">
            <FileText size={14} strokeWidth={2.4} />
            طلبات محتاجة ردّك ({pendingBriefs.length + pendingMeetings.length})
          </h2>
          <div className="attention-list">
            {pendingBriefs.map((b, i) => (
              <RequestRow
                key={b.id}
                icon={FileText}
                title={b.title}
                meta={findClient(b.clientId)?.name || 'عميل محذوف'}
                index={i}
                badge={<span className={`status-chip chip-brief-${b.status}`}>بريف</span>}
                onClick={() => onGoToRequests('briefs')}
              />
            ))}
            {pendingMeetings.map((m, i) => (
              <RequestRow
                key={m.id}
                icon={CalendarClock}
                title={m.title}
                meta={findClient(m.clientId)?.name || 'عميل محذوف'}
                index={pendingBriefs.length + i}
                badge={<span className="status-chip chip-meeting-pending">ميتنج</span>}
                onClick={() => onGoToRequests('meetings')}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
