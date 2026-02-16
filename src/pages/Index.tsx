import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { PerformanceOverview } from "@/components/PerformanceOverview";
import { ModuleCard } from "@/components/ModuleCard";
import { DeadlinesTracker } from "@/components/DeadlinesTracker";
import { AssessmentBreakdown } from "@/components/AssessmentBreakdown";
import { ModuleGradesTable } from "@/components/ModuleGradesTable";
import { modules } from "@/data/mockData";
import { cn } from "@/lib/utils";

type SemesterFilter = "all" | "1" | "2";

const semesterFilters: { value: SemesterFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "1", label: "Semester 1" },
  { value: "2", label: "Semester 2" },
];

const Index = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [semesterFilter, setSemesterFilter] = useState<SemesterFilter>("all");
  const tableRef = useRef<HTMLDivElement>(null);

  const handleNavigateToModule = (moduleId: string | null) => {
    setActiveModule(moduleId);
    if (moduleId) tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filteredModules = modules.filter((m) => {
    if (semesterFilter === "all") return true;
    return String(m.semester) === semesterFilter || m.semester === "full";
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Background Gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, hsl(250 85% 65% / 0.15), transparent),
            radial-gradient(ellipse 60% 40% at 80% 50%, hsl(200 90% 55% / 0.08), transparent),
            radial-gradient(ellipse 40% 30% at 20% 80%, hsl(250 85% 65% / 0.05), transparent)
          `,
        }}
      />

      <div className="relative z-10">
        <Header />

        <main className="max-w-5xl mx-auto px-6 lg:px-8 py-8 space-y-8">
          {/* Grades Table */}
          <div ref={tableRef}>
            <ModuleGradesTable
              externalActiveView={activeModule}
              onNavigateToModule={setActiveModule}
            />
          </div>

          {/* Performance Overview */}
          <PerformanceOverview />

          {/* Deadlines & Assessment Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DeadlinesTracker onNavigateToModule={handleNavigateToModule} />
            <AssessmentBreakdown />
          </div>

          {/* Your Modules - Standalone Section */}
          <section>
            <div className="flex items-center justify-between mb-5 opacity-0 animate-fade-up stagger-1">
              <div>
                <h2 className="text-xl font-semibold">Your Modules</h2>
                <p className="text-sm text-muted-foreground">
                  {filteredModules.length} module{filteredModules.length !== 1 ? "s" : ""} • {filteredModules.reduce((sum, m) => sum + m.credits, 0)} credits
                </p>
              </div>
              <div className="flex gap-1 p-0.5 rounded-lg bg-secondary/50 border border-border/50">
                {semesterFilters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setSemesterFilter(f.value)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                      semesterFilter === f.value
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredModules.map((module, index) => (
                <ModuleCard key={module.id} module={module} delay={`stagger-${Math.min(index + 2, 5)}`} />
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 mt-12">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <p>SPOT V3 • Student Performance & Organisation Tool</p>
              <p>Using synthetic data only • Privacy-first design</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
