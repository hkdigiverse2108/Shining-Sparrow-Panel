import { useMemo, useState, type FC } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Tag, Button, Spin, Card, Image, Tooltip, message } from 'antd';
import { 
  ArrowLeftOutlined, 
  PictureOutlined, 
  CalendarOutlined, 
  CopyOutlined, 
  FolderOpenOutlined, 
  DeleteOutlined, 
  EditOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { motion } from 'motion/react';
import { CommonBreadcrumbs, CommonPageWrapper, CommonDeleteModal } from '@/Components';
import { GalleryForm } from '@/Components/Gallery/GalleryForm';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { BREADCRUMBS } from '@/Data';
import { Queries, Mutations } from '@/Api';
import { ROUTES } from '@/Constants';
import { useQueryClient } from '@tanstack/react-query';
import { KEYS } from '@/Constants';
import dayjs from 'dayjs';

const GalleryDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  // Retrieve record from router navigation state if available
  const stateRecord = location.state?.record;

  // Fallback query if page was reloaded directly
  const { data: responseData, isLoading: galleryLoading } = Queries.useGetGalleries({
    limit: 1000
  });

  const record = useMemo(() => {
    const list = responseData?.data?.gallery_data || [];
    const found = list.find((item: any) => item._id === id);
    if (found) return found;
    return stateRecord;
  }, [stateRecord, responseData, id]);

  const deleteGalleryMutation = Mutations.useDeleteGallery();
  const editGalleryMutation = Mutations.useUpdateGallery();

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    message.success('Image URL copied to clipboard!');
  };

  const handleDownload = (url: string, filename: string) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobURL;
        link.download = filename || 'downloaded-image';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobURL);
      })
      .catch(() => {
        window.open(url, '_blank');
      });
  };

  const handleSave = (values: any) => {
    editGalleryMutation.mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.GALLERY.BASE] });
        setIsFormOpen(false);
        message.success('Gallery folder updated successfully');
      },
    });
  };

  const handleDeleteConfirm = () => {
    if (!record) return;
    deleteGalleryMutation.mutate(record._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.GALLERY.BASE] });
        setIsDeleteModalOpen(false);
        navigate(ROUTES.GALLERY);
        message.success('Gallery folder deleted successfully');
      },
    });
  };

  if (galleryLoading && !stateRecord) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-transparent">
        <Spin size="large" tip="Loading folder details..." />
      </div>
    );
  }

  if (!record) {
    return (
      <>
        <div className="print:hidden">
          <CommonBreadcrumbs title="Folder Details" breadcrumbs={BREADCRUMBS.GALLERY?.DETAILS || []} />
        </div>
        <CommonPageWrapper className="h-full bg-transparent p-6">
          <Card className="text-center rounded-2xl border-border py-12">
            <h3 className="text-lg font-bold text-foreground mb-2">Folder Not Found</h3>
            <p className="text-text-muted mb-6 text-sm">We couldn't locate this gallery folder record in the system.</p>
            <Button type="primary" onClick={() => navigate(ROUTES.GALLERY)} icon={<ArrowLeftOutlined />}>
              Back to Gallery
            </Button>
          </Card>
        </CommonPageWrapper>
      </>
    );
  }

  const images = record.images || [];

  return (
    <>
      <div className="print:hidden">
        <CommonBreadcrumbs title={record.title} breadcrumbs={BREADCRUMBS.GALLERY?.DETAILS || []} />
      </div>
      <CommonPageWrapper noPadding className="h-full bg-transparent">
        {isFormOpen ? (
          <div className="course-container course-container--narrow p-4 md:p-6">
            <GalleryForm 
              onClose={() => { setIsFormOpen(false); }} 
              onSave={handleSave} 
              editing={record} 
              loading={editGalleryMutation.isPending}
            />
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            animate="visible" 
            className="flex flex-col gap-6 p-4 md:p-6 max-w-6xl mx-auto"
          >
            {/* Ambient Background Decorative Blobs */}
            <div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-primary/5 blur-[100px] pointer-events-none z-0" />
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none z-0" />

            {/* Action Header */}
            <div className="flex items-center justify-between border-b border-border/65 pb-4 print:hidden z-10">
              <Button 
                type="text" 
                onClick={() => navigate(ROUTES.GALLERY)} 
                icon={<ArrowLeftOutlined />}
                className="hover:bg-muted text-foreground font-medium flex items-center gap-1.5"
              >
                Back to Gallery
              </Button>
              <div className="flex gap-2">
                <Button 
                  type="default" 
                  onClick={() => setIsFormOpen(true)} 
                  icon={<EditOutlined />}
                  className="hover:border-primary hover:text-primary transition-all duration-200"
                >
                  Edit Folder
                </Button>
                <Button 
                  danger 
                  onClick={() => setIsDeleteModalOpen(true)} 
                  icon={<DeleteOutlined />}
                >
                  Delete Folder
                </Button>
              </div>
            </div>

            {/* Folder Cover Banner Card */}
            <motion.div variants={blurRevealUp} className="z-10">
              <Card className="rounded-2xl border-border bg-surface shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />
                <div className="flex flex-col md:flex-row gap-5 items-start">
                  <div className="p-4 rounded-2xl bg-primary-soft text-primary border border-primary/10 shadow-inner flex items-center justify-center shrink-0">
                    <FolderOpenOutlined style={{ fontSize: 36 }} />
                  </div>
                  <div className="flex-1 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-xl md:text-2xl font-black text-foreground m-0 tracking-tight leading-snug">
                        {record.title}
                      </h2>
                      <Tag 
                        icon={images.length > 0 ? <CheckCircleOutlined /> : <PictureOutlined />}
                        color={images.length > 0 ? 'green' : 'orange'}
                        className="rounded-full px-2.5 py-0.5 text-[10px] uppercase font-bold m-0"
                      >
                        {images.length > 0 ? `${images.length} Assets` : 'Empty Folder'}
                      </Tag>
                    </div>

                    <p className="text-sm text-text-muted leading-relaxed m-0 max-w-3xl">
                      {record.description || <span className="italic opacity-60">No description provided for this collection.</span>}
                    </p>

                    <div className="flex flex-wrap gap-x-5 gap-y-1.5 pt-1.5 text-xs text-text-muted font-semibold">
                      <span className="flex items-center gap-1.5">
                        <CalendarOutlined className="opacity-75" />
                        Created: {record.createdAt ? dayjs(record.createdAt).format('DD MMMM YYYY') : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Images Grid */}
            <motion.div variants={blurRevealUp} className="z-10 mt-2">
              {images.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted border-b border-border pb-2 mb-6">
                    Assets and Photos
                  </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {images.map((img: string, index: number) => {
                        const filename = img.substring(img.lastIndexOf('/') + 1) || `image-${index + 1}.jpg`;
                        return (
                          <div 
                            key={index} 
                            className="group relative rounded-2xl border border-border bg-surface overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-[280px]"
                          >
                            {/* Image Container */}
                            <div 
                              onClick={() => {
                                setPreviewIndex(index);
                                setPreviewVisible(true);
                              }}
                              className="relative flex-1 overflow-hidden bg-surface-muted flex items-center justify-center cursor-pointer"
                            >
                              <Image 
                                src={img} 
                                alt={`${record.title} - ${index + 1}`} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                wrapperStyle={{ width: '100%', height: '100%' }}
                                className="transition-transform duration-500 group-hover:scale-105"
                                preview={false}
                              />

                              {/* Hover Overlay Controls */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10 backdrop-blur-[1px] pointer-events-none group-hover:pointer-events-auto">
                                <Tooltip title="Full Screen Preview">
                                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20 text-white border border-white/25 hover:bg-white/40 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer">
                                    <EyeOutlined style={{ fontSize: 16 }} />
                                  </div>
                                </Tooltip>
                                <Tooltip title="Copy Image URL">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopyLink(img);
                                    }}
                                    className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20 text-white border border-white/25 hover:bg-white/40 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
                                  >
                                    <CopyOutlined style={{ fontSize: 16 }} />
                                  </button>
                                </Tooltip>
                                <Tooltip title="Download Image">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDownload(img, filename);
                                    }}
                                    className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20 text-white border border-white/25 hover:bg-white/40 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
                                  >
                                    <DownloadOutlined style={{ fontSize: 16 }} />
                                  </button>
                                </Tooltip>
                              </div>
                            </div>

                            {/* Image Footer Details */}
                            <div className="p-3 border-t border-border bg-surface flex items-center justify-between gap-3 text-xs">
                              <span className="font-semibold text-foreground truncate max-w-[150px]">
                                {filename}
                              </span>
                              <span className="text-[10px] text-text-muted bg-surface-muted border border-border px-2 py-0.5 rounded font-mono shrink-0">
                                #{index + 1}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-b from-surface to-surface-muted border border-border border-dashed rounded-3xl text-center px-4">
                  <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary border border-primary-ring shadow-inner">
                    <PictureOutlined style={{ fontSize: 32 }} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1.5">No Assets Found</h3>
                  <p className="text-xs text-text-muted max-w-sm mb-6 leading-relaxed">
                    This folder doesn't contain any visual assets yet. Click "Edit Folder" to upload images.
                  </p>
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />} 
                    onClick={() => setIsFormOpen(true)}
                    className="h-10 px-6 rounded-xl font-bold shadow-md hover:scale-102 active:scale-98 transition-all duration-200 bg-primary border-primary hover:bg-primary-dark hover:border-primary-dark"
                  >
                    Upload Images
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </CommonPageWrapper>

      {/* Immersive controlled lightbox preview group */}
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup 
          preview={{ 
            open: previewVisible, 
            current: previewIndex,
            onOpenChange: (visible) => setPreviewVisible(visible),
            onChange: (index) => setPreviewIndex(index)
          }}
        >
          {images.map((img: string, i: number) => (
            <Image key={i} src={img} />
          ))}
        </Image.PreviewGroup>
      </div>

      <CommonDeleteModal 
        open={isDeleteModalOpen} 
        title="Delete Gallery Folder" 
        itemName={record.title} 
        loading={deleteGalleryMutation.isPending} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDeleteConfirm} 
      />
    </>
  );
};

export default GalleryDetails;
