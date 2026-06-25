import { useState, useMemo, type FC } from 'react';
import { Button, Avatar } from 'antd';
import { DeleteOutlined, EditOutlined, StarOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import { useQueryClient } from '@tanstack/react-query';
import { CommonBreadcrumbs, CommonPageWrapper, CommonTable, CommonDeleteModal, CommonSummaryCards } from '@/Components';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { BREADCRUMBS } from '@/Data';
import { Queries, Mutations } from '@/Api';
import { KEYS } from '@/Constants';
import { useDebounce } from '@/Utils';
import type { ColumnType } from 'antd/es/table';
import { TrustedPartnerForm } from '@/Components/TrustedPartner/TrustedPartnerForm';

const getPartnerColumns = ({ 
  onEdit, 
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
      <div className="flex items-center gap-2">
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
    title: 'Actions',
    dataIndex: 'actions',
    width: 120,
    align: 'center',
    render: (_: any, r: any) => (
      <div className="flex gap-1 justify-center">
        <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(r)} />
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

  // Fetch Trusted Partners
  const { data: responseData, isLoading } = Queries.useGetTrustedPartners({
    page: current,
    limit: pageSize,
    search: debouncedSearchQuery
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
              active={partners.length} 
              blocked={0} 
              subject="Partners" 
            />
            <motion.div variants={blurRevealUp}>
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
