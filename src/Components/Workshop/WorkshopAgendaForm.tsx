import { type FC } from 'react';
import { Formik, Form } from 'formik';
import { CommonValidationTextField, CommonRichTextEditor, CommonTimePicker, CommonButton } from '@/Attribute';
import { CommonFormSection } from '@/Components';
import type { WorkshopAgendaFormProps } from '@/Types/Workshop';
import { WorkshopAgendaSchema } from '@/Utils';

export const WorkshopAgendaForm: FC<WorkshopAgendaFormProps> = ({ initialValues, onSubmit, isEditing }) => (
  <Formik enableReinitialize initialValues={initialValues} onSubmit={onSubmit} validationSchema={WorkshopAgendaSchema} >
    {({ values, setFieldValue }) => (
      <Form>
        <CommonFormSection title="Session Details">
          <CommonTimePicker name="time" label="Time" isRange value={values.time} onChange={(val) => setFieldValue('time', val)} required />
          <CommonValidationTextField name="title" label="Session Title" required />
          <CommonRichTextEditor name="desc" label="Description" required value={values.desc} onChange={(val) => setFieldValue('desc', val)} placeholder="Describe what will be covered in this session..." />
        </CommonFormSection>
        <div className="mt-6 pt-4 border-t border-border">
          <CommonButton htmlType="submit" type="primary" title={isEditing ? 'Save Changes' : 'Add Session'} block />
        </div>
      </Form>
    )}
  </Formik>
);