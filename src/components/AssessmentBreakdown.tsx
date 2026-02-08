import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { modules } from "@/data/mockData";
import { FileText, BookOpen, Presentation, FlaskConical } from "lucide-react";

const typeIcons = {
  coursework: FileText,
  exam: BookOpen,
  presentation: Presentation,
  lab: FlaskConical,
};

const typeColors = {
  coursework: "hsl(250 85% 65%)",
  exam: "hsl(200 90% 55%)",
  presentation: "hsl(160 84% 39%)",
  lab: "hsl(38 92% 50%)",
};

export function AssessmentBreakdown() {
  const allAssessments = modules.flatMap(m => m.assessments);
  
  const typeBreakdown = Object.entries(
    allAssessments.reduce((acc, a) => {
      acc[a.type] = (acc[a.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([type, count]) => ({
    type,
    count,
    color: typeColors[type as keyof typeof typeColors],
  }));

  const statusBreakdown = {
    completed: allAssessments.filter(a => a.status === 'completed').length,
    inProgress: allAssessments.filter(a => a.status === 'in-progress').length,
    upcoming: allAssessments.filter(a => a.status === 'upcoming').length,
  };

  const formativeCount = allAssessments.filter(a => a.isFormative).length;
  const summativeCount = allAssessments.length - formativeCount;

  return (
    <section className="glass-card p-6 opacity-0 animate-fade-up stagger-3">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Assessment Breakdown</h2>
        <p className="text-sm text-muted-foreground">Understanding your grading structure</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Type Distribution */}
        <div>
          <h3 className="text-sm font-medium mb-4">By Type</h3>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeBreakdown}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    strokeWidth={0}
                  >
                    {typeBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(230 25% 12%)',
                      border: '1px solid hsl(230 25% 18%)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {typeBreakdown.map(({ type, count, color }) => {
                const Icon = typeIcons[type as keyof typeof typeIcons];
                return (
                  <div key={type} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: color }}
                    />
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm capitalize">{type}</span>
                    <span className="text-sm text-muted-foreground">({count})</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Status & Category */}
        <div className="space-y-6">
          {/* Status */}
          <div>
            <h3 className="text-sm font-medium mb-3">Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-sm">Completed</span>
                </div>
                <span className="text-sm font-medium">{statusBreakdown.completed}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-warning" />
                  <span className="text-sm">In Progress</span>
                </div>
                <span className="text-sm font-medium">{statusBreakdown.inProgress}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                  <span className="text-sm">Upcoming</span>
                </div>
                <span className="text-sm font-medium">{statusBreakdown.upcoming}</span>
              </div>
            </div>
          </div>

          {/* Formative vs Summative */}
          <div>
            <h3 className="text-sm font-medium mb-3">Category</h3>
            <div className="flex gap-4">
              <div className="flex-1 p-3 rounded-lg bg-secondary/50 text-center">
                <p className="text-xl font-bold">{summativeCount}</p>
                <p className="text-xs text-muted-foreground">Summative</p>
                <p className="text-[10px] text-muted-foreground/70">Counts toward grade</p>
              </div>
              <div className="flex-1 p-3 rounded-lg bg-info/10 border border-info/20 text-center">
                <p className="text-xl font-bold text-info">{formativeCount}</p>
                <p className="text-xs text-info">Formative</p>
                <p className="text-[10px] text-muted-foreground/70">Practice only</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
