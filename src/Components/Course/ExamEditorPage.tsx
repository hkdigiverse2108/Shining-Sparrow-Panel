import { useMemo, type FC } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Spin, Button } from 'antd';
import { ArrowLeftOutlined, FileProtectOutlined } from '@ant-design/icons';
import { Queries, Mutations } from '@/Api';
import { KEYS } from '@/Constants';
import { useQueryClient } from '@tanstack/react-query';
import { CommonBreadcrumbs, CommonPageWrapper } from '@/Components';
import { ExamForm } from './ExamForm';
import { extractArray } from '@/Utils';

const ExamEditorPage: FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const [searchParams] = useSearchParams();
  const examId = searchParams.get('examId');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: courseRes, isLoading: courseLoading } = Queries.useGetCourses({ page: 1, limit: 1000 });
  const { isLoading: lessLoading } = Queries.useGetLessons();
  const { data: examRes, isLoading: examLoading } = Queries.useGetExams();

  const addExamMutation = Mutations.useAddExam();
  const editExamMutation = Mutations.useUpdateExam();
  const isMutationLoading = addExamMutation.isPending || editExamMutation.isPending;

  const course = useMemo(() => extractArray(courseRes).find((c: any) => c._id === courseId), [courseRes, courseId]);
  const lessonExam = useMemo(() => {
    if (examId) {
      return extractArray(examRes).find((e: any) => String(e._id) === String(examId));
    }
    return null;
  }, [examRes, examId]);

  const handleSaveExam = (values: any) => {
    const payload = { ...values, courseId };
    const mutation = values.examId ? editExamMutation : addExamMutation;

    mutation.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.EXAM.BASE] });
        navigate(`/courses/${courseId}/lesson/${lessonId}/exam${values.examId ? `?selectedExamId=${values.examId}` : ''}`);
      },
    });
  };

  if (courseLoading || lessLoading || examLoading) {
    return (
      <div className="course-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <CommonBreadcrumbs
        title={lessonExam ? 'Edit Assessment' : 'Create Assessment'}
        breadcrumbs={[
          { label: 'Courses', href: '/courses' },
          { label: `Manage: ${course?.name || 'Course'}`, href: `/courses/${courseId}/manage` },
          { label: 'Assessment', href: `/courses/${courseId}/lesson/${lessonId}/exam` },
          { label: lessonExam ? 'Edit' : 'Create' },
        ]}
      />

      <CommonPageWrapper className="course-shell">
        <div className="course-container course-container--narrow">
          <div className="course-toolbar">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(`/courses/${courseId}/lesson/${lessonId}/exam${examId ? `?selectedExamId=${examId}` : ''}`)}
              className="course-button course-button--text"
            >
              Back to Assessment
            </Button>
          </div>

          <div className="course-panel course-panel--form">
            <div className="course-form-header">
              <div className="course-icon course-icon--hero">
                <FileProtectOutlined className="course-icon--glyph-xl" />
              </div>
              <div>
                <h2 className="course-form-title">{lessonExam ? 'Edit Assessment' : 'Create Assessment'}</h2>
                <p className="course-form-subtitle">Keep the assessment editor isolated so configuration changes stay focused and easy to review.</p>
              </div>
            </div>

            <ExamForm editing={lessonExam || null} lessonId={lessonId!} onSave={handleSaveExam} loading={isMutationLoading} />
          </div>
        </div>
      </CommonPageWrapper>
    </>
  );
};

export default ExamEditorPage;
