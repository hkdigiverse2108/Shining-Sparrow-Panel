import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Table, Avatar } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/Constants';
import { fadeInUp } from '@/Utils/animations';
import { Queries } from '@/Api';
import { CommonTag } from '@/Components/Common/CommonTag';

const DashboardCoursesTable: React.FC = () => {
  const navigate = useNavigate();
  const { data: courseRes, isLoading } = Queries.useGetCourses({ page: 1, limit: 100 });

  const courses = useMemo(() => {
    return (courseRes?.data?.course_data || []).slice(0, 5);
  }, [courseRes]);

  const columns = [
    {
      title: 'Course',
      dataIndex: 'name',
      render: (_: any, r: any) => (
        <div className="flex items-center gap-3">
          <Avatar 
            shape="square" 
            size={40} 
            src={r.image || undefined} 
            icon={<BookOutlined />} 
            className="shrink-0 bg-primary-soft text-primary rounded-lg"
          />
          <span className="font-semibold text-foreground text-sm truncate max-w-[150px]">{r.name}</span>
        </div>
      )
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (_v: any, r: any) => (
        <span className="font-semibold text-foreground text-sm">
          ₹{(r.price ?? 0).toLocaleString()}
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'isBlocked',
      render: (v: any) => (
        <CommonTag className={v ? 'status-dot status-dot-blocked' : 'status-dot status-dot-active'}>
          {v ? 'Blocked' : 'Active'}
        </CommonTag>
      )
    }
  ];

  return (
    <motion.div variants={fadeInUp} className="bg-surface border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-200 flex-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground m-0">Recent Courses</h2>
        <button
          type="button"
          onClick={() => navigate(ROUTES.COURSE.BASE)}
          className="text-text-muted opacity-50 hover:opacity-100 hover:text-primary transition-all duration-200 bg-transparent border-none cursor-pointer p-1.5 rounded hover:bg-surface-muted flex items-center justify-center"
          title="View All Courses"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </button>
      </div>

      <Table
        rowKey={(r: any) => r._id || r.id}
        columns={columns}
        dataSource={courses}
        loading={isLoading}
        pagination={false}
        scroll={{ x: 'max-content' }}
        className="common-table-surface"
      />
    </motion.div>
  );
};

export default DashboardCoursesTable;
