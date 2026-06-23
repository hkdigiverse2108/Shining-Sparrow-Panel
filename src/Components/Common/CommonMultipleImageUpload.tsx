import { type FC, useState, useMemo } from "react";
import { Form, Button, Image, Input, message } from "antd";
import { 
  DeleteOutlined, PlusOutlined, EyeOutlined, LinkOutlined, 
  CloudUploadOutlined 
} from "@ant-design/icons";
import { useField } from "formik";
import type { CommonMultipleImageUploadProps } from "@/Types";

export const CommonMultipleImageUpload: FC<CommonMultipleImageUploadProps> = ({ 
  name, 
  label = "Images", 
  required = false, 
  className = "" 
}) => {
  const [field, meta, helpers] = useField<string[]>(name);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Normalize value to an array of strings
  const value = useMemo(() => {
    const val = field.value;
    if (!val) return [""]; // default to one empty slot
    if (Array.isArray(val)) {
      return val.length === 0 ? [""] : val;
    }
    if (typeof val === "string") return [val];
    return [""];
  }, [field.value]);

  const showError = meta.touched && meta.error;

  const updateValue = (newValue: string[]) => {
    helpers.setValue(newValue);
  };

  const handleFileChangeForSlot = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = [...value];
        updated[index] = reader.result as string;
        updateValue(updated);
        message.success(`Image uploaded for Slot ${index + 1}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDropForSlot = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = [...value];
        updated[index] = reader.result as string;
        updateValue(updated);
        message.success(`Image dropped for Slot ${index + 1}`);
      };
      reader.readAsDataURL(file);
    } else {
      message.error("Please drop a valid image file.");
    }
  };

  const handleRemoveSlot = (index: number) => {
    const updated = value.filter((_, idx) => idx !== index);
    // If we filtered everything, make sure we keep at least one empty slot
    updateValue(updated.length === 0 ? [""] : updated);
  };

  const handleAddSlot = () => {
    updateValue([...value, ""]);
  };

  const handleUrlChangeForSlot = (urlVal: string, index: number) => {
    const updated = [...value];
    updated[index] = urlVal;
    updateValue(updated);
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
      <div className="flex flex-col gap-4 w-full">
        
        {/* Grid layout for slots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {value.map((imgUrl, idx) => {
            const hasImage = !!imgUrl;
            return (
              <div key={idx} className="flex flex-col gap-2 bg-surface-muted/30 p-3 rounded-2xl border border-border/80 relative">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">Image Slot {idx + 1}</span>
                  {value.length > 1 && (
                    <Button 
                      type="link" 
                      danger 
                      size="small" 
                      onClick={() => handleRemoveSlot(idx)}
                      className="p-0 h-auto text-xs"
                    >
                      Remove Slot
                    </Button>
                  )}
                </div>

                {hasImage ? (
                  /* Preview Card */
                  <div className="relative group overflow-hidden border border-border rounded-xl aspect-video bg-surface shadow-sm">
                    <img 
                      src={imgUrl} 
                      alt={`Slot ${idx + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" 
                    />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-250">
                      <Button 
                        shape="circle" 
                        icon={<EyeOutlined />} 
                        onClick={() => {
                          setPreviewImage(imgUrl);
                          setPreviewOpen(true);
                        }}
                        className="bg-white/20 border-white/40 text-white hover:bg-white/40"
                      />
                      <Button 
                        shape="circle" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => {
                          const updated = [...value];
                          updated[idx] = "";
                          updateValue(updated);
                        }}
                        className="bg-red-500/30 border-red-400/40 text-white hover:bg-red-500/80"
                      />
                    </div>
                  </div>
                ) : (
                  /* Upload Placeholder slot */
                  <div>
                    <label 
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDropForSlot(e, idx)}
                      className={`aspect-video border border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 group bg-surface ${
                        dragOverIndex === idx 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      <input 
                        type="file" 
                        onChange={(e) => handleFileChangeForSlot(e, idx)} 
                        className="hidden" 
                        accept="image/png, image/jpeg, image/webp" 
                      />
                      <div className="w-8 h-8 rounded-lg bg-surface-muted border border-border flex items-center justify-center text-muted group-hover:text-primary transition-all">
                        <CloudUploadOutlined className="text-sm" />
                      </div>
                      <span className="text-[10px] font-bold text-muted group-hover:text-primary transition-colors">Upload / Drag Image</span>
                    </label>
                  </div>
                )}
                
                {/* Paste URL for each slot */}
                <Input
                  placeholder="Or paste image URL link..."
                  value={imgUrl.startsWith("data:") ? "" : imgUrl}
                  onChange={(e) => handleUrlChangeForSlot(e.target.value, idx)}
                  prefix={<LinkOutlined className="text-muted text-xs" />}
                  allowClear
                  className="w-full h-8 text-xs rounded-lg border border-border"
                />
              </div>
            );
          })}

          {/* Add more images button card */}
          <div 
            onClick={handleAddSlot}
            className="flex flex-col items-center justify-center gap-2 bg-surface border-2 border-dashed border-border/80 hover:border-primary/50 rounded-2xl p-4 cursor-pointer hover:bg-primary/5 transition-all duration-200 min-h-[140px]"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg">
              <PlusOutlined />
            </div>
            <span className="text-xs font-bold text-foreground">Add Banner Image Slot</span>
            <span className="text-[10px] text-muted">Upload more split images for this banner</span>
          </div>
        </div>

        {/* Hidden previewer component */}
        {previewOpen && (
          <div className="hidden">
            <Image 
              src={previewImage} 
              preview={{ 
                visible: previewOpen, 
                onVisibleChange: (vis) => setPreviewOpen(vis) 
              }} 
            />
          </div>
        )}
      </div>
    </Form.Item>
  );
};
