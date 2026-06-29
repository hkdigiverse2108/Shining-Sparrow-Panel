import { useState, useMemo, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Pagination, Spin, DatePicker, Col } from 'antd';
import { DeleteOutlined, EditOutlined, FolderOpenOutlined, PlusOutlined, SearchOutlined, PictureOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import dayjs from 'dayjs';
import { useQueryClient } from '@tanstack/react-query';
import { CommonBreadcrumbs, CommonPageWrapper, CommonDeleteModal, AdvancedSearch } from '@/Components';
import { staggerContainer } from '@/Utils/animations';
import { BREADCRUMBS } from '@/Data';
import { Queries, Mutations } from '@/Api';
import { KEYS } from '@/Constants';
import { useDebounce } from '@/Utils';
import { GalleryForm } from '@/Components/Gallery/GalleryForm';

const FolderCard = ({ record, onEdit, onDelete, onClick }: any) => {
  const images = record.images || [];
  const previewImg = images[0];

  return (
    <div 
      onClick={onClick}
      className="group relative cursor-pointer bento-gallery-card gallery-fade-in-card"
    >
      {/* Animated Glow Blob */}
      <div className="bento-glow-blob" />

      {/* Top Section: Icon & Info Badge */}
      <div className="flex items-start justify-between w-full z-10">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 border border-primary/15 text-primary transition-all duration-300 group-hover:scale-110">
          <FolderOpenOutlined style={{ fontSize: 20 }} />
        </div>
        <span className="bento-card-badge shrink-0 flex items-center">
          {images.length} {images.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      {/* Center Image Preview (only if images exist) */}
      {previewImg && (
        <div className="absolute right-6 top-16 w-20 h-20 rounded-2xl overflow-hidden border border-border bg-surface rotate-6 opacity-60 group-hover:rotate-12 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300 shadow-md">
          <img src={previewImg} alt={record.title} className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}

      {/* Bottom Section: Details & Quick Actions */}
      <div className="w-full z-10 mt-6">
        <div className="max-w-[58%]">
          <h4 className="font-extrabold text-foreground text-[16px] tracking-tight m-0 transition-colors duration-200 group-hover:text-primary truncate">
            {record.title}
          </h4>
          <p className="text-[11px] text-text-muted line-clamp-1 m-0 mt-1">
            {record.description || "No description provided."}
          </p>
        </div>

        {/* Action icons reveal on hover */}
        <div className="absolute right-4 bottom-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-250 z-20">
          <Button 
            shape="circle" 
            size="small"
            icon={<EditOutlined style={{ fontSize: 13 }} />} 
            onClick={(e) => { e.stopPropagation(); onEdit(record); }} 
            className="shadow-sm hover:scale-105 bg-surface text-foreground border-border"
          />
          <Button 
            danger
            type="primary"
            shape="circle" 
            size="small"
            icon={<DeleteOutlined style={{ fontSize: 13 }} />} 
            onClick={(e) => { e.stopPropagation(); onDelete(record); }} 
            className="shadow-sm hover:scale-105"
          />
        </div>
      </div>
    </div>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10">
                    {galleries.map((gallery: any) => (
                      <FolderCard 
                        key={gallery._id} 
                        record={gallery} 
                        onClick={() => navigate(`/gallery/${gallery._id}`, { state: { record: gallery } })}
                        onEdit={(g: any) => { setEditingGallery(g); setIsFormOpen(true); }}
                        onDelete={handleDeleteClick}
                      />
                    ))}
                  </div>

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
