import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { PerformanceOverview } from "@/components/PerformanceOverview";
import { ModuleCard } from "@/components/ModuleCard";
import { DeadlinesTracker } from "@/components/DeadlinesTracker";
import { AssessmentBreakdown } from "@/components/AssessmentBreakdown";
import { ModuleGradesTable } from "@/components/ModuleGradesTable";
import { modules } from "@/data/mockData";

const Index = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleNavigateToModule = (moduleId: string) => {
    setActiveModule(moduleId);
    tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

        <main className="container mx-auto px-6 py-8 space-y-8">
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
                  {modules.length} modules • {modules.reduce((sum, m) => sum + m.credits, 0)} credits total
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground">
                  All
                </button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg text-muted-foreground hover:bg-secondary transition-colors">
                  Sem 1
                </button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg text-muted-foreground hover:bg-secondary transition-colors">
                  Sem 2
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {modules.map((module, index) => (
                <ModuleCard key={module.id} module={module} delay={`stagger-${Math.min(index + 2, 5)}`} />
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 mt-12">
          <div className="container mx-auto px-6 py-6">
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
