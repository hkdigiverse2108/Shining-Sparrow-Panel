// components/Workshop/TestimonialForm.tsx
import { type FC, useMemo, useEffect, useRef } from 'react';
import { Formik, Form } from 'formik';
import { CommonFormShell, CommonFormSection, CommonImageUpload } from '@/Components';
import { CommonButton, CommonValidationTextField, CommonValidationSelect } from '@/Attribute';
import * as Yup from 'yup';

const FormObserver: FC<{ type: string; onChange: (prev: string, next: string) => void }> = ({ type, onChange }) => {
  const prevTypeRef = useRef<string>(type);
  useEffect(() => {
    if (prevTypeRef.current !== type) {
      onChange(prevTypeRef.current, type);
      prevTypeRef.current = type;
    }
  }, [type, onChange]);
  return null;
};

interface TestimonialFormProps {
  editing: any | null;
  onSave: (values: any) => void;
  onClose: () => void;
  loading: boolean;
  showTypeSelector?: boolean;
  catalogOptions?: { value: string; label: string }[];
}

const TestimonialSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  rate: Yup.number().required('Rating is required').min(0, 'Rating cannot be negative').max(5, 'Max rating is 5'),
  type: Yup.string().oneOf(['home', 'course', 'workshop']).required('Type is required'),
  learningCatalogId: Yup.string().nullable(),
});

const TESTIMONIAL_TYPE_OPTIONS = [
  { label: 'Global (Home Page)', value: 'home' },
  { label: 'Course Specific', value: 'course' },
  { label: 'Workshop Specific', value: 'workshop' },
];

export const TestimonialForm: FC<TestimonialFormProps> = ({ editing, onSave, onClose, loading, showTypeSelector = false, catalogOptions = [] }) => {
  const defaults = { name: '', designation: '', rate: 5, description: '', image: '', type: 'home', learningCatalogId: '' };
  
  const initialValues = useMemo(() => {
    if (editing) {
      return {
        ...defaults,
        ...editing,
        learningCatalogId: typeof editing.learningCatalogId === 'object' && editing.learningCatalogId !== null
          ? editing.learningCatalogId._id
          : editing.learningCatalogId || ''
      };
    }
    return defaults;
  }, [editing]);

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={TestimonialSchema} onSubmit={onSave}>
      {({ values, setFieldValue }) => {
        const currentTypeOptions = [
          { label: 'All', value: 'all' },
          ...catalogOptions
            .filter((opt: any) => opt.type === values.type)
            .map((opt: any) => ({ label: opt.label.replace(/^(Course|Workshop):\s*/, ''), value: opt.value }))
        ];

        return (
          <CommonFormShell
            title={editing ? 'Edit Testimonial' : 'Add Testimonial'}
            description="Manage client testimonials and ratings showcase."
            onClose={onClose}
            closeLabel="Cancel"
          >
            <Form className="course-form-shell">
              <FormObserver
                type={values.type}
                onChange={(prevType, nextType) => {
                  if (prevType && prevType !== nextType) {
                    setFieldValue('learningCatalogId', '');
                  }
                }}
              />
              {showTypeSelector && (
                <CommonFormSection title="Testimonial Classification">
                  <CommonValidationSelect
                    name="type"
                    label="Testimonial Type"
                    options={TESTIMONIAL_TYPE_OPTIONS}
                    required
                    fullWidth={false}
                  />

                  {values.type === 'course' && (
                    <CommonValidationSelect
                      name="learningCatalogId"
                      label="Select Course"
                      options={currentTypeOptions}
                      required
                      fullWidth={false}
                    />
                  )}

                  {values.type === 'workshop' && (
                    <CommonValidationSelect
                      name="learningCatalogId"
                      label="Select Workshop"
                      options={currentTypeOptions}
                      required
                      fullWidth={false}
                    />
                  )}
                </CommonFormSection>
              )}

              <CommonFormSection title="Testimonial Details">
                <CommonImageUpload name="image" label="Customer Photo" shape="circle" size={140} className="col-span-full mb-4" />
                <CommonValidationTextField name="name" label="Name" required />
                <CommonValidationTextField name="designation" label="Designation / Title" placeholder="e.g. Student, CEO" />
                <CommonValidationTextField name="rate" label="Rating (1-5)" type="number" required />
                <CommonValidationTextField name="description" label="Review Description" className="col-span-full" placeholder="Write their testimonial here..." />
              </CommonFormSection>
              <div className="course-form-actions">
                <CommonButton htmlType="submit" type="primary" title={editing ? 'Update Testimonial' : 'Create Testimonial'} loading={loading} block className="course-button course-button--primary" />
              </div>
            </Form>
          </CommonFormShell>
        );
      }}
    </Formik>
  );
};
