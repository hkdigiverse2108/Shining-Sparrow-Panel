import { useState, useMemo, type FC } from 'react';
import { Button, Tag, Tooltip, DatePicker, Col } from 'antd';
import {
  DeleteOutlined,
  EditOutlined, CalendarOutlined,
  LockOutlined, UnlockOutlined
} from '@ant-design/icons';
import { motion } from 'motion/react';
import { useQueryClient } from '@tanstack/react-query';
import { CommonBreadcrumbs, CommonPageWrapper, CommonTable, CommonDeleteModal, CommonSummaryCards, AdvancedSearch } from '@/Components';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { BREADCRUMBS } from '@/Data';
import { Queries, Mutations, Get } from '@/Api';
import { KEYS, URL_KEYS } from '@/Constants';
import { useDebounce } from '@/Utils';
import type { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import { CouponForm } from './CouponForm';

const getCouponColumns = ({ 
  onEdit, 
  onToggleStatus, 
  onDelete, 
  current = 1, 
  pageSize = 10 
}: any): ColumnType<any>[] => [
  {
    title: '#',
    key: 'srNo',
    align:"center",
    width: 70,
    render: (_: any, __: any, index: number) => (current - 1) * pageSize + index + 1
  },
  {
    title: 'Code',
    dataIndex: 'code',
    width: 140,
    align:"center",
    render: (v: string) => (
      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-xs font-mono font-bold uppercase tracking-wider">
        {v}
      </span>
    )
  },
  {
    title: 'Title',
    dataIndex: 'title',
    align:"center",
    render: (v: string) => <span className="font-semibold text-foreground">{v}</span>
  },
  {
    title: 'Discount',
    dataIndex: 'discountValue',
    width: 130,
    align:"center",
    render: (_, r: any) => (
      <span className="font-medium">
        {r.discountType === 'percentage' ? `${r.discountValue}%` : `₹${r.discountValue}`}
      </span>
    )
  },
  {
    title: 'Applies To',
    dataIndex: 'appliesTo',
    align:"center",
    width: 130,
    render: (v: string) => (
      <Tag color={v === 'default' ? 'cyan' : v === 'course' ? 'blue' : 'purple'} className="capitalize border-none font-medium">
        {v === 'default' ? 'All' : v}
      </Tag>
    )
  },
  {
    title: 'Validity',
    width: 220,
    align:"center",
    render: (_, r: any) => (
      <div className="flex flex-col items-center justify-center gap-0.5 text-xs text-muted">
        <span className="flex items-center gap-1">
          <CalendarOutlined className="text-[10px]" />
          Start: {r.startDate ? dayjs(r.startDate).format('DD MMM YYYY') : '—'}
        </span>
        <span className="flex items-center gap-1">
          <CalendarOutlined className="text-[10px]" />
          End: {r.endDate ? dayjs(r.endDate).format('DD MMM YYYY') : '—'}
        </span>
      </div>
    )
  },
  {
    title: 'Usage',
    width: 130,
    align:"center",
    render: (_, r: any) => (
      <span className="text-xs text-muted">
        {r.usedCount} / {r.usageLimit ? r.usageLimit : 'Unlimited'}
      </span>
    )
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    width: 120,
    align:"center",
    render: (_: any, r: any) => {
      const isAct = r.status === 'active';
      return (
        <div className="flex gap-1 justify-center">
          <Tooltip title={isAct ? "Deactivate Coupon" : "Activate Coupon"}>
            <Button
              type="text"
              size="small"
              icon={isAct ? <LockOutlined /> : <UnlockOutlined />}
              onClick={() => onToggleStatus(r)}
              className={isAct ? "hover:!bg-amber-500/10 hover:!text-amber-500 text-muted transition-all duration-200" : "hover:!bg-emerald-500/10 hover:!text-emerald-500 text-muted transition-all duration-200"}
            />
          </Tooltip>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(r)} />
          <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete(r)} />
        </div>
      );
    }
  }
];

const CouponPage: FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Advanced Search states
  const [discountTypeFilter, setDiscountTypeFilter] = useState<string | undefined>("all");
  const [appliesToFilter, setAppliesToFilter] = useState<string | undefined>("all");
  const [validityDateRange, setValidityDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [usageStatusFilter, setUsageStatusFilter] = useState<string | undefined>("all");

  // State for Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<any | null>(null);

  // Fetch Coupons
  const { data: responseData, isLoading, isFetching } = Queries.useGetCouponCodes({
    page: current,
    limit: pageSize,
    search: debouncedSearchQuery,
    discountType: discountTypeFilter === "all" ? undefined : discountTypeFilter,
    appliesTo: appliesToFilter === "all" ? undefined : appliesToFilter,
    validStartDate: validityDateRange?.[0] ? validityDateRange[0].startOf('day').toISOString() : undefined,
    validEndDate: validityDateRange?.[1] ? validityDateRange[1].endOf('day').toISOString() : undefined,
    usageStatus: usageStatusFilter === "all" ? undefined : usageStatusFilter,
  });

  const coupons = useMemo(() => responseData?.data?.coupon_code_data || [], [responseData]);
  const totalCoupons = Number(responseData?.data?.totalData) || 0;

  // Fetch Courses & Workshops for Form dropdown selection
  const { data: coursesRes } = Queries.useGetCourses({ page: 1, limit: 1000 });
  const coursesOptions = useMemo(() => 
    (coursesRes?.data?.course_data || []).map((c: any) => ({ value: c._id, label: c.name })), 
    [coursesRes]
  );

  const { data: workshopsRes } = Queries.useGetWorkshops({ page: 1, limit: 1000 });
  const workshopsOptions = useMemo(() => 
    (workshopsRes?.data?.workshop_data || []).map((w: any) => ({ value: w._id, label: w.title })), 
    [workshopsRes]
  );

  // Mutations
  const addCouponMutation = Mutations.useAddCouponCode();
  const editCouponMutation = Mutations.useUpdateCouponCode();
  const deleteCouponMutation = Mutations.useDeleteCouponCode();

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setCurrent(1);
  };

  const handleSave = (values: any) => {
    const mutation = editingCoupon ? editCouponMutation : addCouponMutation;
    mutation.mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.COUPON_CODE.BASE] });
        setIsFormOpen(false);
        setEditingCoupon(null);
      },
    });
  };

  const handleToggleStatus = (coupon: any) => {
    const nextStatus = coupon.status === 'active' ? 'inactive' : 'active';
    editCouponMutation.mutate(
      { 
        couponCodeId: coupon._id, 
        status: nextStatus 
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.COUPON_CODE.BASE] });
        }
      }
    );
  };

  const handleDeleteClick = (coupon: any) => { 
    setCouponToDelete(coupon);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!couponToDelete) return;
    deleteCouponMutation.mutate(couponToDelete._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.COUPON_CODE.BASE] });
        setIsDeleteModalOpen(false);
        setCouponToDelete(null);
      }
    });
  };

  const columns = useMemo(() => getCouponColumns({ 
    onEdit: (c: any) => { setEditingCoupon(c); setIsFormOpen(true); }, 
    onToggleStatus: handleToggleStatus,
    onDelete: handleDeleteClick,
    current,
    pageSize
  }), [current, pageSize]);  

  const handleTableChange = (pagination: any) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleExportAll = async () => {
    const res = await Get<any>(URL_KEYS.COUPON_CODE.GET, {
      page: 1,
      limit: 10000,
      search: debouncedSearchQuery || undefined,
      discountType: discountTypeFilter === "all" ? undefined : discountTypeFilter,
      appliesTo: appliesToFilter === "all" ? undefined : appliesToFilter,
      validStartDate: validityDateRange?.[0] ? validityDateRange[0].startOf('day').toISOString() : undefined,
      validEndDate: validityDateRange?.[1] ? validityDateRange[1].endOf('day').toISOString() : undefined,
      usageStatus: usageStatusFilter === "all" ? undefined : usageStatusFilter,
    });
    return res?.data?.coupon_code_data || [];
  };

  return (
    <>
      <CommonBreadcrumbs title="Coupon Codes" breadcrumbs={BREADCRUMBS.COUPON_CODE.BASE} />
      <CommonPageWrapper>
        {isFormOpen ? (
          <div className="course-container course-container--narrow">
            <CouponForm 
              open={isFormOpen} 
              onClose={() => { setIsFormOpen(false); setEditingCoupon(null); }} 
              onSave={handleSave} 
              editing={editingCoupon} 
              loading={addCouponMutation.isPending || editCouponMutation.isPending}
              courses={coursesOptions}
              workshops={workshopsOptions}
            />
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <CommonSummaryCards 
              total={totalCoupons} 
              active={coupons.filter((c: any) => c.status === 'active').length} 
              blocked={coupons.filter((c: any) => c.status === 'inactive').length} 
              subject="Coupons" 
            />
            <motion.div variants={blurRevealUp}>
            <AdvancedSearch filter={[
              {
                label: "Discount Format",
                value: discountTypeFilter,
                options: [
                  { label: "All", value: "all" },
                  { label: "Percentage (%)", value: "percentage" },
                  { label: "Flat Amount (₹)", value: "flat" }
                ],
                onChange: (val: any) => { setDiscountTypeFilter(val); setCurrent(1); },
                grid: { xs: 24, sm: 12, md: 5 }
              },
              {
                label: "Product Applicability",
                value: appliesToFilter,
                options: [
                  { label: "All", value: "all" },
                  { label: "Default (Global)", value: "default" },
                  { label: "Course Specific", value: "course" },
                  { label: "Workshop Specific", value: "workshop" }
                ],
                onChange: (val: any) => { setAppliesToFilter(val); setCurrent(1); },
                grid: { xs: 24, sm: 12, md: 5 }
              },
              {
                label: "Usage Depletion",
                value: usageStatusFilter,
                options: [
                  { label: "All", value: "all" },
                  { label: "Valid Coupons", value: "valid" },
                  { label: "Depleted Coupons", value: "depleted" }
                ],
                onChange: (val: any) => { setUsageStatusFilter(val); setCurrent(1); },
                grid: { xs: 24, sm: 12, md: 5 }
              }
            ]}>
              <Col xs={24} sm={12} md={5} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">Validity Period</span>
                <DatePicker.RangePicker
                  value={validityDateRange}
                  onChange={(dates) => {
                    setValidityDateRange(dates as any);
                    setCurrent(1);
                  }}
                  className="rounded-lg h-[40px] w-full"
                />
              </Col>
              {(discountTypeFilter !== "all" || appliesToFilter !== "all" || usageStatusFilter !== "all" || validityDateRange) && (
                <Col xs={24} sm={24} md={4}>
                  <Button
                    onClick={() => {
                      setDiscountTypeFilter("all");
                      setAppliesToFilter("all");
                      setValidityDateRange(null);
                      setUsageStatusFilter("all");
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
                data={coupons} 
                loading={isLoading || isFetching || addCouponMutation.isPending || editCouponMutation.isPending} 
                searchPlaceholder="Search coupons..." 
                onSearch={handleSearch} 
                onAdd={() => { setEditingCoupon(null); setIsFormOpen(true); }} 
                fileName="Coupon_Codes" 
                onExportAll={handleExportAll} 
                title="Coupon Codes" 
                current={current} 
                pageSize={pageSize} 
                total={totalCoupons} 
                onTableChange={handleTableChange} 
                scroll={{ x: 1000 }} 
              />
            </motion.div>
          </motion.div>
        )}
      </CommonPageWrapper>
      <CommonDeleteModal 
        open={isDeleteModalOpen} 
        title="Delete Coupon Code" 
        itemName={couponToDelete?.code} 
        loading={deleteCouponMutation.isPending} 
        onClose={() => { setIsDeleteModalOpen(false); setCouponToDelete(null); }} 
        onConfirm={handleConfirmDelete} 
      />
    </>
  );
};

export default CouponPage;
