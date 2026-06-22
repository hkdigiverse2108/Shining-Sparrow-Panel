import { type FC, useMemo } from "react";
import { Form, Button, Input } from "antd";
import { 
  LinkOutlined, DeleteOutlined, PlayCircleOutlined, InfoCircleOutlined 
} from "@ant-design/icons";
import { useField } from "formik";
import type { CommonVideoUploadProps } from "@/Types";

export const CommonVideoUpload: FC<CommonVideoUploadProps> = ({ 
  name, 
  label = "Video Resource", 
  required = false, 
  className = "" 
}) => {
  const [field, meta, helpers] = useField(name);

  const showError = meta.touched && meta.error;

  const handleRemove = () => {
    helpers.setValue("");
  };

  const isDirectVideo = useMemo(() => {
    const val = field.value;
    if (!val || typeof val !== "string") return false;
    return val.includes("dummy-assets.com/video") || val.match(/\.(mp4|webm|ogg|mov)($|\?)/i) || val.startsWith("data:video");
  }, [field.value]);

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
        {/* Sleek URL Input and Preview Option */}
        <div className="w-full space-y-3">
          <Input
            placeholder="Paste video source link (e.g. S3 direct link, MP4 URL)..."
            value={field.value && typeof field.value === "string" && !field.value.startsWith("data:") ? field.value : ""}
            onChange={(e) => helpers.setValue(e.target.value)}
            prefix={<LinkOutlined className="text-muted" />}
            allowClear
            className="w-full h-11 rounded-xl border border-border shadow-sm focus:border-primary focus:shadow-md transition-all duration-200"
          />
          {field.value ? (
            <div className="flex flex-col gap-3">
              <div className="relative group overflow-hidden rounded-2xl border border-border bg-surface aspect-video shadow-md">
                {isDirectVideo ? (
                  <video 
                    src={field.value} 
                    controls 
                    className="w-full h-full object-cover rounded-2xl bg-black"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 gap-2 p-4 text-center">
                    <PlayCircleOutlined className="text-4xl text-muted" />
                    <span className="text-xs font-semibold text-foreground">Video Link Set</span>
                    <span className="text-[10px] text-muted truncate max-w-full px-2">{field.value}</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <Button 
                    type="primary" 
                    danger 
                    shape="circle" 
                    icon={<DeleteOutlined />} 
                    onClick={handleRemove} 
                    className="shadow-md hover:scale-105 transition-transform"
                  />
                </div>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-blue-50/50 border border-blue-100 rounded-lg text-[10px] text-blue-600">
                <InfoCircleOutlined className="text-xs" />
                <span>Preview loads automatically if URL points to a direct video file.</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Form.Item>
  );
};
