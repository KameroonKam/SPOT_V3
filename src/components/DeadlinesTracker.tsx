import { Clock, FileText, BookOpen, Presentation, FlaskConical, AlertTriangle } from "lucide-react";
import { upcomingDeadlines, Deadline } from "@/data/mockData";

const typeIcons = {
  coursework: FileText,
  exam: BookOpen,
  presentation: Presentation,
  lab: FlaskConical,
};

const urgencyStyles = {
  critical: {
    badge: "bg-destructive/20 text-destructive border-destructive/30",
    dot: "status-dot bg-destructive animate-pulse",
    glow: "shadow-[0_0_12px_-2px_hsl(var(--destructive)/0.4)]",
  },
  soon: {
    badge: "bg-warning/20 text-warning border-warning/30",
    dot: "status-dot bg-warning",
    glow: "",
  },
  upcoming: {
    badge: "bg-muted text-muted-foreground border-border",
    dot: "status-dot bg-muted-foreground",
    glow: "",
  },
};

function getDaysUntil(dateString: string): number {
  const date = new Date(dateString);
  const today = new Date();
  const diff = date.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDaysUntil(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 0) return "Overdue";
  return `${days} days`;
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) +
    ", " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

interface DeadlineItemProps {
  deadline: Deadline;
  index: number;
  onClickDeadline?: (moduleId: string) => void;
}

function DeadlineItem({ deadline, index, onClickDeadline }: DeadlineItemProps) {
  const Icon = typeIcons[deadline.type];
  const styles = urgencyStyles[deadline.urgency];
  const daysUntil = getDaysUntil(deadline.dueDate);
  const daysText = formatDaysUntil(daysUntil);

  return (
    <div 
      className={`flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50 transition-all hover:bg-card/80 hover:border-primary/30 cursor-pointer opacity-0 animate-fade-up ${styles.glow}`}
      style={{ animationDelay: `${0.1 + index * 0.05}s` }}
      onClick={() => onClickDeadline?.(deadline.moduleId)}
    >
      <div className={styles.dot} />
      
      <div className="p-2 rounded-lg bg-secondary/50">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-medium text-sm truncate">{deadline.assessmentName}</span>
          <span className="text-xs text-muted-foreground">{deadline.weight}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-primary">{deadline.moduleCode}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground truncate">{deadline.moduleName}</span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className={`text-sm font-semibold ${
          deadline.urgency === 'critical' ? 'text-destructive' : 
          deadline.urgency === 'soon' ? 'text-warning' : 'text-foreground'
        }`}>
          {daysText}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDateTime(deadline.dueDate)}
        </p>
      </div>
    </div>
  );
}

interface DeadlinesTrackerProps {
  onNavigateToModule?: (moduleId: string) => void;
}

export function DeadlinesTracker({ onNavigateToModule }: DeadlinesTrackerProps) {
  const criticalCount = upcomingDeadlines.filter(d => d.urgency === 'critical').length;

  return (
    <section className="glass-card p-6 opacity-0 animate-fade-up stagger-2">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Upcoming Deadlines</h2>
            <p className="text-sm text-muted-foreground">{upcomingDeadlines.length} assessments due</p>
          </div>
        </div>
        {criticalCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
            <span className="text-xs font-medium text-destructive">
              {criticalCount} urgent
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {upcomingDeadlines.slice(0, 5).map((deadline, index) => (
          <DeadlineItem key={deadline.id} deadline={deadline} index={index} onClickDeadline={onNavigateToModule} />
        ))}
      </div>

      {upcomingDeadlines.length > 5 && (
        <button className="w-full mt-4 py-2.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View all {upcomingDeadlines.length} deadlines
        </button>
      )}
    </section>
  );
}
