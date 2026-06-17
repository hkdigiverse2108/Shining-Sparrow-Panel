import React from 'react';
import { TimePicker, Form } from 'antd';
import dayjs from 'dayjs';
import { useFormikContext } from 'formik';
import type { CommonTimePickerProps } from '@/Types';

export const CommonTimePicker: React.FC<CommonTimePickerProps & { name?: string }> = ({ value, onChange, placeholder = 'Select Time', label, required, format = 'hh:mm A', isRange = false, name }) => {
  const formikContext = useFormikContext();
  
  // Using context methods instead of useField hook to avoid conditional hook calls
  const field = name && formikContext ? formikContext.getFieldProps(name) : { value: value || '' };
  const meta = name && formikContext ? formikContext.getFieldMeta(name) : { touched: false, error: undefined as any };
  const helpers = name && formikContext ? formikContext.getFieldHelpers(name) : { setValue: () => {}, setTouched: () => {} } as any;

  // Fix: Allow timeString to be null to match Antd's strict (date, dateString | null) signature
  const handleChange = (_time: dayjs.Dayjs | null, timeString: string | null) => {
    if (!timeString) return;
    if (onChange) onChange(timeString);
    if (name && formikContext) helpers.setValue(timeString);
  };

  const handleRangeChange = (_time: any, timeStrings: [string, string]) => {
    const val = timeStrings.join(' - ');
    if (onChange) onChange(val);
    if (name && formikContext) helpers.setValue(val);
  };

  const showError = meta.touched && meta.error;
  const currentValue = field.value || value;

  // Fix: Cast through 'unknown' to bypass the 'string & any[]' intersection error safely
  const rangePlaceholder: [string, string] = Array.isArray(placeholder) ? (placeholder as unknown as [string, string]) : ['Start Time', 'End Time'];
  const singlePlaceholder: string = typeof placeholder === 'string' ? placeholder : 'Select Time';

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
      {isRange ? (
        <TimePicker.RangePicker 
          value={currentValue ? [dayjs(currentValue.split(' - ')[0], format), dayjs(currentValue.split(' - ')[1], format)] : null}
          onChange={handleRangeChange} 
          onBlur={() => { if (name && formikContext) helpers.setTouched(true); }}
          format={format} 
          placeholder={rangePlaceholder}
          className="w-full h-10 rounded-lg border border-border bg-surface text-foreground hover:border-primary focus:border-primary transition-colors"
          popupClassName="ant-datepicker-popup"
        />
      ) : (
        <TimePicker 
          value={currentValue ? dayjs(currentValue, format) : null} 
          onChange={handleChange} 
          onBlur={() => { if (name && formikContext) helpers.setTouched(true); }}
          format={format} 
          placeholder={singlePlaceholder}
          className="w-full h-10 rounded-lg border border-border bg-surface text-foreground hover:border-primary focus:border-primary transition-colors"
          popupClassName="ant-datepicker-popup"
        />
      )}
    </Form.Item>
  );
}