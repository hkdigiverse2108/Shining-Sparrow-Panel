import { useState, useMemo, type FC } from 'react';
import { Button, Tag, Rate, Select, Tooltip, DatePicker, Col, Avatar } from 'antd';
import {
  DeleteOutlined, EditOutlined, LockOutlined, UnlockOutlined, CalendarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { KEYS } from '@/Constants';
import { BREADCRUMBS } from '@/Data';
import { CommonPageWrapper, CommonBreadcrumbs, CommonDeleteModal, AdvancedSearch, CommonTable, CommonSummaryCards } from '@/Components';
import { TestimonialForm } from '@/Components/Workshop/TestimonialForm';
import { motion } from 'motion/react';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { useQueryClient } from '@tanstack/react-query';
import { Mutations, Queries } from '@/Api';
import { useDebounce } from '@/Utils';

const TestimonialPage: FC = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<any | null>(null);

  // Search & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Filters
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | undefined>(undefined);
  const [isBlockedFilter, setIsBlockedFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  const params = useMemo(() => {
    const p: Record<string, any> = { page: current, limit: pageSize };
    if (debouncedSearchQuery) p.search = debouncedSearchQuery;
    if (selectedType !== 'all') p.type = selectedType;
    if (selectedCatalogId) p.learningCatalogId = selectedCatalogId;
    if (isBlockedFilter !== 'all') p.isBlocked = isBlockedFilter;
    if (ratingFilter !== 'all') p.rate = ratingFilter;
    if (dateRange?.[0]) p.startDate = dateRange[0].startOf('day').toISOString();
    if (dateRange?.[1]) p.endDate = dateRange[1].endOf('day').toISOString();
    return p;
  }, [current, pageSize, debouncedSearchQuery, selectedType, selectedCatalogId, isBlockedFilter, ratingFilter, dateRange]);

  const { data: responseData, isLoading } = Queries.useGetTestimonials(params);
  const testimonials = useMemo(() => responseData?.data?.testimonial_data || responseData?.data || [], [responseData]);
  const totalTestimonials = Number(responseData?.data?.totalData) || testimonials.length;

  const { data: coursesRes } = Queries.useGetCourses({ page: 1, limit: 1000 });
  const courses = useMemo(() => coursesRes?.data?.course_data || [], [coursesRes]);

  const { data: workshopsRes } = Queries.useGetWorkshops({ page: 1, limit: 1000 });
  const workshops = useMemo(() => workshopsRes?.data?.workshop_data || [], [workshopsRes]);

  // Catalog options based on selected type
  const catalogOptions = useMemo(() => {
    if (selectedType === 'course') return courses.map((c: any) => ({ value: c._id, label: c.name }));
    if (selectedType === 'workshop') return workshops.map((w: any) => ({ value: w._id, label: w.title }));
    return [];
  }, [selectedType, courses, workshops]);

  const addTestimonialMutation = Mutations.useAddTestimonial();
  const editTestimonialMutation = Mutations.useUpdateTestimonial();
  const deleteTestimonialMutation = Mutations.useDeleteTestimonial();

  const handleSave = (values: any) => {
    const isEdit = !!editingTestimonial;
    const payload: any = {
      name: values.name,
      designation: values.designation || '',
      rate: Number(values.rate),
      description: values.description || '',
      image: values.image || '/assets/images/Logo_icon.png',
    };
    if (isEdit) payload.testimonialId = editingTestimonial._id;

    const mutation = isEdit ? editTestimonialMutation : addTestimonialMutation;
    mutation.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.TESTIMONIAL.BASE] });
        setIsFormOpen(false);
        setEditingTestimonial(null);
      },
    });
  };

  const handleDeleteClick = (t: any) => { setTestimonialToDelete(t); setIsDeleteModalOpen(true); };

  const handleConfirmDelete = () => {
    if (!testimonialToDelete) return;
    deleteTestimonialMutation.mutate(testimonialToDelete._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.TESTIMONIAL.BASE] });
        setIsDeleteModalOpen(false);
        setTestimonialToDelete(null);
      },
    });
  };

  const handleEditClick = (t: any) => { setEditingTestimonial(t); setIsFormOpen(true); };

  const handleToggleBlock = (t: any) => {
    editTestimonialMutation.mutate(
      { testimonialId: t._id, isBlocked: !t.isBlocked },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEYS.TESTIMONIAL.BASE] }) }
    );
  };

  // Whether catalog picker is visible
  const hasCatalog = selectedType === 'course' || selectedType === 'workshop';
  const colSpan = hasCatalog ? 4 : 5;
  const hasActiveFilters = selectedType !== 'all' || !!selectedCatalogId || isBlockedFilter !== 'all' || ratingFilter !== 'all' || !!dateRange;

  const handleTableChange = (pagination: any) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const columns = useMemo(() => [
    {
      title: '#',
      key: 'srNo',
      align: 'center' as const,
      width: 70,
      render: (_: any, __: any, index: number) => (current - 1) * pageSize + index + 1
    },
    {
      title: 'User / Client',
      dataIndex: 'name',
      render: (v: string, r: any) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={r.image || '/assets/images/Logo_icon.png'}
            size={38}
            className="shrink-0 border border-border shadow-sm bg-surface-muted/40"
          />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground truncate">{v}</div>
            {r.designation && <div className="text-xs text-muted truncate">{r.designation}</div>}
          </div>
        </div>
      )
    },
    {
      title: 'Rating',
      dataIndex: 'rate',
      width: 140,
      render: (v: number) => (
        <div className="flex items-center gap-1.5">
          <Rate disabled value={v || 5} className="text-xs" style={{ fontSize: '11px' }} />
          <span className="text-xs font-bold text-amber-500 font-mono">({v || 5})</span>
        </div>
      )
    },
    {
      title: 'Review Description',
      dataIndex: 'description',
      render: (v: string) => (
        <Tooltip title={v}>
          <span className="text-xs text-text-muted line-clamp-2 max-w-[280px] block leading-relaxed">
            {v || <span className="text-muted italic">No review text</span>}
          </span>
        </Tooltip>
      )
    },
    {
      title: 'Linked To',
      dataIndex: 'type',
      width: 120,
      render: (v: string) => {
        if (!v || v === 'home') return <Tag color="cyan" className="capitalize m-0 border-none font-bold text-[10px] uppercase tracking-wider">Home Page</Tag>;
        return (
          <Tag
            color={v === 'course' ? 'blue' : 'purple'}
            className="capitalize m-0 border-none font-bold text-[10px] uppercase tracking-wider"
          >
            {v}
          </Tag>
        );
      }
    },
    {
      title: 'Linked Item',
      dataIndex: 'learningCatalogId',
      render: (v: any, r: any) => {
        if (!v) return <span className="text-muted text-xs italic">Global</span>;
        
        let name = '';
        if (typeof v === 'object' && v !== null) {
          name = r.type === 'course' ? v.name : (r.type === 'workshop' ? v.title : '');
        } else {
          const id = String(v);
          if (r.type === 'course') {
            const c = courses.find((item: any) => item._id === id);
            name = c?.name || id;
          } else if (r.type === 'workshop') {
            const w = workshops.find((item: any) => item._id === id);
            name = w?.title || id;
          }
        }
        
        if (!name) return <span className="text-muted text-xs italic">Global</span>;
        return (
          <span className="text-xs text-foreground font-semibold truncate max-w-[150px] block" title={name}>
            {name}
          </span>
        );
      }
    },
    {
      title: 'Status',
      dataIndex: 'isBlocked',
      width: 100,
      render: (v: boolean) => (
        <Tag color={v ? 'error' : 'green'} className="m-0 border-none font-semibold text-[10px] uppercase tracking-wider">
          {v ? 'Blocked' : 'Active'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      width: 120,
      fixed: 'right' as const,
      align: 'center' as const,
      render: (_: any, r: any) => (
        <div className="flex items-center gap-1 justify-center">
          <Tooltip title={r.isBlocked ? 'Unblock' : 'Block'}>
            <Button
              type="text"
              size="small"
              shape="circle"
              icon={r.isBlocked ? <UnlockOutlined /> : <LockOutlined />}
              onClick={() => handleToggleBlock(r)}
              loading={editTestimonialMutation.isPending}
              className={r.isBlocked
                ? 'hover:!bg-emerald-500/10 hover:!text-emerald-500 text-muted'
                : 'hover:!bg-amber-500/10 hover:!text-amber-500 text-muted'}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              size="small"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEditClick(r)}
              className="hover:!bg-primary/10 hover:!text-primary text-muted"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              size="small"
              shape="circle"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteClick(r)}
              className="hover:!bg-rose-500/10"
            />
          </Tooltip>
        </div>
      )
    }
  ], [current, pageSize, courses, workshops, editTestimonialMutation.isPending]);

  return (
    <>
      <CommonBreadcrumbs title="Testimonial Management" breadcrumbs={BREADCRUMBS.TESTIMONIAL.BASE} />
      <CommonPageWrapper>
        {isFormOpen ? (
          <div className="course-container course-container--narrow">
            <TestimonialForm
              editing={editingTestimonial}
              onSave={handleSave}
              loading={addTestimonialMutation.isPending || editTestimonialMutation.isPending}
            />
            <div className="mt-4 flex justify-end">
              <Button onClick={() => { setIsFormOpen(false); setEditingTestimonial(null); }}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <CommonSummaryCards
              total={totalTestimonials}
              active={testimonials.filter((t: any) => !t.isBlocked).length}
              blocked={testimonials.filter((t: any) => t.isBlocked).length}
              subject="Testimonials"
            />
            <motion.div variants={blurRevealUp}>

              {/* ── Advanced Search ── */}
              <div className="mb-8">
                <AdvancedSearch filter={[
                  {
                    label: 'Linked To',
                    value: selectedType,
                    options: [
                      { value: 'all', label: 'All' },
                      { value: 'home', label: 'Home Page' },
                      { value: 'course', label: 'Course Specific' },
                      { value: 'workshop', label: 'Workshop Specific' },
                    ],
                    onChange: (val: any) => { setSelectedType(val); setSelectedCatalogId(undefined); setCurrent(1); },
                    grid: { xs: 24, sm: 12, md: colSpan },
                  },
                  {
                    label: 'Status',
                    value: isBlockedFilter,
                    options: [
                      { label: 'All', value: 'all' },
                      { label: 'Active', value: 'false' },
                      { label: 'Blocked', value: 'true' },
                    ],
                    onChange: (val: any) => { setIsBlockedFilter(val); setCurrent(1); },
                    grid: { xs: 24, sm: 12, md: colSpan },
                  },
                  {
                    label: 'Rating',
                    value: ratingFilter,
                    options: [
                      { label: 'All Ratings', value: 'all' },
                      { label: '5 Stars ★★★★★', value: '5' },
                      { label: '4 Stars ★★★★', value: '4' },
                      { label: '3 Stars ★★★', value: '3' },
                      { label: '2 Stars ★★', value: '2' },
                      { label: '1 Star ★', value: '1' },
                    ],
                    onChange: (val: any) => { setRatingFilter(val); setCurrent(1); },
                    grid: { xs: 24, sm: 12, md: colSpan },
                  },
                ]}>
                  {/* Course / Workshop picker — visible when type is selected */}
                  {hasCatalog && (
                    <Col xs={24} sm={12} md={4} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                        Select {selectedType === 'course' ? 'Course' : 'Workshop'}
                      </span>
                      <Select
                        value={selectedCatalogId || null}
                        onChange={(val) => { setSelectedCatalogId(val || undefined); setCurrent(1); }}
                        options={catalogOptions}
                        className="w-full"
                        placeholder={`Choose a ${selectedType}`}
                        showSearch
                        allowClear
                        filterOption={(input, option) =>
                          (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                        }
                        style={{ height: '40px' }}
                      />
                    </Col>
                  )}

                  {/* Date range */}
                  <Col
                    xs={24} sm={12} md={hasCatalog ? 4 : colSpan}
                    style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                      <CalendarOutlined className="mr-1" />Created Date Range
                    </span>
                    <DatePicker.RangePicker
                      value={dateRange}
                      onChange={(dates) => { setDateRange(dates as any); setCurrent(1); }}
                      className="rounded-lg h-[40px] w-full"
                    />
                  </Col>

                  {/* Clear filters */}
                  {hasActiveFilters && (
                    <Col xs={24} sm={24} md={4}>
                      <Button
                        onClick={() => {
                          setSelectedType('all');
                          setSelectedCatalogId(undefined);
                          setIsBlockedFilter('all');
                          setRatingFilter('all');
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

              {/* ── Content (CommonTable) ── */}
              <CommonTable
                columns={columns}
                data={testimonials}
                loading={isLoading}
                searchPlaceholder="Search testimonials by name, description..."
                onSearch={(q) => { setSearchQuery(q); setCurrent(1); }}
                onAdd={() => { setEditingTestimonial(null); setIsFormOpen(true); }}
                fileName="Testimonials"
                title="Testimonials Management"
                current={current}
                pageSize={pageSize}
                total={totalTestimonials}
                onTableChange={handleTableChange}
              />
            </motion.div>
          </motion.div>
        )}
      </CommonPageWrapper>

      <CommonDeleteModal
        open={isDeleteModalOpen}
        title="Delete Testimonial"
        itemName={testimonialToDelete?.name}
        loading={deleteTestimonialMutation.isPending}
        onClose={() => { setIsDeleteModalOpen(false); setTestimonialToDelete(null); }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default TestimonialPage;
