import React from 'react';
import { DatePicker, Form } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useField, useFormikContext } from 'formik';

interface CommonDatePickerProps {
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  format?: string;
  name?: string;
}

export const CommonDatePicker: React.FC<CommonDatePickerProps> = ({ 
  value, 
  onChange, 
  placeholder = 'Select Date', 
  label, 
  required, 
  format = 'MMM DD, YYYY',
  name
}) => {
  const formikContext = useFormikContext();
  const [field, meta, helpers] = formikContext && name ? useField(name) : [{ value: value || '' } as any, { touched: false, error: undefined }, { setValue: () => {} } as any];

  const handleChange = (date: Dayjs | null) => {
    const val = date ? date.format(format) : '';
    if (onChange) onChange(val);
    if (formikContext && name) helpers.setValue(val);
  };

  const showError = meta.touched && meta.error;

  return (
    <Form.Item 
      label={label} 
      required={required} 
      validateStatus={showError ? "error" : ""} 
      help={showError ? meta.error : ""} 
      labelCol={{ span: 24 }} 
      wrapperCol={{ span: 24 }} 
      className="modern-form-item w-full"
    >
      <DatePicker 
        value={field.value ? dayjs(field.value, format) : (value ? dayjs(value, format) : null)} 
        onChange={handleChange} 
        onBlur={() => { if (formikContext && name) helpers.setTouched(true); }}
        format={format} 
        placeholder={placeholder}
        className="w-full h-10 rounded-lg border border-border bg-surface text-foreground hover:border-primary focus:border-primary transition-colors"
        popupClassName="ant-datepicker-popup"
      />
    </Form.Item>
  );
};