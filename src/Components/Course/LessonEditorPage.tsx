import { useMemo, type FC } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Spin, Button } from 'antd';
import { ArrowLeftOutlined, FileTextOutlined } from '@ant-design/icons';
import { Queries, Mutations } from '@/Api';
import { KEYS } from '@/Constants';
import { useQueryClient } from '@tanstack/react-query';
import { CommonBreadcrumbs, CommonPageWrapper } from '@/Components';
import { LessonForm } from './LessonForm';
import { extractArray } from '@/Utils';

const LessonEditorPage: FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const [searchParams] = useSearchParams();
  const redirectBack = searchParams.get('redirectBack');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = lessonId === 'new';

  const { data: courseRes, isLoading: courseLoading } = Queries.useGetCourses({ page: 1, limit: 1000 });
  const { data: lessonRes, isLoading: lessonLoading } = Queries.useGetLessonById(lessonId!, { enabled: !isNew && !!lessonId });
  const { data: lessRes, isLoading: lessLoading } = Queries.useGetLessons();

  const addLessonMutation = Mutations.useAddLesson();
  const editLessonMutation = Mutations.useUpdateLesson();

  const isMutationLoading = addLessonMutation.isPending || editLessonMutation.isPending;

  const course = useMemo(() => extractArray(courseRes).find((c: any) => c._id === courseId), [courseRes, courseId]);
  const allLessons = useMemo(() => extractArray(lessRes), [lessRes]);

  const existingPriorities = useMemo(() => {
    return allLessons
      .filter((l: any) => String(l.courseId?._id ?? l.courseId) === String(courseId) && String(l._id) !== String(lessonId))
      .map((l: any) => Number(l.priority));
  }, [allLessons, courseId, lessonId]);

  const editingLesson = useMemo(() => {
    if (isNew) return null;
    return lessonRes?.data;
  }, [lessonRes, isNew]);

  const handleSaveLesson = (values: any) => {
    const payload: any = {
      courseId,
      title: values.title,
      subtitle: values.subtitle || '',
      description: values.description || '',
      thumbnail: values.thumbnail || null,
      videoLink: values.videoLink || null,
      duration: values.duration ? String(values.duration) : null,
      priority: values.priority !== undefined && values.priority !== null ? Number(values.priority) : 0,
      practiceMaterial: values.practiceMaterial || null,
      lessonLock: values.lessonLock === 'true' || values.lessonLock === true,
    };

    if (values.id) {
      payload.courseLessonId = values.id;
    }

    const mutation = values.id ? editLessonMutation : addLessonMutation;

    mutation.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.LESSON.BASE] });
        queryClient.invalidateQueries({ queryKey: [KEYS.COURSE.BASE] });
        if (redirectBack) {
          navigate(redirectBack);
        } else {
          navigate(`/courses/${courseId}/manage`);
        }
      },
    });
  };

  const handleBack = () => {
    if (redirectBack) {
      navigate(redirectBack);
    } else {
      navigate(`/courses/${courseId}/manage`);
    }
  };

  if (courseLoading || (!isNew && lessonLoading) || lessLoading) {
    return (
      <div className="course-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <CommonBreadcrumbs
        title={isNew ? 'Add Lesson' : 'Edit Lesson'}
        breadcrumbs={[
          { label: 'Courses', href: '/courses' },
          { label: `Manage: ${course?.name || 'Course'}`, href: `/courses/${courseId}/manage` },
          { label: isNew ? 'New Lesson' : 'Edit Lesson' },
        ]}
      />

      <CommonPageWrapper className="course-shell">
        <div className="course-container course-container--narrow">
          <div className="course-toolbar">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              className="course-button course-button--text"
            >
              Back to Builder
            </Button>
          </div>

          <div className="course-panel course-panel--form">
            <div className="course-form-header">
              <div className="course-icon course-icon--hero">
                <FileTextOutlined className="course-icon--glyph-xl" />
              </div>
              <div>
                <h2 className="course-form-title">{isNew ? 'Create Lesson' : 'Edit Lesson'}</h2>
                <p className="course-form-subtitle">Configure lesson details, attachments, videos and lock parameters.</p>
              </div>
            </div>

            <LessonForm editing={editingLesson} onSave={handleSaveLesson} loading={isMutationLoading} existingPriorities={existingPriorities} />
          </div>
        </div>
      </CommonPageWrapper>
    </>
  );
};

export default LessonEditorPage;
