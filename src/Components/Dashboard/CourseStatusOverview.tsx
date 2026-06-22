import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Skeleton } from 'antd';
import { BookOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { fadeInUp } from '@/Utils/animations';
import { CommonCard } from '@/Components';
import { Queries } from '@/Api';

const CourseStatusOverview: React.FC = () => {
  const { data: dashRes, isLoading } = Queries.useGetDashboard();
  const { data: courseRes, isLoading: courseLoading } = Queries.useGetCourses({ page: 1, limit: 1000 });

  const stats = dashRes?.data?.sec1 ?? {};
  const totalCourses = stats.totalCourses ?? 0;
  const coursePurchaseCount = stats.coursePurchaseCount ?? 0;

  const courses = useMemo(() => courseRes?.data?.course_data || [], [courseRes]);
  const activeCourses = useMemo(() => courses.filter((c: any) => !c.isBlocked).length, [courses]);
  const blockedCourses = useMemo(() => courses.filter((c: any) => c.isBlocked).length, [courses]);

  const loading = isLoading || courseLoading;

  const items = [
    { label: 'Total Courses', value: totalCourses, icon: <BookOutlined />, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Active', value: activeCourses, icon: <CheckCircleOutlined />, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Blocked', value: blockedCourses, icon: <StopOutlined />, color: 'text-danger', bg: 'bg-danger/10' },
    { label: 'Purchases', value: coursePurchaseCount, icon: <BookOutlined />, color: 'text-indigo', bg: 'bg-indigo/10' },
  ];

  return (
    <motion.div variants={fadeInUp}>
      <CommonCard
        title="Course Overview"
        cardProps={{ className: 'h-full bg-surface!' }}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {items.map((item) => (
              <div key={item.label} className={`flex flex-col gap-1 p-4 rounded-xl border border-border`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${item.bg} ${item.color}`}>
                  {item.icon}
                </div>
                <span className={`text-2xl font-extrabold ${item.color}`}>{item.value.toLocaleString()}</span>
                <span className="text-xs text-muted font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </CommonCard>
    </motion.div>
  );
};

export default CourseStatusOverview;