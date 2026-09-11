import { MessageSquare, Target, PenLine, Palette, Video as VideoIcon, TriangleAlert, Sparkles, Clock } from 'lucide-react';
import { formatDate } from '../utils/dates';

const TASK_ICON = {
  brief: MessageSquare,
  strategy: Target,
  content: PenLine,
  design: Palette,
  video: VideoIcon,
};

const PHASE_LABEL = {
  upcoming: 'لسه هيبدأ',
  prep: 'جاري التحضير',
  ready: 'جاهز',
  danger: 'متأخر',
};

const PHASE_ICON = {
  upcoming: Clock,
  prep: Clock,
  ready: Sparkles,
  danger: TriangleAlert,
};

export default function Timeline({ cycle, onToggleTask, readOnly }) {
  const { tasks, phase, daysLeft, prepStart, officialStart } = cycle;
  const PhaseIcon = PHASE_ICON[phase];

  return (
    <div className="timeline-card">
      <div className="timeline-head">
        <div>
          <span className={`phase-pill phase-${phase}`}>
            <PhaseIcon size={14} strokeWidth={2.3} />
            {PHASE_LABEL[phase]}
          </span>
          <span className="timeline-dates">
            {formatDate(prepStart)} ← بداية التحضير &nbsp;·&nbsp; موعد التسليم → {formatDate(officialStart)}
          </span>
        </div>
        <div className="countdown">
          <span className="countdown-number">{Math.abs(daysLeft)}</span>
          <span className="countdown-label">{daysLeft >= 0 ? 'يوم متبقي' : 'يوم تأخير'}</span>
        </div>
      </div>

      <div
        className="t-grid"
        style={{ gridTemplateColumns: `repeat(${tasks.length}, 1fr)` }}
      >
        {tasks.map((t, i) => {
          const top = i % 2 === 0;
          const danger = phase === 'danger' && !t.done;
          return (
            <div className="t-col" key={t.key} style={{ gridColumn: i + 1 }}>
              <div className={`t-slot t-slot-top ${top ? 'active' : ''}`}>
                {top && (
                  <TaskNode task={t} danger={danger} readOnly={readOnly} onToggle={onToggleTask} />
                )}
              </div>
              <div className={`t-bar ${t.done ? 'done' : ''} ${danger ? 'danger' : ''}`} />
              <div className={`t-slot t-slot-bottom ${!top ? 'active' : ''}`}>
                {!top && (
                  <TaskNode task={t} danger={danger} readOnly={readOnly} onToggle={onToggleTask} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TaskNode({ task, danger, readOnly, onToggle }) {
  const Icon = TASK_ICON[task.key] ?? Target;
  return (
    <div className="t-node-wrap">
      <div className="t-stem" />
      <button
        type="button"
        className={`t-node ${task.done ? 'done' : ''} ${danger ? 'danger' : ''}`}
        disabled={readOnly}
        onClick={() => onToggle(task.key)}
        title={task.done ? 'اعتبرها مش خالصة' : 'اعتبرها خالصة'}
      >
        <Icon size={18} strokeWidth={2.2} />
      </button>
      <span className="t-label">{task.label}</span>
    </div>
  );
}
