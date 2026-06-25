import React, { useMemo } from 'react';
import { Skeleton } from 'antd';
import { BookOutlined, ToolOutlined, UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
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
    { label: 'Total Courses', value: totalCourses, icon: <BookOutlined />, color: 'text-info', bg: 'bg-info/10' },
    { label: 'Total Workshops', value: totalWorkshops, icon: <ToolOutlined />, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Course Sales', value: coursePurchaseCount, icon: <ShoppingCartOutlined />, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Workshop Sales', value: workshopPurchaseCount, icon: <ShoppingCartOutlined />, color: 'text-primary-dark', bg: 'bg-primary/10' },
  ], [totalStudents, totalCourses, totalWorkshops, coursePurchaseCount, workshopPurchaseCount]);

  return (
    <div>
      <CommonCard
        title="Platform Stats"
        cardProps={{ className: 'h-full' }}
      >
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : (
          <div className="flex flex-col">
            {items.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-surface-muted transition-all duration-200 group border-b border-border/20 last:border-b-0">
                <div className="flex items-center gap-3.5">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-105 ${item.bg} ${item.color}`}>
                    {item.icon}
                  </div>
                  <span className="text-sm text-foreground/80 font-semibold group-hover:text-foreground transition-colors">{item.label}</span>
                </div>
                <span className={`text-base font-extrabold ${item.color}`}>{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </CommonCard>
    </div>
  );
};

export default CurrentActivity;