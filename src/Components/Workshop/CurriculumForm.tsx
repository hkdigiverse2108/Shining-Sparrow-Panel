// components/Workshop/CurriculumForm.tsx
import { type FC, useMemo } from 'react';
import { Formik, Form } from 'formik';
import { CommonFormShell, CommonFormSection, CommonImageUpload, CommonVideoUpload, CommonAttachmentUpload } from '@/Components';
import { CommonButton, CommonValidationTextField, CommonDatePicker, CommonRichTextEditor } from '@/Attribute';
import * as Yup from 'yup';

interface WorkshopCurriculumFormProps {
  editing: any | null;
  onSave: (values: any) => void;
  loading: boolean;
  existingPriorities?: number[];
}

export const WorkshopCurriculumForm: FC<WorkshopCurriculumFormProps> = ({ editing, onSave, loading, existingPriorities }) => {
  const CurriculumSchema = useMemo(() => {
    const list = existingPriorities || [];
    return Yup.object({
      title: Yup.string().required('Title is required'),
      priority: Yup.number()
        .required('Priority is required')
        .min(0, 'Priority must be non-negative')
        .test('unique-priority', 'This priority is already in use for this workshop.', (val) => {
          if (val === undefined || val === null) return true;
          return !list.includes(Number(val));
        }),
      duration: Yup.number().optional().min(0, 'Duration must be non-negative'),
    });
  }, [existingPriorities]);
  const defaults = { title: '', description: '', videoLink: '', duration: '', priority: 0, thumbnail: '', attachment: '', date: null };
  const initialValues = useMemo(() => (editing ? { ...defaults, ...editing } : defaults), [editing]);
  const handleSubmit = (v: any) => {
    const payload = { ...v };
    if (editing) payload.workshopCurriculumId = editing._id;
    onSave(payload);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={CurriculumSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, errors }) => (
        <CommonFormShell
          title={editing ? 'Edit Session' : 'Add Session'}
          description="Shape the session details, attach media files, and set the date schedule."
        >
          <Form className="space-y-6">
            <CommonFormSection title="Session Details">
              <CommonValidationTextField name="title" label="Session Title" required />
              <CommonValidationTextField name="priority" label="Priority / Order" type="number" required />
              
              <div className="col-span-full mb-4">
                <CommonRichTextEditor
                  name="description"
                  label="Description"
                  onChange={(val) => setFieldValue('description', val)}
                  value={values.description}
                  className="w-full"
                />
              </div>

              <CommonValidationTextField name="duration" label="Duration (Minutes)" type="number" />
              <CommonDatePicker name="date" label="Session Date" />
              <CommonImageUpload
                name="thumbnail"
                label="Session Thumbnail"
                shape="square"
                size={100}
                className="col-span-full"
              />
            </CommonFormSection>

            <CommonFormSection title="Media & Resources">
              <CommonVideoUpload
                name="videoLink"
                label="Video Resource"
                className="col-span-full"
              />

              <CommonAttachmentUpload
                name="attachment"
                label="Session Attachment"
                className="col-span-full"
              />
            </CommonFormSection>

            {Object.keys(errors).length > 0 && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600">
                <strong className="text-xs font-semibold block mb-1">Please fix the following validation errors:</strong>
                <ul className="list-disc list-inside text-xs space-y-0.5">
                  {Object.entries(errors).map(([key, value]) => (
                    <li key={key}><span className="capitalize font-medium">{key}</span>: {String(value)}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4">
              <CommonButton 
                htmlType="submit" 
                type="primary" 
                title={editing ? 'Update Session' : 'Create Session'} 
                loading={loading} 
                block 
                className="h-11 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors font-semibold" 
              />
            </div>
          </Form>
        </CommonFormShell>
      )}
    </Formik>
  );
};