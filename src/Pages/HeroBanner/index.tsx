import { useState, useMemo, type FC } from 'react';
import { Button, Tag, Spin, Tooltip, Input, DatePicker, Col, Pagination } from 'antd'; 
import { DeleteOutlined, PlusOutlined, MobileOutlined, DesktopOutlined, LockOutlined, UnlockOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { KEYS } from '@/Constants';
import { BREADCRUMBS } from '@/Data';
import { CommonPageWrapper, CommonBreadcrumbs, HeroBannerForm, CommonDeleteModal, AdvancedSearch } from '@/Components'; 
import { motion } from 'motion/react';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { useQueryClient } from '@tanstack/react-query';
import { Mutations, Queries } from '@/Api';
import { CommonButton } from '@/Attribute';
import { useDebounce } from '@/Utils';

const HeroBanner: FC = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  
  // State for Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<any | null>(null);

  // Search & Pagination states
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Advanced Search states
  const [typeFilter, setTypeFilter] = useState<string | undefined>("all");
  const [isBlockedFilter, setIsBlockedFilter] = useState<string | undefined>("all");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  const { data: responseData, isLoading, isFetching } = Queries.useGetHeroBanners({
    page: current,
    limit: pageSize,
    search: debouncedSearchQuery || undefined,
    type: typeFilter === "all" ? undefined : typeFilter,
    isBlocked: isBlockedFilter === "all" ? undefined : isBlockedFilter,
    startDate: dateRange?.[0] ? dateRange[0].startOf('day').toISOString() : undefined,
    endDate: dateRange?.[1] ? dateRange[1].endOf('day').toISOString() : undefined,
  });
  const banners = useMemo(() => responseData?.data?.hero_banner_data || [], [responseData]);
  const totalBanners = Number(responseData?.data?.totalData) || banners.length;

  const addBannerMutation = Mutations.useAddHeroBanner();
  const editBannerMutation = Mutations.useUpdateHeroBanner();
  const deleteBannerMutation = Mutations.useDeleteHeroBanner();

  const handleSave = (values: any) => {
    const mutation = editingBanner ? editBannerMutation : addBannerMutation;
    mutation.mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.HERO_BANNER.BASE] });
        setIsFormOpen(false);
      },
    });
  };

  const handleToggleBlock = (banner: any) => {
    editBannerMutation.mutate(
      { heroBannerId: banner._id, isBlocked: !banner.isBlocked },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.HERO_BANNER.BASE] });
        },
      }
    );
  };

  // Updated to open the modal instead of directly deleting
  const handleDeleteClick = (banner: any) => { 
    setBannerToDelete(banner);
    setIsDeleteModalOpen(true);
  };

  // Actual deletion logic triggered by the modal's confirm button
  const handleConfirmDelete = () => {
    if (!bannerToDelete) return;
    
    deleteBannerMutation.mutate(bannerToDelete._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.HERO_BANNER.BASE] });
        setIsDeleteModalOpen(false);
        setBannerToDelete(null);
      },
    });
  };

  return (
    <>
      <CommonBreadcrumbs title="Hero Banners" breadcrumbs={BREADCRUMBS.HERO_BANNER.BASE} />
      <CommonPageWrapper>
        {isFormOpen ? (
          <div className="course-container course-container--narrow">
            <HeroBannerForm open={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={handleSave} editing={editingBanner} loading={addBannerMutation.isPending || editBannerMutation.isPending} />
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={blurRevealUp}>
              {/* Header */}
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Media Gallery</h1>
                  <p className="text-text-muted mt-1">{totalBanners} banner(s) defining your app's first impression.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-72">
                    <Input
                      placeholder="Search banners..."
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrent(1); }}
                      className="h-11 rounded-xl border-border bg-surface hover:border-primary-hover focus:border-primary transition-colors duration-200"
                      prefix={<SearchOutlined className="text-text-muted/70 mr-1.5" />}
                      allowClear
                    />
                  </div>
                  <CommonButton type="primary" size="large" icon={<PlusOutlined />} onClick={() => { setEditingBanner(null); setIsFormOpen(true); }} className="shadow-md" >
                    Upload New
                  </CommonButton>
                </div>
              </div>

              {/* Advanced Search */}
              <div className="mb-8">
                <AdvancedSearch filter={[
                  {
                    label: "Client Type",
                    value: typeFilter,
                    options: [
                      { label: "All", value: "all" },
                      { label: "Web Banner", value: "web" },
                      { label: "App Banner", value: "app" }
                    ],
                    onChange: (val: any) => { setTypeFilter(val); setCurrent(1); },
                    grid: { xs: 24, sm: 12, md: 6 }
                  },
                  {
                    label: "Status",
                    value: isBlockedFilter,
                    options: [
                      { label: "All", value: "all" },
                      { label: "Active", value: "false" },
                      { label: "Blocked", value: "true" }
                    ],
                    onChange: (val: any) => { setIsBlockedFilter(val); setCurrent(1); },
                    grid: { xs: 24, sm: 12, md: 6 }
                  }
                ]}>
                  <Col xs={24} sm={12} md={6} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
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
                  {(typeFilter !== "all" || isBlockedFilter !== "all" || dateRange) && (
                    <Col xs={24} sm={24} md={6}>
                      <Button
                        onClick={() => {
                          setTypeFilter("all");
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
              </div>

              {/* Loading / Empty / Canvas States */}
              {isLoading || isFetching ? (
                <div className="flex justify-center items-center h-64"><Spin size="large" /></div>
              ) : banners.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-border rounded-3xl bg-surface-muted/80">
                  <div className="w-20 h-20 rounded-full bg-surface-muted flex items-center justify-center mb-6 shadow-inner">
                    <DesktopOutlined className="text-3xl text-muted" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">No Banners Found</h3>
                  <p className="text-sm text-text-muted mb-8 max-w-sm text-center">No posters match your current filter criteria.</p>
                </div>
              ) : (
                /* Masonry/Poster Grid */
                <div className="flex flex-col gap-8">
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {banners.map((banner: any) => {
                      const isWeb = banner.type === 'web';
                      const imageSrc = isWeb 
                        ? (banner.images?.[0] || '') 
                        : (banner.images?.[0] || banner.image || '');

                      return (
                        <div 
                          key={banner._id} 
                          className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer bg-surface border border-border"
                          onClick={() => { setEditingBanner(banner); setIsFormOpen(true); }}
                        >
                          {/* Portrait Image Container */}
                          <div className="relative w-full aspect-[4/5] bg-surface-muted overflow-hidden">
                            {imageSrc ? (
                              <img src={imageSrc} alt={banner.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                            ) : (
                              <div className="flex flex-col items-center justify-center h-full text-muted bg-surface-muted gap-3 p-4">
                                <PlusOutlined className="text-3xl" />
                                <span className="text-sm text-center">No Image Uploaded</span>
                              </div>
                            )}
                            
                            {/* Dark Gradient Overlay for Text */}
                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                            {/* Title Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 z-10 pointer-events-none">
                              <h4 className="text-white font-bold text-lg drop-shadow-lg leading-tight line-clamp-2">{banner.title || "Untitled"}</h4>
                            </div>
                            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 z-40">
                              <Tooltip title="Edit Banner">
                                <Button 
                                  shape="circle" 
                                  icon={<EditOutlined />} 
                                  className="backdrop-blur-md bg-white/80 border border-white/30 text-foreground shadow-lg hover:bg-white" 
                                  onClick={(e) => { e.stopPropagation(); setEditingBanner(banner); setIsFormOpen(true); }} 
                                />
                              </Tooltip>
                              <Tooltip title={banner.isBlocked ? "Unblock Banner" : "Block Banner"}>
                                <Button 
                                  shape="circle" 
                                  icon={banner.isBlocked ? <UnlockOutlined /> : <LockOutlined />} 
                                  className="backdrop-blur-md bg-white/80 border border-white/30 text-foreground shadow-lg hover:bg-white" 
                                  onClick={(e) => { e.stopPropagation(); handleToggleBlock(banner); }} 
                                />
                              </Tooltip>
                              <Tooltip title="Delete Banner">
                                <Button 
                                  shape="circle" 
                                  danger 
                                  icon={<DeleteOutlined />} 
                                  className="backdrop-blur-md bg-red-500/80 border border-white/30 text-white shadow-lg hover:bg-red-600" 
                                  onClick={(e) => { e.stopPropagation(); handleDeleteClick(banner); }} 
                                />
                              </Tooltip>
                            </div>

                            {/* Type Tag (Top Left) */}
                            <div className="absolute top-3 left-3 z-10">
                              <Tag color={isWeb ? "blue" : "purple"} className="shadow-md font-semibold border-none" icon={isWeb ? <DesktopOutlined /> : <MobileOutlined />} >
                                {banner.type}
                              </Tag>
                            </div>

                            {/* Blocked Sticker */}
                            {banner.isBlocked && (
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px] flex items-center justify-center z-30 pointer-events-none group-hover:pointer-events-auto">
                                <Tag color="error" className="text-base font-bold px-5 py-1 shadow-xl">BLOCKED</Tag>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalBanners > pageSize && (
                    <div className="flex justify-end mt-4">
                      <Pagination
                        current={current}
                        pageSize={pageSize}
                        total={totalBanners}
                        onChange={(page, size) => {
                          setCurrent(page);
                          setPageSize(size);
                        }}
                        showSizeChanger
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} banners`}
                      />
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </CommonPageWrapper>
      <CommonDeleteModal open={isDeleteModalOpen} title="Delete Banner" itemName={bannerToDelete?.title} loading={deleteBannerMutation.isPending} onClose={() => { setIsDeleteModalOpen(false); setBannerToDelete(null); }} onConfirm={handleConfirmDelete} />
    </>
  );
};

export default HeroBanner;