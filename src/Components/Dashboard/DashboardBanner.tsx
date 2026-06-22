import React from 'react';
import { PlusOutlined, UserOutlined, BookOutlined, ToolOutlined, ShoppingCartOutlined, AppstoreOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import LottieModule from 'lottie-react';
import { Skeleton } from 'antd';

import { ROUTES } from '@/Constants';
import { fadeInUp } from '@/Utils/animations';
import { CommonButton } from '@/Attribute';
import { CommonCard } from '@/Components';
import { Queries } from '@/Api';

import animationData from '@/Data/MainBanner.json';

const Lottie = (LottieModule as any).default;

interface StatCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl ${color}`}>
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20 text-white text-base">
      {icon}
    </div>
    <div>
      <div className="text-xl font-extrabold text-white leading-none">{value}</div>
      <div className="text-xs text-white/80 mt-0.5">{label}</div>
    </div>
  </div>
);

const DashboardBanner: React.FC = () => {
  const navigate = useNavigate();
  const { data: dashRes, isLoading } = Queries.useGetDashboard();

  const stats = dashRes?.data?.sec1 ?? {};
  const totalStudents = stats.totalStudents ?? 0;
  const totalCourses = stats.totalCourses ?? 0;
  const totalWorkshops = stats.totalWorkshops ?? 0;
  const coursePurchaseCount = stats.coursePurchaseCount ?? 0;
  const workshopPurchaseCount = stats.workshopPurchaseCount ?? 0;

  const loading = isLoading;

  return (
    <div className="dashboard-grid-banner">
      <motion.div variants={fadeInUp} className="dashboard-banner">
        <div className="dashboard-banner-content">
          <div>
            <h1 className="dashboard-banner-title">Welcome to Shining Sparrow!</h1>
            <p className="dashboard-banner-copy">
              Manage courses, workshops, and students — all in one place.
            </p>
          </div>
          <div className="dashboard-banner-stats">
            <div className="dashboard-banner-stat">
              <div className="dashboard-banner-stat-icon"><UserOutlined /></div>
              <div>
                <div className="dashboard-banner-stat-value">
                  {loading ? '—' : totalStudents.toLocaleString()}
                </div>
                <div className="dashboard-banner-stat-label">Total Students</div>
              </div>
            </div>
            <div className="dashboard-banner-stat">
              <div className="dashboard-banner-stat-icon"><BookOutlined /></div>
              <div>
                <div className="dashboard-banner-stat-value">
                  {loading ? '—' : totalCourses.toLocaleString()}
                </div>
                <div className="dashboard-banner-stat-label">Total Courses</div>
              </div>
            </div>
            <div className="dashboard-banner-stat">
              <div className="dashboard-banner-stat-icon"><ToolOutlined /></div>
              <div>
                <div className="dashboard-banner-stat-value">
                  {loading ? '—' : totalWorkshops.toLocaleString()}
                </div>
                <div className="dashboard-banner-stat-label">Workshops</div>
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
        <CommonCard
          title="Platform Overview"
          cardProps={{ className: 'dashboard-create-card bg-surface!' }}
        >
          {loading ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 mb-4">
                <StatCard
                  icon={<ShoppingCartOutlined />}
                  value={coursePurchaseCount}
                  label="Course Purchases"
                  color="bg-primary/80"
                />
                <StatCard
                  icon={<AppstoreOutlined />}
                  value={workshopPurchaseCount}
                  label="Workshop Purchases"
                  color="bg-teal/70"
                />
              </div>
              <CommonButton
                type="primary"
                onClick={() => navigate(ROUTES.COURSE.BASE)}
                className="dashboard-primary-button w-full justify-center"
              >
                <PlusOutlined /> Create New Course
              </CommonButton>
            </>
          )}
        </CommonCard>
      </motion.div>
    </div>
  );
};

export default DashboardBanner;