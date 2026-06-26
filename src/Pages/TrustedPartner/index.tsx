import { useState, useMemo, type FC } from 'react';
import { Button, Avatar, DatePicker, Col } from 'antd';
import { DeleteOutlined, EditOutlined, StarOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import dayjs from 'dayjs';
import { useQueryClient } from '@tanstack/react-query';
import { CommonBreadcrumbs, CommonPageWrapper, CommonTable, CommonDeleteModal, CommonSummaryCards, CommonTag, AdvancedSearch } from '@/Components';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { BREADCRUMBS } from '@/Data';
import { Queries, Mutations } from '@/Api';
import { KEYS } from '@/Constants';
import { useDebounce } from '@/Utils';
import type { ColumnType } from 'antd/es/table';
import { TrustedPartnerForm } from '@/Components/TrustedPartner/TrustedPartnerForm';

const getPartnerColumns = ({ 
  onEdit, 
  onToggleStatus,
  onDelete, 
  current = 1, 
  pageSize = 10 
}: any): ColumnType<any>[] => [
  {
    title: '#',
    key: 'srNo',
    align: 'center',
    width: 70,
    render: (_: any, __: any, index: number) => (current - 1) * pageSize + index + 1
  },
  {
    title: 'Logo',
    dataIndex: 'image',
    align: 'center',
    width: 100,
    render: (v: string) => (
      <Avatar shape="square" size={44} src={v} className="bg-surface-muted border border-border">
        {!v && 'Logo'}
      </Avatar>
    )
  },
  {
    title: 'Partner Name',
    dataIndex: 'name',
    align: 'center',
    render: (v: string) => (
      <div className="flex items-center gap-2 justify-center">
        <StarOutlined className="text-amber-500" />
        <span className="font-semibold text-foreground">{v}</span>
      </div>
    )
  },
  {
    title: 'Description',
    dataIndex: 'description',
    align: 'left',
    render: (v: string) => <span className="text-text-muted text-xs line-clamp-2">{v || '—'}</span>
  },
  {
    title: 'Status',
    dataIndex: 'isBlocked',
    align: 'center',
    width: 100,
    render: (v: boolean) => (
      <CommonTag className={v ? "status-dot status-dot-blocked" : "status-dot status-dot-active"}>
        {v ? "Blocked" : "Active"}
      </CommonTag>
    )
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    width: 150,
    align: 'center',
    render: (_: any, r: any) => (
      <div className="flex gap-1 justify-center">
        <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(r)} />
        <Button 
          type="text" 
          size="small" 
          icon={r.isBlocked ? <UnlockOutlined /> : <LockOutlined />} 
          onClick={() => onToggleStatus(r)} 
          title={r.isBlocked ? "Unblock Partner" : "Block Partner"}
        />
        <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete(r)} />
      </div>
    )
  }
];

const TrustedPartnerPage: FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any | null>(null);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State for Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<any | null>(null);

  // Advanced Search states
  const [isBlockedFilter, setIsBlockedFilter] = useState<string | undefined>("all");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // Fetch Trusted Partners
  const { data: responseData, isLoading } = Queries.useGetTrustedPartners({
    page: current,
    limit: pageSize,
    search: debouncedSearchQuery,
    isBlocked: isBlockedFilter === "all" ? undefined : isBlockedFilter,
    startDate: dateRange?.[0] ? dateRange[0].startOf('day').toISOString() : undefined,
    endDate: dateRange?.[1] ? dateRange[1].endOf('day').toISOString() : undefined,
  });

  const partners = useMemo(() => responseData?.data?.trusted_partner_data || [], [responseData]);
  const totalPartners = Number(responseData?.data?.totalData) || 0;

  // Mutations
  const addPartnerMutation = Mutations.useAddTrustedPartner();
  const editPartnerMutation = Mutations.useUpdateTrustedPartner();
  const deletePartnerMutation = Mutations.useDeleteTrustedPartner();

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setCurrent(1);
  };

  const handleSave = (values: any) => {
    const mutation = editingPartner ? editPartnerMutation : addPartnerMutation;
    mutation.mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.TRUSTED_PARTNER.BASE] });
        setIsFormOpen(false);
        setEditingPartner(null);
      },
    });
  };

  const handleToggleStatus = (partner: any) => {
    editPartnerMutation.mutate({
      trustedPartnerId: partner._id,
      name: partner.name,
      image: partner.image,
      description: partner.description,
      isBlocked: !partner.isBlocked
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.TRUSTED_PARTNER.BASE] });
      }
    });
  };

  const handleDeleteClick = (partner: any) => { 
    setPartnerToDelete(partner);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!partnerToDelete) return;
    deletePartnerMutation.mutate(partnerToDelete._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.TRUSTED_PARTNER.BASE] });
        setIsDeleteModalOpen(false);
        setPartnerToDelete(null);
      }
    });
  };

  const columns = useMemo(() => getPartnerColumns({ 
    onEdit: (p: any) => { setEditingPartner(p); setIsFormOpen(true); }, 
    onToggleStatus: handleToggleStatus,
    onDelete: handleDeleteClick,
    current,
    pageSize
  }), [current, pageSize]);  

  const handleTableChange = (pagination: any) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <>
      <CommonBreadcrumbs title="Trusted Partners" breadcrumbs={BREADCRUMBS.TRUSTED_PARTNER.BASE} />
      <CommonPageWrapper>
        {isFormOpen ? (
          <div className="course-container course-container--narrow">
            <TrustedPartnerForm 
              onClose={() => { setIsFormOpen(false); setEditingPartner(null); }} 
              onSave={handleSave} 
              editing={editingPartner} 
              loading={addPartnerMutation.isPending || editPartnerMutation.isPending}
            />
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <CommonSummaryCards 
              total={totalPartners} 
              active={partners.filter((p: any) => !p.isBlocked).length} 
              blocked={partners.filter((p: any) => p.isBlocked).length} 
              subject="Partners" 
            />
            <motion.div variants={blurRevealUp}>
              <AdvancedSearch filter={[
                {
                  label: "Status",
                  value: isBlockedFilter,
                  options: [
                    { label: "All", value: "all" },
                    { label: "Active Only", value: "false" },
                    { label: "Blocked Only", value: "true" }
                  ],
                  onChange: (val: any) => { setIsBlockedFilter(val); setCurrent(1); },
                  grid: { xs: 24, sm: 12, md: 8 }
                }
              ]}>
                <Col xs={24} sm={12} md={8} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">Added Date Range</span>
                  <DatePicker.RangePicker
                    value={dateRange}
                    onChange={(dates) => {
                      setDateRange(dates as any);
                      setCurrent(1);
                    }}
                    className="rounded-lg h-[40px] w-full"
                  />
                </Col>
                {(isBlockedFilter !== "all" || dateRange) && (
                  <Col xs={24} sm={24} md={8}>
                    <Button
                      onClick={() => {
                        setIsBlockedFilter("all");
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
                data={partners} 
                loading={isLoading} 
                searchPlaceholder="Search trusted partners..." 
                onSearch={handleSearch} 
                onAdd={() => { setEditingPartner(null); setIsFormOpen(true); }} 
                fileName="TrustedPartners" 
                title="Trusted Partner Management" 
                current={current} 
                pageSize={pageSize} 
                total={totalPartners} 
                onTableChange={handleTableChange} 
              />
            </motion.div>
          </motion.div>
        )}
      </CommonPageWrapper>
      <CommonDeleteModal 
        open={isDeleteModalOpen} 
        title="Delete Trusted Partner" 
        itemName={partnerToDelete?.name} 
        loading={deletePartnerMutation.isPending} 
        onClose={() => { setIsDeleteModalOpen(false); setPartnerToDelete(null); }} 
        onConfirm={handleConfirmDelete} 
      />
    </>
  );
};

export default TrustedPartnerPage;
