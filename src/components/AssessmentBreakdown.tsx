import { modules } from "@/data/mockData";
import { FileText, BookOpen, Presentation, FlaskConical, CheckCircle2, Clock, CalendarClock } from "lucide-react";

const typeIcons = {
  coursework: FileText,
  exam: BookOpen,
  presentation: Presentation,
  lab: FlaskConical,
};

const typeColors: Record<string, string> = {
  coursework: "hsl(250 85% 65%)",
  exam: "hsl(200 90% 55%)",
  presentation: "hsl(160 84% 39%)",
  lab: "hsl(38 92% 50%)",
};

export function AssessmentBreakdown() {
  const allAssessments = modules.flatMap(m => m.assessments);

  const typeCounts = allAssessments.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const completed = allAssessments.filter(a => a.status === 'completed').length;
  const inProgress = allAssessments.filter(a => a.status === 'in-progress').length;
  const upcoming = allAssessments.filter(a => a.status === 'upcoming').length;
  const total = allAssessments.length;

  const formativeCount = allAssessments.filter(a => a.isFormative).length;
  const summativeCount = total - formativeCount;

  return (
    <section className="glass-card p-6 opacity-0 animate-fade-up stagger-3">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Assessment Overview</h2>
        <p className="text-sm text-muted-foreground">{total} assessments across {modules.length} modules</p>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>{completed} of {total} completed</span>
          <span>{Math.round((completed / total) * 100)}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden flex">
          <div
            className="h-full bg-[hsl(var(--success))] transition-all duration-500"
            style={{ width: `${(completed / total) * 100}%` }}
          />
          <div
            className="h-full bg-[hsl(var(--warning))] transition-all duration-500"
            style={{ width: `${(inProgress / total) * 100}%` }}
          />
        </div>
        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-[hsl(var(--success))]" /> {completed} Done
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-[hsl(var(--warning))]" /> {inProgress} Active
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarClock className="w-3 h-3" /> {upcoming} Upcoming
          </span>
        </div>
      </div>

      {/* Type breakdown - inline */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(typeCounts).map(([type, count]) => {
          const Icon = typeIcons[type as keyof typeof typeIcons];
          return (
            <div
              key={type}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-secondary/50 text-sm"
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: typeColors[type] }} />
              <Icon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="capitalize">{type}</span>
              <span className="text-muted-foreground">({count})</span>
            </div>
          );
        })}
      </div>

      {/* Formative vs Summative */}
      <div className="flex gap-3">
        <div className="flex-1 p-3 rounded-lg bg-secondary/50 text-center">
          <p className="text-lg font-bold">{summativeCount}</p>
          <p className="text-xs text-muted-foreground">Summative</p>
        </div>
        <div className="flex-1 p-3 rounded-lg bg-[hsl(var(--info)/0.1)] border border-[hsl(var(--info)/0.2)] text-center">
          <p className="text-lg font-bold text-[hsl(var(--info))]">{formativeCount}</p>
          <p className="text-xs text-[hsl(var(--info))]">Formative</p>
        </div>
      </div>
    </section>
  );
}
