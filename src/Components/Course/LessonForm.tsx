import { type FC, useMemo, useState } from 'react';
import { Formik, Form } from 'formik';
import { Segmented, Upload, Button, Progress, message } from 'antd';
import { CommonFormSection, CommonFormShell, CommonImageUpload, CommonVideoUpload, CommonAttachmentUpload } from '@/Components';
import { CommonButton, CommonValidationTextField, CommonRichTextEditor, CommonValidationSelect } from '@/Attribute';
import * as Yup from 'yup';

interface LessonFormProps {
  editing: any | null;
  onSave: (values: any, curriculumId?: string | null) => void;
  loading: boolean;
  assignToCurriculumId?: string | null;
  existingPriorities?: number[];
}

export const LessonForm: FC<LessonFormProps> = ({ editing, onSave, loading, assignToCurriculumId, existingPriorities }) => {
  const LessonSchema = useMemo(() => {
    const list = existingPriorities || [];
    return Yup.object({
      title: Yup.string().required('Title is required'),
      priority: Yup.number()
        .required('Priority is required')
        .min(0, 'Priority must be non-negative')
        .test('unique-priority', 'This priority is already in use for this course.', (val) => {
          if (val === undefined || val === null) return true;
          return !list.includes(Number(val));
        }),
    });
  }, [existingPriorities]);
  const defaults = { 
    title: '', 
    subtitle: '', 
    description: '',
    thumbnail: '',
    videoLink: '',
    duration: '',
    priority: 0, 
    practiceMaterial: '',
    lessonLock: 'false' 
  };

  const initialValues = useMemo(() => {
    if (editing) {
      return { 
        ...defaults, 
        ...editing,
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
    <Formik enableReinitialize initialValues={initialValues} validationSchema={LessonSchema} onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => (
        <CommonFormShell
          title={editing ? 'Edit Lesson' : 'Add Lesson'}
          description="Create a lesson record and decide whether it should stay locked while the course evolves."
        >
          <Form className="course-form-shell space-y-6">
            <CommonFormSection title="Lesson Details">
              {/* Lesson Thumbnail */}
              <CommonImageUpload
                name="thumbnail"
                label="Lesson Thumbnail"
                shape="square"
                size={100}
                className="col-span-full"
              />

              <CommonValidationTextField name="title" label="Title" required />
              <CommonValidationTextField name="subtitle" label="Subtitle" />

              <div className="col-span-full">
                <CommonRichTextEditor
                  name="description"
                  label="Description"
                  onChange={(val) => setFieldValue('description', val)}
                  value={values.description}
                  className="w-full"
                />
              </div>

              <CommonValidationTextField name="priority" label="Priority" type="number" required />
              <CommonValidationTextField name="duration" label="Duration (Minutes/Hours)" placeholder="e.g. 45 Mins, 1 Hour" />
              
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
