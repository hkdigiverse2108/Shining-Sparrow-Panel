import { useMemo, type FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Queries, Mutations } from '@/Api';
import { KEYS } from '@/Constants';
import { useQueryClient } from '@tanstack/react-query';
import { CommonBreadcrumbs, CommonPageWrapper } from '@/Components';
import { QuestionForm } from './QuestionForm';
import { extractArray } from '@/Utils';

const QuestionEditorPage: FC = () => {
  const { courseId, examId, questionId } = useParams<{ courseId: string; examId: string; questionId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isNew = questionId === 'new';

  const { data: courseRes, isLoading: courseLoading } = Queries.useGetCourses({ page: 1, limit: 1000 });
  const { data: examRes, isLoading: examLoading } = Queries.useGetExams();
  const { data: quesRes, isLoading: quesLoading } = Queries.useGetQuestions();

  const addQuestionMutation = Mutations.useAddQuestion();
  const editQuestionMutation = Mutations.useUpdateQuestion();
  const editExamMutation = Mutations.useUpdateExam();

  const isMutationLoading =
    addQuestionMutation.isPending ||
    editQuestionMutation.isPending ||
    editExamMutation.isPending;

  const course = useMemo(() => extractArray(courseRes).find((c: any) => c._id === courseId), [courseRes, courseId]);
  const exam = useMemo(() => extractArray(examRes).find((e: any) => e._id === examId), [examRes, examId]);

  const lessonId = useMemo(() => {
    if (!exam) return '';
    return exam.courseLessonId?._id ?? exam.courseLessonId;
  }, [exam]);

  const editingQuestion = useMemo(() => {
    if (isNew) return null;
    return extractArray(quesRes).find((q: any) => q._id === questionId);
  }, [quesRes, questionId, isNew]);

  const handleSaveQuestion = (values: any) => {
    const payload = { ...values, courseId };

    if (isNew) {
      addQuestionMutation.mutate(payload, {
        onSuccess: (res: any) => {
          const newQuestionId = String(res?.data?._id);

          if (examId && newQuestionId) {
            const currentQuestionIds = exam?.questionIds?.map((q: any) => String(q?._id ?? q)) || [];

            editExamMutation.mutate(
              {
                examId: String(examId),
                questionIds: [...currentQuestionIds, newQuestionId],
              } as any,
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: [KEYS.QUESTION.BASE] });
                  queryClient.invalidateQueries({ queryKey: [KEYS.EXAM.BASE] });
                  if (lessonId) {
                    navigate(`/courses/${courseId}/lesson/${lessonId}/exam`);
                  } else {
                    navigate(`/courses/${courseId}/manage`);
                  }
                },
              },
            );
          } else {
            queryClient.invalidateQueries({ queryKey: [KEYS.QUESTION.BASE] });
            if (lessonId) navigate(`/courses/${courseId}/lesson/${lessonId}/exam`);
            else navigate(`/courses/${courseId}/manage`);
          }
        },
      });
    } else {
      editQuestionMutation.mutate(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.QUESTION.BASE] });
          queryClient.invalidateQueries({ queryKey: [KEYS.EXAM.BASE] });
          if (lessonId) {
            navigate(`/courses/${courseId}/lesson/${lessonId}/exam`);
          } else {
            navigate(`/courses/${courseId}/manage`);
          }
        },
      });
    }
  };

  const handleCancel = () => {
    if (lessonId) {
      navigate(`/courses/${courseId}/lesson/${lessonId}/exam`);
    } else {
      navigate(`/courses/${courseId}/manage`);
    }
  };

  if (courseLoading || examLoading || quesLoading) {
    return (
      <div className="course-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <CommonBreadcrumbs
        title={isNew ? 'Add Question' : 'Edit Question'}
        breadcrumbs={[
          { label: 'Courses', href: '/courses' },
          { label: `Manage: ${course?.name || 'Course'}`, href: `/courses/${courseId}/manage` },
          { label: 'Assessment', href: lessonId ? `/courses/${courseId}/lesson/${lessonId}/exam` : undefined },
          { label: isNew ? 'New Question' : 'Edit Question' },
        ]}
      />
      <CommonPageWrapper className="course-shell">
        <div className="course-container course-container--narrow">
          <div className="course-toolbar">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleCancel}
              className="course-button course-button--text"
            >
              Cancel and Return
            </Button>
          </div>

          <QuestionForm editing={editingQuestion} examId={examId!} onSave={handleSaveQuestion} loading={isMutationLoading} />
        </div>
      </CommonPageWrapper>
    </>
  );
};

export default QuestionEditorPage;

