import { useState, useMemo, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Pagination, Spin, DatePicker, Col } from 'antd';
import { DeleteOutlined, EditOutlined, FolderOpenOutlined, PlusOutlined, EyeOutlined, SearchOutlined, PictureOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import dayjs from 'dayjs';
import { useQueryClient } from '@tanstack/react-query';
import { CommonBreadcrumbs, CommonPageWrapper, CommonDeleteModal, AdvancedSearch } from '@/Components';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { BREADCRUMBS } from '@/Data';
import { Queries, Mutations } from '@/Api';
import { KEYS } from '@/Constants';
import { useDebounce } from '@/Utils';
import { GalleryForm } from '@/Components/Gallery/GalleryForm';

const PhotoStack = ({ images, title }: { images: string[]; title: string }) => {
  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-64 bg-gradient-to-br from-primary-soft/40 via-primary-soft/10 to-surface-muted rounded-3xl border-2 border-dashed border-border/85 flex flex-col items-center justify-center gap-3 group-hover:border-primary/30 transition-all duration-300">
        <div className="p-4 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-inner group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
          <FolderOpenOutlined style={{ fontSize: 36 }} />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Empty Folder</span>
          <span className="text-[11px] text-text-muted/60 mt-0.5">No images uploaded</span>
        </div>
      </div>
    );
  }

  const frontImg = images[0];
  const middleImg = images[1] || images[0];
  const backImg = images[2] || images[1] || images[0];

  return (
    <div className="relative w-full h-64 flex items-center justify-center select-none">
      {/* Back Image */}
      <div className="absolute inset-x-5 bottom-2 top-6 rounded-3xl overflow-hidden border border-white/40 dark:border-white/10 shadow-md transform -rotate-6 -translate-y-4 scale-[0.92] opacity-50 transition-all duration-500 ease-out group-hover:-rotate-12 group-hover:-translate-y-8 group-hover:-translate-x-6 group-hover:opacity-70 z-10">
        <img src={backImg} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Middle Image */}
      <div className="absolute inset-x-2.5 bottom-4 top-4 rounded-3xl overflow-hidden border border-white/60 dark:border-white/10 shadow-lg transform rotate-3 -translate-y-2 scale-[0.96] opacity-85 transition-all duration-500 ease-out group-hover:rotate-8 group-hover:-translate-y-5 group-hover:translate-x-6 group-hover:opacity-95 z-20">
        <img src={middleImg} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Front Image */}
      <div className="absolute inset-0 bottom-6 rounded-3xl overflow-hidden border border-white/80 dark:border-white/20 shadow-xl transform transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:-translate-y-2 group-hover:shadow-2xl z-30">
        <img src={frontImg} alt={title} className="w-full h-full object-cover" />
        
        {/* Count Badge on Front Image */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20 shadow-sm z-45">
            +{images.length - 1} More
          </div>
        )}
      </div>
    </div>
  );
};

const FolderCard = ({ record, onEdit, onDelete, onClick }: any) => {
  const images = record.images || [];

  return (
    <motion.div 
      variants={blurRevealUp}
      onClick={onClick}
      className="group relative flex flex-col cursor-pointer pb-4"
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      {/* 3D Photo Stack Container */}
      <div className="relative w-full mb-4">
        <PhotoStack images={images} title={record.title} />

        {/* Hover overlay controls (sliding/revealing) */}
        {images.length > 0 && (
          <div className="absolute inset-0 bottom-6 rounded-3xl bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3.5 z-40 backdrop-blur-[1.5px]">
            <Button 
              shape="circle" 
              icon={<EditOutlined style={{ fontSize: 16 }} />} 
              onClick={(e) => { e.stopPropagation(); onEdit(record); }} 
              className="shadow-lg hover:scale-110 active:scale-95 bg-white/20 text-white border-white/25 hover:bg-white/40 hover:text-white transition-all duration-200"
              style={{ height: 38, width: 38 }}
            />
            <Button 
              type="primary" 
              shape="circle" 
              icon={<EyeOutlined style={{ fontSize: 20 }} />} 
              onClick={(e) => { e.stopPropagation(); onClick(); }} 
              className="shadow-xl hover:scale-115 active:scale-95 transition-all duration-200"
              style={{ height: 48, width: 48, backgroundColor: 'var(--primary)', borderColor: 'var(--primary)' }}
            />
            <Button 
              danger
              type="primary"
              shape="circle" 
              icon={<DeleteOutlined style={{ fontSize: 16 }} />} 
              onClick={(e) => { e.stopPropagation(); onDelete(record); }} 
              className="shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
              style={{ height: 38, width: 38 }}
            />
          </div>
        )}
      </div>

      {/* Floating Action Bar for Empty Folders */}
      {images.length === 0 && (
        <div className="absolute top-3 right-3 flex gap-1.5 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            shape="circle" 
            size="small"
            icon={<EditOutlined style={{ fontSize: 13 }} />} 
            onClick={(e) => { e.stopPropagation(); onEdit(record); }} 
            className="shadow-md hover:scale-105 bg-surface text-foreground border-border"
          />
          <Button 
            danger
            type="primary"
            shape="circle" 
            size="small"
            icon={<DeleteOutlined style={{ fontSize: 13 }} />} 
            onClick={(e) => { e.stopPropagation(); onDelete(record); }} 
            className="shadow-md hover:scale-105"
          />
        </div>
      )}

      {/* Info details */}
      <div className="px-1.5 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-extrabold text-foreground text-[15px] tracking-tight m-0 group-hover:text-primary transition-colors duration-200 truncate leading-snug">
            {record.title}
          </h4>
          <span className="shrink-0 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-soft text-primary border border-primary-ring text-[11px] font-bold shadow-inner">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {images.length} {images.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        {record.description ? (
          <p className="text-xs text-text-muted line-clamp-2 leading-relaxed m-0">
            {record.description}
          </p>
        ) : (
          <p className="text-xs text-text-muted/50 italic leading-relaxed m-0">
            No description provided.
          </p>
        )}
      </div>
    </motion.div>
  );
};

const GalleryPage: FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<any | null>(null);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Advanced Search states
  const [hasImagesFilter, setHasImagesFilter] = useState<string | undefined>("all");
  const [isBlockedFilter, setIsBlockedFilter] = useState<string | undefined>("all");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // State for Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [galleryToDelete, setGalleryToDelete] = useState<any | null>(null);

  // Fetch Galleries
  const { data: responseData, isLoading, isFetching } = Queries.useGetGalleries({
    page: current,
    limit: pageSize,
    search: debouncedSearchQuery,
    hasImages: hasImagesFilter === "all" ? undefined : hasImagesFilter,
    isBlocked: isBlockedFilter === "all" ? undefined : isBlockedFilter,
    startDate: dateRange?.[0] ? dateRange[0].startOf('day').toISOString() : undefined,
    endDate: dateRange?.[1] ? dateRange[1].endOf('day').toISOString() : undefined,
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
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative flex flex-col gap-8 min-h-[500px]">
            {/* Ambient Background Decorative Blobs */}
            <div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-primary/5 blur-[100px] pointer-events-none z-0" />
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none z-0" />

            {/* Creative Page Header Banner */}
            <div className="relative z-10 overflow-hidden rounded-3xl bg-gradient-to-r from-primary-soft/30 via-primary-soft/10 to-surface border border-border p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left Column: Text */}
              <div className="flex flex-col gap-1.5 max-w-xl z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold w-fit mb-1">
                  <PictureOutlined /> Media Manager
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight m-0">
                  Visual Asset Collections
                </h2>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed m-0">
                  Curate photography galleries, manage workshop assets, and organize course media folders. Hover to inspect files or launch full-screen immersive slideshow previews instantly.
                </p>
                
                {/* Stats counters */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-xs text-text-muted font-bold">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    {totalGalleries} Total Folders
                  </span>
                  <span className="h-1 w-1 rounded-full bg-muted/60" />
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    {galleries.filter((g: any) => (g.images || []).length > 0).length} Active Folders
                  </span>
                  <span className="h-1 w-1 rounded-full bg-muted/60" />
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-secondary" />
                    {galleries.filter((g: any) => (g.images || []).length === 0).length} Empty Folders
                  </span>
                </div>
              </div>

              {/* Right Column: Dynamic Action */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 z-10">
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={() => { setEditingGallery(null); setIsFormOpen(true); }}
                  className="h-11 px-6 rounded-xl font-bold shadow-lg hover:scale-102 active:scale-98 transition-all duration-200 bg-primary border-primary hover:bg-primary-dark hover:border-primary-dark"
                >
                  Add Folder
                </Button>
                <div className="w-full sm:w-72">
                  <Input
                    placeholder="Search folders..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="h-11 rounded-xl border-border bg-surface hover:border-primary-hover focus:border-primary transition-colors duration-200"
                    prefix={<SearchOutlined className="text-text-muted/70 mr-1.5" />}
                    allowClear
                  />
                </div>
              </div>

              {/* Decorative Vector Orb */}
              <div className="absolute right-0 bottom-0 top-0 w-80 bg-gradient-to-l from-primary/5 to-transparent blur-2xl rounded-full pointer-events-none transform translate-x-10 translate-y-10" />
            </div>

            <AdvancedSearch filter={[
              {
                label: "Folder Asset Volume",
                value: hasImagesFilter,
                options: [
                  { label: "All", value: "all" },
                  { label: "Populated Folders Only", value: "true" },
                  { label: "Empty Folders Only", value: "false" }
                ],
                onChange: (val: any) => { setHasImagesFilter(val); setCurrent(1); },
                grid: { xs: 24, sm: 12, md: 6 }
              },
              {
                label: "Folder Status",
                value: isBlockedFilter,
                options: [
                  { label: "All", value: "all" },
                  { label: "Active Folders", value: "false" },
                  { label: "Blocked Folders", value: "true" }
                ],
                onChange: (val: any) => { setIsBlockedFilter(val); setCurrent(1); },
                grid: { xs: 24, sm: 12, md: 6 }
              }
            ]}>
              <Col xs={24} sm={12} md={6} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">Folder Creation Date Range</span>
                <DatePicker.RangePicker
                  value={dateRange}
                  onChange={(dates) => {
                    setDateRange(dates as any);
                    setCurrent(1);
                  }}
                  className="rounded-lg h-[40px] w-full"
                />
              </Col>
              {(hasImagesFilter !== "all" || isBlockedFilter !== "all" || dateRange) && (
                <Col xs={24} sm={24} md={6}>
                  <Button
                    onClick={() => {
                      setHasImagesFilter("all");
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

            {/* Folder Grid */}
            <Spin spinning={isLoading || isFetching} size="large">
              {galleries.length > 0 ? (
                <div className="relative z-10 flex flex-col gap-8 min-h-[300px]">
                  <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10"
                  >
                    {galleries.map((gallery: any) => (
                      <FolderCard 
                        key={gallery._id} 
                        record={gallery} 
                        onClick={() => navigate(`/gallery/${gallery._id}`, { state: { record: gallery } })}
                        onEdit={(g: any) => { setEditingGallery(g); setIsFormOpen(true); }}
                        onDelete={handleDeleteClick}
                      />
                    ))}
                  </motion.div>

                  {/* Pagination */}
                  {totalGalleries > pageSize && (
                    <div className="flex justify-end mt-4">
                      <Pagination
                        current={current}
                        pageSize={pageSize}
                        total={totalGalleries}
                        onChange={(page, size) => {
                          setCurrent(page);
                          setPageSize(size);
                        }}
                        showSizeChanger
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} folders`}
                        className="premium-pagination"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative z-10 flex flex-col items-center justify-center py-24 bg-gradient-to-b from-surface to-surface-muted border border-border border-dashed rounded-3xl min-h-[350px] shadow-sm text-center px-4">
                  <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary border border-primary-ring shadow-inner">
                    <FolderOpenOutlined style={{ fontSize: 32 }} />
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow">0</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1.5">No Gallery Folders Found</h3>
                  <p className="text-xs text-text-muted max-w-sm mb-6 leading-relaxed">
                    Create beautiful folders to organize and group your photography collections, workshop assets, and course materials.
                  </p>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => { setEditingGallery(null); setIsFormOpen(true); }}
                    className="h-10 px-6 rounded-xl font-bold shadow-md hover:scale-102 active:scale-98 transition-all duration-200 bg-primary border-primary hover:bg-primary-dark hover:border-primary-dark"
                  >
                    Create Your First Folder
                  </Button>
                </div>
              )}
            </Spin>
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
