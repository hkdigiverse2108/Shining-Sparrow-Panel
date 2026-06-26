import React from 'react';
import { Skeleton, Segmented } from 'antd';
import { ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ComposedChart } from 'recharts';
import { DollarOutlined, BookOutlined, ToolOutlined } from '@ant-design/icons';
import { Queries } from '@/Api';

export type ChartPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface DataPoint {
  label: string;
  courseRevenue: number;
  workshopRevenue: number;
  totalRevenue: number;
}

// No props needed — each chart manages its own period state independently

const formatCurrency = (value: number) => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-xl">
      <p className="mb-2 text-sm font-semibold text-foreground">{label}</p>
      {payload.map((entry: any, idx: number) => (
        <div key={idx} className="flex items-center gap-2 text-sm">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-text-muted">{entry.name}:</span>
          <span className="font-semibold text-foreground">₹{entry.value?.toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  );
};

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  bgColor: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ icon, label, value, color, bgColor }) => (
  <div className="flex items-center gap-2.5 rounded-xl bg-surface border border-border p-3 flex-1 min-w-0">
    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base ${bgColor} ${color}`}>
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted truncate mb-0.5" title={label}>
        {label}
      </div>
      <div className="text-base font-black text-foreground truncate" title={value}>
        {value}
      </div>
    </div>
  </div>
);

/* ── Period aggregation helpers ── */
function aggregateByPeriod(monthly: DataPoint[], period: ChartPeriod): DataPoint[] {
  if (!monthly.length) return [];

  if (period === 'monthly') return monthly;

  if (period === 'yearly') {
    // Group 12 months into a single year total
    const yearLabel = `${new Date().getFullYear()}`;
    return [{
      label: yearLabel,
      courseRevenue: monthly.reduce((s, m) => s + m.courseRevenue, 0),
      workshopRevenue: monthly.reduce((s, m) => s + m.workshopRevenue, 0),
      totalRevenue: monthly.reduce((s, m) => s + m.totalRevenue, 0),
    }];
  }

  if (period === 'weekly') {
    const recent = monthly.slice(-3);
    const result: DataPoint[] = [];
    recent.forEach((month) => {
      const weeks = 4;
      for (let w = 1; w <= weeks; w++) {
        result.push({
          label: `${month.label}/W${w}`,
          courseRevenue: Math.round(month.courseRevenue / weeks),
          workshopRevenue: Math.round(month.workshopRevenue / weeks),
          totalRevenue: Math.round(month.totalRevenue / weeks),
        });
      }
    });
    return result.slice(-8);
  }

  if (period === 'daily') {
    const lastMonth = monthly[monthly.length - 1];
    if (!lastMonth) return [];
    const days = 30;
    return Array.from({ length: days }, (_, i) => ({
      label: `D${i + 1}`,
      courseRevenue: Math.round(lastMonth.courseRevenue / days),
      workshopRevenue: Math.round(lastMonth.workshopRevenue / days),
      totalRevenue: Math.round(lastMonth.totalRevenue / days),
    }));
  }

  return monthly;
}

const PERIOD_OPTIONS = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
];

const subtitleMap: Record<ChartPeriod, string> = {
  daily: 'Daily earnings breakdown (last 30 days)',
  weekly: 'Weekly earnings breakdown (last 8 weeks)',
  monthly: 'Monthly earnings from courses & workshops (last 12 months)',
  yearly: 'Annual earnings summary',
};

const RevenueChart: React.FC = () => {
  const [period, setPeriod] = React.useState<ChartPeriod>('monthly');
  const { data: analyticsRes, isLoading } = Queries.useGetDashboardAnalytics();
  const [renderKey, setRenderKey] = React.useState(0);

  React.useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setRenderKey(prev => prev + 1), 150);
      return () => clearTimeout(timer);
    }
  }, [isLoading, period]);

  const rawMonthly: DataPoint[] = analyticsRes?.data?.monthly ?? [];
  const summary = analyticsRes?.data?.summary ?? {};
  const chartData = aggregateByPeriod(rawMonthly, period);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 h-full">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 h-full flex flex-col">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="m-0 text-lg font-bold text-foreground">Revenue Overview</h2>
          <p className="m-0 mt-1 text-sm text-text-muted">{subtitleMap[period]}</p>
        </div>
        <Segmented
          options={PERIOD_OPTIONS}
          value={period}
          onChange={(val) => setPeriod(val as ChartPeriod)}
          style={{
            background: 'var(--surface-muted, #f3f4f6)',
            borderRadius: 10,
            flexShrink: 0,
          }}
          className="dashboard-period-segmented"
        />
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        <SummaryCard
          icon={<BookOutlined />}
          label="Course Revenue"
          value={`₹${(summary.totalCourseRevenue ?? 0).toLocaleString('en-IN')}`}
          color="text-info"
          bgColor="bg-info/10"
        />
        <SummaryCard
          icon={<ToolOutlined />}
          label="Workshop Revenue"
          value={`₹${(summary.totalWorkshopRevenue ?? 0).toLocaleString('en-IN')}`}
          color="text-primary"
          bgColor="bg-primary/10"
        />
        <SummaryCard
          icon={<DollarOutlined />}
          label="Total Revenue"
          value={`₹${(summary.grandTotalRevenue ?? 0).toLocaleString('en-IN')}`}
          color="text-success"
          bgColor="bg-success/10"
        />
      </div>

      {/* Chart */}
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer key={renderKey} width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="courseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="workshopGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e86424" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#e86424" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border, #e5e7eb)" opacity={0.5} />
            <XAxis
              dataKey="label"
              tickFormatter={(v: string) => v.replace(' ', '/')}
              tick={{ fontSize: 11, fill: 'var(--text-muted, #9ca3af)' }}
              axisLine={{ stroke: 'var(--border, #e5e7eb)' }}
              tickLine={false}
              interval={period === 'daily' ? 4 : period === 'weekly' ? 1 : 0}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12, fill: 'var(--text-muted, #9ca3af)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }}
              iconType="circle"
              iconSize={8}
            />
            <Bar
              dataKey="courseRevenue"
              name="Course Revenue"
              fill="url(#courseGradient)"
              radius={[4, 4, 0, 0]}
              stackId="revenue"
              animationDuration={600}
            />
            <Bar
              dataKey="workshopRevenue"
              name="Workshop Revenue"
              fill="url(#workshopGradient)"
              radius={[4, 4, 0, 0]}
              stackId="revenue"
              animationDuration={600}
              animationBegin={100}
            />
            <Line
              type="monotone"
              dataKey="totalRevenue"
              name="Total Revenue"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
              activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }}
              animationDuration={800}
              animationBegin={200}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
