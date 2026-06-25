import { type FC } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { CommonFormShell, CommonFormSection, CommonImageUpload } from '@/Components';
import { CommonValidationTextField } from '@/Attribute';

interface TrustedPartnerFormProps {
  onClose: () => void;
  onSave: (values: any) => void;
  editing: any | null;
  loading?: boolean;
}

const PartnerSchema = Yup.object({
  name: Yup.string().required('Partner Name is required'),
  description: Yup.string().optional(),
  image: Yup.string().required('Partner Logo is required'),
});

export const TrustedPartnerForm: FC<TrustedPartnerFormProps> = ({ onClose, onSave, editing, loading = false }) => {
  const initialValues = {
    name: editing?.name || '',
    description: editing?.description || '',
    image: editing?.image || '',
  };

  const handleSubmit = (values: any) => {
    const payload = editing
      ? { trustedPartnerId: editing._id, ...values }
      : values;
    onSave(payload);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={PartnerSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty }) => (
        <CommonFormShell
          title={editing ? 'Edit Trusted Partner' : 'Add Trusted Partner'}
          description="Manage client logos, affiliate details, and sponsor entities."
          onClose={onClose}
          closeLabel="Cancel"
        >
          <Form className="space-y-6">
            <CommonFormSection title="Partner Information">
              <CommonValidationTextField
                name="name"
                label="Partner Name"
                placeholder="e.g., Google Digital"
                required
                className="col-span-full"
              />
              <CommonValidationTextField
                name="description"
                label="Description"
                placeholder="Describe partnership terms or sponsor details..."
                multiline
                rows={3}
                className="col-span-full"
              />
            </CommonFormSection>

            <CommonFormSection title="Logo">
              <CommonImageUpload
                name="image"
                label="Partner Logo"
                shape="circle"
                size={120}
                required
                className="col-span-full"
              />
            </CommonFormSection>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="course-button course-button--ghost"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="course-button course-button--primary"
                disabled={!isValid || !dirty || loading}
              >
                {loading ? 'Saving...' : editing ? 'Update Partner' : 'Create Partner'}
              </button>
            </div>
          </Form>
        </CommonFormShell>
      )}
    </Formik>
  );
};
