// Components/Workshop/WorkshopForm.tsx
import { type FC, useMemo } from "react";
import { Formik, Form } from "formik";
import { CommonFormShell, CommonFormSection, CommonImageUpload, CommonAttachmentUpload } from "@/Components";
import { CommonButton, CommonValidationTextField, CommonRichTextEditor } from "@/Attribute";
import * as Yup from "yup";
import { Queries } from "@/Api";

export const WorkshopForm: FC<any> = ({ open, onClose, onSave, editing }) => {
  const { data: workshopResponse } = Queries.useGetWorkshops({ page: 1, limit: 1000 });
  const allWorkshops = workshopResponse?.data?.workshop_data || [];

  const WorkshopSchema = useMemo(() => {
    return Yup.object({
      title: Yup.string().required("Title is required"),
      price: Yup.number().required("Price is required").min(0),
      mrpPrice: Yup.number().required("MRP Price is required").min(0),
      about: Yup.string().optional(),
      pdfAttach: Yup.string().optional().nullable(),
      validFor: Yup.string().optional().nullable(),
      couponCode: Yup.string().optional().nullable(),
      priority: Yup.number()
        .optional()
        .min(0, "Priority must be at least 0")
        .test("unique-priority", "This priority is already assigned to another workshop", (val) => {
          if (val === undefined || val === null || val === 0) return true;
          return !allWorkshops.some((w: any) => w._id !== editing?._id && Number(w.priority) === Number(val));
        }),
    });
  }, [allWorkshops, editing]);
  const defaults = { 
    title: '', 
    subTitle: '', 
    about: '', 
    image: '', 
    pdfAttach: '', 
    price: 0, 
    mrpPrice: 0, 
    validFor: '', 
    couponCode: '', 
    language: '', 
    duration: '',
    priority: 0,
  };
  
  const initialValues = useMemo(() => (editing ? { 
    ...defaults, 
    ...editing,
    pdfAttach: editing.pdfAttach ?? '',
    validFor: editing.validFor ?? '',
    couponCode: editing.couponCode ?? '',
    priority: editing.priority ?? 0,
  } : defaults), [editing]);

  if (!open) return null;

  const handleSubmit = (v: any) => {
    const payload: any = {
      title: v.title,
      subTitle: v.subTitle,
      about: v.about,
      image: v.image,
      pdfAttach: v.pdfAttach || null,
      price: Number(v.price),
      mrpPrice: Number(v.mrpPrice),
      validFor: v.validFor || null,
      couponCode: v.couponCode || null,
      language: v.language,
      duration: v.duration,
      priority: Number(v.priority || 0),
    };
    if (editing) payload.workshopId = editing._id;
    onSave(payload);
  };

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={WorkshopSchema} onSubmit={handleSubmit}>
      {() => (
        <CommonFormShell title={editing ? "Edit Workshop" : "Add Workshop"} description="Use a single, plain form to create or update workshop details." onClose={onClose} closeLabel="Cancel">
          <Form className="course-form-shell">
            <CommonFormSection title="Workshop Details">
              <CommonValidationTextField name="title" label="Title" required />
              <CommonValidationTextField name="subTitle" label="Subtitle" />
              <CommonValidationTextField name="language" label="Language" />
              <CommonValidationTextField name="duration" label="Duration (in Minutes)" />
              <CommonRichTextEditor name="about" label="About Workshop" className="col-span-full" />       
            <CommonImageUpload name="image" label="Workshop Banner" shape="square" size={120} className="col-span-full" />
              <CommonAttachmentUpload name="pdfAttach" label="Workshop Material (PDF)" className="col-span-full" />
            </CommonFormSection>
            
            <CommonFormSection title="Pricing & Access">
              <CommonValidationTextField name="price" label="Selling Price (₹)" type="number" required />
              <CommonValidationTextField name="mrpPrice" label="MRP Price (₹)" type="number" required />
              <CommonValidationTextField name="validFor" label="Access Validity (e.g. 30 Days)" />
              <CommonValidationTextField name="couponCode" label="Coupon Code" />
              <CommonValidationTextField name="priority" label="Priority / Order" type="number" placeholder="e.g. 1" />
            </CommonFormSection>
            

            <div className="course-form-actions">
              <CommonButton htmlType="submit" type="primary" title={editing ? "Update Workshop" : "Create Workshop"} block className="course-button course-button--primary" />
            </div>
          </Form>
        </CommonFormShell>
      )}
    </Formik>
  );
};