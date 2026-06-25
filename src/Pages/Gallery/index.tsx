import { useState, useMemo, type FC } from 'react';
import { Button, Avatar } from 'antd';
import { DeleteOutlined, EditOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import { useQueryClient } from '@tanstack/react-query';
import { CommonBreadcrumbs, CommonPageWrapper, CommonTable, CommonDeleteModal, CommonSummaryCards } from '@/Components';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { BREADCRUMBS } from '@/Data';
import { Queries, Mutations } from '@/Api';
import { KEYS } from '@/Constants';
import { useDebounce } from '@/Utils';
import type { ColumnType } from 'antd/es/table';
import { GalleryForm } from '@/Components/Gallery/GalleryForm';

const getGalleryColumns = ({ 
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
    title: 'Folder Title',
    dataIndex: 'title',
    align: 'left',
    render: (v: string) => (
      <div className="flex items-center gap-2.5">
        <FolderOpenOutlined className="text-primary text-lg" />
        <span className="font-semibold text-foreground">{v}</span>
      </div>
    )
  },
  {
    title: 'Description',
    dataIndex: 'description',
    align: 'center',
    render: (v: string) => <span className="text-text-muted text-xs line-clamp-2">{v || '—'}</span>
  },
  {
    title: 'Images Count',
    dataIndex: 'images',
    align: 'center',
    width: 130,
    render: (images: string[]) => (
      <span className="px-2.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
        {images?.length || 0} images
      </span>
    )
  },
  {
    title: 'Previews',
    dataIndex: 'images',
    align: 'center',
    width: 220,
    render: (images: string[]) => {
      if (!images || images.length === 0) return <span className="text-muted text-xs">—</span>;
      return (
        <div className="flex justify-center">
          <Avatar.Group maxCount={4} maxStyle={{ color: '#fff', backgroundColor: '#e86424', cursor: 'pointer' }}>
            {images.map((img, index) => (
              <Avatar key={index} src={img} shape="square" size={36} className="border border-border" />
            ))}
          </Avatar.Group>
        </div>
      );
    }
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

const GalleryPage: FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<any | null>(null);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State for Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [galleryToDelete, setGalleryToDelete] = useState<any | null>(null);

  // Fetch Galleries
  const { data: responseData, isLoading } = Queries.useGetGalleries({
    page: current,
    limit: pageSize,
    search: debouncedSearchQuery
  });

  const galleries = useMemo(() => responseData?.data?.gallery_data || [], [responseData]);
  const totalGalleries = Number(responseData?.data?.totalData) || 0;

  // Mutations
  const addGalleryMutation = Mutations.useAddGallery();
  const editGalleryMutation = Mutations.useUpdateGallery();
  const deleteGalleryMutation = Mutations.useDeleteGallery();

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setCurrent(1);
  };

  const handleSave = (values: any) => {
    const mutation = editingGallery ? editGalleryMutation : addGalleryMutation;
    mutation.mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.GALLERY.BASE] });
        setIsFormOpen(false);
        setEditingGallery(null);
      },
    });
  };

  const handleDeleteClick = (gallery: any) => { 
    setGalleryToDelete(gallery);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!galleryToDelete) return;
    deleteGalleryMutation.mutate(galleryToDelete._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.GALLERY.BASE] });
        setIsDeleteModalOpen(false);
        setGalleryToDelete(null);
      }
    });
  };

  const columns = useMemo(() => getGalleryColumns({ 
    onEdit: (g: any) => { setEditingGallery(g); setIsFormOpen(true); }, 
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
      <CommonBreadcrumbs title="Galleries" breadcrumbs={BREADCRUMBS.GALLERY.BASE} />
      <CommonPageWrapper>
        {isFormOpen ? (
          <div className="course-container course-container--narrow">
            <GalleryForm 
              onClose={() => { setIsFormOpen(false); setEditingGallery(null); }} 
              onSave={handleSave} 
              editing={editingGallery} 
              loading={addGalleryMutation.isPending || editGalleryMutation.isPending}
            />
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <CommonSummaryCards 
              total={totalGalleries} 
              active={galleries.length} 
              blocked={0} 
              subject="Gallery Folders" 
            />
            <motion.div variants={blurRevealUp}>
              <CommonTable 
                columns={columns} 
                data={galleries} 
                loading={isLoading} 
                searchPlaceholder="Search galleries..." 
                onSearch={handleSearch} 
                onAdd={() => { setEditingGallery(null); setIsFormOpen(true); }} 
                fileName="Galleries" 
                title="Gallery Management" 
                current={current} 
                pageSize={pageSize} 
                total={totalGalleries} 
                onTableChange={handleTableChange} 
              />
            </motion.div>
          </motion.div>
        )}
      </CommonPageWrapper>
      <CommonDeleteModal 
        open={isDeleteModalOpen} 
        title="Delete Gallery Folder" 
        itemName={galleryToDelete?.title} 
        loading={deleteGalleryMutation.isPending} 
        onClose={() => { setIsDeleteModalOpen(false); setGalleryToDelete(null); }} 
        onConfirm={handleConfirmDelete} 
      />
    </>
  );
};

export default GalleryPage;
