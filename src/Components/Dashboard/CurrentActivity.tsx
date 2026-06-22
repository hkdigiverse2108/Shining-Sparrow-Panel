import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Skeleton } from 'antd';
import { BookOutlined, ToolOutlined, UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { fadeInUp } from '@/Utils/animations';
import { CommonCard } from '@/Components';
import { Queries } from '@/Api';

const CurrentActivity: React.FC = () => {
  const { data: dashRes, isLoading } = Queries.useGetDashboard();

  const stats = dashRes?.data?.sec1 ?? {};
  const totalStudents = stats.totalStudents ?? 0;
  const totalCourses = stats.totalCourses ?? 0;
  const totalWorkshops = stats.totalWorkshops ?? 0;
  const coursePurchaseCount = stats.coursePurchaseCount ?? 0;
  const workshopPurchaseCount = stats.workshopPurchaseCount ?? 0;

  const items = useMemo(() => [
    { label: 'Total Students', value: totalStudents, icon: <UserOutlined />, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Courses', value: totalCourses, icon: <BookOutlined />, color: 'text-indigo', bg: 'bg-indigo/10' },
    { label: 'Total Workshops', value: totalWorkshops, icon: <ToolOutlined />, color: 'text-teal', bg: 'bg-teal/10' },
    { label: 'Course Sales', value: coursePurchaseCount, icon: <ShoppingCartOutlined />, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Workshop Sales', value: workshopPurchaseCount, icon: <ShoppingCartOutlined />, color: 'text-orange', bg: 'bg-orange/10' },
  ], [totalStudents, totalCourses, totalWorkshops, coursePurchaseCount, workshopPurchaseCount]);

  return (
    <motion.div variants={fadeInUp}>
      <CommonCard
        title="Platform Stats"
        topContent={<span className="text-xs text-muted">Live data from backend</span>}
        cardProps={{ className: 'h-full bg-surface!' }}
      >
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-xl border border-border">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.bg} ${item.color}`}>
                    {item.icon}
                  </div>
                  <span className="text-sm text-foreground font-medium">{item.label}</span>
                </div>
                <span className={`text-lg font-extrabold ${item.color}`}>{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </CommonCard>
    </motion.div>
  );
};

export default CurrentActivity;