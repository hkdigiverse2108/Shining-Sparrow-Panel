import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Skeleton } from 'antd';
import { fadeInUp } from '@/Utils/animations';
import { CommonCard } from '@/Components';
import { Queries } from '@/Api';

const CompletionRateChart: React.FC = () => {
  const { data: courseRes, isLoading: courseLoading } = Queries.useGetCourses({ page: 1, limit: 1000 });
  const { data: dashRes, isLoading: dashLoading } = Queries.useGetDashboard();

  const stats = dashRes?.data?.sec1 ?? {};
  const courses = useMemo(() => courseRes?.data?.course_data || [], [courseRes]);

  const chartStats = useMemo(() => {
    const totalCourses = stats.totalCourses ?? courses.length ?? 0;
    const activeCourses = courses.filter((c: any) => !c.isBlocked).length;
    const blockedCourses = courses.filter((c: any) => c.isBlocked).length;

    const activePercent = totalCourses === 0 ? 0 : Math.round((activeCourses / totalCourses) * 100);
    return { activePercent, remaining: 100 - activePercent, activeCourses, blockedCourses, totalCourses };
  }, [courses, stats]);

  const loading = courseLoading || dashLoading;
  const circumference = 2 * Math.PI * 45;

  return (
    <motion.div variants={fadeInUp}>
      <CommonCard title="Course Activity Rate" cardProps={{ className: "h-full bg-surface!" }}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <>
            <div className="flex justify-center py-4">
              <svg viewBox="0 0 160 160" width="160" height="160">
                {/* Background Circle */}
                <circle cx="80" cy="80" r="45" fill="transparent" stroke="var(--border)" strokeWidth="12" />

                {/* Active Circle */}
                <circle
                  cx="80" cy="80" r="45" fill="transparent"
                  stroke="var(--primary)" strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (circumference * (chartStats.activePercent / 100))}
                  transform="rotate(-90 80 80)"
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />

                {/* Blocked Circle */}
                <circle
                  cx="80" cy="80" r="45" fill="transparent"
                  stroke="#f97316" strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (circumference * (chartStats.remaining / 100))}
                  transform={`rotate(${360 * (chartStats.activePercent / 100) - 90} 80 80)`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />

                <g>
                  <text x="80" y="77" textAnchor="middle" fill="var(--foreground)" fontSize="24" fontWeight="bold">
                    {chartStats.activePercent}%
                  </text>
                  <text x="80" y="95" textAnchor="middle" fill="var(--muted)" fontSize="10">
                    Active
                  </text>
                </g>
              </svg>
            </div>

            <div className="flex justify-center gap-6 mt-2 pb-2">
              <div className="flex items-center gap-2 text-xs text-muted">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--primary)' }} />
                Active ({chartStats.activeCourses})
              </div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f97316' }} />
                Blocked ({chartStats.blockedCourses})
              </div>
            </div>
          </>
        )}
      </CommonCard>
    </motion.div>
  );
};

export default CompletionRateChart;