import { useState, useMemo, type FC } from 'react';
import { Button, Tag, Avatar } from 'antd';
import { DeleteOutlined, EditOutlined, FolderOpenOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { KEYS } from '@/Constants';
import { BREADCRUMBS } from '@/Data';
import { CommonPageWrapper, CommonBreadcrumbs, CommonTable, CommonSummaryCards, CommonDeleteModal, CourseForm } from '@/Components'; // Added CommonDeleteModal
import { motion } from 'motion/react';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '@/Utils';
import { Mutations, Queries } from '@/Api';
import type { ColumnType } from 'antd/es/table';
import type { CourseBase, CourseColumnProps } from '@/Types';

const getCourseColumns = ({ onEdit, onManage, onToggleStatus, onDelete, current = 1, pageSize = 10 }: CourseColumnProps & { current?: number; pageSize?: number }): ColumnType<CourseBase>[] => [
  {
    title: "Sr. No.",
    key: "srNo",
    width: 80,
    render: (_: any, __: any, index: number) => (current - 1) * pageSize + index + 1
  },
  {
    title: "Image", 
    dataIndex: "image", 
    width: 70,
    render: (v: any) => (
      <Avatar shape="square" size={40} src={v} className="bg-surface-muted">
        {!v && "N/A"}
      </Avatar>
    ) 
  },
  {
    title: "Name", 
    dataIndex: "name", 
    render: (v: any) => <span className="font-semibold text-foreground">{v}</span> 
  },
  {
    title: "Price", 
    dataIndex: "price", 
    width: 120,
    sorter: (a: any, b: any) => a.price - b.price,
    render: (v: any, r: any) => (
      <div>
        <span className="font-semibold">₹{r.mrpPrice || v}</span>
        {v > r.mrpPrice && r.mrpPrice > 0 && (
          <span className="text-muted line-through text-xs ml-1">₹{v}</span>
        )}
      </div>
    ) 
  },
  {
    title: "Language", 
    dataIndex: "language", 
    width: 110,
    render: (v: any) => <Tag color="blue">{v || "N/A"}</Tag> 
  },
  {
    title: "Duration", 
    dataIndex: "duration", 
    width: 110,
    render: (v: any) => <span className="text-text-muted">{v ? `${v} hrs` : "N/A"}</span> 
  },
  {
    title: "Access (Days)", 
    dataIndex: "accessDurationDays", 
    width: 120,
    render: (v: any) => <span className="text-text-muted">{v ? `${v} days` : "N/A"}</span> 
  },
  {
    title: "Status", 
    dataIndex: "isBlocked", 
    width: 100,
    render: (v: any) => <Tag color={v ? "red" : "green"}>{v ? "Blocked" : "Active"}</Tag> 
  },
  {
    title: "Actions", 
    dataIndex: "actions",
    width: 160,
    fixed: 'right' as const, 
    render: (_: any, r: any) => (
      <div className="flex gap-1 justify-center">
        <Button 
          type="text" 
          size="small" 
          icon={<FolderOpenOutlined />} 
          onClick={() => onManage(r)} 
          title="Manage Content"
        />
        <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(r)} />
        <Button 
          type="text" 
          size="small" 
          icon={r.isBlocked ? <UnlockOutlined /> : <LockOutlined />} 
          onClick={() => onToggleStatus(r)} 
          title={r.isBlocked ? "Unblock Course" : "Block Course"}
        />
        <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete(r)} />
      </div>
    ),
  },
];

const Courses: FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State for Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<any | null>(null);

  const { data: responseData, isLoading } = Queries.useGetCourses({
    page: current,
    limit: pageSize,
    search: debouncedSearchQuery
  });

  const courses = useMemo(() => responseData?.data?.course_data || [], [responseData]);
  const totalCourses = Number(responseData?.data?.totalData) || 0;

  const addCourseMutation = Mutations.useAddCourse();
  const editCourseMutation = Mutations.useUpdateCourse();
  const deleteCourseMutation = Mutations.useDeleteCourse();

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setCurrent(1);
  };

  const handleSave = (values: any) => {
    if (editingCourse) {
      editCourseMutation.mutate(values, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [KEYS.COURSE.BASE] });
            setIsFormOpen(false);
          },
      });
    } else {
      addCourseMutation.mutate(values, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [KEYS.COURSE.BASE] });
            setIsFormOpen(false);
          },
      });
    }
  };
  
  const handleToggleStatus = (course: any) => {
    editCourseMutation.mutate({
      courseId: course._id,
      isBlocked: !course.isBlocked
    } as any, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.COURSE.BASE] });
      }
    });
  };

  const handleDeleteClick = (course: any) => { 
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!courseToDelete) return;
    
    deleteCourseMutation.mutate(courseToDelete._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.COURSE.BASE] });
        setIsDeleteModalOpen(false);
        setCourseToDelete(null);
      }
    });
  };

  const handleManageContent = (course: any) => {
    navigate(`/courses/${course._id}/manage`);
  };

  const columns = useMemo(() => getCourseColumns({ 
    onEdit: (c) => { setEditingCourse(c); setIsFormOpen(true); }, 
    onManage: handleManageContent,
    onToggleStatus: handleToggleStatus,
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
      <CommonBreadcrumbs title="Courses" breadcrumbs={BREADCRUMBS.COURSE.BASE} />
      <CommonPageWrapper>
        {isFormOpen ? (
          <div className="course-container course-container--narrow">
            <CourseForm open={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={handleSave} editing={editingCourse} />
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <CommonSummaryCards total={totalCourses} active={courses.filter((c: any) => !c.isBlocked).length} blocked={courses.filter((c: any) => c.isBlocked).length} subject="Courses" />
            <motion.div variants={blurRevealUp}>
              <CommonTable columns={columns} data={courses} loading={isLoading || addCourseMutation.isPending || editCourseMutation.isPending} searchPlaceholder="Search courses..." onSearch={handleSearch} onAdd={() => { setEditingCourse(null); setIsFormOpen(true); }} fileName="Courses" title="Course Management" current={current} pageSize={pageSize} total={totalCourses} onTableChange={handleTableChange} scroll={{ x: 1000 }} />
            </motion.div>
          </motion.div>
        )}
      </CommonPageWrapper>
      <CommonDeleteModal open={isDeleteModalOpen} title="Delete Course" itemName={courseToDelete?.name} loading={deleteCourseMutation.isPending} onClose={() => { setIsDeleteModalOpen(false); setCourseToDelete(null); }} onConfirm={handleConfirmDelete} />
    </>
  );
};

export default Courses;