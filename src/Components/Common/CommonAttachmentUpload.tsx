import { type FC, useRef, useState, useMemo, useEffect } from "react";
import { Form, Button, Segmented, Input, Progress, message } from "antd";
import { 
  FileTextOutlined, CloudUploadOutlined, LinkOutlined, 
  DeleteOutlined, PaperClipOutlined,
  FilePdfOutlined, FileExcelOutlined, FileWordOutlined,
  FilePptOutlined, FileZipOutlined
} from "@ant-design/icons";
import { useField } from "formik";
import type { CommonAttachmentUploadProps } from "@/Types";

const getFileIcon = (url: string) => {
  if (!url) return <FileTextOutlined className="text-gray-500 text-lg flex-shrink-0" />;
  const ext = url.split(".").pop()?.toLowerCase();
  
  switch (ext) {
    case "pdf":
      return <FilePdfOutlined className="text-red-500 text-lg flex-shrink-0" />;
    case "xls":
    case "xlsx":
      return <FileExcelOutlined className="text-green-600 text-lg flex-shrink-0" />;
    case "doc":
    case "docx":
      return <FileWordOutlined className="text-blue-500 text-lg flex-shrink-0" />;
    case "ppt":
    case "pptx":
      return <FilePptOutlined className="text-amber-500 text-lg flex-shrink-0" />;
    case "zip":
    case "rar":
    case "7z":
      return <FileZipOutlined className="text-orange-500 text-lg flex-shrink-0" />;
    default:
      return <FileTextOutlined className="text-indigo-500 text-lg flex-shrink-0" />;
  }
};

export const CommonAttachmentUpload: FC<CommonAttachmentUploadProps> = ({ 
  name, 
  label = "Attachment", 
  required = false, 
  className = "" 
}) => {
  const [field, meta, helpers] = useField(name);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [fileUploading, setFileUploading] = useState(false);
  const [fileProgress, setFileProgress] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState("");
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

  const handleFileUpload = (file: File) => {
    setFileUploading(true);
    setFileProgress(0);
    setUploadedFileName(file.name);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setFileProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setFileUploading(false);
        const simulatedUrl = `https://dummy-assets.com/docs/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
        helpers.setValue(simulatedUrl);
        message.success(`Attachment "${file.name}" uploaded successfully!`);
      }
    }, 150);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
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
      handleFileUpload(file);
    }
  };

  const handleRemove = () => {
    helpers.setValue("");
    setUploadedFileName("");
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
        {/* Premium Glassmorphic Segmented Selector */}
        <Segmented
          options={[
            { label: <span className="flex items-center gap-1.5 px-2 py-0.5"><CloudUploadOutlined /> Upload File</span>, value: "upload" },
            { label: <span className="flex items-center gap-1.5 px-2 py-0.5"><LinkOutlined /> File URL</span>, value: "url" }
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
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
        />

        {mode === "upload" ? (
          <div className="w-full">
            {fileUploading ? (
              /* Gorgeous Uploading Progress Card - stretched to full width */
              <div className="w-full p-5 bg-surface border border-primary/20 rounded-2xl shadow-sm flex flex-col gap-3.5 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-lg">
                    <CloudUploadOutlined />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold text-foreground block truncate">Uploading File</span>
                    <span className="text-[10px] text-muted truncate block">{uploadedFileName || "Processing document..."}</span>
                  </div>
                  <span className="text-xs font-bold text-primary">{fileProgress}%</span>
                </div>
                <Progress 
                  percent={fileProgress} 
                  showInfo={false} 
                  strokeColor="var(--primary)"
                  trailColor="color-mix(in srgb, var(--primary) 12%, transparent)"
                  strokeWidth={5}
                  className="m-0"
                />
              </div>
            ) : field.value ? (
              /* Premium Uploaded Attachment Card - stretched to full width */
              <div className="w-full p-4 bg-surface rounded-2xl border border-border shadow-sm flex items-center justify-between gap-3 group hover:border-primary/45 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 overflow-hidden min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-surface-muted border border-border flex items-center justify-center flex-shrink-0">
                    {getFileIcon(field.value)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-foreground block truncate">{uploadedFileName || field.value.split("/").pop() || "attachment_file"}</span>
                    <span className="text-[9px] text-muted block truncate font-medium">{field.value}</span>
                  </div>
                </div>
                <Button 
                  type="text" 
                  danger 
                  shape="circle" 
                  icon={<DeleteOutlined />} 
                  onClick={handleRemove}
                  className="shadow-sm hover:bg-red-50 hover:scale-105 transition-all flex-shrink-0"
                />
              </div>
            ) : (
              /* Stunning Stretched Dropzone with Hover Micro-Animations */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 group bg-surface-muted/50 ${
                  dragOver 
                    ? "border-primary bg-primary/5 scale-[1.005]" 
                    : "border-border hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-muted group-hover:text-primary group-hover:scale-110 shadow-sm transition-all duration-300">
                  <PaperClipOutlined className="text-lg" />
                </div>
                <div className="text-center px-4">
                  <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors duration-250">
                    Drag & drop file here or <span className="underline text-primary">browse</span>
                  </p>
                  <p className="text-[10px] text-muted mt-0.5">Supports PDF, DOC, XLS, PPT, ZIP (Max 25MB)</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Sleek Stretched URL Input and Preview Option */
          <div className="w-full space-y-3">
            <Input
              placeholder="Paste document source link (e.g. PDF link, S3 document URL)..."
              value={field.value && typeof field.value === "string" && !field.value.startsWith("data:") ? field.value : ""}
              onChange={(e) => helpers.setValue(e.target.value)}
              prefix={<LinkOutlined className="text-muted" />}
              allowClear
              className="w-full h-10 rounded-xl border border-border shadow-sm focus:border-primary focus:shadow-md transition-all duration-200"
            />
            {field.value ? (
              <div className="p-4 bg-surface rounded-2xl border border-border flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3 overflow-hidden min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-surface-muted border border-border flex items-center justify-center flex-shrink-0">
                    {getFileIcon(field.value)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-foreground block truncate">{field.value.split("/").pop() || "Document URL Link"}</span>
                    <span className="text-[9px] text-muted block truncate font-medium">{field.value}</span>
                  </div>
                </div>
                <Button 
                  type="text" 
                  danger 
                  shape="circle" 
                  icon={<DeleteOutlined />} 
                  onClick={handleRemove}
                  className="shadow-sm hover:bg-red-50 hover:scale-105 transition-all flex-shrink-0"
                />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </Form.Item>
  );
};
