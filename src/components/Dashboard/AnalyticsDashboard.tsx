'use client';

import { Activity, Briefcase, Calendar, Clock, Moon, Sun, Umbrella } from 'lucide-react';
import { MonthSelector } from './MonthSelector';
import { ShiftChart } from './ShiftChart';
import { StatsCard } from './StatsCard';

type AnalyticsDashboardProps = {
  yearlyStats: {
    I: number;
    II: number;
    III: number;
    REST: number;
  };
  monthlyStats: {
    I: number;
    II: number;
    III: number;
    REST: number;
    sickLeave: number;
    vacation: number;
    flexTime: number;
    totalNadure: number;
    totalUre: number;
  };
  yearlyTrend: {
    month: number;
    nadure: number;
    sickLeave: number;
  }[];
};

export function AnalyticsDashboard({ yearlyStats, monthlyStats, yearlyTrend }: AnalyticsDashboardProps) {
  const totalShifts = yearlyStats.I + yearlyStats.II + yearlyStats.III;

  const distributionData = {
    labels: ['Morning (I)', 'Afternoon (II)', 'Night (III)'],
    datasets: [
      {
        label: 'Shifts',
        data: [yearlyStats.I, yearlyStats.II, yearlyStats.III],
        backgroundColor: [
          '#FEF08A', // Yellow-200
          '#FDBA74', // Orange-300
          '#1E293B', // Slate-800
        ],
        borderColor: ['#000', '#000', '#000'],
        borderWidth: 2,
      },
    ],
  };

  const workloadData = {
    labels: ['Work', 'Rest'],
    datasets: [
      {
        label: 'Days',
        data: [totalShifts, yearlyStats.REST],
        backgroundColor: [
          '#86EFAC', // Green-300
          '#E2E8F0', // Slate-200
        ],
        borderColor: ['#000', '#000'],
        borderWidth: 2,
      },
    ],
  };

  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Overtime (Hours)',
        data: yearlyTrend.map(d => d.nadure),
        borderColor: '#EF4444', // Red-500
        backgroundColor: '#EF4444',
        tension: 0.3,
        borderWidth: 3,
      },
      {
        label: 'Sick Leave (Days)',
        data: yearlyTrend.map(d => d.sickLeave),
        borderColor: '#3B82F6', // Blue-500
        backgroundColor: '#3B82F6',
        tension: 0.3,
        borderWidth: 3,
      },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Month Selector */}
      <div className="flex justify-center">
        <MonthSelector />
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Night Shifts (Year)"
          value={yearlyStats.III}
          icon={Moon}
          description="Total night shifts in 2025"
          className="bg-slate-100"
        />
        <StatsCard
          title="Overtime (Month)"
          value={`${monthlyStats.totalNadure}h`}
          icon={Clock}
          description="Overtime this month"
          className="bg-blue-100"
        />
        <StatsCard
          title="Banked Hours"
          value={`${monthlyStats.totalUre}h`}
          icon={Activity}
          description="Total banked hours available"
          className="bg-green-100"
        />
        <StatsCard
          title="Total Shifts"
          value={totalShifts}
          icon={Calendar}
          description="Shifts worked this year"
          className="bg-purple-100"
        />
        {/* New Stats */}
        <StatsCard
          title="Sick Leave"
          value={monthlyStats.sickLeave}
          icon={Umbrella}
          description="Days sick this month"
          className="bg-red-100"
        />
        <StatsCard
          title="Vacation"
          value={monthlyStats.vacation}
          icon={Sun}
          description="Vacation days this month"
          className="bg-yellow-100"
        />
        <StatsCard
          title="Flex Time"
          value={monthlyStats.flexTime}
          icon={Briefcase}
          description="Flex days used this month"
          className="bg-orange-100"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Shift Distribution */}
        <div className="min-h-[400px] rounded-xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="mb-6 text-xl font-black">Shift Distribution (Year)</h3>
          <div className="h-[300px]">
            <ShiftChart type="bar" data={distributionData} />
          </div>
        </div>

        {/* Work/Life Balance */}
        <div className="min-h-[400px] rounded-xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="mb-6 text-xl font-black">Work / Rest Ratio (Year)</h3>
          <div className="h-[300px]">
            <ShiftChart type="doughnut" data={workloadData} />
          </div>
        </div>

        {/* Yearly Trend */}
        <div className="col-span-full min-h-[400px] rounded-xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="mb-6 text-xl font-black">Yearly Trends</h3>
          <div className="h-[300px]">
            <ShiftChart type="line" data={trendData} />
          </div>
        </div>
      </div>
    </div>
  );
}
