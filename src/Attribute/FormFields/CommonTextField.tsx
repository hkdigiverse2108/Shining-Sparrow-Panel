import { type ChangeEvent, type FC, useMemo, useState, type ReactNode } from "react";
import { Button, Input, Spin, Form } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useField } from "formik";
import { type CommonValidationTextFieldProps } from "@/Types/Common";

export const CommonValidationTextField: FC<CommonValidationTextFieldProps> = ({ 
  name, label, type = "text", placeholder, required, disabled, validating, clearable, 
  showPasswordToggle, startIcon, endIcon, maxDigits, isCurrency, currencyDisabled, 
  onCurrencyLog, className, ...props 
}) => {
  const [field, meta] = name ? useField(name) : [{
    name: '',
    value: (props as any).value,
    onChange: (props as any).onChange,
    onBlur: (props as any).onBlur || (() => {}),
  }, { touched: false, error: undefined }];
  const [currencyType, setCurrencyType] = useState<"\u20b9" | "%">("\u20b9");
  
  const isPassword = type === "password";
  const showError = meta.touched && meta.error; 

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (maxDigits && e.target.value.length > maxDigits) return;
    field.onChange(e); 
  };

  const suffix = useMemo(() => {
    const items: ReactNode[] = [];
    if (validating) items.push(<Spin size="small" key="loading" />);
    if (endIcon) items.push(endIcon);
    return items.length ? <>{items}</> : null;
  }, [validating, endIcon]);

  const inputClassName = ["modern-input", className].filter(Boolean).join(" ");

  const sharedProps = { 
    ...props, 
    name: field.name, 
    value: field.value, 
    placeholder, 
    disabled, 
    onChange: handleChange, 
    onBlur: field.onBlur, 
    prefix: startIcon, 
    suffix, 
    allowClear: clearable, 
    className: inputClassName 
  };

  const inputNode = isPassword && showPasswordToggle ? (
    <Input.Password {...sharedProps} iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)} />
  ) : (
    <Input {...sharedProps} type={type} />
  );

  const content = isCurrency ? (
    <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
      <Button disabled={disabled || currencyDisabled} onClick={() => {
        const next = currencyType === "\u20b9" ? "%" : "\u20b9";
        setCurrencyType(next);
        onCurrencyLog?.(next);
      }}>
        {currencyType}
      </Button>
      <div style={{ flex: 1 }}>{inputNode}</div>
    </div>
  ) : (
    inputNode
  );

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={showError ? "error" : ""}
      help={showError ? meta.error : ""}
      labelCol={{ span: 24 }} 
      wrapperCol={{ span: 24 }}
      className="modern-form-item" // Applied modern class
    >
      {content}
    </Form.Item>
  );
};