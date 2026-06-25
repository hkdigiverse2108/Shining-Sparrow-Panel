import React, { useMemo } from 'react';
import { Skeleton } from 'antd';
import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { CommonCard } from '@/Components';
import { Queries } from '@/Api';

const CourseStatusOverview: React.FC = () => {
  const { data: courseRes, isLoading: courseLoading } = Queries.useGetCourses({ page: 1, limit: 1000 });

  const courses = useMemo(() => courseRes?.data?.course_data || [], [courseRes]);
  const activeCourses = useMemo(() => courses.filter((c: any) => !c.isBlocked).length, [courses]);
  const blockedCourses = useMemo(() => courses.filter((c: any) => c.isBlocked).length, [courses]);

  const items = [
    { label: 'Active Courses', value: activeCourses, icon: <CheckCircleOutlined />, color: 'text-success bg-success/10' },
    { label: 'Blocked Courses', value: blockedCourses, icon: <StopOutlined />, color: 'text-danger bg-danger/10' },
  ];

  return (
    <div>
      <CommonCard
        title="Course Overview"
        cardProps={{ className: 'h-full' }}
      >
        {courseLoading ? (
          <Skeleton active paragraph={{ rows: 2 }} />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {items.map((item) => (
              <div key={item.label} className="flex flex-col p-5 rounded-xl bg-surface-muted/60 border border-border/50 hover:border-border hover:bg-surface hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="text-text-muted opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">{item.label}</div>
                <div className="text-2xl font-extrabold text-foreground leading-tight">{item.value.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </CommonCard>
    </div>
  );
};

export default CourseStatusOverview;