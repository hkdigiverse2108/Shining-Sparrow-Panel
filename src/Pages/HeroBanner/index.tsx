import { useState, useMemo, type FC } from 'react';
import { Button, Tag, Spin, Tooltip } from 'antd'; 
import { DeleteOutlined, PlusOutlined, MobileOutlined, DesktopOutlined, LockOutlined, UnlockOutlined, EditOutlined } from '@ant-design/icons';
import { KEYS } from '@/Constants';
import { BREADCRUMBS } from '@/Data';
import { CommonPageWrapper, CommonBreadcrumbs, HeroBannerForm, CommonDeleteModal } from '@/Components'; 
import { motion } from 'motion/react';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { useQueryClient } from '@tanstack/react-query';
import { Mutations, Queries } from '@/Api';
import { CommonButton } from '@/Attribute';

const HeroBanner: FC = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  
  // State for Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<any | null>(null);

  const { data: responseData, isLoading } = Queries.useGetHeroBanners();
  const banners = useMemo(() => responseData?.data?.hero_banner_data || [], [responseData]);
  const totalBanners = banners.length;

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
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Media Gallery</h1>
                  <p className="text-text-muted mt-1">{totalBanners} banner(s) defining your app's first impression.</p>
                </div>
                <CommonButton type="primary" size="large" icon={<PlusOutlined />} onClick={() => { setEditingBanner(null); setIsFormOpen(true); }} className="shadow-md" >
                  Upload New
                </CommonButton>
              </div>

              {/* Loading / Empty / Canvas States */}
              {isLoading ? (
                <div className="flex justify-center items-center h-64"><Spin size="large" /></div>
              ) : banners.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-border rounded-3xl bg-surface-muted/80">
                  <div className="w-20 h-20 rounded-full bg-surface-muted flex items-center justify-center mb-6 shadow-inner">
                    <DesktopOutlined className="text-3xl text-muted" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Your Gallery is Empty</h3>
                  <p className="text-sm text-text-muted mb-8 max-w-sm text-center">Upload your first poster to start designing the user experience.</p>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingBanner(null); setIsFormOpen(true); }}>
                    Create First Poster
                  </Button>
                </div>
              ) : (
                /* Masonry/Poster Grid */
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