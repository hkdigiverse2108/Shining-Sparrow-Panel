import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Table, Tag, Button, Tooltip, Popconfirm, message } from 'antd';
import { ClockCircleOutlined, DesktopOutlined, GlobalOutlined, DeleteOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { fadeInUp } from '@/Utils/animations';
import { Queries, Mutations } from '@/Api';
import { KEYS } from '@/Constants';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CommonSimplePagination } from '@/Components/Common/CommonSimplePagination';

dayjs.extend(relativeTime);

import type { ColumnType } from 'antd/es/table';

const DashboardLoginHistoryTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();

  const { data: historyRes, isLoading } = Queries.useGetLoginHistory({ page, limit: pageSize });
  const deleteMutation = Mutations.useDeleteLoginHistory();
  const blockMutation = Mutations.useBlockDevice();
  const unblockMutation = Mutations.useUnblockDevice();

  const records = useMemo(() => {
    return historyRes?.data?.records || [];
  }, [historyRes]);

  const total = historyRes?.data?.total ?? 0;

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        message.success('Login log deleted successfully');
        queryClient.invalidateQueries({ queryKey: [KEYS.DASHBOARD.LOGIN_HISTORY] });
      },
      onError: (err: any) => {
        message.error(err?.message || 'Failed to delete login log');
      }
    });
  };

  const handleBlock = (id: string) => {
    blockMutation.mutate(id, {
      onSuccess: () => {
        message.success('Device blocked successfully');
        queryClient.invalidateQueries({ queryKey: [KEYS.DASHBOARD.LOGIN_HISTORY] });
      },
      onError: (err: any) => {
        message.error(err?.message || 'Failed to block device');
      }
    });
  };

  const handleUnblock = (id: string) => {
    unblockMutation.mutate(id, {
      onSuccess: () => {
        message.success('Device unblocked successfully');
        queryClient.invalidateQueries({ queryKey: [KEYS.DASHBOARD.LOGIN_HISTORY] });
      },
      onError: (err: any) => {
        message.error(err?.message || 'Failed to unblock device');
      }
    });
  };

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
      align: 'center',
      render: (_: any, r: any) => (
        <div className="flex items-center justify-center gap-1.5">
          <ClockCircleOutlined className="text-text-muted text-xs" />
          <span className="text-xs text-text-muted">
            {r.createdAt ? dayjs(r.createdAt).format('DD MMM, hh:mm A') : 'N/A'}
          </span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isBlocked',
      align: 'center',
      render: (isBlocked: boolean) => (
        isBlocked ? (
          <Tag color="error" className="m-0 uppercase font-semibold text-xs rounded-full">
            Blocked
          </Tag>
        ) : (
          <Tag color="success" className="m-0 uppercase font-semibold text-xs rounded-full">
            Allowed
          </Tag>
        )
      ),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right',
      render: (_: any, r: any) => (
        <div className="flex justify-end items-center gap-2">
          {r.isBlocked ? (
            <Tooltip title="Unblock Device">
              <Button
                type="text"
                shape="circle"
                icon={<CheckCircleOutlined className="text-success text-sm" />}
                onClick={() => handleUnblock(r._id)}
                loading={unblockMutation.isPending}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Block Device">
              <Popconfirm
                title="Block Device"
                description="Are you sure you want to block this device? It will not be able to log in to the admin panel."
                onConfirm={() => handleBlock(r._id)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Button
                  type="text"
                  shape="circle"
                  icon={<StopOutlined className="text-error text-sm" />}
                  loading={blockMutation.isPending}
                />
              </Popconfirm>
            </Tooltip>
          )}

          <Tooltip title="Delete Log">
            <Popconfirm
              title="Delete Login Log"
              description={r.isBlocked ? "Deleting this blocked log will unblock the device. Continue?" : "Are you sure you want to delete this log?"}
              onConfirm={() => handleDelete(r._id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                shape="circle"
                icon={<DeleteOutlined className="text-error text-sm" />}
                loading={deleteMutation.isPending}
              />
            </Popconfirm>
          </Tooltip>
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
      <CommonSimplePagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />
    </motion.div>
  );
};

export default DashboardLoginHistoryTable;
