import React from 'react';
import { Formik, Form } from 'formik';
import { CommonValidationTextField, CommonValidationSelect, CommonDatePicker, CommonTimePicker, CommonButton } from '@/Attribute';
import type { EventFormProps } from '@/Types';

const eventTypeOptions = [
  { label: "Meeting", value: "meeting" },
  { label: "Holiday", value: "holiday" },
  { label: "Other", value: "other" },
];

export const EventForm: React.FC<EventFormProps> = ({ initialValues, onSubmit, isEditing = false }) => (
  <Formik enableReinitialize initialValues={initialValues} onSubmit={onSubmit}>
    {({ values, setFieldValue }) => (
      <Form className="space-y-4">
        <CommonValidationTextField name="title" label="Event Title" required />
        <CommonValidationSelect name="type" label="Event Type" options={eventTypeOptions} required />
        <CommonDatePicker label="Date" required value={values.date} onChange={(val) => setFieldValue('date', val)} />
        <CommonTimePicker label="Time" value={values.time} onChange={(val) => setFieldValue('time', val)} />
        <div className="mt-6 pt-4 border-t border-border">
          <CommonButton htmlType="submit" type="primary" title={isEditing ? "Save Changes" : "Add Event"} block />
        </div>
      </Form>
    )}
  </Formik>
);