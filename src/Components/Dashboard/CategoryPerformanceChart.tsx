import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Skeleton } from 'antd';
import { fadeInUp } from '@/Utils/animations';
import { CommonCard } from '@/Components';
import { Queries } from '@/Api';

const barColors = ['var(--primary)', 'var(--teal)', 'var(--indigo)', 'var(--orange)', 'var(--purple)', 'var(--success)'];

const CategoryPerformanceChart: React.FC = () => {
  const { data: courseRes, isLoading: courseLoading } = Queries.useGetCourses({ page: 1, limit: 1000 });
  const { data: workshopRes, isLoading: workshopLoading } = Queries.useGetWorkshops({ page: 1, limit: 1000 });

  const chartData = useMemo(() => {
    const courses = courseRes?.data?.course_data || [];
    const workshops: any[] = (() => {
      const d = workshopRes?.data?.workshop_data || workshopRes?.data || [];
      return Array.isArray(d) ? d : [];
    })();

    // Build a map: name → count
    const map: Record<string, number> = {};
    courses.forEach((c: any) => {
      const key = c.name?.split(' ')[0] || 'Course';
      map[key] = (map[key] || 0) + 1;
    });
    workshops.forEach((w: any) => {
      const key = w.title?.split(' ')[0] || 'Workshop';
      map[key] = (map[key] || 0) + 1;
    });

    return Object.entries(map).slice(0, 6).map(([name, value]) => ({ name, value }));
  }, [courseRes, workshopRes]);

  const loading = courseLoading || workshopLoading;
  const maxVal = Math.max(...chartData.map(d => d.value), 1);

  const chartHeight = 100;
  const chartTop = 20;
  const getY = (val: number) => chartTop + chartHeight - (val / maxVal) * chartHeight;

  return (
    <motion.div variants={fadeInUp}>
      <CommonCard
        title="Content Distribution"
        cardProps={{ className: 'h-full bg-surface!' }}
      >
        <p className="text-xs text-muted mb-4">Courses & workshops grouped by name prefix</p>
        {loading ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : chartData.length === 0 ? (
          <div className="text-center py-8 text-muted text-sm">No data available.</div>
        ) : (
          <>
            <div className="w-full overflow-x-auto">
              <svg viewBox="0 0 420 180" className="w-full" style={{ minWidth: '280px' }}>
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(pct => {
                  const v = Math.round((pct / 100) * maxVal);
                  const y = getY(v);
                  return (
                    <g key={pct}>
                      <line x1="40" y1={y} x2="400" y2={y} stroke="var(--border)" strokeWidth="1" strokeOpacity="0.6" />
                      <text x="35" y={y} textAnchor="end" dominantBaseline="middle" fill="var(--muted)" fontSize="8">{v}</text>
                    </g>
                  );
                })}

                {chartData.map((item, i) => {
                  const barWidth = Math.min(40, Math.floor(340 / chartData.length) - 8);
                  const spacing = 360 / chartData.length;
                  const x = 50 + i * spacing;
                  const barH = (item.value / maxVal) * chartHeight;
                  const y = getY(item.value);
                  const color = barColors[i % barColors.length];

                  return (
                    <g key={item.name}>
                      <rect x={x} y={chartTop} width={barWidth} height={chartHeight} fill="var(--border)" opacity="0.15" rx="3" />
                      <motion.rect
                        x={x} y={y} width={barWidth} height={barH}
                        fill={color} rx="3"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.08 }}
                        style={{ transformOrigin: `${x}px ${getY(0)}px` }}
                      />
                      <text x={x + barWidth / 2} y="168" textAnchor="middle" fill="var(--muted)" fontSize="8">
                        {item.name.length > 7 ? `${item.name.substring(0, 6)}…` : item.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex flex-wrap gap-3 mt-2">
              {chartData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: barColors[i % barColors.length] }} />
                  {item.name} ({item.value})
                </div>
              ))}
            </div>
          </>
        )}
      </CommonCard>
    </motion.div>
  );
};

export default CategoryPerformanceChart;