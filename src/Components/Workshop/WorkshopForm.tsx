// Components/Workshop/WorkshopForm.tsx
import { type FC, useMemo } from "react";
import { Formik, Form } from "formik";
import { CommonFormShell, CommonFormSection, CommonImageUpload } from "@/Components";
import { CommonButton, CommonValidationTextField, CommonRichTextEditor } from "@/Attribute";
import * as Yup from "yup";

const WorkshopSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  price: Yup.number().required("Price is required").min(0),
  mrpPrice: Yup.number().required("MRP Price is required").min(0),
});

export const WorkshopForm: FC<any> = ({ open, onClose, onSave, editing }) => {
  const defaults = { title: '', subTitle: '', about: '', image: '', pdfAttach: '', price: 0, mrpPrice: 0, validFor: '', couponCode: '', language: '', duration: '' };
  const initialValues = useMemo(() => (editing ? { ...defaults, ...editing } : defaults), [editing]);

  if (!open) return null;

  const handleSubmit = (v: any) => {
    const payload: any = {
      title: v.title,
      subTitle: v.subTitle,
      about: v.about,
      image: v.image,
      pdfAttach: v.pdfAttach,
      price: Number(v.price),
      mrpPrice: Number(v.mrpPrice),
      validFor: v.validFor,
      couponCode: v.couponCode,
      language: v.language,
      duration: v.duration,
    };
    if (editing) payload.workshopId = editing._id;
    onSave(payload);
  };

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={WorkshopSchema} onSubmit={handleSubmit}>
      {({ errors }) => (
        <CommonFormShell title={editing ? "Edit Workshop" : "Add Workshop"} description="Use a single, plain form to create or update workshop details." onClose={onClose} closeLabel="Cancel">
          <Form className="course-form-shell">
            <CommonFormSection title="Workshop Details">
              <CommonImageUpload name="image" label="Workshop Banner" shape="square" size={120} className="col-span-full" />
              <CommonValidationTextField name="title" label="Title" required />
              <CommonValidationTextField name="subTitle" label="Subtitle" />
              <CommonValidationTextField name="about" label="About Workshop" multiline rows={4} className="col-span-full" />
              <CommonValidationTextField name="language" label="Language" />
              <CommonValidationTextField name="duration" label="Duration (e.g. 2 Hours)" />
            </CommonFormSection>
            <CommonFormSection title="Pricing & Access">
              <CommonValidationTextField name="price" label="Selling Price (₹)" type="number" required />
              <CommonValidationTextField name="mrpPrice" label="MRP Price (₹)" type="number" required />
              <CommonValidationTextField name="validFor" label="Access Validity (e.g. 30 Days)" />
              <CommonValidationTextField name="couponCode" label="Coupon Code" />
            </CommonFormSection>
            {Object.keys(errors).length > 0 && ( <div className="course-form-error"><strong>Validation errors:</strong><ul className="course-form-error-list">{Object.entries(errors).map(([k, v]) => <li key={k}>{k}: {String(v)}</li>)}</ul></div> )}
            <div className="course-form-actions">
              <CommonButton htmlType="submit" type="primary" title={editing ? "Update Workshop" : "Create Workshop"} block className="course-button course-button--primary" />
            </div>
          </Form>
        </CommonFormShell>
      )}
    </Formik>
  );
};