import { useState } from "react";
import { GraduationCap, RefreshCw, ChevronDown, Check } from "lucide-react";
import { studentProfile, academicYears } from "@/data/mockData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [selectedYear, setSelectedYear] = useState(studentProfile.academicYear);

  return (
    <header className="glass-card border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">SPOT</h1>
                <p className="text-xs text-muted-foreground">Student Performance Tool</p>
              </div>
            </div>
          </div>

          {/* Student Info */}
          <div className="flex items-center gap-6">
            {/* Academic Year Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm">
                  <span className="text-muted-foreground">Academic Year:</span>
                  <span className="font-medium">{selectedYear}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border/50">
                {academicYears.map((year) => (
                  <DropdownMenuItem
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className="flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span>{year}</span>
                    {selectedYear === year && <Check className="w-4 h-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sync Status */}
            <div className="flex items-center gap-2 text-sm">
              <div className="status-dot-success" />
              <span className="text-muted-foreground">Synced {studentProfile.lastSync}</span>
              <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Student Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right">
                <p className="font-medium text-sm">{studentProfile.name}</p>
                <p className="text-xs text-muted-foreground">
                  Year {studentProfile.year} • {studentProfile.degree}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-sm font-medium">
                {studentProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
