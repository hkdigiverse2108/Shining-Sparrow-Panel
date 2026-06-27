import { type FC, useMemo } from "react";
import { Formik, Form } from "formik";
import { CommonFormShell, CommonFormSection, CommonMultipleImageUpload } from "@/Components";
import { CommonButton, CommonValidationTextField, CommonValidationSelect, CommonRichTextEditor } from "@/Attribute";
import * as Yup from "yup";

interface HeroBannerFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
  editing: any | null;
  loading?: boolean;
}

const HeroBannerSchema = Yup.object({
  type: Yup.string().required("Banner type is required"),
  title: Yup.string().optional(),
  description: Yup.string().optional(),
  isBlocked: Yup.boolean().optional(),
});

const bannerTypes = [
  { label: "Web Banner", value: "web" },
  { label: "App Banner", value: "app" },
];

export const HeroBannerForm: FC<HeroBannerFormProps> = ({ open, onClose, onSave, editing, loading = false }) => {
  const defaults = {
    type: "web", title: "", description: "", 
    images: ["", ""], link: "", image: "", isBlocked: false,
  };

  const initialValues = useMemo(() => {
    if (editing) {
      const images = [...(editing.images || [])];
      // Migrating old single image if images array is empty
      if (images.length === 0 && editing.image) {
        images.push(editing.image);
      }
      while (images.length < 2) images.push("");
      return { ...defaults, ...editing, images };
    }
    return defaults;
  }, [editing]);

  if (!open) return null;

  const handleSubmit = (v: any) => {
    const payload: any = {
      type: v.type,
      title: v.title || "",
      description: v.description || "",
      images: v.images || [],
      isBlocked: v.isBlocked || false,
    };

    if (v.type === "app") {
      payload.link = v.link || "";
      // Set single image fallback for app-side backwards compatibility
      payload.image = v.images?.[0] || "";
    }

    if (editing) {
      payload.heroBannerId = editing._id;
    }
    onSave(payload);
  };

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={HeroBannerSchema} onSubmit={handleSubmit}>
      {({ setFieldValue, values }) => (
        <CommonFormShell
          title={editing ? "Edit Hero Banner" : "Add Hero Banner"}
          description="Configure marketing hero banners for web or app channels."
          onClose={onClose}
          closeLabel="Cancel"
        >
          <Form className="course-form-shell space-y-6">
            <CommonFormSection title="Banner Classification">
              <CommonValidationSelect 
                name="type" 
                label="Target Platform Type" 
                options={bannerTypes} 
                required 
                fullWidth 
                // onChange={(val) => {
                //   setFieldValue("type", val);
                // }}
              />
              <CommonValidationTextField name="title" label="Banner Title" />
              
              
              <div className="col-span-full mb-4">
                <CommonRichTextEditor
                  name="description"
                  label="Banner Description"
                  onChange={(val) => setFieldValue('description', val)}
                  value={values.description}
                  className="w-full"
                />
              </div>
            </CommonFormSection>

            {values.type === "web" ? (
              <CommonFormSection title="Web Banner Media (Upload Multiple Images)">
                <CommonMultipleImageUpload 
                  name="images" 
                  label="Web Banner Images" 
                  className="col-span-full" 
                />
              </CommonFormSection>
            ) : (
              <CommonFormSection title="App Banner Media & Action">
                <CommonMultipleImageUpload 
                  name="images" 
                  label="App Banner Images" 
                  className="col-span-full" 
                />
                <CommonValidationTextField name="link" label="Redirect Link URL" className="col-span-full" />
              </CommonFormSection>
            )}



            <div className="course-form-actions">
              <CommonButton 
                htmlType="submit" 
                type="primary" 
                title={editing ? "Update Banner" : "Publish Banner"} 
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
