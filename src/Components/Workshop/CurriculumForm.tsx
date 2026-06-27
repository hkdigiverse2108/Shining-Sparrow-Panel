// components/Workshop/CurriculumForm.tsx
import { type FC, useMemo } from 'react';
import { Formik, Form } from 'formik';
import { CommonFormShell, CommonFormSection, CommonImageUpload, CommonVideoUpload, CommonAttachmentUpload, CommonPrioritySelect } from '@/Components';
import { CommonButton, CommonValidationTextField, CommonDatePicker, CommonRichTextEditor } from '@/Attribute';
import { WorkshopCurriculumSchema } from '@/Utils';

interface WorkshopCurriculumFormProps {
  editing: any | null;
  onSave: (values: any) => void;
  loading: boolean;
  existingPriorities?: number[];
}

export const WorkshopCurriculumForm: FC<WorkshopCurriculumFormProps> = ({ editing, onSave, loading, existingPriorities }) => {
  const validationSchema = useMemo(() => {
    const list = existingPriorities || [];
    return WorkshopCurriculumSchema.shape({
      priority: (WorkshopCurriculumSchema.fields.priority as any).test(
        'unique-priority',
        'This priority is already in use for this workshop.',
        (val: any) => {
          if (val === undefined || val === null || val === '') return true;
          return !list.includes(Number(val));
        }
      )
    });
  }, [existingPriorities]);

  const defaults = { title: '', description: '', videoLink: '', duration: '', priority: '', thumbnail: '', attachment: '', date: '' };
  const initialValues = useMemo(() => (editing ? { 
    ...defaults, 
    ...editing,
    priority: editing.priority ?? '',
    duration: editing.duration ?? '',
  } : defaults), [editing]);

  const handleSubmit = (v: any) => {
    const payload = { ...v };
    if (editing) payload.workshopCurriculumId = editing._id;
    onSave(payload);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <CommonFormShell
          title={editing ? 'Edit Session' : 'Add Session'}
          description="Shape the session details, attach media files, and set the date schedule."
        >
          <Form className="space-y-6">
            <CommonFormSection title="Session Details">
              <CommonValidationTextField name="title" label="Session Title" required className="col-span-full lg:col-span-2" />
              <div className="col-span-full lg:col-span-1">
                <CommonPrioritySelect
                  name="priority"
                  label="Priority / Order"
                  required
                  usedPriorities={existingPriorities || []}
                  editingId={editing?._id}
                  editingPriority={editing?.priority}
                />
              </div>
              
              <div className="col-span-full mb-4">
                <CommonRichTextEditor
                  name="description"
                  label="Description"
                  onChange={(val) => setFieldValue('description', val)}
                  value={values.description}
                  className="w-full"
                />
              </div>

              <CommonValidationTextField name="duration" label="Duration (Minutes)" type="number" required />
              <CommonDatePicker name="date" label="Session Date" required />
              <CommonImageUpload
                name="thumbnail"
                label="Session Thumbnail"
                shape="square"
                size={100}
                required
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