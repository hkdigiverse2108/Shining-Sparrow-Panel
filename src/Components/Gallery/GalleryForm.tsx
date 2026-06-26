import { type FC } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { CommonFormShell, CommonFormSection, CommonMultipleImageUpload } from '@/Components';
import { CommonValidationTextField, CommonButton } from '@/Attribute';

interface GalleryFormProps {
  onClose: () => void;
  onSave: (values: any) => void;
  editing: any | null;
  loading?: boolean;
}

const GallerySchema = Yup.object({
  title: Yup.string().required('Folder Title is required'),
  description: Yup.string().optional(),
  images: Yup.array()
    .of(Yup.string())
    .test('min-one-image', 'At least one image must be uploaded', (val) => {
      if (!val) return false;
      return val.filter((img) => !!img).length > 0;
    }),
});

export const GalleryForm: FC<GalleryFormProps> = ({ onClose, onSave, editing, loading = false }) => {
  const initialValues = {
    title: editing?.title || '',
    description: editing?.description || '',
    images: editing?.images || [''], // default with one empty slot
  };

  const handleSubmit = (values: any) => {
    // Filter out empty images
    const cleanedImages = (values.images || []).filter((img: string) => !!img);
    const payload = editing
      ? { galleryId: editing._id, ...values, images: cleanedImages }
      : { ...values, images: cleanedImages };
    onSave(payload);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={GallerySchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty }) => (
        <CommonFormShell
          title={editing ? 'Edit Gallery Folder' : 'Create Gallery Folder'}
          description="Group images together into folders for showcases."
          onClose={onClose}
          closeLabel="Cancel"
        >
          <Form className="course-form-shell">
            <CommonFormSection title="Folder Information">
              <CommonValidationTextField
                name="title"
                label="Folder Title"
                placeholder="e.g., Annual Sports Meet 2026"
                required
                className="col-span-full"
              />
              <CommonValidationTextField
                name="description"
                label="Description"
                placeholder="Short description of the event or folder..."
                multiline
                rows={3}
                className="col-span-full"
              />
            </CommonFormSection>

            <CommonFormSection title="Images">
              <CommonMultipleImageUpload
                name="images"
                label="Select Event Images"
                required
                className="col-span-full"
              />
            </CommonFormSection>

            <div className="course-form-actions">
              <CommonButton
                htmlType="submit"
                type="primary"
                title={editing ? 'Update Folder' : 'Create Folder'}
                loading={loading}
                disabled={!isValid || !dirty || loading}
                block
                className="course-button course-button--primary"
              />
            </div>
          </Form>
        </CommonFormShell>
      )}
    </Formik>
  );
};
