import { useState } from "react";
import { Info } from "lucide-react";
import { modules } from "@/data/mockData";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ModuleNavBarProps {
  selectedModuleId: string | null;
  onModuleSelect: (moduleId: string | null) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
}

export function ModuleNavBar({
  selectedModuleId,
  onModuleSelect,
  selectedYear,
  onYearChange,
}: ModuleNavBarProps) {
  const years = ["2024", "2025"];
  
  // Group modules by semester
  const semester1Modules = modules.filter(m => m.semester === 1);
  const semester2Modules = modules.filter(m => m.semester === 2);

  return (
    <div className="glass-card border-b border-border/50">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center gap-4 overflow-x-auto">
          {/* Year Selector */}
          <div className="flex border border-border/50 rounded-lg overflow-hidden shrink-0">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => onYearChange(year)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors",
                  selectedYear === year
                    ? "bg-success text-success-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                )}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Semester 1 Modules */}
          <div className="flex items-center gap-2">
            {semester1Modules.map((module) => (
              <Tooltip key={module.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onModuleSelect(selectedModuleId === module.id ? null : module.id)}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded transition-all",
                      selectedModuleId === module.id
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "text-foreground hover:bg-secondary"
                    )}
                  >
                    {module.code.replace("CS", "")}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="font-medium">{module.code}</p>
                  <p className="text-xs text-muted-foreground">{module.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Divider */}
          <span className="text-primary font-bold shrink-0">-</span>

          {/* Semester 2 Modules */}
          <div className="flex items-center gap-2">
            {semester2Modules.map((module) => (
              <Tooltip key={module.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onModuleSelect(selectedModuleId === module.id ? null : module.id)}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded transition-all",
                      selectedModuleId === module.id
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "text-foreground hover:bg-secondary"
                    )}
                  >
                    {module.code.replace("CS", "")}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="font-medium">{module.code}</p>
                  <p className="text-xs text-muted-foreground">{module.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Divider */}
          <span className="text-primary font-bold shrink-0">-</span>

          {/* Overview Button */}
          <button
            onClick={() => onModuleSelect(null)}
            className={cn(
              "px-3 py-2 text-sm font-medium rounded transition-all shrink-0",
              selectedModuleId === null
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-secondary"
            )}
          >
            OVERVIEW
          </button>

          {/* Info Icon */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 rounded-lg hover:bg-secondary transition-colors shrink-0">
                <Info className="w-4 h-4 text-info" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Click a module code to view detailed assessments</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
