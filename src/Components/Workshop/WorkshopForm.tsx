import { Formik, Form } from 'formik';
import { useMemo } from 'react';
import { CommonFormSection, CommonImageUpload } from '@/Components';
import { CommonButton, CommonValidationTextField, CommonValidationSelect, CommonDatePicker, CommonRichTextEditor, CommonTimePicker } from '@/Attribute';
import { workshopCategoryOptions } from '@/Data';
import type { FC } from 'react';
import type { WorkshopFormProps } from '@/Types/Workshop';
import { WorkshopSchema } from '@/Utils';
import { useAppSelector } from '@/Store/hooks';

export const WorkshopForm: FC<WorkshopFormProps> = ({ initialValues, onSubmit, isEditing = false }) => {
  const users = useAppSelector(state => state.users.data);

  const speakerOptions = useMemo(() => 
    users
      .filter(u => u.role === 'instructor')
      .map(u => ({ label: u.username, value: String(u.id) })),
    [users]
  );

  // Ensure speakerId is a string so the dropdown matches the value on edit
  const formattedInitialValues = useMemo(() => ({
    ...initialValues,
    speakerId: initialValues.speakerId ? String(initialValues.speakerId) : '',
  }), [initialValues]);

  return (
    <Formik enableReinitialize initialValues={formattedInitialValues} onSubmit={onSubmit} validationSchema={WorkshopSchema} >
      {({ values, setFieldValue }) => (
        <Form>
          <CommonFormSection title="Details">
            <CommonImageUpload name="image" label="Workshop Banner" shape="square" size={100} className='col-span-2' />
            <CommonValidationTextField name="title" label="Title" required />
            <CommonValidationSelect name="category" label="Category" options={workshopCategoryOptions} required />
            <CommonDatePicker name="date" label="Date" required value={values.date} onChange={(val) => setFieldValue('date', val)} />
            <CommonTimePicker name="time" label="Time" required isRange value={values.time} onChange={(val) => setFieldValue('time', val)} />
            <CommonRichTextEditor name="description" label="Description" required value={values.description} onChange={(val) => setFieldValue('description', val)} placeholder="Write a detailed workshop description..." className="col-span-2" />
          </CommonFormSection>
          
          <CommonFormSection title="Speaker Info">          
            <CommonValidationSelect name="speakerId" label="Speaker" options={speakerOptions} fullWidth required />
          </CommonFormSection>
          
          <div className="mt-6 pt-4 border-t border-border">
            <CommonButton htmlType="submit" type="primary" title={isEditing ? "Save Changes" : "Create Workshop"} block />
          </div>
        </Form>
      )}
    </Formik>
  );
};