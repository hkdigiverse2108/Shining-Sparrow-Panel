// components/Workshop/TestimonialForm.tsx
import { type FC, useMemo } from 'react';
import { Formik, Form } from 'formik';
import { CommonFormSection, CommonImageUpload } from '@/Components';
import { CommonButton, CommonValidationTextField } from '@/Attribute';
import * as Yup from 'yup';

interface TestimonialFormProps {
  editing: any | null;
  onSave: (values: any) => void;
  loading: boolean;
}

const TestimonialSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  rate: Yup.number().required('Rating is required').min(0, 'Rating cannot be negative').max(5, 'Max rating is 5'),
});

export const TestimonialForm: FC<TestimonialFormProps> = ({ editing, onSave, loading }) => {
  const defaults = { name: '', designation: '', rate: 5, description: '', image: '' };
  const initialValues = useMemo(() => (editing ? { ...defaults, ...editing } : defaults), [editing]);

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={TestimonialSchema} onSubmit={onSave}>
      {() => (
        <Form className="space-y-6">
          <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
          <CommonFormSection title="Testimonial Details">
            <CommonImageUpload name="image" label="Customer Photo" shape="circle" size={140} className="col-span-full mb-4" />
            <CommonValidationTextField name="name" label="Name" required />
            <CommonValidationTextField name="designation" label="Designation / Title" placeholder="e.g. Student, CEO" />
            <CommonValidationTextField name="rate" label="Rating (1-5)" type="number" required />
            <CommonValidationTextField name="description" label="Review Description" className="col-span-full" placeholder="Write their testimonial here..." />
          </CommonFormSection>
          <div className="mt-6">
            <CommonButton htmlType="submit" type="primary" title={editing ? 'Update Testimonial' : 'Create Testimonial'} loading={loading} block />
          </div>
        </Form>
      )}
    </Formik>
  );
};
