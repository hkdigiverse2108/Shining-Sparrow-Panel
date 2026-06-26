import React from 'react';
import { Skeleton } from 'antd';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import { Queries } from '@/Api';
import { fadeInUp } from '@/Utils/animations';

interface MonthlyData {
  label: string;
  coursePurchases: number;
  workshopPurchases: number;
  totalPurchases: number;
}

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

const PurchasesChart: React.FC = () => {
  const { data: analyticsRes, isLoading } = Queries.useGetDashboardAnalytics();

  const monthly: MonthlyData[] = analyticsRes?.data?.monthly ?? [];

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <motion.div variants={fadeInUp} className="rounded-2xl border border-border bg-surface p-6">
      <div className="mb-5">
        <h2 className="m-0 text-lg font-bold text-foreground">Purchase Trends</h2>
        <p className="m-0 mt-1 text-sm text-text-muted">Monthly course & workshop purchases (last 12 months)</p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthly} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
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
              tick={{ fontSize: 12, fill: 'var(--text-muted, #9ca3af)' }}
              axisLine={{ stroke: 'var(--border, #e5e7eb)' }}
              tickLine={false}
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
              animationDuration={800}
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
              animationDuration={800}
              animationBegin={200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default PurchasesChart;
