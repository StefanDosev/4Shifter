'use client';

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

type ShiftChartProps = {
  type: 'bar' | 'doughnut' | 'line';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[] | string;
      borderColor?: string[] | string;
      borderWidth?: number;
    }[];
  };
  title?: string;
};

export function ShiftChart({ type, data, title }: ShiftChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            family: 'inherit',
            weight: 'bold' as const,
          },
          color: '#000',
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        color: '#000',
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: '#000',
        titleFont: {
          weight: 'bold' as const,
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: type === 'bar'
      ? {
          y: {
            beginAtZero: true,
            grid: {
              color: '#e5e7eb',
            },
            ticks: {
              font: {
                weight: 'bold' as const,
              },
              color: '#000',
            },
            border: {
              display: false,
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                weight: 'bold' as const,
              },
              color: '#000',
            },
            border: {
              display: false,
            },
          },
        }
      : undefined,
  };

  return (
    <div className="h-full w-full p-4">
      {type === 'bar' && <Bar options={options} data={data} />}
      {type === 'doughnut' && <Doughnut options={options} data={data} />}
      {type === 'line' && <Line options={options} data={data} />}
    </div>
  );
}
