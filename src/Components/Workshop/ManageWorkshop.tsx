import { useState, useMemo, type FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Popconfirm, Button, Segmented, Rate, Tag } from 'antd';
import {
  FolderOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
  ArrowLeftOutlined, ClockCircleOutlined, BookOutlined,
  UnorderedListOutlined, FileTextOutlined, CommentOutlined, QuestionCircleOutlined,
  LockOutlined, UnlockOutlined
} from '@ant-design/icons';
import { Queries, Mutations } from '@/Api';
import { KEYS } from '@/Constants';
import { useQueryClient } from '@tanstack/react-query';
import { CommonBreadcrumbs, CommonPageWrapper, EmptyContentPanel, ContentItemCard, CommonReadMore } from '@/Components';
import {
  priorityBadge, durationBadge, dateBadge,
  videoResourceBadge, attachmentFileBadge, editAction, deleteAction, blockAction, blockedBadge
} from '@/Components/Common/ContentItemCard';
import { extractArray } from '@/Utils';
import { TestimonialForm } from './TestimonialForm';
import { FAQForm } from './FAQForm';

type FormMode =
  | { type: 'view' }
  | { type: 'addSession' }
  | { type: 'editSession'; data: any }
  | { type: 'addTestimonial' }
  | { type: 'editTestimonial'; data: any }
  | { type: 'addFAQ' }
  | { type: 'editFAQ'; data: any };

const ManageWorkshop: FC = () => {
  const { workshopId } = useParams<{ workshopId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeForm, setActiveForm] = useState<FormMode>({ type: 'view' });
  const [activeTab, setActiveTab] = useState<'schedule' | 'testimonials' | 'faqs'>('schedule');

  const { data: workshopRes, isLoading: wsLoading } = Queries.useGetWorkshopById(workshopId!);
  const { data: currRes, isLoading: currLoading } = Queries.useGetWorkshopCurriculums({ workshopFilter: workshopId });
  const { data: faqsRes, isLoading: faqsLoading } = Queries.useGetFAQs({ type: 'workshop', learningCatalogFilter: workshopId });

  const faqs = useMemo(() => faqsRes?.data?.faq_data || [], [faqsRes]);

  const editWorkshopMutation = Mutations.useUpdateWorkshop();
  const addCurrMutation = Mutations.useAddWorkshopCurriculum();
  const editCurrMutation = Mutations.useUpdateWorkshopCurriculum();
  const deleteCurrMutation = Mutations.useDeleteWorkshopCurriculum();
  const addTestimonialMutation = Mutations.useAddTestimonial();
  const editTestimonialMutation = Mutations.useUpdateTestimonial();
  const deleteTestimonialMutation = Mutations.useDeleteTestimonial();
  const addFAQMutation = Mutations.useAddFAQ();
  const editFAQMutation = Mutations.useUpdateFAQ();
  const deleteFAQMutation = Mutations.useDeleteFAQ();

  const isMutationLoading =
    addCurrMutation.isPending || editCurrMutation.isPending || deleteCurrMutation.isPending ||
    editWorkshopMutation.isPending ||
    addTestimonialMutation.isPending || editTestimonialMutation.isPending || deleteTestimonialMutation.isPending ||
    addFAQMutation.isPending || editFAQMutation.isPending || deleteFAQMutation.isPending;

  const workshop = workshopRes?.data;
  const curriculums = useMemo(() =>
    extractArray(currRes)
      .filter((c: any) => String(c.workshopId?._id ?? c.workshopId) === String(workshopId))
      .sort((a: any, b: any) => (a.priority ?? 0) - (b.priority ?? 0)),
    [currRes, workshopId]);

  // ── Session handlers ──────────────────────────────────────────────────────

  const handleDeleteSession = (id: string) => {
    deleteCurrMutation.mutate(id, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEYS.WORKSHOP_CURRICULUM.BASE] }),
    });
  };

  const handleToggleBlockSession = (curr: any) => {
    editCurrMutation.mutate(
      { workshopCurriculumId: curr._id, isBlocked: !curr.isBlocked } as any,
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.WORKSHOP_CURRICULUM.BASE] });
        },
      }
    );
  };

  // ── Testimonial handlers ──────────────────────────────────────────────────

  const handleSaveTestimonial = (values: any) => {
    const payload: any = {
      name: values.name,
      designation: values.designation || '',
      rate: Number(values.rate),
      description: values.description || '',
      image: values.image || '/assets/images/Logo_icon.png',
      learningCatalogId: workshopId,
      type: 'workshop',
    };
    if (values._id) payload.testimonialId = values._id;

    const mutation = values._id ? editTestimonialMutation : addTestimonialMutation;
    mutation.mutate(payload, {
      onSuccess: (res: any) => {
        const testimonialId = res.data?._id;
        if (!values._id && testimonialId) {
          const updatedIds = [...(workshop?.workshopTestimonials || []).map((t: any) => t._id || t), testimonialId];
          editWorkshopMutation.mutate({ workshopId, workshopTestimonials: updatedIds } as any, {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: [KEYS.WORKSHOP.BASE] });
              setActiveForm({ type: 'view' });
            },
          });
        } else {
          queryClient.invalidateQueries({ queryKey: [KEYS.WORKSHOP.BASE] });
          setActiveForm({ type: 'view' });
        }
      },
    });
  };

  const handleDeleteTestimonial = (testimonialId: string) => {
    const updatedIds = (workshop?.workshopTestimonials || []).map((t: any) => t._id || t).filter((id: any) => id !== testimonialId);
    editWorkshopMutation.mutate({ workshopId, workshopTestimonials: updatedIds } as any, {
      onSuccess: () => {
        deleteTestimonialMutation.mutate(testimonialId, {
          onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEYS.WORKSHOP.BASE] }),
          onError: () => queryClient.invalidateQueries({ queryKey: [KEYS.WORKSHOP.BASE] }),
        });
      },
    });
  };

  const handleToggleBlockTestimonial = (test: any) => {
    editTestimonialMutation.mutate(
      { testimonialId: test._id, isBlocked: !test.isBlocked } as any,
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.WORKSHOP.BASE] });
        },
      }
    );
  };

  // ── FAQ handlers ──────────────────────────────────────────────────────────

  const handleSaveFAQ = (values: any) => {
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
      type: 'workshop',
      learningCatalogId: workshopId,
    };
    if (activeForm.type === 'editFAQ' && activeForm.data?._id) payload.faqId = activeForm.data._id;

    const isEdit = !!payload.faqId;
    const mutation = isEdit ? editFAQMutation : addFAQMutation;
    mutation.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.FAQ.BASE] });
        setActiveForm({ type: 'view' });
      },
    });
  };

  const handleDeleteFAQ = (faqId: string) => {
    deleteFAQMutation.mutate(faqId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.FAQ.BASE] });
      },
    });
  };

  const handleToggleBlockFAQ = (faq: any) => {
    editFAQMutation.mutate(
      { faqId: faq._id, isBlocked: !faq.isBlocked } as any,
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.FAQ.BASE] });
        },
      }
    );
  };

  if (wsLoading || currLoading || faqsLoading) {
    return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>;
  }

  const tabAddLabel: Record<string, string> = { schedule: 'Add Session', testimonials: 'Add Testimonial', faqs: 'Add FAQ' };
  const tabAddMode: Record<string, FormMode['type']> = { schedule: 'addSession', testimonials: 'addTestimonial', faqs: 'addFAQ' };

  return (
    <>
      <CommonBreadcrumbs
        title={`Workshop Builder: ${workshop?.title || 'Workshop'}`}
        breadcrumbs={[{ label: 'Workshops', href: '/workshops' }, { label: `Manage: ${workshop?.title || 'Workshop'}` }]}
      />
      <CommonPageWrapper className="flex-1 min-h-screen bg-background pb-20">
        <div className="max-w-5xl mx-auto space-y-8 mt-6">

          {/* ── Active Form View ── */}
          {activeForm.type !== 'view' ? (
            <div className="bg-surface border border-border shadow-md rounded-2xl p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
                <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => setActiveForm({ type: 'view' })} className="text-text-muted hover:text-foreground rounded-full hover:bg-surface-muted" />
                <span className="font-semibold text-foreground text-sm">Back to Workshop Builder</span>
              </div>

              {activeForm.type === 'addTestimonial' && <TestimonialForm editing={null} onSave={handleSaveTestimonial} loading={isMutationLoading} />}
              {activeForm.type === 'editTestimonial' && <TestimonialForm editing={activeForm.data} onSave={handleSaveTestimonial} loading={isMutationLoading} />}
              {activeForm.type === 'addFAQ' && <FAQForm editing={null} onSave={handleSaveFAQ} loading={isMutationLoading} />}
              {activeForm.type === 'editFAQ' && <FAQForm editing={activeForm.data} onSave={handleSaveFAQ} loading={isMutationLoading} />}
            </div>
          ) : (
            <>
              {/* ── Workshop Header ── */}
              <div className="bg-surface border border-border shadow-sm rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg"><BookOutlined className="text-xl" /></div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">{workshop?.title}</h2>
                  </div>
                  <CommonReadMore htmlContent={workshop?.about || 'No description provided. Add sessions and configure dates below.'} maxHeight={90} className="mt-1.5 max-w-2xl" />
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-xs font-semibold text-text-muted bg-surface-muted px-2.5 py-1 rounded-full">{curriculums.length} Session{curriculums.length !== 1 ? 's' : ''}</span>
                    {(workshop?.workshopTestimonials || []).length > 0 && (
                      <span className="text-xs font-semibold text-text-muted bg-surface-muted px-2.5 py-1 rounded-full">{(workshop?.workshopTestimonials || []).length} Testimonial{(workshop?.workshopTestimonials || []).length !== 1 ? 's' : ''}</span>
                    )}
                    {faqs.length > 0 && (
                      <span className="text-xs font-semibold text-text-muted bg-surface-muted px-2.5 py-1 rounded-full">{faqs.length} FAQ{faqs.length !== 1 ? 's' : ''}</span>
                    )}
                    {workshop?.duration && (
                      <span className="text-xs font-semibold text-text-muted bg-surface-muted px-2.5 py-1 rounded-full flex items-center gap-1">
                        <ClockCircleOutlined className="text-[10px]" /> {workshop.duration}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                      {workshop?.price === 0 ? 'Free' : `₹${workshop?.price}`}
                    </span>
                  </div>
                </div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    if (activeTab === 'schedule') {
                      navigate(`/workshops/${workshopId}/curriculum/new/edit`);
                    } else {
                      setActiveForm({ type: tabAddMode[activeTab] as 'addTestimonial' | 'addFAQ' });
                    }
                  }}
                  className="bg-indigo-600 hover:!bg-indigo-700 text-white rounded-lg h-10 px-5 font-medium"
                >
                  {tabAddLabel[activeTab]}
                </Button>
              </div>

              {/* ── Tab Selector ── */}
              <div className="flex justify-start">
                <Segmented
                  options={[
                    { label: 'Schedule', value: 'schedule', icon: <UnorderedListOutlined /> },
                    { label: 'Testimonials', value: 'testimonials', icon: <CommentOutlined /> },
                    { label: 'FAQs', value: 'faqs', icon: <QuestionCircleOutlined /> },
                  ]}
                  value={activeTab}
                  onChange={(val) => setActiveTab(val as typeof activeTab)}
                  className="p-1 bg-surface border border-border shadow-sm rounded-xl font-medium"
                />
              </div>

              {/* ── Workflow Guide Card ── */}
              <div className="course-workflow-guide">
                <div className="course-workflow-guide__icon">
                  <BookOutlined />
                </div>
                <div className="course-workflow-guide__content">
                  <h4 className="course-workflow-guide__title">
                    {activeTab === 'schedule'
                      ? 'Managing Workshop Schedule'
                      : activeTab === 'testimonials'
                      ? 'Managing Customer Testimonials'
                      : 'Managing Workshop FAQs'}
                  </h4>
                  <p className="course-workflow-guide__text">
                    {activeTab === 'schedule' ? (
                      'Plan and sequence your workshop sessions. You can edit the session titles, summaries, dates, duration, resources, and change the ordering priority.'
                    ) : activeTab === 'testimonials' ? (
                      'Manage ratings and reviews from customers. Toggling block status controls visibility on the public landing page.'
                    ) : (
                      'Configure frequently asked questions for workshop learners. Translating to multiple languages improves reach.'
                    )}
                  </p>
                </div>
              </div>

              {/* ── Schedule Tab ── */}
              {activeTab === 'schedule' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2"><UnorderedListOutlined className="text-muted" /> Workshop Schedule</h3>
                    <span className="text-xs font-semibold text-muted bg-surface-muted px-2.5 py-1 rounded-full">Sorted by priority</span>
                  </div>
                  <div className="bg-surface border border-border shadow-sm rounded-2xl overflow-hidden divide-y divide-border">
                    {curriculums.length > 0 ? curriculums.map((curr: any, index: number) => (
                      <ContentItemCard
                        key={curr._id}
                        index={index}
                        title={curr.title}
                        description={curr.description}
                        thumbnail={curr.thumbnail}
                        thumbnailFallbackText={String(index + 1)}
                        className={`!rounded-none !border-0 !shadow-none hover:bg-surface-muted/40 ${curr.isBlocked ? 'opacity-75 border-red-100 bg-red-50/5' : ''}`}
                        badges={[
                          ...(curr.isBlocked ? [blockedBadge()] : []),
                          ...(curr.date ? [dateBadge(curr.date)] : []),
                          ...(curr.duration > 0 ? [durationBadge(`${curr.duration} mins`)] : []),
                          priorityBadge(curr.priority),
                          ...(curr.videoLink ? [videoResourceBadge(curr.videoLink)] : []),
                          ...(curr.attachment ? [attachmentFileBadge(curr.attachment)] : []),
                        ]}
                        actions={[
                          editAction(() => navigate(`/workshops/${workshopId}/curriculum/${curr._id}/edit`)),
                          blockAction(curr.isBlocked, () => handleToggleBlockSession(curr), editCurrMutation.isPending),
                          deleteAction(() => handleDeleteSession(curr._id), 'This will permanently delete this session.'),
                        ]}
                      />
                    )) : (
                      <EmptyContentPanel
                        icon={<FolderOutlined />}
                        title="No Sessions Added"
                        description="Add sessions to build the timeline for this workshop."
                        action={{ label: 'Create Session', onClick: () => navigate(`/workshops/${workshopId}/curriculum/new/edit`) }}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* ── Testimonials Tab ── */}
              {activeTab === 'testimonials' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2"><CommentOutlined className="text-muted" /> Customer Testimonials</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(workshop?.workshopTestimonials || []).length > 0 ? workshop?.workshopTestimonials.map((test: any) => (
                      <div key={test._id} className={`bg-surface border border-border shadow-sm rounded-2xl p-4 sm:p-6 flex flex-col justify-between hover:shadow-md transition-shadow group ${test.isBlocked ? 'opacity-75 border-red-200 bg-red-50/5' : ''}`}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <Rate disabled defaultValue={test.rate || 5} className="text-xs" />
                            {test.isBlocked && <Tag color="red" className="m-0 ml-2">Blocked</Tag>}
                          </div>
                          <div className="flex items-center gap-1.5 p-1 bg-surface border border-border rounded-xl opacity-50 group-hover:opacity-100 group-hover:border-indigo-500/30 transition-all">
                            <Button
                              type="text"
                              size="small"
                              icon={test.isBlocked ? <UnlockOutlined /> : <LockOutlined />}
                              onClick={() => handleToggleBlockTestimonial(test)}
                              className="h-7 w-7 rounded-full flex items-center justify-center p-0"
                              title={test.isBlocked ? "Unblock Testimonial" : "Block Testimonial"}
                              danger={!test.isBlocked}
                              loading={editTestimonialMutation.isPending}
                            />
                            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => setActiveForm({ type: 'editTestimonial', data: test })} className="h-7 w-7 rounded-full flex items-center justify-center p-0 hover:bg-surface-muted" />
                            <Popconfirm title="Delete this testimonial?" description="This will remove it from the workshop." onConfirm={() => handleDeleteTestimonial(test._id)} okText="Delete" cancelText="Cancel" okButtonProps={{ danger: true }}>
                              <Button type="text" size="small" danger icon={<DeleteOutlined />} className="hover:bg-red-50 h-7 w-7 rounded-full flex items-center justify-center p-0" />
                            </Popconfirm>
                          </div>
                        </div>
                        <div className="course-hero-description-wrapper text-sm text-text-muted italic leading-relaxed mb-6">
                          "{test.description || 'No review text provided.'}"
                        </div>
                        <div className="flex items-center gap-3 border-t border-border pt-4 mt-auto">
                          {test.image
                            ? <img src={test.image} alt={test.name} className="w-10 h-10 rounded-full object-cover border border-border shadow-sm" />
                            : <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-semibold text-sm">{test.name?.charAt(0).toUpperCase()}</div>
                          }
                          <div>
                            <h5 className="font-semibold text-foreground text-sm">{test.name}</h5>
                            {test.designation && <span className="text-xs text-muted">{test.designation}</span>}
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="col-span-full">
                        <EmptyContentPanel icon={<CommentOutlined />} title="No testimonials linked" description="Click 'Add Testimonial' to collect ratings and reviews for this workshop." />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── FAQs Tab ── */}
              {activeTab === 'faqs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2"><QuestionCircleOutlined className="text-muted" /> Workshop FAQs</h3>
                  </div>
                  <div className="space-y-4">
                    {faqs.length > 0 ? faqs.map((faq: any) => (
                      <div key={faq._id} className={`bg-surface border border-border shadow-sm rounded-2xl p-4 sm:p-6 hover:shadow-md transition-shadow group ${faq.isBlocked ? 'opacity-75 border-red-200 bg-red-50/5' : ''}`}>
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-3 flex-1">
                            {/* English */}
                            <div className="space-y-1">
                               <h4 className="font-semibold text-foreground text-base flex items-start gap-2 leading-snug">
                                <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 w-5 h-5 rounded-full flex-shrink-0 mt-0.5 inline-flex items-center justify-center">EN</span>
                                {faq.question?.en}
                                {faq.isBlocked && <Tag color="red" className="m-0 ml-2">Blocked</Tag>}
                              </h4>
                              <div className="course-hero-description-wrapper text-sm text-text-muted pl-7 leading-relaxed flex items-start gap-2">
                                <span className="flex-1 content-card-description">{faq.answer?.en}</span>
                              </div>
                            </div>

                            {/* Hindi */}
                            {faq.question?.hi && (
                              <div className="space-y-1 pt-2 border-t border-border/50">
                                <h4 className="font-medium text-foreground/90 text-sm flex items-start gap-2 leading-snug">
                                  <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 w-5 h-5 rounded-full flex-shrink-0 mt-0.5 inline-flex items-center justify-center">HI</span>
                                  {faq.question.hi}
                                </h4>
                                <div className="course-hero-description-wrapper text-sm text-text-muted pl-7 leading-relaxed flex items-start gap-2">
                                  <span className="flex-1 content-card-description">{faq.answer?.hi}</span>
                                </div>
                              </div>
                            )}

                            {/* Gujarati */}
                            {faq.question?.gu && (
                              <div className="space-y-1 pt-2 border-t border-border/50">
                                <h4 className="font-medium text-foreground/90 text-sm flex items-start gap-2 leading-snug">
                                  <span className="text-[10px] font-bold text-teal-600 bg-teal-500/10 border border-teal-500/20 w-5 h-5 rounded-full flex-shrink-0 mt-0.5 inline-flex items-center justify-center">GU</span>
                                  {faq.question.gu}
                                </h4>
                                <div className="course-hero-description-wrapper text-sm text-text-muted pl-7 leading-relaxed flex items-start gap-2">
                                  <span className="flex-1 content-card-description">{faq.answer?.gu}</span>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 p-1 bg-surface border border-border rounded-xl opacity-50 group-hover:opacity-100 group-hover:border-indigo-500/30 transition-all flex-shrink-0">
                            <Button
                              type="text"
                              size="small"
                              icon={faq.isBlocked ? <UnlockOutlined /> : <LockOutlined />}
                              onClick={() => handleToggleBlockFAQ(faq)}
                              className="h-7 w-7 rounded-full flex items-center justify-center p-0"
                              title={faq.isBlocked ? "Unblock FAQ" : "Block FAQ"}
                              danger={!faq.isBlocked}
                              loading={editFAQMutation.isPending}
                            />
                            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => setActiveForm({ type: 'editFAQ', data: faq })} className="h-7 w-7 rounded-full flex items-center justify-center p-0 hover:bg-surface-muted" />
                            <Popconfirm title="Delete this FAQ?" description="This will remove it from the workshop." onConfirm={() => handleDeleteFAQ(faq._id)} okText="Delete" cancelText="Cancel" okButtonProps={{ danger: true }}>
                              <Button type="text" size="small" danger icon={<DeleteOutlined />} className="hover:bg-red-50 h-7 w-7 rounded-full flex items-center justify-center p-0" />
                            </Popconfirm>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <EmptyContentPanel icon={<FileTextOutlined />} title="No FAQs linked" description="Click 'Add FAQ' to configure question and answer cards for students." />
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CommonPageWrapper>
    </>
  );
};

export default ManageWorkshop;