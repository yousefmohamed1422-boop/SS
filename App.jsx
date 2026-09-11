import { useEffect, useMemo, useState } from 'react';
import { Plus, Users, LayoutDashboard, Rows3, ClipboardList } from 'lucide-react';
import logo from './assets/logo.png';
import Splash from './components/Splash';
import Overview from './components/Overview';
import StatusTabs from './components/StatusTabs';
import ClientCard from './components/ClientCard';
import ClientDetail from './components/ClientDetail';
import AddClientModal from './components/AddClientModal';
import EditClientModal from './components/EditClientModal';
import PlansPage from './components/PlansPage';
import {
  loadClients, saveClients, seedClients,
  loadBriefs, saveBriefs, seedBriefs,
  loadMeetings, saveMeetings, seedMeetings,
} from './utils/storage';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [clients, setClients] = useState(() => loadClients() ?? seedClients());
  const [briefs, setBriefs] = useState(() => loadBriefs() ?? seedBriefs(clients));
  const [meetings, setMeetings] = useState(() => loadMeetings() ?? seedMeetings(clients));

  const [view, setView] = useState('overview'); // overview | clients | plans
  const [tab, setTab] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [plansSub, setPlansSub] = useState('plans');

  const pendingBriefsCount = briefs.filter((b) => b.status !== 'done').length;
  const pendingMeetingsCount = meetings.filter((m) => m.status === 'pending').length;
  const pendingRequestsCount = pendingBriefsCount + pendingMeetingsCount;

  function goToPlans(sub) {
    setPlansSub(sub);
    setView('plans');
  }

  useEffect(() => { saveClients(clients); }, [clients]);
  useEffect(() => { saveBriefs(briefs); }, [briefs]);
  useEffect(() => { saveMeetings(meetings); }, [meetings]);

  const filtered = useMemo(
    () => (tab === 'all' ? clients : clients.filter((c) => c.status === tab)),
    [clients, tab]
  );

  const selected = clients.find((c) => c.id === selectedId);

  function goToTab(key) {
    setTab(key);
    setView('clients');
  }

  function openClient(id) {
    setSelectedId(id);
  }

  function addClient(client) {
    setClients((prev) => [client, ...prev]);
    setShowAdd(false);
    setSelectedId(client.id);
  }

  function toggleTask(clientId, cycleIndex, taskKey) {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        const cycles = { ...(c.cycles || {}) };
        const cyc = { ...(cycles[cycleIndex] || {}) };
        cyc[taskKey] = !cyc[taskKey];
        cycles[cycleIndex] = cyc;
        return { ...c, cycles };
      })
    );
  }

  function changeStatus(clientId, status) {
    setClients((prev) => prev.map((c) => (c.id === clientId ? { ...c, status } : c)));
  }

  function updateClient(clientId, updates) {
    setClients((prev) => prev.map((c) => (c.id === clientId ? { ...c, ...updates } : c)));
    setShowEdit(false);
  }

  function deleteClient(clientId) {
    if (!confirm('متأكد إنك عايز تحذف العميل ده؟')) return;
    setClients((prev) => prev.filter((c) => c.id !== clientId));
    setSelectedId(null);
  }

  // ---------- خطط العملاء ----------
  function bumpPlan(clientId, itemKey, delta) {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        const plan = { ...(c.plan || {}) };
        const item = { ...(plan[itemKey] || { total: 0, used: 0 }) };
        item.used = Math.max(0, Math.min(item.total, item.used + delta));
        plan[itemKey] = item;
        return { ...c, plan };
      })
    );
  }
  function savePlan(clientId, values) {
    setClients((prev) => prev.map((c) => (c.id === clientId ? { ...c, plan: values } : c)));
  }

  // ---------- البريفات ----------
  function addBrief(brief) { setBriefs((prev) => [brief, ...prev]); }
  function changeBriefStatus(id, status) {
    setBriefs((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  }
  function deleteBrief(id) { setBriefs((prev) => prev.filter((b) => b.id !== id)); }

  // ---------- الميتنجات ----------
  function addMeeting(meeting) { setMeetings((prev) => [meeting, ...prev]); }
  function changeMeetingStatus(id, status) {
    setMeetings((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  }
  function deleteMeeting(id) { setMeetings((prev) => prev.filter((m) => m.id !== id)); }

  return (
    <div className="app-shell">
      {showSplash && <Splash onDone={() => setShowSplash(false)} />}
      <header className="app-header">
        <div className="brand">
          <img src={logo} alt="شعار الشركة" className="brand-mark" />
          <div>
            <h1>غرفة تحكم العملاء</h1>
            <p>رحلة كل عميل، من التوقيع لحد التسليم</p>
          </div>
        </div>
        <button className="btn primary" onClick={() => setShowAdd(true)}>
          <Plus size={16} strokeWidth={2.6} />
          عميل جديد
        </button>
      </header>

      {!selected && (
        <nav className="main-nav">
          <button
            className={`main-nav-item ${view === 'overview' ? 'active' : ''}`}
            onClick={() => setView('overview')}
          >
            <LayoutDashboard size={16} strokeWidth={2.2} />
            الرئيسية
          </button>
          <button
            className={`main-nav-item ${view === 'clients' ? 'active' : ''}`}
            onClick={() => setView('clients')}
          >
            <Rows3 size={16} strokeWidth={2.2} />
            كل العملاء
          </button>
          <button
            className={`main-nav-item ${view === 'plans' ? 'active' : ''}`}
            onClick={() => setView('plans')}
          >
            <ClipboardList size={16} strokeWidth={2.2} />
            الخطط والطلبات
            {pendingRequestsCount > 0 && <span className="nav-badge">{pendingRequestsCount}</span>}
          </button>
        </nav>
      )}

      {!selected && view === 'overview' && (
        <Overview
          clients={clients}
          briefs={briefs}
          meetings={meetings}
          onGoToTab={goToTab}
          onOpenClient={openClient}
          onGoToRequests={goToPlans}
        />
      )}

      {!selected && view === 'clients' && (
        <>
          <StatusTabs clients={clients} active={tab} onChange={setTab} />

          {filtered.length === 0 ? (
            <div className="empty-state glass-panel">
              <Users size={28} strokeWidth={1.6} />
              <p>مفيش عملاء في القسم ده لسه.</p>
            </div>
          ) : (
            <div className="client-grid">
              {filtered.map((c, i) => (
                <ClientCard key={c.id} client={c} onOpen={openClient} index={i} />
              ))}
            </div>
          )}
        </>
      )}

      {!selected && view === 'plans' && (
        <PlansPage
          key={plansSub}
          initialSub={plansSub}
          clients={clients}
          briefs={briefs}
          meetings={meetings}
          onBumpPlan={bumpPlan}
          onSavePlan={savePlan}
          onAddBrief={addBrief}
          onChangeBriefStatus={changeBriefStatus}
          onDeleteBrief={deleteBrief}
          onAddMeeting={addMeeting}
          onChangeMeetingStatus={changeMeetingStatus}
          onDeleteMeeting={deleteMeeting}
        />
      )}

      {selected && (
        <ClientDetail
          client={selected}
          onBack={() => setSelectedId(null)}
          onToggleTask={toggleTask}
          onChangeStatus={changeStatus}
          onDelete={deleteClient}
          onEdit={() => setShowEdit(true)}
        />
      )}

      {showAdd && <AddClientModal onClose={() => setShowAdd(false)} onSave={addClient} />}
      {showEdit && selected && (
        <EditClientModal
          client={selected}
          onClose={() => setShowEdit(false)}
          onSave={updateClient}
        />
      )}
    </div>
  );
}
