import { useState, useMemo, type FC } from 'react';
import { Button, Tag, Avatar, Col, Slider } from 'antd';
import { DeleteOutlined, EditOutlined, FolderOpenOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { KEYS } from '@/Constants';
import { BREADCRUMBS } from '@/Data';
import { CommonPageWrapper, CommonBreadcrumbs, CommonTable, CommonSummaryCards, CommonDeleteModal, CourseForm, CommonTag, AdvancedSearch } from '@/Components'; // Added CommonDeleteModal
import { motion } from 'motion/react';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '@/Utils';
import { Mutations, Queries } from '@/Api';
import type { ColumnType } from 'antd/es/table';
import type { CourseBase, CourseColumnProps } from '@/Types';

const getCourseColumns = ({ onEdit, onManage, onToggleStatus, onDelete }: CourseColumnProps): ColumnType<CourseBase>[] => [
  {
    title: "#",
    dataIndex: "priority",
    width: 80,
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
      <Avatar shape="square" size={40} src={v} className="bg-surface-muted">
        {!v && "N/A"}
      </Avatar>
    ) 
  },
  {
    title: "Name", 
    dataIndex: "name",
    align: "center", 
    render: (v: any) => <span className="font-semibold text-foreground">{v}</span> 
  },
  {
    title: "Price", 
    dataIndex: "price", 
    width: 120,
    align: "center",    
    sorter: (a: any, b: any) => a.price - b.price,
    render: (v: any, r: any) => (
      <div>
        <span className="font-semibold">₹{r.mrpPrice || v}</span><br />
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
    align: "center",
    render: (v: any) => <Tag color="blue">{v || "N/A"}</Tag> 
  },
  {
    title: "Duration", 
    dataIndex: "duration", 
    align: "center",
    width: 110,
    render: (v: any) => <span className="text-text-muted">{v ? `${v} hrs` : "N/A"}</span> 
  },
  {
    title: "Access (Days)", 
    dataIndex: "accessDurationDays", 
    width: 120,
    align: "center",
    render: (v: any) => <span className="text-text-muted">{v ? `${v} days` : "N/A"}</span> 
  },
  {
    title: "Status", 
    dataIndex: "isBlocked", 
    width: 100,
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

  // Advanced Search states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [languageFilter, setLanguageFilter] = useState<string | undefined>("all");
  const [isBlockedFilter, setIsBlockedFilter] = useState<string | undefined>("all");
  const [accessDaysRange, setAccessDaysRange] = useState<[number, number]>([0, 365]);

  // State for Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<any | null>(null);

  const { data: responseData, isLoading, isFetching } = Queries.useGetCourses({
    page: current,
    limit: pageSize,
    search: debouncedSearchQuery,
    minPrice: priceRange[0] === 0 ? undefined : priceRange[0],
    maxPrice: priceRange[1] === 50000 ? undefined : priceRange[1],
    language: languageFilter === "all" ? undefined : languageFilter,
    isBlocked: isBlockedFilter === "all" ? undefined : isBlockedFilter,
    minAccessDurationDays: accessDaysRange[0] === 0 ? undefined : accessDaysRange[0],
    maxAccessDurationDays: accessDaysRange[1] === 365 ? undefined : accessDaysRange[1],
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
  }), []);  

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
              <AdvancedSearch filter={[
                {
                  label: "Language",
                  value: languageFilter,
                  options: [
                    { label: "All", value: "all" },
                    { label: "English", value: "English" },
                    { label: "Hindi", value: "Hindi" }
                  ],
                  onChange: (val: any) => { setLanguageFilter(val); setCurrent(1); },
                  grid: { xs: 24, sm: 12, md: 5 }
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
                  grid: { xs: 24, sm: 12, md: 5 }
                }
              ]}>
                <Col xs={24} sm={12} md={5} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Price: ₹{priceRange[0]} - ₹{priceRange[1] === 50000 ? "50,000+" : priceRange[1]}
                  </span>
                  <div className="ant-picker w-full h-[40px] flex items-center px-4 rounded-lg">
                    <Slider
                      range
                      min={0}
                      max={50000}
                      step={100}
                      value={priceRange}
                      onChange={(val) => { setPriceRange(val as [number, number]); setCurrent(1); }}
                      tooltip={{ formatter: (v) => `₹${v}` }}
                      style={{ width: "100%", margin: 0, padding: 0 }}
                    />
                  </div>
                </Col>
                <Col xs={24} sm={12} md={5} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Access Period: {accessDaysRange[0]} - {accessDaysRange[1] === 365 ? "365+ days" : `${accessDaysRange[1]} days`}
                  </span>
                  <div className="ant-picker w-full h-[40px] flex items-center px-4 rounded-lg">
                    <Slider
                      range
                      min={0}
                      max={365}
                      step={5}
                      value={accessDaysRange}
                      onChange={(val) => { setAccessDaysRange(val as [number, number]); setCurrent(1); }}
                      tooltip={{ formatter: (v) => `${v} days` }}
                      style={{ width: "100%", margin: 0, padding: 0 }}
                    />
                  </div>
                </Col>
                {(priceRange[0] !== 0 || priceRange[1] !== 50000 || accessDaysRange[0] !== 0 || accessDaysRange[1] !== 365 || languageFilter !== "all" || isBlockedFilter !== "all") && (
                  <Col xs={24} sm={24} md={4}>
                    <Button
                      onClick={() => {
                        setPriceRange([0, 50000]);
                        setAccessDaysRange([0, 365]);
                        setLanguageFilter("all");
                        setIsBlockedFilter("all");
                        setCurrent(1);
                      }}
                      className="h-[40px] px-6 rounded-lg font-semibold hover:border-primary hover:text-primary transition-all duration-200 text-foreground"
                    >
                      Clear Filters
                    </Button>
                  </Col>
                )}
              </AdvancedSearch>
              <CommonTable columns={columns} data={courses} loading={isLoading || isFetching || addCourseMutation.isPending || editCourseMutation.isPending} searchPlaceholder="Search courses..." onSearch={handleSearch} onAdd={() => { setEditingCourse(null); setIsFormOpen(true); }} fileName="Courses" title="Course Management" current={current} pageSize={pageSize} total={totalCourses} onTableChange={handleTableChange} scroll={{ x: 1000 }} />
            </motion.div>
          </motion.div>
        )}
      </CommonPageWrapper>
      <CommonDeleteModal open={isDeleteModalOpen} title="Delete Course" itemName={courseToDelete?.name} loading={deleteCourseMutation.isPending} onClose={() => { setIsDeleteModalOpen(false); setCourseToDelete(null); }} onConfirm={handleConfirmDelete} />
    </>
  );
};

export default Courses;