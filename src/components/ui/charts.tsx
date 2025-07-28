'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale
);

// Common chart colors for consistent theming
const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  warning: '#EF4444',
  info: '#8B5CF6',
  success: '#059669',
  muted: '#6B7280',
};

const GRADIENT_COLORS = {
  blue: ['rgba(59, 130, 246, 0.8)', 'rgba(59, 130, 246, 0.1)'],
  green: ['rgba(16, 185, 129, 0.8)', 'rgba(16, 185, 129, 0.1)'],
  purple: ['rgba(139, 92, 246, 0.8)', 'rgba(139, 92, 246, 0.1)'],
  orange: ['rgba(245, 158, 11, 0.8)', 'rgba(245, 158, 11, 0.1)'],
};

interface ChartWrapperProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  error?: string;
}

function ChartWrapper({ title, children, className = '', loading, error }: ChartWrapperProps) {
  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-4 sm:p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      ) : (
        <div className="h-64 sm:h-80">
          {children}
        </div>
      )}
    </div>
  );
}



// Device Breakdown Doughnut Chart
interface DeviceBreakdownChartProps {
  data: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  loading?: boolean;
  error?: string;
}

export function DeviceBreakdownChart({ data, loading, error }: DeviceBreakdownChartProps) {
  const chartData: ChartData<'doughnut'> = {
    labels: data.map(d => d.type.charAt(0).toUpperCase() + d.type.slice(1)),
    datasets: [
      {
        data: data.map(d => d.count),
        backgroundColor: [
          CHART_COLORS.primary,
          CHART_COLORS.secondary,
          CHART_COLORS.accent,
          CHART_COLORS.info,
          CHART_COLORS.warning,
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '60%',
  };

  return (
    <ChartWrapper title="Device Breakdown" loading={loading} error={error}>
      <Doughnut data={chartData} options={options} />
    </ChartWrapper>
  );
}

// Top Pages Bar Chart
interface TopPagesChartProps {
  data: Array<{
    page: string;
    views: number;
    avgTimeOnPage: number;
  }>;
  loading?: boolean;
  error?: string;
}

export function TopPagesChart({ data, loading, error }: TopPagesChartProps) {
  const chartData: ChartData<'bar'> = {
    labels: data.map(d => d.page === '/' ? 'Home' : d.page.replace('/', '')),
    datasets: [
      {
        label: 'Page Views',
        data: data.map(d => d.views),
        backgroundColor: CHART_COLORS.primary,
        borderColor: CHART_COLORS.primary,
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          afterLabel: function(context) {
            const pageData = data[context.dataIndex];
            return `Avg. time: ${Math.floor(pageData.avgTimeOnPage / 60)}:${(pageData.avgTimeOnPage % 60).toString().padStart(2, '0')}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <ChartWrapper title="Top Pages" loading={loading} error={error}>
      <Bar data={chartData} options={options} />
    </ChartWrapper>
  );
}

// Conversion Funnel Chart
interface ConversionFunnelChartProps {
  data: {
    pageViews: number;
    formViews: number;
    formSubmissions: number;
    qualifiedLeads: number;
  };
  loading?: boolean;
  error?: string;
}

export function ConversionFunnelChart({ data, loading, error }: ConversionFunnelChartProps) {
  const funnelData = [
    { stage: 'Page Views', count: data.pageViews, color: CHART_COLORS.primary },
    { stage: 'Form Views', count: data.formViews, color: CHART_COLORS.secondary },
    { stage: 'Form Submissions', count: data.formSubmissions, color: CHART_COLORS.accent },
    { stage: 'Qualified Leads', count: data.qualifiedLeads, color: CHART_COLORS.success },
  ];

  const chartData: ChartData<'bar'> = {
    labels: funnelData.map(d => d.stage),
    datasets: [
      {
        label: 'Count',
        data: funnelData.map(d => d.count),
        backgroundColor: funnelData.map(d => d.color),
        borderColor: funnelData.map(d => d.color),
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          afterLabel: function(context) {
            if (context.dataIndex > 0) {
              const current = funnelData[context.dataIndex].count;
              const previous = funnelData[context.dataIndex - 1].count;
              const conversionRate = previous > 0 ? ((current / previous) * 100).toFixed(1) : '0';
              return `Conversion: ${conversionRate}%`;
            }
            return '';
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <ChartWrapper title="Conversion Funnel" loading={loading} error={error}>
      <Bar data={chartData} options={options} />
    </ChartWrapper>
  );
}

// Gender Demographics Chart
interface GenderDemographicsChartProps {
  data: Array<{
    gender: string;
    count: number;
    percentage: number;
  }>;
  loading?: boolean;
  error?: string;
}

export function GenderDemographicsChart({ data, loading, error }: GenderDemographicsChartProps) {
  const chartData: ChartData<'doughnut'> = {
    labels: data.map(d => d.gender),
    datasets: [
      {
        data: data.map(d => d.count),
        backgroundColor: [
          CHART_COLORS.primary,
          CHART_COLORS.secondary,
          CHART_COLORS.accent,
          CHART_COLORS.info,
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '60%',
  };

  return (
    <ChartWrapper title="Gender Demographics" loading={loading} error={error}>
      <Doughnut data={chartData} options={options} />
    </ChartWrapper>
  );
}

// Age Demographics Chart
interface AgeDemographicsChartProps {
  data: Array<{
    ageGroup: string;
    count: number;
    percentage: number;
  }>;
  loading?: boolean;
  error?: string;
}

export function AgeDemographicsChart({ data, loading, error }: AgeDemographicsChartProps) {
  const chartData: ChartData<'bar'> = {
    labels: data.map(d => d.ageGroup),
    datasets: [
      {
        label: 'Visitors',
        data: data.map(d => d.count),
        backgroundColor: CHART_COLORS.secondary,
        borderColor: CHART_COLORS.secondary,
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          afterLabel: function(context) {
            const ageData = data[context.dataIndex];
            return `${ageData.percentage.toFixed(1)}% of visitors`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <ChartWrapper title="Age Demographics" loading={loading} error={error}>
      <Bar data={chartData} options={options} />
    </ChartWrapper>
  );
}

// Lead Source Performance Chart
interface LeadSourceChartProps {
  data: Array<{
    source: string;
    leads: number;
    cost: number;
    quality: number;
  }>;
  loading?: boolean;
  error?: string;
}

export function LeadSourceChart({ data, loading, error }: LeadSourceChartProps) {
  const chartData: ChartData<'bar'> = {
    labels: data.map(d => d.source),
    datasets: [
      {
        label: 'Leads Generated',
        data: data.map(d => d.leads),
        backgroundColor: CHART_COLORS.primary,
        borderColor: CHART_COLORS.primary,
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
        yAxisID: 'y',
      },
      {
        label: 'Quality Score',
        data: data.map(d => d.quality),
        backgroundColor: CHART_COLORS.accent,
        borderColor: CHART_COLORS.accent,
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
        yAxisID: 'y1',
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          afterLabel: function(context) {
            const sourceData = data[context.dataIndex];
            return `Cost: $${sourceData.cost}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Leads',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        beginAtZero: true,
        max: 10,
        title: {
          display: true,
          text: 'Quality Score',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <ChartWrapper title="Lead Source Performance" loading={loading} error={error}>
      <Bar data={chartData} options={options} />
    </ChartWrapper>
  );
}

// Monthly Trends Chart
interface MonthlyTrendsChartProps {
  data: Array<{
    month: string;
    visitors: number;
    leads: number;
    revenue: number;
  }>;
  loading?: boolean;
  error?: string;
}

export function MonthlyTrendsChart({ data, loading, error }: MonthlyTrendsChartProps) {
  const chartData: ChartData<'line'> = {
    labels: data.map(d => d.month),
    datasets: [
      {
        label: 'Visitors',
        data: data.map(d => d.visitors),
        borderColor: CHART_COLORS.primary,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: false,
        yAxisID: 'y',
      },
      {
        label: 'Leads',
        data: data.map(d => d.leads),
        borderColor: CHART_COLORS.secondary,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: false,
        yAxisID: 'y1',
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          afterBody: function(context) {
            const monthData = data[context[0].dataIndex];
            return [`Revenue: $${monthData.revenue.toLocaleString()}`];
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Visitors',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Leads',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  return (
    <ChartWrapper title="Monthly Business Trends" loading={loading} error={error}>
      <Line data={chartData} options={options} />
    </ChartWrapper>
  );
}

// Browser Performance Chart  
interface BrowserPerformanceChartProps {
  data: Array<{
    browser: string;
    count: number;
    avgSessionDuration: number;
    bounceRate: number;
  }>;
  loading?: boolean;
  error?: string;
}

export function BrowserPerformanceChart({ data, loading, error }: BrowserPerformanceChartProps) {
  const chartData: ChartData<'doughnut'> = {
    labels: data.map(d => d.browser),
    datasets: [
      {
        data: data.map(d => d.count),
        backgroundColor: [
          CHART_COLORS.primary,
          CHART_COLORS.secondary,
          CHART_COLORS.accent,
          CHART_COLORS.info,
          CHART_COLORS.warning,
          CHART_COLORS.muted,
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          afterLabel: function(context) {
            const browserData = data[context.dataIndex];
            return [
              `Session: ${Math.floor(browserData.avgSessionDuration / 60)}:${(browserData.avgSessionDuration % 60).toString().padStart(2, '0')}`,
              `Bounce: ${browserData.bounceRate.toFixed(1)}%`
            ];
          },
        },
      },
    },
    cutout: '50%',
  };

  return (
    <ChartWrapper title="Browser Performance" loading={loading} error={error}>
      <Doughnut data={chartData} options={options} />
    </ChartWrapper>
  );
}





export { ChartWrapper }; 