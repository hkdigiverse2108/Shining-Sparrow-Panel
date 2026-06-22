import { useMemo, type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spin, Button } from 'antd';
import { ArrowLeftOutlined, FolderOutlined } from '@ant-design/icons';
import { Queries, Mutations } from '@/Api';
import { KEYS } from '@/Constants';
import { useQueryClient } from '@tanstack/react-query';
import { CommonBreadcrumbs, CommonPageWrapper } from '@/Components';
import { CurriculumForm } from './CurriculumForm';
import { extractArray } from '@/Utils';

const CurriculumEditorPage: FC = () => {
  const { courseId, curriculumId } = useParams<{ courseId: string; curriculumId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = curriculumId === 'new';

  const { data: courseRes, isLoading: courseLoading } = Queries.useGetCourses({ page: 1, limit: 1000 });
  const { data: currRes, isLoading: currLoading } = Queries.useGetCurriculums();

  const addCurrMutation = Mutations.useAddCurriculum();
  const editCurrMutation = Mutations.useUpdateCurriculum();
  const isMutationLoading = addCurrMutation.isPending || editCurrMutation.isPending;

  const course = useMemo(() => extractArray(courseRes).find((c: any) => c._id === courseId), [courseRes, courseId]);
  const editingCurriculum = useMemo(() => {
    if (isNew) return null;
    return extractArray(currRes).find((c: any) => c._id === curriculumId);
  }, [currRes, curriculumId, isNew]);

  const handleSaveCurriculum = (values: any) => {
    const payload: any = {
      courseId,
      title: values.title,
      description: values.description || '',
      videoLink: values.videoLink || '',
      duration: values.duration !== undefined && values.duration !== null ? String(values.duration) : '',
    };

    if (values.id) {
      payload.courseCurriculumId = values.id;
    }

    const mutation = values.id ? editCurrMutation : addCurrMutation;

    mutation.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.CURRICULUM.BASE] });
        navigate(`/courses/${courseId}/manage`);
      },
    });
  };

  if (courseLoading || currLoading) {
    return (
      <div className="course-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <CommonBreadcrumbs
        title={isNew ? 'Add Curriculum' : 'Edit Curriculum'}
        breadcrumbs={[
          { label: 'Courses', href: '/courses' },
          { label: `Manage: ${course?.name || 'Course'}`, href: `/courses/${courseId}/manage` },
          { label: isNew ? 'New Curriculum' : 'Edit Curriculum' },
        ]}
      />

      <CommonPageWrapper className="course-shell">
        <div className="course-container course-container--narrow">
          <div className="course-toolbar">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(`/courses/${courseId}/manage`)}
              className="course-button course-button--text"
            >
              Back to Builder
            </Button>
          </div>

          <div className="course-panel course-panel--form">
            <div className="course-form-header">
              <div className="course-icon course-icon--hero">
                <FolderOutlined className="course-icon--glyph-xl" />
              </div>
              <div>
                <h2 className="course-form-title">{isNew ? 'Create Curriculum' : 'Edit Curriculum'}</h2>
                <p className="course-form-subtitle">Keep curriculum changes on a dedicated page so the form stays clean and focused.</p>
              </div>
            </div>

            <CurriculumForm editing={editingCurriculum} onSave={handleSaveCurriculum} loading={isMutationLoading} />
          </div>
        </div>
      </CommonPageWrapper>
    </>
  );
};

export default CurriculumEditorPage;
