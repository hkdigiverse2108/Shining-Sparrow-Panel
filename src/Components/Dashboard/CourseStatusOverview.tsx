import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/Constants';
import { CommonCard } from '@/Components';
import { useAppSelector } from '@/Store/hooks';
import { fadeInUp } from '@/Utils/animations';

const statusConfig = [
  { key: 'published', label: 'Published', color: '#22c55e' },
  { key: 'draft', label: 'Draft', color: '#3b82f6' },
  { key: 'archived', label: 'Archived', color: '#f59e0b' },
];

const CourseStatusOverview: React.FC = () => {
  const courses = useAppSelector(state => state.courses.data);

  const stats = useMemo(() => {
    const total = courses.length || 1;
    return {
      published: courses.filter(c => c.status === 'published').length,
      draft: courses.filter(c => c.status === 'draft').length,
      archived: courses.filter(c => c.status === 'archived').length,
      total
    };
  }, [courses]);

  return (
    <motion.div variants={fadeInUp}>
      <CommonCard 
        title="Course Status" 
        extra={<Link to={ROUTES.COURSE.BASE} className="text-sm text-primary hover:underline">View All</Link>}
        cardProps={{ className: "h-full bg-surface!" }}
      >
        <div className="dashboard-list space-y-4">
          {statusConfig.map((item) => {
            const count = stats[item.key as keyof typeof stats] as number;
            const percent = Math.round((count / stats.total) * 100);

            return (
              <div key={item.key} className="dashboard-completion-row">
                <div className="dashboard-completion-meta flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  <span className="text-xs text-muted">{count} Courses ({percent}%)</span>
                </div>
                <div className="dashboard-progress-track w-full h-2 rounded-full bg-border overflow-hidden">
                  <motion.div 
                    className="dashboard-progress-fill h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CommonCard>
    </motion.div>
  );
};

export default CourseStatusOverview;