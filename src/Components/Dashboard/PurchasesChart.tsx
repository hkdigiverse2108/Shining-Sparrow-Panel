import React from 'react';
import { Skeleton, Segmented } from 'antd';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Queries } from '@/Api';
import type { ChartPeriod } from './RevenueChart';

interface DataPoint {
  label: string;
  coursePurchases: number;
  workshopPurchases: number;
  totalPurchases: number;
}

// No props — each chart manages its own period independently

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
          <span className="font-semibold text-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

/* ── Period aggregation helpers ── */
function aggregateByPeriod(monthly: DataPoint[], period: ChartPeriod): DataPoint[] {
  if (!monthly.length) return [];

  if (period === 'monthly') return monthly;

  if (period === 'yearly') {
    const yearLabel = `${new Date().getFullYear()}`;
    return [{
      label: yearLabel,
      coursePurchases: monthly.reduce((s, m) => s + m.coursePurchases, 0),
      workshopPurchases: monthly.reduce((s, m) => s + m.workshopPurchases, 0),
      totalPurchases: monthly.reduce((s, m) => s + m.totalPurchases, 0),
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
          coursePurchases: Math.round(month.coursePurchases / weeks),
          workshopPurchases: Math.round(month.workshopPurchases / weeks),
          totalPurchases: Math.round(month.totalPurchases / weeks),
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
      coursePurchases: Math.round(lastMonth.coursePurchases / days),
      workshopPurchases: Math.round(lastMonth.workshopPurchases / days),
      totalPurchases: Math.round(lastMonth.totalPurchases / days),
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
  daily: 'Daily purchase breakdown (last 30 days)',
  weekly: 'Weekly purchase breakdown (last 8 weeks)',
  monthly: 'Monthly course & workshop purchases (last 12 months)',
  yearly: 'Annual purchase summary',
};

const PurchasesChart: React.FC = () => {
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
          <h2 className="m-0 text-lg font-bold text-foreground">Purchase Trends</h2>
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

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer key={renderKey} width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="coursePurchaseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="workshopPurchaseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e86424" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#e86424" stopOpacity={0.02} />
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
              allowDecimals={false}
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
            <Area
              type="monotone"
              dataKey="coursePurchases"
              name="Course Purchases"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#coursePurchaseGradient)"
              dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
              activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
              animationDuration={600}
            />
            <Area
              type="monotone"
              dataKey="workshopPurchases"
              name="Workshop Purchases"
              stroke="#e86424"
              strokeWidth={2}
              fill="url(#workshopPurchaseGradient)"
              dot={{ r: 3, fill: '#e86424', strokeWidth: 0 }}
              activeDot={{ r: 5, stroke: '#e86424', strokeWidth: 2, fill: '#fff' }}
              animationDuration={600}
              animationBegin={100}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PurchasesChart;
