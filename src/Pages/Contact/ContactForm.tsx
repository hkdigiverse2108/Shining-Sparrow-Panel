import React from 'react';
import { Formik, Form } from 'formik';
import { CommonFormSection } from '@/Components/Common/CommonFormSection';
import { CommonButton, CommonValidationTextField } from '@/Attribute';
import type { ContactFormProps } from '@/Types';

export const ContactForm: React.FC<ContactFormProps> = ({ initialValues, onSubmit }) => (
  <Formik enableReinitialize initialValues={initialValues} onSubmit={onSubmit}>
    {() => (
      <Form>
        <CommonFormSection title="Office Details">
          <CommonValidationTextField name="email" label="Email Address" required />
          <CommonValidationTextField name="phone" label="Phone Number" required />
          <CommonValidationTextField name="hours" label="Working Hours" required />
          <CommonValidationTextField name="location" label="Location" required />
        </CommonFormSection>
        <div className="contact-form-actions">
          <CommonButton htmlType="submit" type="primary" title="Save Details" block />
        </div>
      </Form>
    )}
  </Formik>
);