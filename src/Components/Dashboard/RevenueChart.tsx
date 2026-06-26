import React from 'react';
import { Skeleton } from 'antd';
import { ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ComposedChart } from 'recharts';
import { DollarOutlined, BookOutlined, ToolOutlined } from '@ant-design/icons';
import { Queries } from '@/Api';

interface MonthlyData {
  label: string;
  courseRevenue: number;
  workshopRevenue: number;
  totalRevenue: number;
}

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

const RevenueChart: React.FC = () => {
  const { data: analyticsRes, isLoading } = Queries.useGetDashboardAnalytics();
  const [renderKey, setRenderKey] = React.useState(0);

  React.useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setRenderKey(prev => prev + 1);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const monthly: MonthlyData[] = analyticsRes?.data?.monthly ?? [];
  const summary = analyticsRes?.data?.summary ?? {};

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 h-full">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 h-full flex flex-col">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="m-0 text-lg font-bold text-foreground">Revenue Overview</h2>
          <p className="m-0 mt-1 text-sm text-text-muted">Monthly earnings from courses & workshops (last 12 months)</p>
        </div>
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
          <ComposedChart data={monthly} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
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
              tick={{ fontSize: 12, fill: 'var(--text-muted, #9ca3af)' }}
              axisLine={{ stroke: 'var(--border, #e5e7eb)' }}
              tickLine={false}
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
              animationDuration={800}
            />
            <Bar
              dataKey="workshopRevenue"
              name="Workshop Revenue"
              fill="url(#workshopGradient)"
              radius={[4, 4, 0, 0]}
              stackId="revenue"
              animationDuration={800}
              animationBegin={200}
            />
            <Line
              type="monotone"
              dataKey="totalRevenue"
              name="Total Revenue"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
              activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }}
              animationDuration={1200}
              animationBegin={400}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
