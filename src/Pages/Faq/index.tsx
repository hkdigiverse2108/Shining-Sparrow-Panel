import { useState, useMemo, type FC } from 'react';
import { Button, Tag, Spin, Select, Tooltip, DatePicker, Col, Input, Pagination } from 'antd';
import { DeleteOutlined, PlusOutlined, QuestionCircleOutlined, EditOutlined, StarFilled, LockOutlined, UnlockOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { KEYS } from '@/Constants';
import { BREADCRUMBS } from '@/Data';
import { CommonPageWrapper, CommonBreadcrumbs, CommonDeleteModal, AdvancedSearch } from '@/Components';
import { FAQForm } from '@/Components/Workshop/FAQForm';
import { motion } from 'motion/react';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { useQueryClient } from '@tanstack/react-query';
import { Mutations, Queries } from '@/Api';
import { CommonButton } from '@/Attribute';
import { useDebounce } from '@/Utils';

const Faq: FC = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<any | null>(null);

  // Search & Pagination states
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Advanced filters state
  const [selectedType, setSelectedType] = useState<string | undefined>("all");
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | undefined>(undefined);
  const [isFeaturedFilter, setIsFeaturedFilter] = useState<string | undefined>("all");
  const [isBlockedFilter, setIsBlockedFilter] = useState<string | undefined>("all");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  const params = useMemo(() => {
    const p: Record<string, any> = {
      page: current,
      limit: pageSize,
    };
    if (debouncedSearchQuery) p.search = debouncedSearchQuery;
    if (selectedType && selectedType !== "all") p.type = selectedType;
    if (selectedCatalogId) p.learningCatalogFilter = selectedCatalogId;
    if (isFeaturedFilter !== undefined && isFeaturedFilter !== "all") p.isFeatured = isFeaturedFilter;
    if (isBlockedFilter !== undefined && isBlockedFilter !== "all") p.isBlocked = isBlockedFilter;
    if (dateRange?.[0]) p.startDate = dateRange[0].startOf('day').toISOString();
    if (dateRange?.[1]) p.endDate = dateRange[1].endOf('day').toISOString();
    return p;
  }, [current, pageSize, debouncedSearchQuery, selectedType, selectedCatalogId, isFeaturedFilter, isBlockedFilter, dateRange]);

  const { data: responseData, isLoading } = Queries.useGetFAQs(params);
  const faqs = useMemo(() => responseData?.data?.faq_data || [], [responseData]);
  const totalFaq = Number(responseData?.data?.totalData) || faqs.length;

  const { data: coursesRes } = Queries.useGetCourses({ page: 1, limit: 1000 });
  const courses = useMemo(() => coursesRes?.data?.course_data || [], [coursesRes]);

  const { data: workshopsRes } = Queries.useGetWorkshops({ page: 1, limit: 1000 });
  const workshops = useMemo(() => workshopsRes?.data?.workshop_data || [], [workshopsRes]);

  const addFAQMutation = Mutations.useAddFAQ();
  const editFAQMutation = Mutations.useUpdateFAQ();
  const deleteFAQMutation = Mutations.useDeleteFAQ();

  const allCatalogOptions = useMemo(() => [
    ...courses.map((c: any) => ({ value: c._id, label: c.name, type: 'course' })),
    ...workshops.map((w: any) => ({ value: w._id, label: w.title, type: 'workshop' })),
  ], [courses, workshops]);

  const handleSave = (values: any) => {
    const payload: any = {
      question: {
        en: values.questionEn,
        hi: values.questionHi || null,
        gu: values.questionGu || null,
      },
      answer: {
        en: values.answerEn,
        hi: values.answerHi || null,
        gu: values.answerGu || null,
      },
      type: values.type,
      isFeatured: values.isFeatured || false,
      isBlocked: values.isBlocked || false,
    };

    if (values.type !== 'home') {
      payload.learningCatalogId = values.learningCatalogId || null;
    } else {
      payload.learningCatalogId = null;
    }

    const isEdit = !!editingFaq;
    if (isEdit) payload.faqId = editingFaq._id;

    const mutation = isEdit ? editFAQMutation : addFAQMutation;
    mutation.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.FAQ.BASE] });
        setIsFormOpen(false);
        setEditingFaq(null);
      },
    });
  };

  const handleDeleteClick = (faq: any) => {
    setFaqToDelete(faq);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!faqToDelete) return;
    deleteFAQMutation.mutate(faqToDelete._id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.FAQ.BASE] });
        setIsDeleteModalOpen(false);
        setFaqToDelete(null);
      },
    });
  };

  const handleEditClick = (faq: any) => {
    setEditingFaq(faq);
    setIsFormOpen(true);
  };

  const handleToggleBlock = (faq: any) => {
    editFAQMutation.mutate(
      { faqId: faq._id, isBlocked: !faq.isBlocked },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.FAQ.BASE] });
        },
      }
    );
  };

  return (
    <>
      <CommonBreadcrumbs title="FAQ Management" breadcrumbs={BREADCRUMBS.FAQ.BASE} />
      <CommonPageWrapper>
        {isFormOpen ? (
          <div className="course-container course-container--narrow">
            <FAQForm
              editing={editingFaq}
              onSave={handleSave}
              onClose={() => { setIsFormOpen(false); setEditingFaq(null); }}
              loading={addFAQMutation.isPending || editFAQMutation.isPending}
              showTypeSelector
              catalogOptions={allCatalogOptions}
            />
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={blurRevealUp}>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-extrabold text-foreground tracking-tight">FAQ Management</h1>
                  <p className="text-text-muted mt-1">{totalFaq} FAQ(s) matching filters.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-72">
                    <Input
                      placeholder="Search FAQs..."
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrent(1); }}
                      className="h-11 rounded-xl border-border bg-surface hover:border-primary-hover focus:border-primary transition-colors duration-200"
                      prefix={<SearchOutlined className="text-text-muted/70 mr-1.5" />}
                      allowClear
                    />
                  </div>
                  <CommonButton
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={() => { setEditingFaq(null); setIsFormOpen(true); }}
                    className="shadow-md"
                  >
                    Add FAQ
                  </CommonButton>
                </div>
              </div>

              {/* Advanced Search */}
              <div className="mb-8">
                <AdvancedSearch filter={[
                 
                  {
                    label: "Featured Display",
                    value: isFeaturedFilter,
                    options: [
                      { label: "All", value: "all" },
                      { label: "Featured Only", value: "true" },
                      { label: "Standard Only", value: "false" }
                    ],
                    onChange: (val: any) => { setIsFeaturedFilter(val); setCurrent(1); },
                    grid: { xs: 24, sm: 12, md: selectedType && selectedType !== 'home' && selectedType !== 'all' ? 4 : 6 }
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
                    grid: { xs: 24, sm: 12, md: selectedType && selectedType !== 'home' && selectedType !== 'all' ? 4 : 6 }
                    },
                   {
                    label: "FAQ Placement",
                    value: selectedType,
                    options: [
                      { value: "all", label: "All" },
                      { value: "home", label: "Global (Home Page)" },
                      { value: "course", label: "Course Specific" },
                      { value: "workshop", label: "Workshop Specific" }
                    ],
                    onChange: (val: any) => { setSelectedType(val); setSelectedCatalogId(undefined); setCurrent(1); },
                    grid: { xs: 24, sm: 12, md: selectedType && selectedType !== 'home' && selectedType !== 'all' ? 4 : 6 }
                  },
                ]}>
                  {selectedType && selectedType !== 'home' && selectedType !== 'all' && (
                    <Col xs={24} sm={12} md={4} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                        Select {selectedType === 'course' ? 'Course' : 'Workshop'}
                      </span>
                      <Select
                        value={selectedCatalogId || null}
                        onChange={(val) => { setSelectedCatalogId(val || undefined); setCurrent(1); }}
                        options={allCatalogOptions.filter((o) => o.type === selectedType)}
                        className="w-full"
                        size="large"
                        placeholder={`Choose a ${selectedType}`}
                        showSearch
                        allowClear
                        filterOption={(input, option) =>
                          (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                        }
                        style={{ height: "40px" }}
                      />
                    </Col>
                  )}
                  <Col xs={24} sm={12} md={selectedType && selectedType !== 'home' && selectedType !== 'all' ? 4 : 6} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted">Created Date Range</span>
                    <DatePicker.RangePicker
                      value={dateRange}
                      onChange={(dates) => {
                        setDateRange(dates as any);
                        setCurrent(1);
                      }}
                      className="rounded-lg h-[40px] w-full"
                    />
                  </Col>
                  {(selectedType !== "all" || selectedCatalogId || isFeaturedFilter !== "all" || isBlockedFilter !== "all" || dateRange) && (
                    <Col xs={24} sm={24} md={4}>
                      <Button
                        onClick={() => {
                          setSelectedType("all");
                          setSelectedCatalogId(undefined);
                          setIsFeaturedFilter("all");
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

              {/* Loading / Empty / List */}
              {isLoading ? (
                <div className="flex justify-center items-center h-64"><Spin size="large" /></div>
              ) : faqs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border rounded-3xl bg-surface-muted/80">
                  <div className="w-20 h-20 rounded-full bg-surface-muted flex items-center justify-center mb-6 shadow-inner">
                    <QuestionCircleOutlined className="text-3xl text-muted" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">No FAQs Yet</h3>
                  <p className="text-sm text-text-muted mb-8 max-w-sm text-center">
                    {selectedType === 'home'
                      ? 'Add global FAQs that appear on the homepage.'
                      : `Add FAQs specific to this ${selectedType}.`}
                  </p>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => { setEditingFaq(null); setIsFormOpen(true); }}
                  >
                    Create First FAQ
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {faqs.map((faq: any) => (
                    <div key={faq._id} className={`faq-list-item-card type-${faq.type} group ${faq.isBlocked ? 'opacity-75' : ''}`}>
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-3 flex-1">
                          {/* English */}
                          <div className="space-y-1">
                            <h4 className="font-semibold text-foreground text-base flex items-start gap-2 leading-snug">
                              <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">EN</span>
                              {faq.question?.en}
                            </h4>
                            <div className="text-sm text-text-muted pl-7 leading-relaxed flex items-start gap-2">
                              <span className="flex-1">{faq.answer?.en}</span>
                            </div>
                          </div>

                          {/* Hindi */}
                          {faq.question?.hi && (
                            <div className="space-y-1">
                              <h5 className="font-semibold text-foreground text-sm flex items-start gap-2 leading-snug">
                                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">HI</span>
                                {faq.question?.hi}
                              </h5>
                              <div className="text-sm text-text-muted pl-7 leading-relaxed">{faq.answer?.hi}</div>
                            </div>
                          )}

                          {/* Gujarati */}
                          {faq.question?.gu && (
                            <div className="space-y-1">
                              <h5 className="font-semibold text-foreground text-sm flex items-start gap-2 leading-snug">
                                <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">GU</span>
                                {faq.question?.gu}
                              </h5>
                              <div className="text-sm text-text-muted pl-7 leading-relaxed">{faq.answer?.gu}</div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100 shrink-0">
                          <Tooltip title={faq.isBlocked ? "Unblock FAQ" : "Block FAQ"}>
                            <Button
                              shape="circle"
                              icon={faq.isBlocked ? <UnlockOutlined /> : <LockOutlined />}
                              onClick={(e) => { e.stopPropagation(); handleToggleBlock(faq); }}
                              className={faq.isBlocked ? "hover:!bg-emerald-500/10 hover:!text-emerald-500 text-muted transition-all duration-200" : "hover:!bg-amber-500/10 hover:!text-amber-500 text-muted transition-all duration-200"}
                            />
                          </Tooltip>
                          <Button
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => handleEditClick(faq)}
                            className="hover:text-primary hover:border-primary"
                          />
                          <Button
                            shape="circle"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={(e) => { e.stopPropagation(); handleDeleteClick(faq); }}
                          />
                        </div>
                      </div>

                      {/* Type & Featured Tags */}
                      <div className="mt-3 flex items-center gap-2 pl-7">
                        <Tag
                          color={faq.type === 'home' ? 'green' : faq.type === 'course' ? 'blue' : 'purple'}
                          className="font-semibold border-none uppercase text-[10px] tracking-wider px-2 py-0.5"
                        >
                          {faq.type === 'home' ? 'Global' : faq.type}
                        </Tag>
                        {faq.isFeatured && (
                          <Tag color="gold" className="font-semibold border-none uppercase text-[10px] tracking-wider px-2 py-0.5 flex items-center gap-1">
                            <StarFilled className="text-[10px] text-amber-500" /> Featured
                          </Tag>
                        )}
                        {faq.isBlocked && (
                          <Tag color="error" className="font-semibold border-none uppercase text-[10px] tracking-wider px-2 py-0.5">
                            Blocked
                          </Tag>
                        )}
                      </div>
                    </div>
                  ))}
                  {totalFaq > pageSize && (
                    <div className="flex justify-end mt-6">
                      <Pagination
                        current={current}
                        pageSize={pageSize}
                        total={totalFaq}
                        onChange={(page, size) => {
                          setCurrent(page);
                          setPageSize(size);
                        }}
                        showSizeChanger
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} FAQs`}
                      />
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </CommonPageWrapper>
      <CommonDeleteModal
        open={isDeleteModalOpen}
        title="Delete FAQ"
        itemName={faqToDelete?.question?.en}
        loading={deleteFAQMutation.isPending}
        onClose={() => { setIsDeleteModalOpen(false); setFaqToDelete(null); }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default Faq;
