import { type FC, useMemo } from "react";
import { Form, Button, Input } from "antd";
import { 
  LinkOutlined, DeleteOutlined, PlayCircleOutlined
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

  // YouTube / Vimeo embed matcher
  const renderVideoPreview = () => {
    if (!field.value) return null;

    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const ytMatch = field.value.match(youtubeRegex);
    if (ytMatch && ytMatch[1]) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${ytMatch[1]}`}
          title="Video Preview"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full object-cover rounded-2xl"
        />
      );
    }

    const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
    const vimeoMatch = field.value.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) {
      return (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
          title="Video Preview"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full object-cover rounded-2xl"
        />
      );
    }

    if (isDirectVideo) {
      return (
        <video 
          src={field.value} 
          controls 
          className="w-full h-full object-cover rounded-2xl bg-black"
        />
      );
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 gap-2 p-4 text-center">
        <PlayCircleOutlined className="text-4xl text-muted" />
        <span className="text-xs font-semibold text-foreground">External Link Set</span>
        <span className="text-[10px] text-muted truncate max-w-full px-2">{field.value}</span>
      </div>
    );
  };

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
        <div className="w-full space-y-3">
          <div>
            <Input
              placeholder="Paste video source link (e.g. YouTube, Vimeo, direct link)..."
              value={field.value && typeof field.value === "string" ? field.value : ""}
              onChange={(e) => helpers.setValue(e.target.value)}
              prefix={<LinkOutlined className="text-muted" />}
              allowClear
              className="w-full h-11 rounded-xl border border-border shadow-sm focus:border-primary focus:shadow-md transition-all duration-200"
            />
            {field.value ? (
              <div className="flex flex-col gap-3 mt-3">
                <div className="relative group overflow-hidden rounded-2xl border border-border bg-surface aspect-video shadow-md">
                  {renderVideoPreview()}
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
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Form.Item>
  );
};
