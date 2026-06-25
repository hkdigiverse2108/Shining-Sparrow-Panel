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
      <CommonCard title="Course Activity" cardProps={{ className: "h-full" }}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <>
            <div className="flex justify-center py-4">
              <svg viewBox="0 0 160 160" width="140" height="140">
                <defs>
                  <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                  <linearGradient id="blockedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f87171" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                <circle cx="80" cy="80" r="46" fill="transparent" stroke="var(--border)" strokeWidth="6" opacity="0.4" />
                <circle
                  cx="80" cy="80" r="46" fill="transparent"
                  stroke="url(#activeGrad)" strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (circumference * (chartStats.activePercent / 100))}
                  transform="rotate(-90 80 80)"
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
                {chartStats.blockedCourses > 0 && (
                  <circle
                    cx="80" cy="80" r="46" fill="transparent"
                    stroke="url(#blockedGrad)" strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (circumference * (chartStats.remaining / 100))}
                    transform={`rotate(${360 * (chartStats.activePercent / 100) - 90} 80 80)`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                  />
                )}
                <g>
                  <text x="80" y="77" textAnchor="middle" fill="var(--foreground)" fontSize="24" fontWeight="800">
                    {chartStats.activePercent}%
                  </text>
                  <text x="80" y="94" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600" letterSpacing="0.1em" className="uppercase">
                    Active
                  </text>
                </g>
              </svg>
            </div>
            <div className="flex justify-center gap-5 mt-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-text-muted/80">
                <span className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                Active ({chartStats.activeCourses})
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-text-muted/80">
                <span className="w-2.5 h-2.5 rounded-full bg-danger shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
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