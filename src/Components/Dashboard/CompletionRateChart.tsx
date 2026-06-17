import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { CommonCard } from '@/Components';
import { useAppSelector } from '@/Store/hooks';
import { fadeInUp } from '@/Utils/animations';

const CompletionRateChart: React.FC = () => {
  const courses = useAppSelector(state => state.courses.data);

  const completionStats = useMemo(() => {
    let totalItems = 0;
    let completedItems = 0;
    
    courses.forEach(c => {
      if (c.curriculum && c.curriculum.length > 0) {
        totalItems += c.curriculum.length;
        completedItems += c.curriculum.filter(item => item.completed).length;
      }
    });

    const percent = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
    return { percent, remaining: 100 - percent, completedItems, totalItems };
  }, [courses]);

  const circumference = 2 * Math.PI * 45; // 282.74

  return (
    <motion.div variants={fadeInUp}>
      <CommonCard title="Curriculum Completion" cardProps={{ className: "h-full bg-surface!" }}>
        <div className="dashboard-chart-container dashboard-donut-chart flex justify-center py-4">
          <svg viewBox="0 0 160 160" className="dashboard-donut-svg" width="160" height="160">
            {/* Background Circle */}
            <circle cx="80" cy="80" r="45" fill="transparent" stroke="var(--border)" strokeWidth="12" />
            
            {/* Completed Circle */}
            <circle
              cx="80" cy="80" r="45" fill="transparent"
              stroke="var(--primary)" strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (circumference * (completionStats.percent / 100))}
              transform="rotate(-90 80 80)"
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
            
            {/* Incomplete Circle (Drawn after completed) */}
            <circle
              cx="80" cy="80" r="45" fill="transparent"
              stroke="#f97316" strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (circumference * (completionStats.remaining / 100))}
              transform={`rotate(${360 * (completionStats.percent / 100) - 90} 80 80)`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />

            <g className="dashboard-donut-center">
              <text x="80" y="77" textAnchor="middle" className="dashboard-donut-value" fill="var(--foreground)" fontSize="24" fontWeight="bold">
                {completionStats.percent}%
              </text>
              <text x="80" y="95" textAnchor="middle" className="dashboard-donut-label" fill="var(--muted)" fontSize="10">
                Completed
              </text>
            </g>
          </svg>
        </div>

        <div className="dashboard-pass-legends flex justify-center gap-6 mt-2 pb-2">
          <div className="dashboard-pass-legend flex items-center gap-2 text-xs text-muted">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--primary)' }} />
            Completed ({completionStats.completedItems})
          </div>
          <div className="dashboard-pass-legend flex items-center gap-2 text-xs text-muted">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f97316' }} />
            Incomplete ({completionStats.totalItems - completionStats.completedItems})
          </div>
        </div>
      </CommonCard>
    </motion.div>
  );
};

export default CompletionRateChart;