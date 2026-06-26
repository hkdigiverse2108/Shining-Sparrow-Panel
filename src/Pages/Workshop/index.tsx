import { useState, useMemo, type FC } from 'react';
import { Button, Tag, Image } from 'antd';
import { DeleteOutlined, EditOutlined, FolderOpenOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { KEYS, URL_KEYS } from '@/Constants';
import { BREADCRUMBS } from '@/Data';
import { CommonPageWrapper, CommonBreadcrumbs, CommonTable, CommonSummaryCards, CommonDeleteModal, CommonTag } from '@/Components'; 
import { motion } from 'motion/react';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '@/Utils';
import { Mutations, Queries, Get } from '@/Api';
import type { ColumnType } from 'antd/es/table';
import { WorkshopForm } from '../../Components/Workshop/WorkshopForm';

const getWorkshopColumns = ({ onEdit, onManage, onToggleStatus, onDelete }: any): ColumnType<any>[] => [
  {
    title: "#",
    dataIndex: "priority",
    width: 60,
    align: "center",
    sorter: (a: any, b: any) => (a.priority || 0) - (b.priority || 0),
    render: (v: any) => <span className="font-semibold text-text-muted">{v ?? 0}</span>
  },
  {
    title: "Image", 
    dataIndex: "image", 
    width: 70,
    align: "center",
    render: (v: any) => (
      <Image src={v} width={40} height={40} style={{ objectFit: 'cover', borderRadius: 6, background: 'var(--surface-muted)' }} fallback="https://via.placeholder.com/40x40/E2E8F0/94A3B8?text=WS" />
    )
  },
  {
    title: "Title", 
    dataIndex: "title", 
    align: "center",
    render: (v: any) => <span className="font-semibold text-foreground">{v}</span> 
  },
  {
    title: "Price", 
    dataIndex: "price", 
    width: 120,
    align: "center",
    render: (price: number, record: any) => {
      if (price === 0) return <Tag color="green">Free</Tag>;
      const mrp = record.mrpPrice || 0;
      const hasDiscount = mrp > price;
      return (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">₹{price}</span>
          {hasDiscount && <span className="text-xs text-muted line-through">₹{mrp}</span>}
        </div>
      );
    }
  },
  {
    title: "Language", 
    dataIndex: "language", 
    width: 100,
    align: "center",
    render: (v: any) => <Tag color="blue">{v || 'N/A'}</Tag> 
  },
  {
    title: "Duration", 
    dataIndex: "duration", 
    width: 120,
    align: "center",
    ellipsis: true,
    render: (v: any) => <span className="text-gray-600 text-sm">{v || 'N/A'}</span> 
  },
  {
    title: "Status", 
    dataIndex: "isBlocked", 
    width: 90,
    align: "center",
    render: (v: any) => (
      <CommonTag className={v ? "status-dot status-dot-blocked" : "status-dot status-dot-active"}>
        {v ? "Blocked" : "Active"}
      </CommonTag>
    ) 
  },
  {
    title: "Actions", 
    dataIndex: "actions",
    width: 160,
    align: "center",
    render: (_: any, r: any) => (
      <div className="flex gap-1 justify-center">
        <Button type="text" size="small" icon={<FolderOpenOutlined />} onClick={() => onManage(r)} title="Manage Curriculum" />
        <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(r)} />
        <Button 
          type="text" 
          size="small" 
          icon={r.isBlocked ? <UnlockOutlined /> : <LockOutlined />} 
          onClick={() => onToggleStatus(r)} 
          title={r.isBlocked ? "Unblock Workshop" : "Block Workshop"}
        />
        <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete(r)} />
      </div>
    ),
  },
];

const Workshops: FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<any | null>(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [workshopToDelete, setWorkshopToDelete] = useState<any | null>(null);

  const { data: responseData, isLoading, isFetching } = Queries.useGetWorkshops({
    page: current, limit: pageSize, search: debouncedSearchQuery
  });

  const workshops = useMemo(() => responseData?.data?.workshop_data || [], [responseData]);
  const totalWorkshops = Number(responseData?.data?.totalData) || 0;

  const addMutation = Mutations.useAddWorkshop();
  const editMutation = Mutations.useUpdateWorkshop();
  const deleteMutation = Mutations.useDeleteWorkshop();

  const handleSearch = (q: string) => { setSearchQuery(q); setCurrent(1); };

  const handleSave = (values: any) => {
    const payload = { ...values, price: Number(values.price), mrpPrice: Number(values.mrpPrice) };
    const mutation = editingWorkshop ? editMutation : addMutation;
    if (editingWorkshop) payload.workshopId = editingWorkshop._id;

    mutation.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.WORKSHOP.BASE] });
        setIsFormOpen(false);
      },
    });
  };

  const handleToggleStatus = (workshop: any) => {
    editMutation.mutate({
      workshopId: workshop._id,
      isBlocked: !workshop.isBlocked
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.WORKSHOP.BASE] });
      }
    });
  };

  const handleDeleteClick = (workshop: any) => { 
    setWorkshopToDelete(workshop);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!workshopToDelete) return;
    
    deleteMutation.mutate(workshopToDelete._id, {
      onSuccess: () => { 
        queryClient.invalidateQueries({ queryKey: [KEYS.WORKSHOP.BASE] }); 
        setIsDeleteModalOpen(false);
        setWorkshopToDelete(null);
      }
    });
  };

  const handleManageContent = (workshop: any) => { navigate(`/workshops/${workshop._id}/manage`); };

  const columns = useMemo(() => getWorkshopColumns({ 
    onEdit: (w: any) => { setEditingWorkshop(w); setIsFormOpen(true); }, 
    onManage: handleManageContent,
    onToggleStatus: handleToggleStatus,
    onDelete: handleDeleteClick,
  }), []);  

  const handleExportAll = async () => {
    const res = await Get<any>(URL_KEYS.WORKSHOP.GET, {
      page: 1,
      limit: 10000,
      search: debouncedSearchQuery || undefined,
    });
    return res?.data?.workshop_data || [];
  };

  return (
    <>
      <CommonBreadcrumbs title="Workshops" breadcrumbs={BREADCRUMBS.WORKSHOP.BASE} />
      <CommonPageWrapper>
        {isFormOpen ? (
          <div className="course-container course-container--narrow">
            <WorkshopForm open={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={handleSave} editing={editingWorkshop} />
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <CommonSummaryCards total={totalWorkshops} active={workshops.filter((w: any) => !w.isBlocked).length} blocked={workshops.filter((w: any) => w.isBlocked).length} subject="Workshops" />
            <motion.div variants={blurRevealUp}>
              <div className="">
                <CommonTable columns={columns} data={workshops} loading={isLoading || isFetching || addMutation.isPending || editMutation.isPending} searchPlaceholder="Search workshops..." onSearch={handleSearch} onAdd={() => { setEditingWorkshop(null); setIsFormOpen(true); }} fileName="Workshops" title="Workshop Management" current={current} pageSize={pageSize} total={totalWorkshops} onTableChange={(p: any) => { setCurrent(p.current); setPageSize(p.pageSize); }} scroll={{ x: 1000 }} onExportAll={handleExportAll} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </CommonPageWrapper>
      <CommonDeleteModal open={isDeleteModalOpen} title="Delete Workshop" itemName={workshopToDelete?.title} loading={deleteMutation.isPending} onClose={() => { setIsDeleteModalOpen(false); setWorkshopToDelete(null); }} onConfirm={handleConfirmDelete} />
    </>
  );
};

export default Workshops;