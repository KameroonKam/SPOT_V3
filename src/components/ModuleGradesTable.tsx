import { Info } from "lucide-react";
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

export function ModuleGradesTable() {
  const totalCredits = modules.reduce((sum, m) => sum + m.credits, 0);
  const modulesWithGrades = modules.filter(m => m.currentGrade !== null);
  const weightedAverage = modulesWithGrades.length > 0
    ? Math.round(
        modulesWithGrades.reduce((sum, m) => sum + (m.currentGrade || 0) * m.credits, 0) /
        modulesWithGrades.reduce((sum, m) => sum + m.credits, 0)
      )
    : 0;

  return (
    <div className="glass-card p-6 opacity-0 animate-fade-up stagger-3">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Module Grades Summary</h2>
          <p className="text-sm text-muted-foreground">
            Overview of all module grades and weightings
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-border/50 overflow-hidden">
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.map((module) => {
              const stats = calculateModuleStats(module);
              return (
                <TableRow key={module.id} className="border-border/50">
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
      </div>
    </div>
  );
}
