// components/Blog/BlogForm.tsx
import { type FC, useMemo } from "react";
import { Formik, Form } from "formik";
import { CommonFormShell, CommonFormSection, CommonImageUpload } from "@/Components";
import { CommonButton, CommonValidationTextField, CommonRichTextEditor, CommonValidationSelect } from "@/Attribute"; // Ensure you have a CommonSwitch or use Ant's Switch
import * as Yup from "yup";
import { Switch } from "antd";

interface BlogFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
  editing: any | null;
  loading?: boolean;
}

const BlogSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  content: Yup.string().required("Content is required"),
  category: Yup.string().required("Category is required"),
});

const blogCategories = [
  { label: "Technology", value: "Technology" },
  { label: "Education", value: "Education" },
  { label: "Lifestyle", value: "Lifestyle" },
  { label: "Health", value: "Health" },
  { label: "Business", value: "Business" },
  { label: "Other", value: "Other" },
];

export const BlogForm: FC<BlogFormProps> = ({ open, onClose, onSave, editing, loading = false }) => {
  const defaults = {
    title: "", subTitle: "", content: "", category: "", 
    coverImage: "", mainImage: "", author: "", quote: "", isFeatured: false,
  };

  const initialValues = useMemo(() => (editing ? { ...defaults, ...editing } : defaults), [editing]);

  if (!open) return null;

  const handleSubmit = (v: any) => {
    const payload: any = {
      title: v.title,
      subTitle: v.subTitle,
      content: v.content,
      category: v.category,
      coverImage: v.coverImage,
      mainImage: v.mainImage,
      author: v.author,
      quote: v.quote,
      isFeatured: v.isFeatured,
    };
    if (editing) {
      payload.blogId = editing._id;
    }
    onSave(payload);
  };

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={BlogSchema} onSubmit={handleSubmit}>
      {({ errors, setFieldValue, values }) => (
        <CommonFormShell
          title={editing ? "Edit Blog" : "Add Blog"}
          description="Compose and format blog posts. Use the rich text editor for detailed content."
          onClose={onClose}
          closeLabel="Cancel"
        >
          <Form className="course-form-shell">
            <CommonFormSection title="Blog Details">
              <CommonImageUpload name="coverImage" label="Cover Image" shape="square" size={120} className="col-span-full" />
              <CommonValidationTextField name="title" label="Blog Title" required />
              <CommonValidationTextField name="subTitle" label="Subtitle" />
              <CommonValidationSelect name="category" label="Category" options={blogCategories} required fullWidth />
              <CommonValidationTextField name="author" label="Author Name" />
              <CommonValidationTextField name="quote" label="Quote / Highlight" className="col-span-full" />
            </CommonFormSection>

            <CommonFormSection title="Content & Images">
              <CommonRichTextEditor 
                name="content" 
                label="Blog Content" 
                required 
                value={values.content} 
                onChange={(val) => setFieldValue('content', val)} 
                className="col-span-full" 
              />
              <CommonImageUpload name="mainImage" label="Main Body Image" shape="square" size={120} className="col-span-full" />
              
              {/* Assuming you have a Switch component. If not, you can use Ant Design's Switch directly with setFieldValue */}
              <div className="col-span-2 flex items-center gap-3 mt-2">
                <span className="text-sm font-medium text-gray-700">Featured Blog:</span>
                <Switch
                  // name="isFeatured" 
                  checked={values.isFeatured} 
                  onChange={(val: any) => setFieldValue('isFeatured', val)} 
                />
              </div>
            </CommonFormSection>

            {Object.keys(errors).length > 0 && (
              <div className="course-form-error">
                <strong>Cannot submit because of validation errors:</strong>
                <ul className="course-form-error-list">
                  {Object.entries(errors).map(([key, value]) => (
                    <li key={key}>{key}: {String(value)}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="course-form-actions">
              <CommonButton 
                htmlType="submit" 
                type="primary" 
                title={editing ? "Update Blog" : "Publish Blog"} 
                loading={loading}
                block 
                className="course-button course-button--primary" 
              />
            </div>
          </Form>
        </CommonFormShell>
      )}
    </Formik>
  );
};