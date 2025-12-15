import type { LucideIcon } from 'lucide-react';

type StatsCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
};

export function StatsCard({ title, value, icon: Icon, description, trend, className = '' }: StatsCardProps) {
  return (
    <div className={`rounded-xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-gray-600">{title}</p>
          <h3 className="mt-2 text-3xl font-black">{value}</h3>
        </div>
        <div className="rounded-lg border-2 border-black bg-yellow-300 p-2">
          <Icon className="size-6 text-black" />
        </div>
      </div>

      {(description || trend) && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          {trend && (
            <span className={`font-bold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '+' : ''}
              {trend.value}
              %
            </span>
          )}
          {description && <span className="font-medium text-gray-600">{description}</span>}
        </div>
      )}
    </div>
  );
}
