import { useState, useMemo, type FC } from 'react';
import { Button, Tag, Spin, Select } from 'antd';
import { DeleteOutlined, PlusOutlined, QuestionCircleOutlined, EditOutlined } from '@ant-design/icons';
import { KEYS } from '@/Constants';
import { BREADCRUMBS } from '@/Data';
import { CommonPageWrapper, CommonBreadcrumbs, CommonDeleteModal } from '@/Components';
import { FAQForm } from '@/Components/Workshop/FAQForm';
import { motion } from 'motion/react';
import { blurRevealUp, staggerContainer } from '@/Utils/animations';
import { useQueryClient } from '@tanstack/react-query';
import { Mutations, Queries } from '@/Api';
import { CommonButton } from '@/Attribute';

const FAQ_TYPES = [
  { value: 'home', label: 'Global (Home Page)' },
  { value: 'course', label: 'Course Specific' },
  { value: 'workshop', label: 'Workshop Specific' },
];

const Faq: FC = () => {
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<string>('home');
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<any | null>(null);

  const params = useMemo(() => {
    const p: Record<string, string> = { type: selectedType };
    if (selectedCatalogId) p.learningCatalogFilter = selectedCatalogId;
    return p;
  }, [selectedType, selectedCatalogId]);

  const { data: responseData, isLoading } = Queries.useGetFAQs(params);
  const faqs = useMemo(() => responseData?.data?.faq_data || [], [responseData]);

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
    };

    if (values.type !== 'home' && values.learningCatalogId) {
      payload.learningCatalogId = values.learningCatalogId;
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

  return (
    <>
      <CommonBreadcrumbs title="FAQ Management" breadcrumbs={BREADCRUMBS.FAQ.BASE} />
      <CommonPageWrapper>
        {isFormOpen ? (
          <div className="course-container course-container--narrow">
            <FAQForm
              editing={editingFaq}
              onSave={handleSave}
              loading={addFAQMutation.isPending || editFAQMutation.isPending}
              showTypeSelector
              catalogOptions={allCatalogOptions}
            />
            <div className="mt-4 flex justify-end">
              <Button onClick={() => { setIsFormOpen(false); setEditingFaq(null); }}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={blurRevealUp}>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-foreground tracking-tight">FAQ Management</h1>
                  <p className="text-text-muted mt-1">{faqs.length} FAQ(s) for this category.</p>
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

              {/* Type & Catalog Filter */}
              <div className="flex flex-wrap gap-4 mb-8 p-4 bg-surface-muted rounded-2xl border border-border">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">FAQ Type</label>
                  <Select
                    value={selectedType}
                    onChange={(val) => { setSelectedType(val); setSelectedCatalogId(null); }}
                    options={FAQ_TYPES}
                    className="w-full"
                    size="large"
                  />
                </div>
                {selectedType !== 'home' && (
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-semibold text-text-muted mb-1.5">
                      Select {selectedType === 'course' ? 'Course' : 'Workshop'}
                    </label>
                    <Select
                      value={selectedCatalogId}
                      onChange={(val) => setSelectedCatalogId(val)}
                      options={allCatalogOptions.filter((o) => o.type === selectedType)}
                      className="w-full"
                      size="large"
                      placeholder={`Choose a ${selectedType}`}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </div>
                )}
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
                    <div key={faq._id} className="bg-surface border border-border shadow-sm rounded-2xl p-4 sm:p-6 hover:shadow-md transition-shadow group">
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

                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <Button
                            shape="circle"
                            icon={<EditOutlined />}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleEditClick(faq)}
                          />
                          <Button
                            shape="circle"
                            danger
                            icon={<DeleteOutlined />}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => { e.stopPropagation(); handleDeleteClick(faq); }}
                          />
                        </div>
                      </div>

                      {/* Type & Featured Tags */}
                      <div className="mt-3 flex items-center gap-2">
                        <Tag
                          color={faq.type === 'home' ? 'green' : faq.type === 'course' ? 'blue' : 'purple'}
                          className="font-semibold border-none"
                        >
                          {faq.type}
                        </Tag>
                        {faq.isFeatured && (
                          <Tag color="gold" className="font-semibold border-none">Featured</Tag>
                        )}
                      </div>
                    </div>
                  ))}
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
