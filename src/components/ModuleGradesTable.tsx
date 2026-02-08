import { useState } from "react";
import { Info, ChevronRight } from "lucide-react";
import { modules } from "@/data/mockData";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ViewMode = "all" | string; // "all" or module id
type FilterMode = "all" | "formative" | "summative";

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

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "in-progress": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  upcoming: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

export function ModuleGradesTable() {
  const [activeView, setActiveView] = useState<ViewMode>("all");
  const [filter, setFilter] = useState<FilterMode>("all");

  const totalCredits = modules.reduce((sum, m) => sum + m.credits, 0);
  const modulesWithGrades = modules.filter(m => m.currentGrade !== null);
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
      </div>

      {/* Module Navigation Bar */}
      <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => { setActiveView("all"); setFilter("all"); }}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap",
            activeView === "all"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary"
          )}
        >
          All Modules
        </button>
        {modules.map((m) => (
          <button
            key={m.id}
            onClick={() => { setActiveView(m.id); setFilter("all"); }}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap",
              activeView === m.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary"
            )}
          >
            {m.code}
          </button>
        ))}
      </div>

      {/* Filter toggle for single module view */}
      {selectedModule && (
        <div className="flex items-center gap-1.5 mb-4 animate-fade-in">
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
      )}

      <div className="rounded-lg border border-border/50 overflow-hidden">
        {activeView === "all" ? (
          /* All Modules Overview Table */
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
              {modules.map((module) => {
                const stats = calculateModuleStats(module);
                return (
                  <TableRow
                    key={module.id}
                    className="border-border/50 cursor-pointer hover:bg-secondary/40 transition-colors duration-150"
                    onClick={() => setActiveView(module.id)}
                  >
                    <TableCell className="font-medium text-foreground">{module.code}</TableCell>
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
                      {stats.unitMark !== null ? (
                        <span className="font-semibold gradient-text">{stats.unitMark}</span>
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
                <TableCell colSpan={4}></TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5">
                    <span className="font-bold gradient-text">{weightedAverage}</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3.5 h-3.5 text-info" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Credit-weighted average of all modules with grades</p>
                      </TooltipContent>
                    </Tooltip>
                  </span>
                </TableCell>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssessments.length > 0 ? (
                filteredAssessments.map((a) => (
                  <TableRow key={a.id} className="border-border/50 animate-fade-in">
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
                    <TableCell className="text-muted-foreground">
                      {a.dueDate
                        ? new Date(a.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {a.grade !== null ? (
                        <span className="font-semibold gradient-text">{a.grade}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full border capitalize", statusStyles[a.status])}>
                        {a.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
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
                  <TableCell colSpan={2}>
                    {selectedModule.currentGrade !== null ? (
                      <span className="font-bold gradient-text">{selectedModule.currentGrade}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            )}
          </Table>
        )}
      </div>
    </div>
  );
}
