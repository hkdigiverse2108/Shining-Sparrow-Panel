import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Table, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/Constants';
import { fadeInUp } from '@/Utils/animations';
import { Queries } from '@/Api';
import { CommonTag } from '@/Components/Common/CommonTag';

const DashboardUsersTable: React.FC = () => {
  const navigate = useNavigate();
  const { data: userRes, isLoading } = Queries.useGetUser({ page: 1, limit: 100 });

  const users = useMemo(() => {
    const data = userRes?.data?.user_data || userRes?.data || [];
    const arr = Array.isArray(data) ? data : [];
    return arr.slice(0, 5);
  }, [userRes]);

  const columns = [
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
          <div className="min-w-0">
            <div className="font-semibold text-foreground text-sm truncate max-w-[120px]">{r.fullName || r.name || 'Unknown'}</div>
            <div className="text-xs text-text-muted truncate max-w-[120px]">{r.email}</div>
          </div>
        </div>
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
    <motion.div variants={fadeInUp} className="bg-surface border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-200 flex-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground m-0">Recent Users</h2>
        <button
          type="button"
          onClick={() => navigate(ROUTES.USERS.BASE)}
          className="text-text-muted opacity-50 hover:opacity-100 hover:text-primary transition-all duration-200 bg-transparent border-none cursor-pointer p-1.5 rounded hover:bg-surface-muted flex items-center justify-center"
          title="View All Users"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </button>
      </div>

      <Table
        rowKey={(r: any) => r._id || r.id}
        columns={columns}
        dataSource={users}
        loading={isLoading}
        pagination={false}
        scroll={{ x: 'max-content' }}
        className="common-table-surface"
      />
    </motion.div>
  );
};

export default DashboardUsersTable;
