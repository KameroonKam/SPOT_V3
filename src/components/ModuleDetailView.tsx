import { useState } from "react";
import { ArrowLeft, FileText, BookOpen, Award, TrendingUp, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Module } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface ModuleDetailViewProps {
  module: Module;
  onBack: () => void;
}

type AssessmentFilter = "all" | "formative" | "summative";

export function ModuleDetailView({ module, onBack }: ModuleDetailViewProps) {
  const [filter, setFilter] = useState<AssessmentFilter>("all");

  const filteredAssessments = module.assessments.filter((assessment) => {
    if (filter === "all") return true;
    if (filter === "formative") return assessment.isFormative;
    if (filter === "summative") return !assessment.isFormative;
    return true;
  });

  const completedWeight = module.assessments
    .filter((a) => a.status === "completed")
    .reduce((sum, a) => sum + a.weight, 0);

  const formativeCount = module.assessments.filter((a) => a.isFormative).length;
  const summativeCount = module.assessments.filter((a) => !a.isFormative).length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-warning" />;
      case "upcoming":
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: "bg-success/10 text-success border-success/20",
      "in-progress": "bg-warning/10 text-warning border-warning/20",
      upcoming: "bg-muted text-muted-foreground border-border",
    };
    return styles[status as keyof typeof styles] || styles.upcoming;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "coursework":
        return <FileText className="w-4 h-4" />;
      case "exam":
        return <BookOpen className="w-4 h-4" />;
      case "lab":
        return <Award className="w-4 h-4" />;
      case "presentation":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-mono text-sm font-medium">
              {module.code}
            </span>
          </div>
          <h1 className="text-2xl font-semibold">{module.name}</h1>
          <p className="text-muted-foreground mt-1">
            {module.credits} credits • Semester {module.semester}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold gradient-text">
            {module.currentGrade !== null ? `${module.currentGrade}%` : "—"}
          </p>
          <p className="text-sm text-muted-foreground">Current Grade</p>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground mb-2">Module Progress</p>
          <div className="flex items-end gap-3">
            <span className="text-2xl font-bold">{module.progress}%</span>
            <Progress value={module.progress} className="flex-1 mb-1.5" />
          </div>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground mb-2">Assessment Weight Completed</p>
          <div className="flex items-end gap-3">
            <span className="text-2xl font-bold">{completedWeight}%</span>
            <Progress value={completedWeight} className="flex-1 mb-1.5" />
          </div>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground mb-2">Assessment Breakdown</p>
          <div className="flex gap-4">
            <div>
              <span className="text-2xl font-bold text-accent">{formativeCount}</span>
              <span className="text-sm text-muted-foreground ml-1">Formative</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-primary">{summativeCount}</span>
              <span className="text-sm text-muted-foreground ml-1">Summative</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(["all", "summative", "formative"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              filter === type
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {type === "all" && "All Assessments"}
            {type === "formative" && "Formative"}
            {type === "summative" && "Summative"}
          </button>
        ))}
      </div>

      {/* Assessments Table */}
      <div className="glass-card overflow-hidden">
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">Assessment</TableHead>
                <TableHead className="text-muted-foreground font-medium">Type</TableHead>
                <TableHead className="text-muted-foreground font-medium">Weight</TableHead>
                <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                <TableHead className="text-muted-foreground font-medium">Due Date</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssessments.map((assessment) => (
                <TableRow key={assessment.id} className="border-border/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-secondary">
                        {getTypeIcon(assessment.type)}
                      </div>
                      <div>
                        <p className="font-medium">{assessment.name}</p>
                        {assessment.isFormative && (
                          <span className="text-xs text-accent">Formative</span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize text-muted-foreground">{assessment.type}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${assessment.weight}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{assessment.weight}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(assessment.status)}
                      <span
                        className={cn(
                          "px-2 py-1 rounded-md text-xs font-medium border",
                          getStatusBadge(assessment.status)
                        )}
                      >
                        {assessment.status === "in-progress" ? "In Progress" : 
                         assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {assessment.dueDate
                      ? new Date(assessment.dueDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {assessment.grade !== null ? (
                      <span className="font-semibold gradient-text text-lg">
                        {assessment.grade}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Grade Contribution Summary */}
      <div className="glass-card p-6">
        <h3 className="font-medium mb-4">Grade Contribution</h3>
        <div className="space-y-3">
          {module.assessments
            .filter((a) => a.grade !== null)
            .map((assessment) => {
              const contribution = (assessment.grade! * assessment.weight) / 100;
              return (
                <div key={assessment.id} className="flex items-center gap-4">
                  <div className="w-40 text-sm text-muted-foreground truncate">
                    {assessment.name}
                  </div>
                  <div className="flex-1">
                    <div className="h-3 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                        style={{ width: `${contribution}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <span className="font-medium">{contribution.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground ml-1">/ {assessment.weight}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
