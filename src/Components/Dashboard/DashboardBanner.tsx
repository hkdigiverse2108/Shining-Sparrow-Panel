import React, { useMemo } from 'react';
import { PlusOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import LottieModule from 'lottie-react';

import { ROUTES } from '@/Constants';
import { fadeInUp } from '@/Utils/animations';
import { CommonButton } from '@/Attribute';
import { CommonCard } from '@/Components';
import { useAppSelector } from '@/Store/hooks';

// FIX: Import the JSON file directly from your Data folder
import animationData from '@/Data/MainBanner.json';

// FIX: Manually extract the default component from the module.
// This bypasses the "Element type is invalid: got object" error caused by bundler interop.
const Lottie = (LottieModule as any).default;

const DashboardBanner: React.FC = () => {
  const navigate = useNavigate();
  const users = useAppSelector(state => state.users.data);
  const courses = useAppSelector(state => state.courses.data);
  const workshops = useAppSelector(state => state.workshops.data);
  
  const metrics = useMemo(() => ({
    students: users.filter(u => u.role === 'student').length,
    instructors: users.filter(u => u.role === 'instructor').length,
    draftCourses: courses.filter(c => c.status === 'draft').length,
    totalWorkshops: workshops.length,
  }), [users, courses, workshops]);

  return (
    <div className="dashboard-grid-banner ">
      <motion.div variants={fadeInUp} className="dashboard-banner h-50">
        <div className="dashboard-banner-content">
          <div>
            <h1 className="dashboard-banner-title">
              Learn Effectively With Us!
            </h1>
            <p className="dashboard-banner-copy">
              Manage your platform, track progress, and boost skills with experts.
            </p>
          </div>
          <div className="dashboard-banner-stats">
            <div className="dashboard-banner-stat">
              <div className="dashboard-banner-stat-icon">
                <UserOutlined />
              </div>
              <div>
                <div className="dashboard-banner-stat-value">{metrics.students.toLocaleString()}</div>
                <div className="dashboard-banner-stat-label">Students</div>
              </div>
            </div>
            <div className="dashboard-banner-stat">
              <div className="dashboard-banner-stat-icon">
                <StarOutlined />
              </div>
              <div>
                <div className="dashboard-banner-stat-value">{metrics.instructors.toLocaleString()}</div>
                <div className="dashboard-banner-stat-label">Expert Mentors</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-banner-illustration">
          <Lottie 
            animationData={animationData} 
            loop={true} 
            autoplay={true}
            className="dashboard-banner-svg" 
          />
        </div>
      </motion.div>
      
      <motion.div variants={fadeInUp}>
        <CommonCard title="Have More knowledge to share?" cardProps={{ className: "dashboard-create-card bg-surface!" }} >
          <p className="dashboard-create-copy text-sm text-muted mb-4">
            Create your course and publish it to students.
          </p>
          <CommonButton type="primary" onClick={() => navigate(ROUTES.COURSE.BASE)} className="dashboard-primary-button" >
            <PlusOutlined /> Create New Course
          </CommonButton>
          <div className="dashboard-create-stats grid grid-cols-2 gap-4 border-t border-border h-15">
            <div className="dashboard-create-stat">
              <div className="text-xs text-muted font-semibold uppercase tracking-wider">Draft Courses</div>
              <div className="text-2xl font-bold text-foreground">{metrics.draftCourses}</div>
            </div>
            <div className="dashboard-create-stat">
              <div className="text-xs text-muted font-semibold uppercase tracking-wider">Workshops</div>
              <div className="text-2xl font-bold text-foreground">{metrics.totalWorkshops}</div>
            </div>
          </div>
        </CommonCard>
      </motion.div>
    </div>
  );
};

export default DashboardBanner;