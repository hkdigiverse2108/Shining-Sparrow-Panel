import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Table, Avatar } from 'antd';
import { BookOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/Constants';
import { fadeInUp } from '@/Utils/animations';
import { Queries } from '@/Api';
import { CommonTag } from '@/Components/Common/CommonTag';

const DashboardTable: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'courses' | 'users'>('courses');

  const { data: courseRes, isLoading: courseLoading } = Queries.useGetCourses({ page: 1, limit: 100 });
  const { data: userRes, isLoading: userLoading } = Queries.useGetUser({ page: 1, limit: 100 });

  const courses = useMemo(() => {
    return (courseRes?.data?.course_data || []).slice(0, 5);
  }, [courseRes]);

  const users = useMemo(() => {
    const data = userRes?.data?.user_data || userRes?.data || [];
    const arr = Array.isArray(data) ? data : [];
    return arr.slice(0, 5);
  }, [userRes]);

  const courseColumns = [
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
          <span className="font-semibold text-foreground text-sm">{r.name}</span>
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
      title: 'Language',
      dataIndex: 'language',
      render: (v: any) => (
        <span className="text-text-muted text-sm">{v || 'N/A'}</span>
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

  const userColumns = [
    {
      title: 'User',
      dataIndex: 'fullName',
      render: (_: any, r: any) => (
        <div className="flex items-center gap-3">
          <Avatar 
            size={40} 
            src={r.profilePhoto || r.profileImage || undefined} 
            icon={<UserOutlined />} 
            className="shrink-0 bg-primary-soft text-primary"
          />
          <div>
            <div className="font-semibold text-foreground text-sm">{r.fullName || r.name || 'Unknown User'}</div>
            <div className="text-xs text-text-muted">{r.email}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      render: (v: any) => (
        <span className="font-mono text-xs text-text-muted">{v || 'N/A'}</span>
      )
    },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (v: any) => (
        <span className="capitalize text-sm font-medium text-foreground">{v || 'user'}</span>
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
    <motion.div variants={fadeInUp} className="w-full bg-surface border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-foreground m-0">Platform Overview</h2>
        </div>
        <button
          type="button"
          onClick={() => navigate(activeTab === 'courses' ? ROUTES.COURSE.BASE : ROUTES.USERS.BASE)}
          className="text-text-muted opacity-50 hover:opacity-100 hover:text-primary transition-all duration-200 bg-transparent border-none cursor-pointer p-1.5 rounded hover:bg-surface-muted flex items-center justify-center"
          title={activeTab === 'courses' ? 'View All Courses' : 'View All Users'}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4">
        <div className="flex items-center gap-2 bg-surface-muted p-1 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-muted hover:text-foreground'
            }`}
          >
            Courses
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'users'
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-muted hover:text-foreground'
            }`}
          >
            Users
          </button>
        </div>
      </div>

      <Table
        rowKey={(r: any) => r._id || r.id}
        columns={activeTab === 'courses' ? courseColumns : userColumns}
        dataSource={activeTab === 'courses' ? courses : users}
        loading={activeTab === 'courses' ? courseLoading : userLoading}
        pagination={false}
        scroll={{ x: 'max-content' }}
        className="common-table-surface"
        rowSelection={{
          type: 'checkbox',
          onChange: () => {},
        }}
      />
    </motion.div>
  );
};

export default DashboardTable;
