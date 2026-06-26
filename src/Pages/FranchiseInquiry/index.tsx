import { useState, useMemo, type FC } from 'react';
import { Avatar, Button, Tag, Tooltip, DatePicker, Col } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, DeleteOutlined, EyeOutlined, CheckCircleOutlined, InboxOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import { useQueryClient } from '@tanstack/react-query';
import { CommonBreadcrumbs, CommonPageWrapper, CommonTable, CommonDeleteModal, AdvancedSearch } from '@/Components';

import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { BREADCRUMBS } from '@/Data';
import { Queries, Mutations, Get } from '@/Api';
import { KEYS, ROUTES, URL_KEYS } from '@/Constants';
import { useDebounce } from '@/Utils';
import type { ColumnType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

// ─── Columns ────────────────────────────────────────────────────────────────
const getColumns = ({
  onView,
  onDelete,
  current = 1,
  pageSize = 10,
}: {
  onView: (r: any) => void;
  onDelete: (r: any) => void;
  current?: number;
  pageSize?: number;
}): ColumnType<any>[] => [
  {
    title: '#',
    key: 'srNo',
    width: 60,
    align: 'center' as const,
    render: (_: any, __: any, i: number) => (
      <span className="font-mono text-xs text-muted font-semibold">
        {(current - 1) * pageSize + i + 1}
      </span>
    ),
  },
  {
    title: 'Applicant',
    dataIndex: 'name',
    render: (v: string, r: any) => (
      <div className="flex items-center gap-3">
        <Avatar size={38} icon={<UserOutlined />} className="shrink-0 border border-border shadow-sm" style={{ backgroundColor: 'var(--primary)', opacity: 0.85 }} />
        <div className="min-w-0">
          <div className="text-sm font-semibold text-foreground truncate flex items-center gap-1.5">
            {v}
            {!r.isRead && (
              <span className="inline-block w-2 h-2 rounded-full bg-primary shrink-0" title="Unread" />
            )}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Email',
    dataIndex: 'email',
    render: (v: string) => (
      <div className="flex items-center gap-1.5 text-sm text-muted">
        <MailOutlined className="text-[10px]" />
        <span>{v || '—'}</span>
      </div>
    ),
  },
  {
    title: 'Phone',
    dataIndex: 'phoneNumber',
    width: 140,
    align: 'center' as const,
    render: (v: string) => (
      <div className="flex items-center gap-1.5 text-sm text-muted justify-center">
        <PhoneOutlined className="text-xs" />
        <span className="font-mono">{v || '—'}</span>
      </div>
    ),
  },
  {
    title: 'Location',
    key: 'location',
    width: 150,
    align: 'center' as const,
    render: (_: any, r: any) => (
      <div className="flex flex-col items-center gap-0.5 text-xs text-muted">
        {r.city && <span>{r.city}</span>}
        {r.state && <span className="text-muted/70">{r.state}</span>}
        {!r.city && !r.state && <span className="italic">—</span>}
      </div>
    ),
  },
  {
    title: 'Budget',
    dataIndex: 'investmentBudget',
    width: 130,
    align: 'center' as const,
    render: (v: string) => (
      <span className="text-xs font-semibold text-foreground">
        {v || <span className="text-muted italic">Not specified</span>}
      </span>
    ),
  },
  {
    title: 'Occupation',
    dataIndex: 'occupation',
    width: 140,
    align: 'center' as const,
    render: (v: string) => (
      <span className="text-xs text-muted">{v || '—'}</span>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'isRead',
    width: 100,
    align: 'center' as const,
    render: (v: boolean) => (
      <Tag
        icon={v ? <CheckCircleOutlined /> : <InboxOutlined />}
        color={v ? 'green' : 'orange'}
        className="capitalize m-0"
      >
        {v ? 'Read' : 'Unread'}
      </Tag>
    ),
  },
  {
    title: 'Date',
    dataIndex: 'createdAt',
    width: 120,
    align: 'center' as const,
    render: (v: string) => (
      <span className="text-xs text-muted">{v ? dayjs(v).format('DD MMM YYYY') : '—'}</span>
    ),
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    width: 100,
    align: 'center' as const,
    fixed: 'right' as const,
    render: (_: any, r: any) => (
      <div className="flex items-center gap-1.5 justify-center">
        <Tooltip title="View Inquiry">
          <Button
            type="text"
            shape="circle"
            icon={<EyeOutlined />}
            onClick={() => onView(r)}
            className="hover:!bg-primary/10 hover:!text-primary text-muted transition-all duration-200"
          />
        </Tooltip>
        <Tooltip title="Delete">
          <Button
            type="text"
            shape="circle"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(r)}
            className="hover:!bg-rose-500/10 transition-all duration-200"
          />
        </Tooltip>
      </div>
    ),
  },
];

// ─── Franchise Inquiry Page ─────────────────────────────────────────────────
const FranchiseInquiryPage: FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState<any>(null);

  // Advanced Search states
  const [isReadFilter, setIsReadFilter] = useState<string | undefined>('all');
  const [isBlockedFilter, setIsBlockedFilter] = useState<string | undefined>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  const { data: responseData, isLoading, isFetching } = Queries.useGetFranchiseInquiries({
    page: current,
    limit: pageSize,
    search: debouncedSearch || undefined,
    isRead: isReadFilter === 'all' ? undefined : isReadFilter,
    isBlocked: isBlockedFilter === 'all' ? undefined : isBlockedFilter,
    startDate: dateRange?.[0] ? dateRange[0].startOf('day').toISOString() : undefined,
    endDate: dateRange?.[1] ? dateRange[1].endOf('day').toISOString() : undefined,
  });

  const inquiries = useMemo(() => responseData?.data?.franchise_inquiries_data || responseData?.data?.franchise_inquiry_data || [], [responseData]);
  const totalInquiries = Number(responseData?.data?.totalData) || 0;

  const deleteMutation = Mutations.useDeleteFranchiseInquiry();

  const unreadCount = useMemo(() => inquiries.filter((m: any) => !m.isRead).length, [inquiries]);
  const readCount = useMemo(() => inquiries.filter((m: any) => m.isRead).length, [inquiries]);
  const handleView = (inquiry: any) => {
    navigate(`${ROUTES.FRANCHISE_INQUIRY}/${inquiry._id}`, { state: { record: inquiry } });
  };

  const handleDeleteClick = (inquiry: any) => {
    setInquiryToDelete(inquiry);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!inquiryToDelete) return;
    deleteMutation.mutate(inquiryToDelete._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.FRANCHISE_INQUIRY.BASE] });
        setIsDeleteModalOpen(false);
        setInquiryToDelete(null);
      },
    });
  };

  const handleTableChange = (pagination: any) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleExportAll = async () => {
    const res = await Get<any>(URL_KEYS.FRANCHISE_INQUIRY.GET, {
      page: 1,
      limit: 10000,
      search: debouncedSearch || undefined,
      isRead: isReadFilter === "all" ? undefined : isReadFilter,
      isBlocked: isBlockedFilter === "all" ? undefined : isBlockedFilter,
      startDate: dateRange?.[0] ? dateRange[0].startOf('day').toISOString() : undefined,
      endDate: dateRange?.[1] ? dateRange[1].endOf('day').toISOString() : undefined,
    });
    return res?.data?.franchise_inquiries_data || res?.data?.franchise_inquiry_data || [];
  };

  const columns = useMemo(
    () => getColumns({ onView: handleView, onDelete: handleDeleteClick, current, pageSize }),
    [current, pageSize]
  );

  return (
    <>
      <CommonBreadcrumbs title="Franchise Inquiries" breadcrumbs={BREADCRUMBS.FRANCHISE_INQUIRY.BASE} />
      <CommonPageWrapper>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">

          {/* Summary Cards */}
          <motion.div variants={blurRevealUp} className="user-metrics-grid">
            <div className="user-metric-card">
              <div className="user-metric-icon user-metric-icon--total">
                <InboxOutlined />
              </div>
              <div className="user-metric-info">
                <p className="user-metric-title">Total Inquiries</p>
                <p className="user-metric-value">{totalInquiries}</p>
              </div>
            </div>
            <div className="user-metric-card">
              <div className="user-metric-icon user-metric-icon--blocked">
                <MailOutlined />
              </div>
              <div className="user-metric-info">
                <p className="user-metric-title">Unread</p>
                <p className="user-metric-value">{unreadCount}</p>
              </div>
            </div>
            <div className="user-metric-card">
              <div className="user-metric-icon user-metric-icon--active">
                <CheckCircleOutlined />
              </div>
              <div className="user-metric-info">
                <p className="user-metric-title">Read</p>
                <p className="user-metric-value">{readCount}</p>
              </div>
            </div>
          </motion.div>

          {/* Table with Advanced Search */}
          <motion.div variants={blurRevealUp}>
            <AdvancedSearch filter={[
              {
                label: 'Read State',
                value: isReadFilter,
                options: [
                  { label: 'All', value: 'all' },
                  { label: 'Unread Inquiries', value: 'false' },
                  { label: 'Read Inquiries', value: 'true' },
                ],
                onChange: (val: any) => { setIsReadFilter(val); setCurrent(1); },
                grid: { xs: 24, sm: 12, md: 6 },
              },
              {
                label: 'Status',
                value: isBlockedFilter,
                options: [
                  { label: 'All', value: 'all' },
                  { label: 'Active', value: 'false' },
                  { label: 'Blocked', value: 'true' },
                ],
                onChange: (val: any) => { setIsBlockedFilter(val); setCurrent(1); },
                grid: { xs: 24, sm: 12, md: 6 },
              },
            ]}>
              <Col xs={24} sm={12} md={6} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">Date Received Range</span>
                <DatePicker.RangePicker
                  value={dateRange}
                  onChange={(dates) => { setDateRange(dates as any); setCurrent(1); }}
                  className="rounded-lg h-[40px] w-full"
                />
              </Col>
              {(isReadFilter !== 'all' || isBlockedFilter !== 'all' || dateRange) && (
                <Col xs={24} sm={24} md={6}>
                  <Button
                    onClick={() => {
                      setIsReadFilter('all');
                      setIsBlockedFilter('all');
                      setDateRange(null);
                      setCurrent(1);
                    }}
                    className="h-[40px] px-6 rounded-lg font-semibold hover:border-primary hover:text-primary transition-all duration-200 text-foreground"
                  >
                    Clear Filters
                  </Button>
                </Col>
              )}
            </AdvancedSearch>

            <CommonTable
              columns={columns}
              data={inquiries}
              loading={isLoading || isFetching || deleteMutation.isPending}
              searchPlaceholder="Search by name, email, city..."
              onSearch={(q) => { setSearchQuery(q); setCurrent(1); }}
              current={current}
              pageSize={pageSize}
              total={totalInquiries}
              onTableChange={handleTableChange}
              onExportAll={handleExportAll}
              fileName="franchise-inquiries"
              title="Franchise Inquiries"
            />
          </motion.div>
        </motion.div>
      </CommonPageWrapper>

      {/* Delete Modal */}
      <CommonDeleteModal
        open={isDeleteModalOpen}
        title="Delete Franchise Inquiry"
        itemName={inquiryToDelete?.name}
        loading={deleteMutation.isPending}
        onClose={() => { setIsDeleteModalOpen(false); setInquiryToDelete(null); }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default FranchiseInquiryPage;
