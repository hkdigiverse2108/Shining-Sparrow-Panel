// pages/Workshop/WorkshopCurriculumEditorPage.tsx
import { useMemo, type FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Button } from 'antd';
import { ArrowLeftOutlined, FolderOutlined } from '@ant-design/icons';
import { Queries, Mutations } from '@/Api';
import { KEYS } from '@/Constants';
import { useQueryClient } from '@tanstack/react-query';
import { CommonBreadcrumbs, CommonPageWrapper } from '@/Components';
import { WorkshopCurriculumForm } from './CurriculumForm';
import { extractArray } from '@/Utils';

const WorkshopCurriculumEditorPage: FC = () => {
  const { workshopId, curriculumId } = useParams<{ workshopId: string; curriculumId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = curriculumId === 'new';

  const { data: wsRes, isLoading: wsLoading } = Queries.useGetWorkshops({ page: 1, limit: 1000 });
  const { data: currRes, isLoading: currLoading } = Queries.useGetWorkshopCurriculums();

  const addMutation = Mutations.useAddWorkshopCurriculum();
  const editMutation = Mutations.useUpdateWorkshopCurriculum();

  const workshop = useMemo(() => extractArray(wsRes).find((w: any) => w._id === workshopId), [wsRes, workshopId]);
  const allCurriculums = useMemo(() => extractArray(currRes), [currRes]);

  const existingPriorities = useMemo(() => {
    return allCurriculums
      .filter((c: any) => String(c.workshopId?._id ?? c.workshopId) === String(workshopId) && String(c._id) !== String(curriculumId))
      .map((c: any) => Number(c.priority));
  }, [allCurriculums, workshopId, curriculumId]);

  const editingCurriculum = useMemo(() => {
    if (isNew) return null;
    return allCurriculums.find((c: any) => c._id === curriculumId);
  }, [allCurriculums, curriculumId, isNew]);

  const handleSave = (values: any) => {
    const payload: any = {
      workshopId,
      title: values.title,
      priority: Number(values.priority),
      description: values.description || '',
      videoLink: values.videoLink || '',
      thumbnail: values.thumbnail || '',
      attachment: values.attachment || '',
    };

    if (values.duration !== undefined && values.duration !== null && values.duration !== '') {
      payload.duration = Number(values.duration);
    }

    if (values.date) {
      payload.date = typeof values.date.toISOString === 'function' 
        ? values.date.toISOString() 
        : values.date;
    }

    if (values.workshopCurriculumId) {
      payload.workshopCurriculumId = values.workshopCurriculumId;
    } else if (values.id) {
      payload.workshopCurriculumId = values.id;
    }

    const mutation = payload.workshopCurriculumId ? editMutation : addMutation;

    mutation.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [KEYS.WORKSHOP_CURRICULUM.BASE] });
        navigate(`/workshops/${workshopId}/manage`);
      },
    });
  };

  const isMutationLoading = addMutation.isPending || editMutation.isPending;

  if (wsLoading || currLoading) return <div className="course-loading"><Spin size="large" /></div>;

  return (
    <>
      <CommonBreadcrumbs
        title={isNew ? 'Add Session' : 'Edit Session'}
        breadcrumbs={[
          { label: 'Workshops', href: '/workshops' },
          { label: `Manage: ${workshop?.title || 'Workshop'}`, href: `/workshops/${workshopId}/manage` },
          { label: isNew ? 'New Session' : 'Edit Session' },
        ]}
      />
      <CommonPageWrapper className="course-shell">
        <div className="course-container course-container--narrow">
          <div className="course-toolbar">
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(`/workshops/${workshopId}/manage`)} className="course-button course-button--text">Back to Builder</Button>
          </div>
          <div className="course-panel course-panel--form">
            <div className="course-form-header">
              <div className="course-icon course-icon--hero"><FolderOutlined className="course-icon--glyph-xl" /></div>
              <div>
                <h2 className="course-form-title">{isNew ? 'Create Session' : 'Edit Session'}</h2>
                <p className="course-form-subtitle">Keep session changes on a dedicated page so the form stays clean and focused.</p>
              </div>
            </div>
            <WorkshopCurriculumForm editing={editingCurriculum} onSave={handleSave} loading={isMutationLoading} existingPriorities={existingPriorities} />
          </div>
        </div>
      </CommonPageWrapper>
    </>
  );
};

export default WorkshopCurriculumEditorPage;