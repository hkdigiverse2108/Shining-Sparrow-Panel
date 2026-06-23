import { useMemo, useState, type FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Button, Segmented, Popconfirm } from 'antd';
import {
  BookOutlined, BarsOutlined, LockOutlined, UnlockOutlined,
  AppstoreOutlined, FolderOutlined, FileTextOutlined, PlusOutlined,
  QuestionCircleOutlined, ArrowLeftOutlined, EditOutlined, DeleteOutlined,
} from '@ant-design/icons';
import { Queries, Mutations } from '@/Api';
import { KEYS } from '@/Constants';
import { useQueryClient } from '@tanstack/react-query';
import { CommonBreadcrumbs, CommonPageWrapper, ContentItemCard, EmptyContentPanel } from '@/Components';
import { FAQForm } from '@/Components/Workshop/FAQForm';
import {
  priorityBadge, durationBadge, videoBadge, attachmentBadge,
  lockBadge, editAction, deleteAction,
} from '@/Components/Common/ContentItemCard';
import { extractArray } from '@/Utils';

const ManageContentPage: FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'lessons' | 'faqs'>('lessons');
  const [activeForm, setActiveForm] = useState<
    | { type: 'view' }
    | { type: 'addFAQ' }
    | { type: 'editFAQ'; data: any }
  >({ type: 'view' });

  const { data: courseRes, isLoading: courseLoading } = Queries.useGetCourses({ page: 1, limit: 1000 });
  const { data: lessRes, isLoading: lessLoading } = Queries.useGetLessons();
  const { data: faqsRes, isLoading: faqsLoading } = Queries.useGetFAQs({ type: 'course' });

  const deleteLessonMutation = Mutations.useDeleteLesson();
  const addFAQMutation = Mutations.useAddFAQ();
  const editFAQMutation = Mutations.useUpdateFAQ();
  const deleteFAQMutation = Mutations.useDeleteFAQ();

  const allCourses = useMemo(() => extractArray(courseRes), [courseRes]);
  const course = useMemo(() => allCourses.find((c: any) => c._id === courseId), [allCourses, courseId]);

  const subCourses = useMemo(() => {
    if (!course?.courseCurriculumIds) return [];
    return course.courseCurriculumIds
      .map((sub: any) => allCourses.find((c: any) => c._id === (typeof sub === 'object' ? sub._id : sub)))
      .filter(Boolean);
  }, [course, allCourses]);

  const isBundle = subCourses.length > 0;

  const allLessons = useMemo(() => extractArray(lessRes), [lessRes]);

  const lessons = useMemo(() => {
    if (isBundle) {
      return allLessons
        .filter((l: any) => subCourses.some((sc: any) => String(l.courseId?._id ?? l.courseId) === String(sc._id)))
        .sort((a: any, b: any) => (a.priority || 0) - (b.priority || 0));
    }
    return allLessons
      .filter((l: any) => String(l.courseId?._id ?? l.courseId) === String(courseId))
      .sort((a: any, b: any) => (a.priority || 0) - (b.priority || 0));
  }, [allLessons, isBundle, subCourses, courseId]);

  const faqs = useMemo(() => faqsRes?.data?.faq_data || [], [faqsRes]);

  const lockedCount = useMemo(() => lessons.filter((l) => l.lessonLock).length, [lessons]);

  const isMutationLoading =
    addFAQMutation.isPending || editFAQMutation.isPending || deleteFAQMutation.isPending;

  const handleDeleteLesson = (id: string) => {
    deleteLessonMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.LESSON.BASE] });
        queryClient.invalidateQueries({ queryKey: [KEYS.COURSE.BASE] });
      },
    });
  };

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
      type: 'course',
    };
    if (activeForm.type === 'editFAQ' && activeForm.data?._id) {
      payload.faqId = activeForm.data._id;
    }

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

  const getLessonsBySubCourse = (subId: string) =>
    allLessons
      .filter((l: any) => String(l.courseId?._id ?? l.courseId) === String(subId))
      .sort((a: any, b: any) => (a.priority || 0) - (b.priority || 0));

  if (courseLoading || lessLoading || faqsLoading) {
    return <div className="course-loading"><Spin size="large" /></div>;
  }

  const renderLessonCard = (lesson: any, index: number, targetCourseId: string) => (
    <ContentItemCard
      key={lesson._id}
      index={index}
      title={lesson.title}
      subtitle={lesson.subtitle}
      description={lesson.description}
      thumbnail={lesson.thumbnail}
      badges={[
        priorityBadge(lesson.priority),
        ...(lesson.duration ? [durationBadge(lesson.duration)] : []),
        ...(lesson.videoLink ? [videoBadge(lesson.videoLink, 'Video Lesson')] : []),
        ...(lesson.practiceMaterial ? [attachmentBadge(lesson.practiceMaterial)] : []),
        lockBadge(lesson.lessonLock),
      ]}
      actions={[
        {
          label: 'Assessment',
          onClick: () => navigate(`/courses/${targetCourseId}/lesson/${lesson._id}/exam`),
        },
        editAction(() => navigate(`/courses/${targetCourseId}/lesson/${lesson._id}/edit?redirectBack=/courses/${courseId}/manage`)),
        deleteAction(
          () => handleDeleteLesson(lesson._id),
          'All exams and questions linked to this lesson will be affected.',
        ),
      ]}
    />
  );

  return (
    <>
      <CommonBreadcrumbs
        title={`${isBundle ? 'Bundle Builder' : 'Course Builder'}: ${course?.name || 'Course'}`}
        breadcrumbs={[{ label: 'Courses', href: '/courses' }, { label: `Manage: ${course?.name || 'Course'}` }]}
      />

      <CommonPageWrapper className="course-shell">
        <div className="course-container course-container--wide">
          {activeForm.type !== 'view' ? (
            <div className="bg-surface border border-border shadow-md rounded-2xl p-4 sm:p-6 md:p-8 max-w-2xl mx-auto mt-6">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
                <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => setActiveForm({ type: 'view' })} className="text-text-muted hover:text-foreground rounded-full hover:bg-surface-muted" />
                <span className="font-semibold text-foreground text-sm">Back to Course Builder</span>
              </div>

              {activeForm.type === 'addFAQ' && <FAQForm editing={null} onSave={handleSaveFAQ} loading={isMutationLoading} />}
              {activeForm.type === 'editFAQ' && <FAQForm editing={activeForm.data} onSave={handleSaveFAQ} loading={isMutationLoading} />}
            </div>
          ) : (
            <>
              {/* ── Hero Card ── */}
              <section className="course-hero-card">
                <div className="course-hero-copy">
                  <span className="course-hero-eyebrow">{isBundle ? 'Course Bundle Structure' : 'Course Structure'}</span>
                  <div className="course-hero-title-row">
                    <div className="course-hero-icon"><BookOutlined className="course-icon--glyph-xl" /></div>
                    <div>
                      <h1 className="course-hero-title">{course?.name || 'Course'}</h1>
                      <p className="course-hero-text">{course?.description || 'Organize lessons, media resources, and assessments for this course.'}</p>
                    </div>
                  </div>
                  <div className="course-hero-badges">
                    {isBundle && <span className="course-chip course-chip--neutral">{subCourses.length} Bundled Courses</span>}
                    <span className="course-chip course-chip--primary">{lessons.length} Total Lessons</span>
                    <span className="course-chip course-chip--success">{lessons.length - lockedCount} Unlocked Preview</span>
                    <span className="course-chip course-chip--danger">{lockedCount} Locked</span>
                    {faqs.length > 0 && <span className="course-chip course-chip--neutral">{faqs.length} FAQs</span>}
                  </div>
                </div>
                <div className="course-hero-actions">
                  {activeTab === 'lessons' ? (
                    !isBundle && (
                      <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(`/courses/${courseId}/lesson/new`)} className="course-button course-button--primary">
                        Add Lesson
                      </Button>
                    )
                  ) : (
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setActiveForm({ type: 'addFAQ' })} className="course-button course-button--primary">
                      Add FAQ
                    </Button>
                  )}
                </div>
              </section>

              {/* ── Stats ── */}
              <section className="course-stat-grid">
                {isBundle && (
                  <article className="course-stat-card animate-fade-in">
                    <div className="course-stat-icon course-stat-icon--primary"><AppstoreOutlined /></div>
                    <div><span className="course-stat-label">Bundled Courses</span><strong className="course-stat-value">{subCourses.length}</strong></div>
                  </article>
                )}
                <article className="course-stat-card animate-fade-in">
                  <div className="course-stat-icon course-stat-icon--info"><BarsOutlined /></div>
                  <div><span className="course-stat-label">Total Lessons</span><strong className="course-stat-value">{lessons.length}</strong></div>
                </article>
                <article className="course-stat-card animate-fade-in">
                  <div className="course-stat-icon course-stat-icon--success"><UnlockOutlined /></div>
                  <div><span className="course-stat-label">Unlocked Preview</span><strong className="course-stat-value">{lessons.length - lockedCount}</strong></div>
                </article>
                <article className="course-stat-card animate-fade-in">
                  <div className="course-stat-icon course-stat-icon--warning"><LockOutlined /></div>
                  <div><span className="course-stat-label">Locked Lessons</span><strong className="course-stat-value">{lockedCount}</strong></div>
                </article>
              </section>

              {/* ── Tab Selector ── */}
              <div className="flex justify-start">
                <Segmented
                  options={[
                    { label: 'Lessons', value: 'lessons', icon: <BarsOutlined /> },
                    { label: 'FAQs', value: 'faqs', icon: <QuestionCircleOutlined /> },
                  ]}
                  value={activeTab}
                  onChange={(val) => setActiveTab(val as typeof activeTab)}
                  className="p-1 bg-surface border border-border shadow-sm rounded-xl font-medium"
                />
              </div>

              {/* ── Main Content ── */}
              <section className="course-layout">
                <main className="course-main">
                  {activeTab === 'lessons' ? (
                    isBundle ? (
                      <div className="course-section-card">
                        <div className="course-section-card__header">
                          <div>
                            <h2 className="course-section-card__title">Curriculum Sections</h2>
                            <p className="course-section-card__text">Manage lessons nested inside each bundled course.</p>
                          </div>
                          <span className="course-chip course-chip--neutral">{subCourses.length} sections</span>
                        </div>

                        <div className="course-section-stack space-y-6 mt-4">
                          {subCourses.map((sub: any) => {
                            const subLessons = getLessonsBySubCourse(sub._id);
                            return (
                              <article key={sub._id} className="course-curriculum-card bg-surface-muted/20 border border-border rounded-xl p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3 mb-3">
                                  <div className="flex items-start gap-3">
                                    <div className="text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 p-2 rounded-lg"><FolderOutlined className="course-icon--glyph-lg" /></div>
                                    <div>
                                      <h3 className="text-base font-semibold text-foreground">{sub.name}</h3>
                                      <p className="text-xs text-text-muted line-clamp-1">{sub.description || 'No description provided.'}</p>
                                    </div>
                                  </div>
                                  <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(`/courses/${sub._id}/lesson/new?redirectBack=/courses/${courseId}/manage`)} className="course-button course-button--primary course-button--compact self-end sm:self-center">
                                    Add Lesson
                                  </Button>
                                </div>

                                <div className="space-y-3">
                                  {subLessons.length > 0
                                    ? subLessons.map((lesson: any, i: number) => renderLessonCard(lesson, i, sub._id))
                                    : <EmptyContentPanel variant="inline" icon={<FileTextOutlined />} title="No lessons in this section" description="Add a lesson to begin building this curriculum block." />
                                  }
                                </div>
                              </article>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="course-section-card">
                        <div className="course-section-card__header">
                          <div>
                            <h2 className="course-section-card__title">Lessons Track</h2>
                            <p className="course-section-card__text">Configure lesson sequence, attachments, and assessments.</p>
                          </div>
                          <span className="course-chip course-chip--neutral">{lessons.length} items</span>
                        </div>

                        <div className="space-y-4 mt-4">
                          {lessons.length > 0
                            ? lessons.map((lesson: any, i: number) => renderLessonCard(lesson, i, courseId!))
                            : (
                              <EmptyContentPanel
                                icon={<FileTextOutlined />}
                                title="No lessons created yet"
                                description="Start building your course structure by adding your first lesson."
                                action={{ label: 'Create First Lesson', onClick: () => navigate(`/courses/${courseId}/lesson/new`) }}
                              />
                            )
                          }
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="course-section-card">
                      <div className="course-section-card__header">
                        <div>
                          <h2 className="course-section-card__title">Course FAQs</h2>
                          <p className="course-section-card__text">Configure general question and answer cards for students.</p>
                        </div>
                        <span className="course-chip course-chip--neutral">{faqs.length} FAQ{faqs.length !== 1 ? 's' : ''}</span>
                      </div>

                      <div className="space-y-4 mt-4">
                        {faqs.length > 0 ? (
                          faqs.map((faq: any) => (
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
                                      <span className="flex-1 content-card-description">{faq.answer?.en}</span>
                                    </div>
                                  </div>

                                  {/* Hindi */}
                                  {faq.question?.hi && (
                                    <div className="space-y-1 pt-2 border-t border-border/50">
                                      <h4 className="font-medium text-foreground/90 text-sm flex items-start gap-2 leading-snug">
                                        <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">HI</span>
                                        {faq.question.hi}
                                      </h4>
                                      <div className="text-sm text-text-muted pl-7 leading-relaxed flex items-start gap-2">
                                        <span className="flex-1 content-card-description">{faq.answer?.hi}</span>
                                      </div>
                                    </div>
                                  )}

                                  {/* Gujarati */}
                                  {faq.question?.gu && (
                                    <div className="space-y-1 pt-2 border-t border-border/50">
                                      <h4 className="font-medium text-foreground/90 text-sm flex items-start gap-2 leading-snug">
                                        <span className="text-[10px] font-bold text-teal-600 bg-teal-500/10 border border-teal-500/20 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">GU</span>
                                        {faq.question.gu}
                                      </h4>
                                      <div className="text-sm text-text-muted pl-7 leading-relaxed flex items-start gap-2">
                                        <span className="flex-1 content-card-description">{faq.answer?.gu}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                  <Button type="text" size="small" icon={<EditOutlined />} onClick={() => setActiveForm({ type: 'editFAQ', data: faq })} className="h-7 w-7 rounded-full flex items-center justify-center p-0" />
                                  <Popconfirm title="Delete this FAQ?" description="This will remove it from the course." onConfirm={() => handleDeleteFAQ(faq._id)} okText="Delete" cancelText="Cancel" okButtonProps={{ danger: true }}>
                                    <Button type="text" size="small" danger icon={<DeleteOutlined />} className="hover:bg-red-50 h-7 w-7 rounded-full flex items-center justify-center p-0" />
                                  </Popconfirm>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <EmptyContentPanel
                            icon={<FileTextOutlined />}
                            title="No FAQs configured"
                            description="Start building course FAQs by adding your first Q&A card."
                            action={{ label: 'Create First FAQ', onClick: () => setActiveForm({ type: 'addFAQ' }) }}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </main>

                {/* ── Sidebar ── */}
                <aside className="course-sidebar">
                  {activeTab === 'lessons' ? (
                    <>
                      <div className="course-sidebar-card">
                        <span className="course-sidebar-label">Course snapshot</span>
                        <h3 className="course-sidebar-title">Fast overview</h3>
                        <div className="course-sidebar-list">
                          {isBundle && <div className="course-sidebar-item"><span>Curriculums</span><strong>{subCourses.length}</strong></div>}
                          <div className="course-sidebar-item"><span>Total lessons</span><strong>{lessons.length}</strong></div>
                          <div className="course-sidebar-item"><span>Free Preview</span><strong>{lessons.length - lockedCount}</strong></div>
                          <div className="course-sidebar-item"><span>Locked lessons</span><strong>{lockedCount}</strong></div>
                        </div>
                      </div>

                      <div className="course-sidebar-card course-sidebar-card--accent">
                        <span className="course-sidebar-label">Quick actions</span>
                        <h3 className="course-sidebar-title">Keep building</h3>
                        <div className="course-sidebar-actions">
                          {isBundle ? (
                            <span className="text-xs text-gray-500 italic block py-2">Add lessons directly inside each bundled curriculum section.</span>
                          ) : (
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(`/courses/${courseId}/lesson/new`)} className="course-button course-button--primary course-button--compact course-button--wide">New Lesson</Button>
                          )}
                        </div>
                      </div>

                      <div className="course-sidebar-card">
                        <span className="course-sidebar-label">Workflow tip</span>
                        <p className="course-sidebar-text">
                          {isBundle
                            ? "Link or unlink sub-courses within this bundle by updating the 'Bundle Courses' selection in the Course Edit form."
                            : "Lessons marked as Unlocked serve as free previews. Locked lessons require enrollment."}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="course-sidebar-card">
                        <span className="course-sidebar-label">FAQ Snapshot</span>
                        <h3 className="course-sidebar-title">Fast overview</h3>
                        <div className="course-sidebar-list">
                          <div className="course-sidebar-item"><span>Total FAQs</span><strong>{faqs.length}</strong></div>
                          <div className="course-sidebar-item"><span>Status</span><strong>Active</strong></div>
                        </div>
                      </div>

                      <div className="course-sidebar-card course-sidebar-card--accent">
                        <span className="course-sidebar-label">Quick actions</span>
                        <h3 className="course-sidebar-title">Add Q&A</h3>
                        <div className="course-sidebar-actions">
                          <Button type="primary" icon={<PlusOutlined />} onClick={() => setActiveForm({ type: 'addFAQ' })} className="course-button course-button--primary course-button--compact course-button--wide">New FAQ</Button>
                        </div>
                      </div>

                      <div className="course-sidebar-card">
                        <span className="course-sidebar-label">Workflow tip</span>
                        <p className="course-sidebar-text">
                          FAQs are shared across all courses. Changes made here will be visible on all course pages.
                        </p>
                      </div>
                    </>
                  )}
                </aside>
              </section>
            </>
          )}
        </div>
      </CommonPageWrapper>
    </>
  );
};

export default ManageContentPage;
