import { useState, useMemo, type FC } from 'react';
import { Button, Tag, Avatar } from 'antd'; 
import { DeleteOutlined, EditOutlined, LockOutlined, UnlockOutlined, StarOutlined } from '@ant-design/icons';
import { KEYS } from '@/Constants';
import { BREADCRUMBS } from '@/Data';
import { CommonPageWrapper, CommonBreadcrumbs, CommonTable, BlogForm, CommonSummaryCards, CommonDeleteModal, } from '@/Components';
import { motion } from 'motion/react';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '@/Utils';
import { Mutations, Queries } from '@/Api';
import type { ColumnType } from 'antd/es/table';

const getBlogColumns = ({ onEdit, onToggleStatus, onDelete, current = 1, pageSize = 10 }: any): ColumnType<any>[] => [
  { title: "Sr. No.", key: "srNo", width: 80, render: (_: any, __: any, index: number) => (current - 1) * pageSize + index + 1 },
  { title: "Image", dataIndex: "coverImage", width: 70, render: (v: any) => <Avatar shape="square" size={40} src={v} className="bg-surface-muted">{!v && "N/A"}</Avatar> },
  { title: "Title", dataIndex: "title", width: 230, render: (v: any) => <span className="font-medium">{v}</span> },
  { title: "Category", dataIndex: "category", width: 130, render: (v: any) => <Tag color="blue">{v || "Uncategorized"}</Tag> },
  { title: "Author", dataIndex: "author", width: 120, render: (v: any) => <span className="text-text-muted">{v || "Admin"}</span> },
  { title: "Featured", dataIndex: "isFeatured", width: 90, render: (v: any) => <Tag color={v ? "gold" : "purple"} icon={<StarOutlined />}>{v ? "Featured" : "Standard"}</Tag> },
  { title: "Status", dataIndex: "isBlocked", width: 90, render: (v: any) => <Tag color={v ? "red" : "green"}>{v ? "Blocked" : "Active"}</Tag> },
  { title: "Actions", dataIndex: "actions", width: 150, fixed: 'right' as const, render: (_: any, r: any) => ( <div className="flex gap-1"> <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(r)} /> <Button type="text" size="small" icon={r.isBlocked ? <UnlockOutlined /> : <LockOutlined />} onClick={() => onToggleStatus(r)} /> <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete(r)} /> </div> ), },
];

const Blog: FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State for Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<any | null>(null);

  const { data: responseData, isLoading } = Queries.useGetBlog({
    page: current,
    limit: pageSize,
    search: debouncedSearchQuery
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
    console.log(`Toggle status clicked for ${blog.title}`);
  };

  // Updated to open the modal instead of directly deleting
  const handleDeleteClick = (blog: any) => { 
    setBlogToDelete(blog);
    setIsDeleteModalOpen(true);
  };

  // Actual deletion logic triggered by the modal's confirm button
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

  const columns = useMemo(() => getBlogColumns({ 
    onEdit: (b) => { setEditingBlog(b); setIsFormOpen(true); }, 
    onToggleStatus: handleToggleStatus,
    onDelete: handleDeleteClick, // Passed the new click handler
    current,
    pageSize
  }), [current, pageSize]);  

  const handleTableChange = (pagination: any) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
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
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <CommonSummaryCards total={totalBlogs} active={blogs.filter((b: any) => !b.isBlocked).length} blocked={blogs.filter((b: any) => b.isBlocked).length} subject="Blogs" />
            <motion.div variants={blurRevealUp}>
              <CommonTable columns={columns} data={blogs} loading={isLoading || addBlogMutation.isPending || editBlogMutation.isPending} searchPlaceholder="Search blogs..." onSearch={handleSearch} onAdd={() => { setEditingBlog(null); setIsFormOpen(true); }} fileName="Blogs" title="Blog Management" current={current} pageSize={pageSize} total={totalBlogs} onTableChange={handleTableChange} scroll={{ x: 900 }} />
            </motion.div>
          </motion.div>
        )}
      </CommonPageWrapper>
      <CommonDeleteModal open={isDeleteModalOpen} title="Delete Blog" itemName={blogToDelete?.title} loading={deleteBlogMutation.isPending} onClose={() => { setIsDeleteModalOpen(false); setBlogToDelete(null); }} onConfirm={handleConfirmDelete} />
    </>
  );
};

export default Blog;