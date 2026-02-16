import { useState } from "react";
import { Info, ChevronRight, GitBranch, MessageSquare, TrendingUp } from "lucide-react";
import { modules, modulePerformanceData } from "@/data/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";

type ViewMode = "all" | string;
type FilterMode = "all" | "formative" | "summative";
type SemesterFilter = "all" | "1" | "2";

function semesterLabel(sem: 1 | 2 | "full"): string {
  if (sem === "full") return "Full Year";
  return `Semester ${sem}`;
}

const semesterFilters: { value: SemesterFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "1", label: "Sem 1" },
  { value: "2", label: "Sem 2" },
];

function calculateModuleStats(module: typeof modules[0]) {
  const cwAssessments = module.assessments.filter(a => a.type === 'coursework' || a.type === 'lab' || a.type === 'presentation');
  const examAssessments = module.assessments.filter(a => a.type === 'exam');

  const cwWeight = cwAssessments.reduce((sum, a) => sum + a.weight, 0);
  const examWeight = examAssessments.reduce((sum, a) => sum + a.weight, 0);

  const completedCw = cwAssessments.filter(a => a.grade !== null);
  const completedExam = examAssessments.filter(a => a.grade !== null);

  const cwPercentage = completedCw.length > 0
    ? completedCw.reduce((sum, a) => sum + (a.grade || 0) * (a.weight / cwWeight), 0) * (cwWeight / 100)
    : 0;

  const examPercentage = completedExam.length > 0
    ? completedExam.reduce((sum, a) => sum + (a.grade || 0) * (a.weight / examWeight), 0) * (examWeight / 100)
    : 0;

  return {
    cwWeight,
    examWeight,
    cwPercentage: Math.round(cwPercentage * 100) / 100,
    examPercentage: Math.round(examPercentage * 100) / 100,
    unitMark: module.currentGrade,
  };
}

function getGradeClassification(grade: number): { label: string; className: string } {
  if (grade >= 70) return { label: "1st", className: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30" };
  if (grade >= 60) return { label: "2:1", className: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30" };
  if (grade >= 50) return { label: "2:2", className: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30" };
  if (grade >= 40) return { label: "3rd", className: "bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30" };
  return { label: "Fail", className: "bg-destructive/20 text-destructive border border-destructive/30" };
}

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) +
    ", " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  "in-progress": "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  upcoming: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
};

const gradeLegend = [
  { label: "1st (≥70)", className: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" },
  { label: "2:1 (60–69)", className: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30" },
  { label: "2:2 (50–59)", className: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30" },
  { label: "3rd (40–49)", className: "bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30" },
  { label: "Fail (<40)", className: "bg-destructive/20 text-destructive border-destructive/30" },
];

interface ModuleGradesTableProps {
  onNavigateToModule?: (moduleId: string) => void;
  externalActiveView?: string | null;
}

export function ModuleGradesTable({ onNavigateToModule, externalActiveView }: ModuleGradesTableProps) {
  const [internalView, setInternalView] = useState<ViewMode>("all");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [feedbackModal, setFeedbackModal] = useState<{ name: string; feedback: string } | null>(null);
  const [showTrend, setShowTrend] = useState<string | null>(null);
  const [semFilter, setSemFilter] = useState<SemesterFilter>("all");

  // Allow external navigation to override internal state
  const activeView = externalActiveView ?? internalView;
  const setActiveView = (v: ViewMode) => {
    setInternalView(v);
    if (onNavigateToModule) onNavigateToModule(v === "all" ? null as any : v);
  };

  const visibleModules = modules.filter((m) => {
    if (semFilter === "all") return true;
    return String(m.semester) === semFilter || m.semester === "full";
  });

  const totalCredits = visibleModules.reduce((sum, m) => sum + m.credits, 0);
  const modulesWithGrades = visibleModules.filter(m => m.currentGrade !== null);
  const weightedAverage = modulesWithGrades.length > 0
    ? Math.round(
        modulesWithGrades.reduce((sum, m) => sum + (m.currentGrade || 0) * m.credits, 0) /
        modulesWithGrades.reduce((sum, m) => sum + m.credits, 0)
      )
    : 0;

  const selectedModule = activeView !== "all" ? modules.find(m => m.id === activeView) : null;

  const filteredAssessments = selectedModule
    ? selectedModule.assessments.filter(a => {
        if (filter === "all") return true;
        if (filter === "formative") return a.isFormative;
        return !a.isFormative;
      })
    : [];

  const trendData = showTrend ? modulePerformanceData[showTrend] : null;

  return (
    <div className="glass-card p-6 opacity-0 animate-fade-up stagger-3">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Module Grades Summary</h2>
          <p className="text-sm text-muted-foreground">
            {selectedModule
              ? `${selectedModule.code} — ${selectedModule.name}`
              : "Overview of all module grades and weightings"}
          </p>
        </div>
        {/* Semester Filter - only in "all" view */}
        {activeView === "all" && (
          <div className="flex gap-0.5 p-0.5 rounded-lg bg-secondary/50 border border-border/50">
            {semesterFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setSemFilter(f.value)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium rounded-md transition-all duration-200 whitespace-nowrap",
                  semFilter === f.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Module Navigation Bar */}
      <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => { setActiveView("all"); setFilter("all"); setShowTrend(null); }}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap",
            activeView === "all"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary"
          )}
        >
          All Modules
        </button>
        {visibleModules.map((m) => (
          <Tooltip key={m.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => { setActiveView(m.id); setFilter("all"); setShowTrend(null); }}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap",
                  activeView === m.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary"
                )}
              >
                {m.code.replace(/^COMP/, "")}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="shadow-lg">
              <p className="font-medium">{m.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Filter toggle + trend selector for single module view */}
      {selectedModule && (
        <div className="flex items-center justify-between mb-4 animate-fade-in">
          <div className="flex items-center gap-1.5">
            {(["all", "summative", "formative"] as FilterMode[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md border transition-all duration-200 capitalize",
                  filter === f
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                )}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
          {modulePerformanceData[selectedModule.id] && (
            <button
              onClick={() => setShowTrend(showTrend === selectedModule.id ? null : selectedModule.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md border transition-all duration-200",
                showTrend === selectedModule.id
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              )}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Trend
            </button>
          )}
        </div>
      )}

      {/* Trend Chart */}
      {showTrend && trendData && (
        <div className="mb-4 p-4 rounded-lg bg-secondary/30 border border-border/50 animate-fade-in">
          <p className="text-xs text-muted-foreground mb-3">Grade Trend Over Time</p>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <YAxis domain={[40, 100]} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Area type="monotone" dataKey="grade" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#trendGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border/50 overflow-hidden">
        {activeView === "all" ? (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">Course Id</TableHead>
                <TableHead className="text-muted-foreground font-medium">Credits</TableHead>
                <TableHead className="text-muted-foreground font-medium">CW/EXAM</TableHead>
                <TableHead className="text-muted-foreground font-medium">CW%</TableHead>
                <TableHead className="text-muted-foreground font-medium">Exam%</TableHead>
                <TableHead className="text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5">
                    Unit Mark
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3.5 h-3.5 text-info" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Current weighted average based on completed assessments</p>
                      </TooltipContent>
                    </Tooltip>
                  </span>
                </TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleModules.map((module, index) => {
                const stats = calculateModuleStats(module);
                const classification = stats.unitMark !== null ? getGradeClassification(stats.unitMark) : null;
                return (
                  <TableRow
                    key={module.id}
                    className={cn(
                      "border-border/50 cursor-pointer hover:bg-secondary/40 transition-colors duration-150",
                      index % 2 === 1 && "bg-secondary/15"
                    )}
                    onClick={() => setActiveView(module.id)}
                  >
                    <TableCell className="font-medium text-foreground">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="underline decoration-dotted decoration-muted-foreground/40 underline-offset-4 cursor-help">
                            {module.code}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="shadow-lg">
                          <p className="font-medium">{module.name}</p>
                          <p className="text-xs text-muted-foreground">{semesterLabel(module.semester)} • {module.credits} credits</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{module.credits}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {stats.cwWeight}/{stats.examWeight}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {stats.cwPercentage > 0 ? stats.cwPercentage : 0}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {stats.examPercentage > 0 ? stats.examPercentage : 0}
                    </TableCell>
                    <TableCell>
                      {stats.unitMark !== null && classification ? (
                        <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-sm font-semibold", classification.className)}>
                          {stats.unitMark}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter className="bg-secondary/50 border-t border-border/50">
              <TableRow className="hover:bg-transparent">
                <TableCell className="font-semibold text-foreground">Total</TableCell>
                <TableCell className="font-bold text-foreground">{totalCredits}</TableCell>
                <TableCell colSpan={3}></TableCell>
                <TableCell>
                  {weightedAverage > 0 && (
                    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold", getGradeClassification(weightedAverage).className)}>
                      {weightedAverage}
                    </span>
                  )}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        ) : (
          /* Single Module Assessment Table */
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">Assessment</TableHead>
                <TableHead className="text-muted-foreground font-medium">Type</TableHead>
                <TableHead className="text-muted-foreground font-medium">Weight</TableHead>
                <TableHead className="text-muted-foreground font-medium">Deadline</TableHead>
                <TableHead className="text-muted-foreground font-medium">Grade</TableHead>
                <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssessments.length > 0 ? (
                filteredAssessments.map((a, index) => {
                  const classification = a.grade !== null ? getGradeClassification(a.grade) : null;
                  return (
                    <TableRow key={a.id} className={cn("border-border/50 animate-fade-in", index % 2 === 1 && "bg-secondary/15")}>
                      <TableCell className="font-medium text-foreground">
                        {a.name}
                        {a.isFormative && (
                          <Badge variant="outline" className="ml-2 text-[10px] py-0 px-1.5 border-muted-foreground/30 text-muted-foreground">
                            Formative
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground capitalize">{a.type}</TableCell>
                      <TableCell className="text-muted-foreground">{a.weight}%</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {formatDateTime(a.dueDate)}
                      </TableCell>
                      <TableCell>
                        {a.grade !== null && classification ? (
                          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-sm font-semibold", classification.className)}>
                            {a.grade}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={cn("text-xs px-2 py-0.5 rounded-full border capitalize", statusStyles[a.status])}>
                          {a.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {a.gitlabUrl && (
                            <a
                              href={a.gitlabUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-orange-500/15 text-orange-400 border border-orange-500/30 hover:bg-orange-500/25 transition-colors"
                            >
                              <GitBranch className="w-3 h-3" />
                              GitLab
                            </a>
                          )}
                          {a.feedback && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setFeedbackModal({ name: a.name, feedback: a.feedback! }); }}
                              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 transition-colors"
                            >
                              <MessageSquare className="w-3 h-3" />
                              Feedback
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No {filter} assessments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            {selectedModule && (
              <TableFooter className="bg-secondary/50 border-t border-border/50">
                <TableRow className="hover:bg-transparent">
                  <TableCell className="font-semibold text-foreground" colSpan={2}>
                    Module Average
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {filteredAssessments.reduce((s, a) => s + a.weight, 0)}%
                  </TableCell>
                  <TableCell />
                  <TableCell>
                    {selectedModule.currentGrade !== null ? (
                      <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-sm font-bold", getGradeClassification(selectedModule.currentGrade).className)}>
                        {selectedModule.currentGrade}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell colSpan={2} />
                </TableRow>
              </TableFooter>
            )}
          </Table>
        )}
      </div>

      {/* Grade Legend */}
      <div className="flex items-center gap-3 mt-3 flex-wrap">
        <span className="text-[11px] text-muted-foreground font-medium">Grade Key:</span>
        {gradeLegend.map((item) => (
          <span key={item.label} className={cn("text-[11px] px-2 py-0.5 rounded-md border", item.className)}>
            {item.label}
          </span>
        ))}
      </div>

      {/* Feedback Modal */}
      <Dialog open={!!feedbackModal} onOpenChange={(open) => !open && setFeedbackModal(null)}>
        <DialogContent className="glass-card border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Instructor Feedback
            </DialogTitle>
            <DialogDescription>
              {feedbackModal?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 p-4 rounded-lg bg-secondary/30 border border-border/50">
            <p className="text-sm leading-relaxed text-foreground/90">
              {feedbackModal?.feedback}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
