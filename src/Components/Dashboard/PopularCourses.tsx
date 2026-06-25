import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton, Avatar } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import { ROUTES } from '@/Constants';
import { fadeInUp } from '@/Utils/animations';
import { CommonCard } from '@/Components';
import { Queries } from '@/Api';

const PopularCourses: React.FC = () => {
  const navigate = useNavigate();
  const { data: courseRes, isLoading } = Queries.useGetCourses({ page: 1, limit: 1000 });

  const courses = useMemo(() => {
    const data = courseRes?.data?.course_data || [];
    // Sort by price descending as proxy for popularity (no enrollmentsCount in backend)
    return [...data].slice(0, 3);
  }, [courseRes]);

  return (
    <motion.div variants={fadeInUp}>
      <CommonCard
        title="Recent Courses"
        extra={<Link to={ROUTES.COURSE.BASE} className="text-sm text-primary hover:text-primary-dark font-medium">View All</Link>}
        cardProps={{ className: 'h-full' }}
      >
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : courses.length === 0 ? (
          <div className="text-center py-8 text-muted text-sm">No courses found.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {courses.map((course: any) => (
              <div
                key={course._id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-muted transition-colors cursor-pointer group border border-transparent hover:border-border"
                onClick={() => navigate(ROUTES.COURSE.BASE)}
              >
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.name}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                    onError={(e: any) => { e.target.src = ''; e.target.style.display = 'none'; }}
                  />
                ) : (
                  <Avatar shape="square" size={48} icon={<BookOutlined />} className="shrink-0 bg-primary-soft text-primary" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {course.name}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    ₹{(course.price ?? 0).toLocaleString()} {course.mrpPrice > course.price && <span className="text-muted line-through">₹{course.mrpPrice.toLocaleString()}</span>}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${course.isBlocked ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                  {course.isBlocked ? 'Blocked' : 'Active'}
                </span>
              </div>
            ))}
          </div>
        )}
      </CommonCard>
    </motion.div>
  );
};

export default PopularCourses;