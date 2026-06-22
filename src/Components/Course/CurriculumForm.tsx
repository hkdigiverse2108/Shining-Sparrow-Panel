import { type FC, useMemo } from 'react';
import { Formik, Form } from 'formik';
import { CommonFormSection, CommonFormShell } from '@/Components';
import { CommonButton, CommonValidationTextField } from '@/Attribute';
import * as Yup from 'yup';

interface CurriculumFormProps {
  editing: any | null;
  onSave: (values: any) => void;
  loading: boolean;
}

const CurriculumSchema = Yup.object({
  title: Yup.string().required('Title is required'),
});

export const CurriculumForm: FC<CurriculumFormProps> = ({ editing, onSave, loading }) => {
  const defaults = { title: '', description: '', videoLink: '', duration: '', curriculumLock: false };
  const initialValues = useMemo(() => (editing ? { ...defaults, ...editing } : defaults), [editing]);

  const handleSubmit = (v: any) => {
    const payload = { ...v };
    if (editing) payload.id = editing._id;
    onSave(payload);
  };

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={CurriculumSchema} onSubmit={handleSubmit}>
      {() => (
        <CommonFormShell
          title={editing ? 'Edit Curriculum' : 'Add Curriculum'}
          description="Shape the curriculum block and attach the supporting lesson details."
        >
          <Form className="course-form-shell">
            <CommonFormSection title="Curriculum Details">
              <CommonValidationTextField name="title" label="Title" required />
              <CommonValidationTextField name="description" label="Description" />
              <CommonValidationTextField name="videoLink" label="Video Link" />
              <CommonValidationTextField name="duration" label="Duration" />
            </CommonFormSection>

            <div className="course-form-actions">
              <CommonButton htmlType="submit" type="primary" title={editing ? 'Update Curriculum' : 'Create Curriculum'} loading={loading} block className="course-button course-button--primary" />
            </div>
          </Form>
        </CommonFormShell>
      )}
    </Formik>
  );
};
