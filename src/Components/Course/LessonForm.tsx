import { type FC, useMemo } from 'react';
import { Formik, Form } from 'formik';
import { CommonFormSection, CommonFormShell, CommonImageUpload, CommonVideoUpload, CommonAttachmentUpload, CommonPrioritySelect } from '@/Components';
import { CommonButton, CommonValidationTextField, CommonRichTextEditor, CommonValidationSelect } from '@/Attribute';
import { LessonSchema } from '@/Utils';

interface LessonFormProps {
  editing: any | null;
  onSave: (values: any, curriculumId?: string | null) => void;
  loading: boolean;
  assignToCurriculumId?: string | null;
  existingPriorities?: number[];
}

export const LessonForm: FC<LessonFormProps> = ({ editing, onSave, loading, assignToCurriculumId, existingPriorities }) => {
  const validationSchema = useMemo(() => {
    const list = existingPriorities || [];
    return LessonSchema.shape({
      priority: (LessonSchema.fields.priority as any).test(
        'unique-priority',
        'This priority is already in use for this course.',
        (val: any) => {
          if (val === undefined || val === null || val === '') return true;
          return !list.includes(Number(val));
        }
      )
    });
  }, [existingPriorities]);

  const defaults = { 
    title: '', 
    subtitle: '', 
    description: '',
    thumbnail: '',
    videoLink: '',
    duration: '',
    priority: '', 
    practiceMaterial: '',
    lessonLock: 'false' 
  };

  const initialValues = useMemo(() => {
    if (editing) {
      return { 
        ...defaults, 
        ...editing,
        priority: editing.priority ?? '',
        lessonLock: String(editing.lessonLock ?? false)
      };
    }
    return defaults;
  }, [editing]);



  const handleSubmit = (v: any) => {
    const payload = { ...v };
    if (editing) payload.id = editing._id;
    onSave(payload, assignToCurriculumId);
  };

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => (
        <CommonFormShell
          title={editing ? 'Edit Lesson' : 'Add Lesson'}
          description="Create a lesson record and decide whether it should stay locked while the course evolves."
        >
          <Form className="course-form-shell space-y-6">
            <CommonFormSection title="Lesson Details">
              <CommonValidationTextField name="title" label="Title" required />
              <CommonValidationTextField name="subtitle" label="Subtitle" required />
              
              <CommonValidationTextField name="duration" label="Duration (Minutes)" required placeholder="e.g. 45 Mins, 1 Hour" />
              <div className="col-span-full">
                <CommonRichTextEditor
                  name="description"
                  label="Description"
                  required
                  onChange={(val) => setFieldValue('description', val)}
                  value={values.description}
                  className="w-full"
                />
              </div>
              <CommonImageUpload name="thumbnail" label="Lesson Thumbnail" shape="square" size={100} required className="col-span-full" />
              <CommonPrioritySelect
                name="priority"
                label="Priority"
                required
                usedPriorities={existingPriorities || []}
                editingId={editing?._id}
                editingPriority={editing?.priority}
              />
              
              <CommonValidationSelect
                name="lessonLock"
                label="Lesson Lock Status"
                options={[
                  { label: 'Unlocked (Free Preview)', value: 'false' },
                  { label: 'Locked (Requires Enrollment)', value: 'true' },
                ]}
              />
            </CommonFormSection>

            <CommonFormSection title="Media & Resources">
              <CommonVideoUpload
                name="videoLink"
                label="Video Lesson Resource"
                className="col-span-full"
              />

              <CommonAttachmentUpload
                name="practiceMaterial"
                label="Practice Material / Attachment"
                className="col-span-full"
              />
            </CommonFormSection>

            <div className="course-form-actions">
              <CommonButton htmlType="submit" type="primary" title={editing ? 'Update Lesson' : 'Create Lesson'} loading={loading} block className="course-button course-button--primary" />
            </div>
          </Form>
        </CommonFormShell>
      )}
    </Formik>
  );
};
