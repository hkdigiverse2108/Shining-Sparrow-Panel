import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Table, Tag } from 'antd';
import { ClockCircleOutlined, DesktopOutlined, GlobalOutlined } from '@ant-design/icons';
import { fadeInUp } from '@/Utils/animations';
import { Queries } from '@/Api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

import type { ColumnType } from 'antd/es/table';

const DashboardLoginHistoryTable: React.FC = () => {
  const { data: historyRes, isLoading } = Queries.useGetLoginHistory({ page: 1, limit: 10 });

  const records = useMemo(() => {
    return historyRes?.data?.records || [];
  }, [historyRes]);

  const columns: ColumnType<any>[] = [
    {
      title: 'Device / OS',
      dataIndex: 'device',
      align: 'left',
      render: (_: any, r: any) => (
        <div className="flex items-center gap-2">
          <DesktopOutlined className="text-primary text-sm" />
          <span className="font-semibold text-foreground text-sm">{r.device || 'Unknown'}</span>
        </div>
      ),
    },
    {
      title: 'Browser',
      dataIndex: 'browser',
      align: 'left',
      render: (_: any, r: any) => (
        <span className="text-foreground text-sm">{r.browser || 'Unknown'}</span>
      ),
    },
    {
      title: 'IP Address',
      dataIndex: 'ipAddress',
      align: 'center',
      render: (_: any, r: any) => (
        <div className="flex items-center justify-center gap-1.5">
          <GlobalOutlined className="text-text-muted text-xs" />
          <code className="text-xs font-mono bg-surface-muted px-2 py-0.5 rounded text-foreground">
            {r.ipAddress || 'N/A'}
          </code>
        </div>
      ),
    },
    {
      title: 'Login Time',
      dataIndex: 'createdAt',
      align: 'right',
      render: (_: any, r: any) => (
        <div className="flex items-center justify-end gap-1.5">
          <ClockCircleOutlined className="text-text-muted text-xs" />
          <span className="text-xs text-text-muted">
            {r.createdAt ? dayjs(r.createdAt).format('DD MMM, hh:mm A') : 'N/A'}
          </span>
        </div>
      ),
    },
  ];

  return (
    <motion.div variants={fadeInUp} className="bg-surface border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-foreground m-0">Login History</h2>
          <Tag color="blue" className="rounded-full px-2 py-0 text-[10px] uppercase font-bold m-0">
            Recent
          </Tag>
        </div>
      </div>

      <Table
        rowKey={(r: any) => r._id || r.id}
        columns={columns}
        dataSource={records}
        loading={isLoading}
        pagination={false}
        scroll={{ x: 'max-content' }}
        className="common-table-surface"
      />
    </motion.div>
  );
};

export default DashboardLoginHistoryTable;
