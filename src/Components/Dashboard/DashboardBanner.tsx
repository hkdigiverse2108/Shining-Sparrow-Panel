import React from 'react';
import { PlusOutlined, UserOutlined, BookOutlined, ToolOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/Constants';
import { fadeInUp } from '@/Utils/animations';
import { CommonButton } from '@/Attribute';
import { Queries } from '@/Api';

interface StatCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  color: string;
  bgColor: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color, bgColor, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex flex-col p-5 rounded-2xl bg-surface border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group ${onClick ? 'cursor-pointer' : ''}`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${bgColor} ${color}`}>
        {icon}
      </div>
      <div className="text-text-muted opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </div>
    </div>
    <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">{label}</div>
    <div className="text-3xl font-extrabold text-foreground leading-tight">{value}</div>
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
    <div className="mb-6">
      <motion.div variants={fadeInUp}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl font-bold text-foreground m-0">Dashboard</h1>
            <p className="text-sm text-text-muted mt-1 m-0">Welcome back! Here's what's happening with your platform.</p>
          </div>
          <CommonButton
            type="primary"
            onClick={() => navigate(ROUTES.COURSE.BASE)}
            className="flex items-center gap-2"
          >
            <PlusOutlined /> Create New Course
          </CommonButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<UserOutlined />}
            value={loading ? '—' : totalStudents.toLocaleString()}
            label="Total Students"
            color="text-primary"
            bgColor="bg-primary/10"
            onClick={() => navigate(ROUTES.USERS.BASE)}
          />
          <StatCard
            icon={<BookOutlined />}
            value={loading ? '—' : totalCourses.toLocaleString()}
            label="Total Courses"
            color="text-info"
            bgColor="bg-info/10"
            onClick={() => navigate(ROUTES.COURSE.BASE)}
          />
          <StatCard
            icon={<ToolOutlined />}
            value={loading ? '—' : totalWorkshops.toLocaleString()}
            label="Total Workshops"
            color="text-success"
            bgColor="bg-success/10"
            onClick={() => navigate(ROUTES.WORKSHOP.BASE)}
          />
          <StatCard
            icon={<ShoppingCartOutlined />}
            value={loading ? '—' : (coursePurchaseCount + workshopPurchaseCount).toLocaleString()}
            label="Total Sales"
            color="text-warning"
            bgColor="bg-warning/10"
            onClick={() => navigate(ROUTES.PAYMENTS)}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardBanner;