import { Select, Form } from "antd";
import { useField, useFormikContext } from "formik";
import { type FC } from "react";
import type { CommonSelectProps, CommonValidationSelectProps } from "../../Types";

export const CommonValidationSelect: FC<CommonValidationSelectProps> = ({ 
  name, label, options = [], multiple = false, placeholder, disabled, isLoading, required, fullWidth = false, maxTagCount, showSearch
}) => {
  const [field, meta, helpers] = useField(name);
  const { setFieldValue } = useFormikContext<any>();
  const value = multiple ? field.value || [] : field.value;
  const hasError = meta.touched && meta.error;
  
  return (
    <Form.Item 
      label={label} 
      required={required}
      validateStatus={hasError ? "error" : ""} 
      help={hasError && meta.error}
      labelCol={{ span: 24 }} 
      wrapperCol={{ span: 24 }}
      className={`modern-form-item ${fullWidth ? 'col-span-2' : 'col-span-1'}`} 
    >
      <Select 
        mode={multiple ? "multiple" : undefined} 
        value={value} 
        options={options.map((o) => ({ label: o.label, value: o.value }))} 
        placeholder={placeholder} 
        disabled={disabled} 
        loading={isLoading} 
        showSearch={showSearch}
        optionFilterProp="label"
        onChange={(val) => { helpers.setValue(val); setFieldValue(name, val); }}
        onBlur={() => helpers.setTouched(true)} 
        allowClear 
        maxTagCount={maxTagCount} // <-- ADD THIS
        className="modern-select h-10" 
      />
    </Form.Item>
  );
};

// Also update the standard CommonSelect if you use it elsewhere
export const CommonSelect: FC<CommonSelectProps> = ({ label, options = [], value, onChange, multiple = false, placeholder, disabled, isLoading, limitTags, fullWidth = false, maxTagCount, showSearch }) => {
  return (
    <Form.Item 
      label={label} 
      labelCol={{ span: 24 }} 
      wrapperCol={{ span: 24 }}
      className={`modern-form-item ${fullWidth ? 'col-span-2' : 'col-span-1'}`}
    >
      <Select 
        mode={multiple ? "multiple" : undefined} 
        value={value} 
        options={options.map((o) => ({ label: o.label, value: o.value }))} 
        placeholder={placeholder} 
        disabled={disabled} 
        loading={isLoading} 
        showSearch={showSearch}
        optionFilterProp="label"
        maxTagCount={maxTagCount || limitTags} // <-- ADD THIS
        onChange={(val) => { if (multiple) onChange?.(val as string[]); else onChange?.(val as string); }} 
        allowClear 
        className="modern-select" 
      />
    </Form.Item>
  );
};