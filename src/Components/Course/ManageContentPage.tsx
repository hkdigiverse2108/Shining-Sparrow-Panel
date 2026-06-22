import { useMemo, type FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Button } from 'antd';
import {
  BookOutlined, BarsOutlined, LockOutlined, UnlockOutlined,
  AppstoreOutlined, FolderOutlined, FileTextOutlined, PlusOutlined,
} from '@ant-design/icons';
import { Queries, Mutations } from '@/Api';
import { KEYS } from '@/Constants';
import { useQueryClient } from '@tanstack/react-query';
import { CommonBreadcrumbs, CommonPageWrapper, ContentItemCard, EmptyContentPanel } from '@/Components';
import {
  priorityBadge, durationBadge, videoBadge, attachmentBadge,
  lockBadge, editAction, deleteAction,
} from '@/Components/Common/ContentItemCard';
import { extractArray } from '@/Utils';

const ManageContentPage: FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: courseRes, isLoading: courseLoading } = Queries.useGetCourses({ page: 1, limit: 1000 });
  const { data: lessRes, isLoading: lessLoading } = Queries.useGetLessons();
  const deleteLessonMutation = Mutations.useDeleteLesson();

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

  const lockedCount = useMemo(() => lessons.filter((l) => l.lessonLock).length, [lessons]);

  const handleDeleteLesson = (id: string) => {
    deleteLessonMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.LESSON.BASE] });
        queryClient.invalidateQueries({ queryKey: [KEYS.COURSE.BASE] });
      },
    });
  };

  const getLessonsBySubCourse = (subId: string) =>
    allLessons
      .filter((l: any) => String(l.courseId?._id ?? l.courseId) === String(subId))
      .sort((a: any, b: any) => (a.priority || 0) - (b.priority || 0));

  if (courseLoading || lessLoading) {
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
              </div>
            </div>
            {!isBundle && (
              <div className="course-hero-actions">
                <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(`/courses/${courseId}/lesson/new`)} className="course-button course-button--primary">
                  Add Lesson
                </Button>
              </div>
            )}
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

          {/* ── Main Content ── */}
          <section className="course-layout">
            <main className="course-main">
              {isBundle ? (
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
                        <article key={sub._id} className="course-curriculum-card bg-gray-50/20 border border-gray-100 rounded-xl p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-3 mb-3">
                            <div className="flex items-start gap-3">
                              <div className="text-indigo-500 bg-indigo-50 p-2 rounded-lg"><FolderOutlined className="course-icon--glyph-lg" /></div>
                              <div>
                                <h3 className="text-base font-semibold text-gray-800">{sub.name}</h3>
                                <p className="text-xs text-gray-500 line-clamp-1">{sub.description || 'No description provided.'}</p>
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
              )}
            </main>

            {/* ── Sidebar ── */}
            <aside className="course-sidebar">
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
                  {isBundle
                    ? <span className="text-xs text-gray-500 italic block py-2">Add lessons directly inside each bundled curriculum section.</span>
                    : <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(`/courses/${courseId}/lesson/new`)} className="course-button course-button--primary course-button--compact course-button--wide">New Lesson</Button>
                  }
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
            </aside>
          </section>

        </div>
      </CommonPageWrapper>
    </>
  );
};

export default ManageContentPage;
