import { useState, useMemo, type FC } from 'react';
import { Button, Tooltip, Input, Pagination, Spin, DatePicker, Col } from 'antd'; 
import { DeleteOutlined, EditOutlined, StarOutlined, LockOutlined, UnlockOutlined, SearchOutlined, PictureOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { KEYS } from '@/Constants';
import { BREADCRUMBS } from '@/Data';
import { CommonPageWrapper, CommonBreadcrumbs, BlogForm, CommonDeleteModal, AdvancedSearch } from '@/Components';
import { motion } from 'motion/react';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '@/Utils';
import { Mutations, Queries } from '@/Api';

const BlogCard = ({ record, onEdit, onToggleStatus, onDelete }: any) => {
  const isBlocked = record.isBlocked;
  const isFeatured = record.isFeatured;
  
  return (
    <motion.div 
      variants={blurRevealUp}
      className={`group relative flex flex-col cursor-pointer pb-4 transition-all duration-300 ${isBlocked ? 'opacity-70' : ''}`}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      {/* Visual Image Area */}
      <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden border border-border bg-surface-muted mb-4 shadow-sm group-hover:shadow-md group-hover:border-primary/20 transition-all duration-300">
        {record.coverImage ? (
          <img 
            src={record.coverImage} 
            alt={record.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-soft/30 via-surface-muted to-muted/10 flex flex-col items-center justify-center gap-2">
            <PictureOutlined className="text-text-muted/40" style={{ fontSize: 32 }} />
            <span className="text-[10px] text-text-muted/60 uppercase font-bold tracking-wider">No Cover Image</span>
          </div>
        )}

        {/* Category & Status Tags */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 z-20">
          <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/10 shadow-sm">
            {record.category || 'Uncategorized'}
          </span>
          {isFeatured && (
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold border border-amber-400/20 shadow-sm flex items-center gap-1">
              <StarOutlined style={{ fontSize: 10 }} /> Featured
            </span>
          )}
          {isBlocked && (
            <span className="px-2.5 py-0.5 rounded-full bg-danger text-white text-[10px] font-bold shadow-sm">
              Blocked
            </span>
          )}
        </div>

        {/* Premium Actions Glass Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 z-30 backdrop-blur-[1.5px]">
          {/* Edit Button */}
          <Button 
            shape="circle" 
            icon={<EditOutlined style={{ fontSize: 15 }} />} 
            onClick={(e) => { e.stopPropagation(); onEdit(record); }} 
            className="shadow-lg hover:scale-110 active:scale-95 bg-white/20 text-white border-white/25 hover:bg-white/40 hover:text-white transition-all duration-200"
            style={{ height: 38, width: 38 }}
          />

          {/* Toggle Block Status Button */}
          <Tooltip title={isBlocked ? "Unblock Blog" : "Block Blog"}>
            <Button 
              type="primary"
              shape="circle" 
              icon={isBlocked ? <UnlockOutlined style={{ fontSize: 16 }} /> : <LockOutlined style={{ fontSize: 16 }} />} 
              onClick={(e) => { e.stopPropagation(); onToggleStatus(record); }} 
              className={`shadow-xl hover:scale-115 active:scale-95 transition-all duration-200 ${isBlocked ? 'bg-emerald-500 border-emerald-500 hover:bg-emerald-600 hover:border-emerald-600' : 'bg-amber-500 border-amber-500 hover:bg-amber-600 hover:border-amber-600'}`}
              style={{ height: 44, width: 44 }}
            />
          </Tooltip>

          {/* Delete Button */}
          <Button 
            danger
            type="primary"
            shape="circle" 
            icon={<DeleteOutlined style={{ fontSize: 15 }} />} 
            onClick={(e) => { e.stopPropagation(); onDelete(record); }} 
            className="shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
            style={{ height: 38, width: 38 }}
          />
        </div>
      </div>

      {/* Info section below card */}
      <div className="px-1.5 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-3">
          <h4 
            onClick={(e) => { e.stopPropagation(); onEdit(record); }}
            className="font-extrabold text-foreground text-[15px] tracking-tight m-0 group-hover:text-primary transition-colors duration-200 truncate leading-snug hover:underline flex-1"
          >
            {record.title}
          </h4>
          <span className="shrink-0 text-[11px] text-text-muted/80 font-bold">
            by {record.author || 'Admin'}
          </span>
        </div>
        
        {record.subTitle ? (
          <p className="text-xs text-text-muted line-clamp-2 leading-relaxed m-0">
            {record.subTitle}
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

const Blog: FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Advanced Search states
  const [isFeaturedFilter, setIsFeaturedFilter] = useState<string | undefined>("all");
  const [isBlockedFilter, setIsBlockedFilter] = useState<string | undefined>("all");
  const [publishDateRange, setPublishDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // State for Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<any | null>(null);

  const { data: responseData, isLoading, isFetching } = Queries.useGetBlog({
    page: current,
    limit: pageSize,
    search: debouncedSearchQuery,
    isFeatured: isFeaturedFilter === "all" ? undefined : isFeaturedFilter,
    isBlocked: isBlockedFilter === "all" ? undefined : isBlockedFilter,
    startDate: publishDateRange?.[0] ? publishDateRange[0].startOf('day').toISOString() : undefined,
    endDate: publishDateRange?.[1] ? publishDateRange[1].endOf('day').toISOString() : undefined,
  });

  const blogs = useMemo(() => responseData?.data?.blog_data || [], [responseData]);
  const totalBlogs = Number(responseData?.data?.totalData) || 0;

  const addBlogMutation = Mutations.useAddBlog();
  const editBlogMutation = Mutations.useUpdateBlog();
  const deleteBlogMutation = Mutations.useDeleteBlog();

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setCurrent(1);
  };

  const handleSave = (values: any) => {
    if (editingBlog) {
      editBlogMutation.mutate(values, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.BLOG.BASE] });
          setIsFormOpen(false);
        },
      });
    } else {
      addBlogMutation.mutate(values, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.BLOG.BASE] });
          setIsFormOpen(false);
        },
      });
    }
  };
  
  const handleToggleStatus = (blog: any) => {
    editBlogMutation.mutate(
      { 
        blogId: blog._id, 
        title: blog.title,
        content: blog.content,
        category: blog.category,
        subTitle: blog.subTitle,
        coverImage: blog.coverImage,
        mainImage: blog.mainImage,
        author: blog.author,
        quote: blog.quote,
        isFeatured: blog.isFeatured,
        isBlocked: !blog.isBlocked 
      } as any,
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.BLOG.BASE] });
        }
      }
    );
  };

  const handleDeleteClick = (blog: any) => { 
    setBlogToDelete(blog);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!blogToDelete) return;
    
    deleteBlogMutation.mutate(blogToDelete._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.BLOG.BASE] });
        setIsDeleteModalOpen(false);
        setBlogToDelete(null);
      }
    });
  };

  return (
    <>
      <CommonBreadcrumbs title="Blogs" breadcrumbs={BREADCRUMBS.BLOG.BASE} />
      <CommonPageWrapper>
        {isFormOpen ? (
          <div className="course-container course-container--narrow">
            <BlogForm open={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={handleSave} editing={editingBlog} loading={addBlogMutation.isPending || editBlogMutation.isPending} />
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
                  <StarOutlined /> Editorial Board
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight m-0">
                  Blog & Publications
                </h2>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed m-0">
                  Compose rich educational articles, manage featured insights, and organize updates. Use filters to query categories, or block/feature blogs inline.
                </p>
                
                {/* Stats counters */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-xs text-text-muted font-bold">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    {totalBlogs} Total Posts
                  </span>
                  <span className="h-1 w-1 rounded-full bg-muted/60" />
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    {blogs.filter((b: any) => !b.isBlocked).length} Active Posts
                  </span>
                  <span className="h-1 w-1 rounded-full bg-muted/60" />
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-warning" />
                    {blogs.filter((b: any) => b.isFeatured).length} Featured
                  </span>
                </div>
              </div>

              {/* Right Column: Dynamic Action */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 z-10">
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={() => { setEditingBlog(null); setIsFormOpen(true); }}
                  className="h-11 px-6 rounded-xl font-bold shadow-lg hover:scale-102 active:scale-98 transition-all duration-200 bg-primary border-primary hover:bg-primary-dark hover:border-primary-dark"
                >
                  Create Article
                </Button>
                <div className="w-full sm:w-72">
                  <Input
                    placeholder="Search articles..."
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
                label: "Homepage Featured",
                value: isFeaturedFilter,
                options: [
                  { label: "All", value: "all" },
                  { label: "Featured Only", value: "true" },
                  { label: "Standard Only", value: "false" }
                ],
                onChange: (val: any) => { setIsFeaturedFilter(val); setCurrent(1); },
                grid: { xs: 24, sm: 12, md: 6 }
              },
              {
                label: "Publication Status",
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
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">Publish Date Range</span>
                <DatePicker.RangePicker
                  value={publishDateRange}
                  onChange={(dates) => {
                    setPublishDateRange(dates as any);
                    setCurrent(1);
                  }}
                  className="rounded-lg h-[40px] w-full"
                />
              </Col>
              {(isFeaturedFilter !== "all" || isBlockedFilter !== "all" || publishDateRange !== null) && (
                <Col xs={24} sm={24} md={6}>
                  <Button
                    onClick={() => {
                      setIsFeaturedFilter("all");
                      setIsBlockedFilter("all");
                      setPublishDateRange(null);
                      setCurrent(1);
                    }}
                    className="h-[40px] px-6 rounded-lg font-semibold hover:border-primary hover:text-primary transition-all duration-200 text-foreground"
                  >
                    Clear Filters
                  </Button>
                </Col>
              )}
            </AdvancedSearch>

            {/* Articles Grid */}
            <Spin spinning={isLoading || isFetching} size="large">
              {blogs.length > 0 ? (
                <div className="relative z-10 flex flex-col gap-8 min-h-[300px]">
                  <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10"
                  >
                    {blogs.map((blog: any) => (
                      <BlogCard 
                        key={blog._id} 
                        record={blog} 
                        onEdit={(b: any) => { setEditingBlog(b); setIsFormOpen(true); }}
                        onToggleStatus={handleToggleStatus}
                        onDelete={handleDeleteClick}
                      />
                    ))}
                  </motion.div>

                  {/* Pagination */}
                  {totalBlogs > pageSize && (
                    <div className="flex justify-end mt-4">
                      <Pagination
                        current={current}
                        pageSize={pageSize}
                        total={totalBlogs}
                        onChange={(page, size) => {
                          setCurrent(page);
                          setPageSize(size);
                        }}
                        showSizeChanger
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} articles`}
                        className="premium-pagination"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative z-10 flex flex-col items-center justify-center py-24 bg-gradient-to-b from-surface to-surface-muted border border-border border-dashed rounded-3xl min-h-[350px] shadow-sm text-center px-4">
                  <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary border border-primary-ring shadow-inner">
                    <StarOutlined style={{ fontSize: 32 }} />
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow">0</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1.5">No Articles Found</h3>
                  <p className="text-xs text-text-muted max-w-sm mb-6 leading-relaxed">
                    Write creative lessons, updates, or informational blogs to engage your audience and build study groups.
                  </p>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => { setEditingBlog(null); setIsFormOpen(true); }}
                    className="h-10 px-6 rounded-xl font-bold shadow-md hover:scale-102 active:scale-98 transition-all duration-200 bg-primary border-primary hover:bg-primary-dark hover:border-primary-dark"
                  >
                    Compose Your First Article
                  </Button>
                </div>
              )}
            </Spin>
          </motion.div>
        )}
      </CommonPageWrapper>
      <CommonDeleteModal open={isDeleteModalOpen} title="Delete Blog" itemName={blogToDelete?.title} loading={deleteBlogMutation.isPending} onClose={() => { setIsDeleteModalOpen(false); setBlogToDelete(null); }} onConfirm={handleConfirmDelete} />
    </>
  );
};

export default Blog;