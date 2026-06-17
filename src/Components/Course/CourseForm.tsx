import { Formik, Form } from 'formik';
import { useMemo } from 'react';
import { CommonFormSection, CommonImageUpload } from '@/Components';
import { CommonButton, CommonValidationTextField, CommonValidationSelect, CommonRichTextEditor } from '@/Attribute';
import { courseStatusOptions } from '@/Data';
import { CourseSchema } from '@/Utils';
import type { CourseFormProps } from '@/Types/Course';
import type { FC } from 'react';
import { useAppSelector } from '@/Store/hooks';

export const CourseForm: FC<CourseFormProps> = ({ initialValues, onSubmit, isEditing = false }) => {
  const users = useAppSelector(state => state.users.data);
  const categories = useAppSelector(state => state.categories.data);
  
  const instructorOptions = useMemo(() => users
      .filter(user => user.role === 'instructor')
      .map(user => ({ label: user.username, value: String(user.id) })),
    [users]
  );
  const formattedInitialValues = useMemo(() => ({
    ...initialValues,
    instructorId: initialValues.instructorId ? String(initialValues.instructorId) : '',
  }), [initialValues]);

  const courseCategoryOptions = useMemo(() => 
    categories.map(c => ({ label: c.name, value: c.name })), 
  [categories]); 

  return (
    <Formik enableReinitialize initialValues={formattedInitialValues} onSubmit={onSubmit} validationSchema={CourseSchema} >
      {({ values, setFieldValue }) => (
        <Form>
          <CommonFormSection title="Media & Status">
            <CommonImageUpload name="image" label="Course Thumbnail" shape="square" size={120} className="col-span-2" />
            <CommonValidationSelect name="status" label="Status" options={courseStatusOptions} fullWidth required />
          </CommonFormSection>

          <CommonFormSection title="Course Details">
            <CommonValidationTextField name="title" label="Course Title" required />
            <CommonValidationSelect name="category" label="Category" options={courseCategoryOptions} required />
            <CommonRichTextEditor name="description" label="Description" required value={values.description} onChange={(val) => setFieldValue('description', val)} placeholder="Write a detailed course description..." className="col-span-2" />
          </CommonFormSection>

          <CommonFormSection title="Instructor & Pricing">
            <CommonValidationSelect name="instructorId" label="Instructor" options={instructorOptions} fullWidth required />
            <CommonValidationTextField name="price" label="Price (e.g. $49)" required />
            <CommonValidationTextField name="fullPrice" label="Original Price (e.g. $49.99)" />
            <CommonValidationTextField name="rating" label="Rating (1-5)" />
          </CommonFormSection>

          <div className="mt-6 pt-4 border-t border-border">
            <CommonButton htmlType="submit" type="primary" title={isEditing ? "Save Changes" : "Create Course"} block />
          </div>
        </Form>
      )}
    </Formik>
  );
};