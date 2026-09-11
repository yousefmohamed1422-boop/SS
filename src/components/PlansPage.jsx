import { useState } from 'react';
import { ClipboardList, FileText, CalendarClock, Plus, Palette, PenLine, Video as VideoIcon, Camera } from 'lucide-react';
import { PLAN_ITEMS, getPlan } from '../utils/storage';
import PlanCard from './PlanCard';
import PlanEditorModal from './PlanEditorModal';
import BriefCard from './BriefCard';
import AddBriefModal from './AddBriefModal';
import BriefDetailModal from './BriefDetailModal';
import MeetingCard from './MeetingCard';
import AddMeetingModal from './AddMeetingModal';
import MeetingDetailModal from './MeetingDetailModal';

const SUB_TABS = [
  { key: 'plans', label: 'خطط العملاء', icon: ClipboardList },
  { key: 'briefs', label: 'البريفات', icon: FileText },
  { key: 'meetings', label: 'الميتنجات', icon: CalendarClock },
];

export default function PlansPage({
  clients,
  briefs,
  meetings,
  initialSub,
  onBumpPlan,
  onSavePlan,
  onAddBrief,
  onChangeBriefStatus,
  onDeleteBrief,
  onAddMeeting,
  onChangeMeetingStatus,
  onDeleteMeeting,
}) {
  const [sub, setSub] = useState(initialSub || 'plans');
  const [editingPlanClient, setEditingPlanClient] = useState(null);
  const [showAddBrief, setShowAddBrief] = useState(false);
  const [openBrief, setOpenBrief] = useState(null);
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [openMeeting, setOpenMeeting] = useState(null);

  const activeClients = clients.filter((c) => c.status === 'active');
  const findClient = (id) => clients.find((c) => c.id === id);

  const PLAN_ICONS = { design: Palette, content: PenLine, video: VideoIcon, photoSession: Camera };
  const planStats = PLAN_ITEMS.map((item) => {
    let clientsRemaining = 0;
    let unitsRemaining = 0;
    activeClients.forEach((c) => {
      const { total, used } = getPlan(c)[item.key];
      const remaining = Math.max(0, total - used);
      if (remaining > 0) {
        clientsRemaining += 1;
        unitsRemaining += remaining;
      }
    });
    return { ...item, clientsRemaining, unitsRemaining };
  });

  return (
    <div className="plans-page">
      <nav className="sub-nav">
        {SUB_TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              className={`sub-nav-item ${sub === t.key ? 'active' : ''}`}
              onClick={() => setSub(t.key)}
            >
              <Icon size={15} strokeWidth={2.2} />
              {t.label}
            </button>
          );
        })}
      </nav>

      {sub === 'plans' && (
        <>
          <div className="plan-stats-row">
            {planStats.map((s) => {
              const Icon = PLAN_ICONS[s.key];
              return (
                <div className="plan-stat-card glass-panel" key={s.key}>
                  <span className="plan-stat-icon"><Icon size={17} strokeWidth={2.1} /></span>
                  <div>
                    <div className="plan-stat-number">
                      {s.clientsRemaining} <span>عميل</span>
                    </div>
                    <div className="plan-stat-label">لسه محتاج {s.label} ({s.unitsRemaining} {s.unit})</div>
                  </div>
                </div>
              );
            })}
          </div>

          {activeClients.length === 0 ? (
            <div className="empty-state glass-panel">
              <ClipboardList size={26} strokeWidth={1.6} />
              <p>مفيش عملاء نشطين لسه عشان تحطلهم خطة.</p>
            </div>
          ) : (
            <div className="plan-grid">
              {activeClients.map((c, i) => (
                <PlanCard
                  key={c.id}
                  client={c}
                  index={i}
                  onBump={onBumpPlan}
                  onEdit={setEditingPlanClient}
                />
              ))}
            </div>
          )}
        </>
      )}

      {sub === 'briefs' && (
        <>
          <div className="requests-toolbar">
            <button className="btn primary" onClick={() => setShowAddBrief(true)}>
              <Plus size={16} strokeWidth={2.6} />
              بريف جديد
            </button>
          </div>
          {briefs.length === 0 ? (
            <div className="empty-state glass-panel">
              <FileText size={26} strokeWidth={1.6} />
              <p>مفيش بريفات لسه.</p>
            </div>
          ) : (
            <div className="requests-list">
              {briefs.map((b, i) => (
                <BriefCard key={b.id} brief={b} client={findClient(b.clientId)} index={i} onOpen={setOpenBrief} />
              ))}
            </div>
          )}
        </>
      )}

      {sub === 'meetings' && (
        <>
          <div className="requests-toolbar">
            <button className="btn primary" onClick={() => setShowAddMeeting(true)}>
              <Plus size={16} strokeWidth={2.6} />
              طلب ميتنج
            </button>
          </div>
          {meetings.length === 0 ? (
            <div className="empty-state glass-panel">
              <CalendarClock size={26} strokeWidth={1.6} />
              <p>مفيش ميتنجات مطلوبة لسه.</p>
            </div>
          ) : (
            <div className="requests-list">
              {meetings.map((m, i) => (
                <MeetingCard key={m.id} meeting={m} client={findClient(m.clientId)} index={i} onOpen={setOpenMeeting} />
              ))}
            </div>
          )}
        </>
      )}

      {editingPlanClient && (
        <PlanEditorModal
          client={editingPlanClient}
          onClose={() => setEditingPlanClient(null)}
          onSave={(clientId, values) => {
            onSavePlan(clientId, values);
            setEditingPlanClient(null);
          }}
        />
      )}

      {showAddBrief && (
        <AddBriefModal
          clients={clients}
          onClose={() => setShowAddBrief(false)}
          onSave={(brief) => {
            onAddBrief(brief);
            setShowAddBrief(false);
          }}
        />
      )}
      {openBrief && (
        <BriefDetailModal
          brief={openBrief}
          client={findClient(openBrief.clientId)}
          onClose={() => setOpenBrief(null)}
          onChangeStatus={(id, status) => {
            onChangeBriefStatus(id, status);
            setOpenBrief((b) => (b ? { ...b, status } : b));
          }}
          onDelete={(id) => {
            onDeleteBrief(id);
            setOpenBrief(null);
          }}
        />
      )}

      {showAddMeeting && (
        <AddMeetingModal
          clients={clients}
          onClose={() => setShowAddMeeting(false)}
          onSave={(meeting) => {
            onAddMeeting(meeting);
            setShowAddMeeting(false);
          }}
        />
      )}
      {openMeeting && (
        <MeetingDetailModal
          meeting={openMeeting}
          client={findClient(openMeeting.clientId)}
          onClose={() => setOpenMeeting(null)}
          onChangeStatus={(id, status) => {
            onChangeMeetingStatus(id, status);
            setOpenMeeting((m) => (m ? { ...m, status } : m));
          }}
          onDelete={(id) => {
            onDeleteMeeting(id);
            setOpenMeeting(null);
          }}
        />
      )}
    </div>
  );
}
