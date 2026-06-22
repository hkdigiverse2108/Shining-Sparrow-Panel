import { type FC, useRef, useState, useMemo, useEffect } from "react";
import { Form, Button, Image, Segmented, Input, message } from "antd";
import { 
  UserOutlined, CameraOutlined, EyeOutlined, DeleteOutlined, 
  PictureOutlined, CloudUploadOutlined, LinkOutlined, InfoCircleOutlined 
} from "@ant-design/icons";
import { useField } from "formik";
import type { CommonImageUploadProps } from "@/Types";

export const CommonImageUpload: FC<CommonImageUploadProps> = ({ 
  name, 
  label = "Image", 
  shape = "circle", 
  size = 80, 
  required = false, 
  className = "" 
}) => {
  const [field, meta, helpers] = useField(name);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const showError = meta.touched && meta.error;

  const initialMode = useMemo(() => {
    if (field.value && typeof field.value === "string" && field.value.startsWith("http")) {
      return "url";
    }
    return "upload";
  }, [field.value]);

  const [mode, setMode] = useState<"upload" | "url">(initialMode);

  // Sync mode state when form is re-initialized / item changes
  useEffect(() => {
    if (meta.initialValue && typeof meta.initialValue === "string" && meta.initialValue.startsWith("http")) {
      setMode("url");
    } else {
      setMode("upload");
    }
  }, [meta.initialValue]);

  // Reset error state when the image URL/value changes
  useEffect(() => {
    setHasError(false);
  }, [field.value]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => helpers.setValue(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        message.error("Please select a valid image file.");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => helpers.setValue(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        message.error("Please upload a valid image file.");
      }
    }
  };

  const handleRemove = () => helpers.setValue("");
  
  const borderRadiusStyle = shape === "circle" ? "50%" : "16px";
  const ringStyle = shape === "circle" ? "rounded-full" : "rounded-2xl";

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
      <div className="flex flex-col gap-3.5 w-full">
        {/* Premium Glassmorphic Segmented Selector */}
        <Segmented 
          options={[
            { label: <span className="flex items-center gap-1.5 px-2 py-0.5"><CloudUploadOutlined /> Upload Image</span>, value: "upload" },
            { label: <span className="flex items-center gap-1.5 px-2 py-0.5"><LinkOutlined /> Image URL</span>, value: "url" }
          ]}
          value={mode}
          onChange={(val) => setMode(val as "upload" | "url")}
          className="w-fit bg-gray-150/70 dark:bg-gray-800/50 p-1 rounded-xl border border-border"
        />

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/png, image/jpeg, image/webp" 
        />
        
        <div className="hidden">
          <Image src={field.value} preview={{ visible: previewOpen, onVisibleChange: (vis) => setPreviewOpen(vis) }} />
        </div>

        {mode === "upload" ? (
          <div>
            {field.value ? (
              /* Gorgeous Uploaded Image Preview Card with hover effects */
              <div 
                className={`relative group overflow-hidden border border-border shadow-md hover:shadow-lg transition-all duration-300 ${ringStyle}`}
                style={{ width: shape === "circle" ? size : "100%", aspectRatio: shape === "circle" ? "1/1" : "16/10" }}
              >
                <img 
                  src={hasError ? "https://placehold.co/300x200?text=Invalid+Image" : field.value} 
                  alt="Preview" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  onError={() => setHasError(true)}
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex justify-center items-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button 
                    shape="circle" 
                    icon={<EyeOutlined />} 
                    size="medium" 
                    onClick={() => setPreviewOpen(true)}
                    className="bg-white/20 border-white/40 text-white hover:bg-white/40 hover:scale-105 transition-all"
                  />
                  <Button 
                    shape="circle" 
                    icon={<CameraOutlined />} 
                    size="medium" 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/20 border-white/40 text-white hover:bg-white/40 hover:scale-105 transition-all"
                  />
                  <Button 
                    shape="circle" 
                    danger 
                    icon={<DeleteOutlined />} 
                    size="medium" 
                    onClick={handleRemove}
                    className="bg-red-500/30 border-red-400/40 text-white hover:bg-red-500/80 hover:scale-105 transition-all"
                  />
                </div>
              </div>
            ) : (
              /* Premium Dropzone Placeholder for Image Select */
              shape === "circle" ? (
                /* Circle Avatar Placeholder */
                <div 
                  className="relative group cursor-pointer overflow-hidden border border-dashed border-border flex items-center justify-center bg-surface-muted hover:border-primary hover:bg-primary/5 shadow-sm transition-all duration-300 rounded-full"
                  style={{ width: size, height: size }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UserOutlined style={{ fontSize: size / 2.4 }} className="text-muted group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-250">
                    <CameraOutlined className="text-white text-lg" />
                    <span className="text-[9px] text-white font-bold mt-0.5">UPLOAD</span>
                  </div>
                </div>
              ) : (
                /* Square Image Dropzone Card with Micro-Animations */
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full h-36 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all duration-300 group bg-surface-muted/50 ${
                    dragOver 
                      ? "border-primary bg-primary/5 scale-[1.01]" 
                      : "border-border hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-muted group-hover:text-primary group-hover:scale-110 group-hover:rotate-3 shadow-sm transition-all duration-300">
                    <PictureOutlined className="text-xl" />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors duration-250">
                      Drag & drop image here or <span className="underline text-primary">browse</span>
                    </p>
                    <p className="text-[10px] text-muted mt-0.5">Supports PNG, JPEG, WEBP (Max 5MB)</p>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          /* Premium Image URL Mode */
          <div className="w-full space-y-3">
            <Input
              placeholder="Paste image URL link..."
              value={field.value && typeof field.value === "string" && !field.value.startsWith("data:") ? field.value : ""}
              onChange={(e) => helpers.setValue(e.target.value)}
              prefix={<LinkOutlined className="text-muted" />}
              allowClear
              className="w-full h-10 rounded-xl border border-border shadow-sm focus:border-primary focus:shadow-md transition-all duration-200"
            />
            {field.value ? (
              <div className="flex flex-col gap-3">
                <div 
                  className={`relative group overflow-hidden border border-border bg-surface shadow-md ${ringStyle}`}
                  style={{ width: shape === "circle" ? size : "100%", aspectRatio: shape === "circle" ? "1/1" : "16/10" }}
                >
                  <img 
                    src={hasError ? "https://placehold.co/300x200?text=Invalid+Image" : field.value} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                    onError={() => setHasError(true)}
                  />
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button 
                      shape="circle" 
                      icon={<EyeOutlined />} 
                      size="medium" 
                      onClick={() => setPreviewOpen(true)}
                      className="bg-white/20 border-white/40 text-white hover:bg-white/40 hover:scale-105 transition-all"
                    />
                    <Button 
                      shape="circle" 
                      danger 
                      icon={<DeleteOutlined />} 
                      size="medium" 
                      onClick={handleRemove}
                      className="bg-red-500/30 border-red-400/40 text-white hover:bg-red-500/80 hover:scale-105 transition-all"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-blue-50/50 border border-blue-100 rounded-lg text-[10px] text-blue-600">
                  <InfoCircleOutlined className="text-xs" />
                  <span>Preview loads dynamically. Invalid links default to a placeholder.</span>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </Form.Item>
  );
};