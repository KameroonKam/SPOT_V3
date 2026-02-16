import { TrendingUp, Target, Award, BookOpen } from "lucide-react";
import { studentProfile, performanceData, modules } from "@/data/mockData";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  subtext, 
  trend,
  delay 
}: { 
  icon: React.ElementType;
  label: string;
  value: string;
  subtext: string;
  trend?: { value: number; positive: boolean };
  delay: string;
}) {
  return (
    <div className={`glass-card-hover p-5 opacity-0 animate-fade-up ${delay}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            trend.positive ? 'text-success' : 'text-destructive'
          }`}>
            <TrendingUp className={`w-3 h-3 ${!trend.positive ? 'rotate-180' : ''}`} />
            {trend.value}%
          </div>
        )}
      </div>
      <p className="text-2xl font-semibold mb-1">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xs text-muted-foreground/70 mt-1">{subtext}</p>
    </div>
  );
}

function ProgressRing({ percentage, size = 120 }: { percentage: number; size?: number }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-muted"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-primary transition-all duration-1000 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="url(#gradient)"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{percentage}%</span>
        <span className="text-xs text-muted-foreground">Complete</span>
      </div>
    </div>
  );
}

export function PerformanceOverview() {
  const completedCredits = Math.round((studentProfile.earnedCredits / studentProfile.totalCredits) * 100);
  const completedAssessments = modules.flatMap(m => m.assessments).filter(a => a.status === 'completed').length;
  const totalAssessments = modules.flatMap(m => m.assessments).length;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Performance Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">Your academic progress at a glance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Target}
          label="Current Average"
          value={`${studentProfile.currentAverage}%`}
          subtext="Across all modules"
          trend={{ value: 2.4, positive: true }}
          delay="stagger-1"
        />
        <StatCard
          icon={BookOpen}
          label="Credits Earned"
          value={`${studentProfile.earnedCredits}/${studentProfile.totalCredits}`}
          subtext={`${completedCredits}% of year complete`}
          delay="stagger-2"
        />
        <StatCard
          icon={Award}
          label="Assessments Done"
          value={`${completedAssessments}/${totalAssessments}`}
          subtext="Across all modules"
          delay="stagger-3"
        />
        <StatCard
          icon={TrendingUp}
          label="Predicted Grade"
          value="2:1"
          subtext="Based on current trajectory"
          delay="stagger-4"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Ring */}
        <div className="glass-card p-6 flex flex-col items-center justify-center opacity-0 animate-fade-up stagger-3">
          <ProgressRing percentage={completedCredits} />
          <div className="mt-4 text-center">
            <p className="font-medium">Year Progress</p>
            <p className="text-sm text-muted-foreground">
              {studentProfile.earnedCredits} of {studentProfile.totalCredits} credits
            </p>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="glass-card p-6 lg:col-span-2 opacity-0 animate-fade-up stagger-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium">Performance Trend</h3>
              <p className="text-sm text-muted-foreground">Monthly average vs target</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Your Average</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent/50" />
                <span className="text-muted-foreground">Target</span>
              </div>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorAverage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  domain={[50, 80]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="transparent"
                />
                <Area
                  type="monotone"
                  dataKey="average"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAverage)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
