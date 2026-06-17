import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/Constants';
import { fadeInUp } from '@/Utils/animations';
import { CommonCard } from '@/Components';
import { useAppSelector } from '@/Store/hooks';

const PopularCourses: React.FC = () => {
  const navigate = useNavigate();
  const courses = useAppSelector(state => state.courses.data);

  const topCourses = useMemo(() => {
    return [...courses]
      .sort((a, b) => (b.enrollmentsCount || 0) - (a.enrollmentsCount || 0))
      .slice(0, 2)
      .map(c => ({
        ...c,
        progress: Math.round(((c.rating || 0) / 5) * 100), 
      }));
  }, [courses]);

  return (
    <motion.div variants={fadeInUp}>
      <CommonCard title="Popular Courses" extra={<Link to={ROUTES.COURSE.BASE} className="text-sm text-primary">All Courses</Link>} cardProps={{ className: "h-full bg-surface!" }} >
        <div className="dashboard-course-grid">
          {topCourses.map((course) => (
            <div key={course.id} className="dashboard-course-card">
              <img src={course.image} alt={course.title} className="dashboard-course-image" />
              <div className="dashboard-course-title">{course.title}</div>
              <div className="dashboard-course-meta">{course.category} • {course.enrollmentsCount} Students</div>
              {/* <ProgressBar percent={course.progress} /> */}
              <button
                onClick={() => navigate(`${ROUTES.COURSE.BASE}/${course.id}`)}
                className="dashboard-soft-button dashboard-course-button"
              >
                View Course
              </button>
            </div>
          ))}
        </div>
      </CommonCard>
    </motion.div>
  );
};

export default PopularCourses;