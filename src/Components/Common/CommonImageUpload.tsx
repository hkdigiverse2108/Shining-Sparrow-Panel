import { type FC, useRef, useState } from "react";
import { Form, Button, Image } from "antd";
import { UserOutlined, CameraOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { useField } from "formik";
import type { CommonImageUploadProps } from "@/Types";

export const CommonImageUpload: FC<CommonImageUploadProps> = ({ name, label = "Image", shape = "circle", size = 80, required = false, className = "" }) => {
  const [field, meta, helpers] = useField(name);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const showError = meta.touched && meta.error;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => helpers.setValue(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => helpers.setValue("");
  
  const borderRadiusStyle = shape === "circle" ? "50%" : 8;

  return (
    <Form.Item 
      label={label} 
      required={required} 
      validateStatus={showError ? "error" : ""} 
      help={showError ? meta.error : ""} 
      labelCol={{ span: 24 }} 
      wrapperCol={{ span: 24 }} 
      className={`modern-form-item ${className}`}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/webp" />
      
      <div className="hidden">
        <Image src={field.value} preview={{ visible: previewOpen, onVisibleChange: (vis) => setPreviewOpen(vis) }} />
      </div>
      
      {field.value ? (
        <div className="image-upload-container group" style={{ width: size, height: size }}>
          <img src={field.value} alt="Preview" className="image-upload-img" style={{ width: size, height: size, borderRadius: borderRadiusStyle }} />
          <div className="image-upload-overlay" style={{ borderRadius: borderRadiusStyle }}>
            <Button shape="circle" icon={<EyeOutlined />} size="small" onClick={() => setPreviewOpen(true)} />
            <Button shape="circle" icon={<CameraOutlined />} size="small" onClick={() => fileInputRef.current?.click()} />
            <Button shape="circle" danger icon={<DeleteOutlined />} size="small" onClick={handleRemove} />
          </div>
        </div>
      ) : (
        <div className="image-upload-placeholder" style={{ width: size, height: size, borderRadius: borderRadiusStyle }} onClick={() => fileInputRef.current?.click()}>
          {shape === "circle" ? (
            <UserOutlined style={{ fontSize: size / 2.5 }} className="text-muted" />
          ) : (
            <>
              <CameraOutlined style={{ fontSize: size / 4 }} className="text-muted" />
              <span className="image-upload-placeholder-text">Upload</span>
            </>
          )}
        </div>
      )}
    </Form.Item>
  );
};