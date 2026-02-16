import { BookOpen, FileText, Presentation, FlaskConical } from "lucide-react";
import { Module, Assessment } from "@/data/mockData";

const typeIcons = {
  coursework: FileText,
  exam: BookOpen,
  presentation: Presentation,
  lab: FlaskConical,
};

const statusColors = {
  completed: "bg-success/20 text-success",
  "in-progress": "bg-warning/20 text-warning",
  upcoming: "bg-muted text-muted-foreground",
};

function semesterLabel(sem: 1 | 2 | "full"): string {
  if (sem === "full") return "Full Year";
  return `Sem ${sem}`;
}

function AssessmentItem({ assessment }: { assessment: Assessment }) {
  const Icon = typeIcons[assessment.type];
  
  return (
    <div className="flex items-center gap-3 py-2">
      <div className={`p-1.5 rounded ${statusColors[assessment.status]}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{assessment.name}</span>
          {assessment.isFormative && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-info/20 text-info">Formative</span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">{assessment.weight}% weight</span>
      </div>
      <div className="text-right">
        {assessment.grade !== null ? (
          <span className="text-sm font-semibold">{assessment.grade}%</span>
        ) : (
          <span className="text-xs text-muted-foreground">
            {assessment.status === 'upcoming' && assessment.dueDate 
              ? new Date(assessment.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
              : 'Pending'}
          </span>
        )}
      </div>
    </div>
  );
}

export function ModuleCard({ module, delay }: { module: Module; delay: string }) {
  const completedWeight = module.assessments
    .filter(a => a.status === 'completed' && !a.isFormative)
    .reduce((sum, a) => sum + a.weight, 0);

  return (
    <div className={`glass-card-hover p-5 opacity-0 animate-fade-up ${delay}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
              {module.code}
            </span>
            <span className="text-xs text-muted-foreground">{semesterLabel(module.semester)}</span>
          </div>
          <h3 className="font-semibold">{module.name}</h3>
          <p className="text-sm text-muted-foreground">{module.credits} credits</p>
        </div>
        <div className="text-right">
          {module.currentGrade !== null ? (
            <>
              <p className="text-2xl font-bold gradient-text">{module.currentGrade}%</p>
              <p className="text-xs text-muted-foreground">Current grade</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No grades yet</p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">Assessment progress</span>
          <span className="font-medium">{completedWeight}% complete</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${completedWeight}%` }}
          />
        </div>
      </div>

      {/* Assessments */}
      <div className="border-t border-border/50 pt-3 space-y-1">
        {module.assessments.map(assessment => (
          <AssessmentItem key={assessment.id} assessment={assessment} />
        ))}
      </div>
    </div>
  );
}
