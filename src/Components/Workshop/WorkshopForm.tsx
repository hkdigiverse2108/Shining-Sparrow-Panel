// Components/Workshop/WorkshopForm.tsx
import { type FC, useMemo } from "react";
import { Formik, Form } from "formik";
import { CommonFormShell, CommonFormSection, CommonImageUpload, CommonAttachmentUpload, CommonPrioritySelect } from "@/Components";
import { CommonButton, CommonValidationTextField, CommonRichTextEditor } from "@/Attribute";
import { WorkshopSchema } from "@/Utils";
import { Queries } from "@/Api";

export const WorkshopForm: FC<any> = ({ open, onClose, onSave, editing }) => {
  const { data: workshopResponse } = Queries.useGetWorkshops({ page: 1, limit: 1000 });
  const allWorkshops = workshopResponse?.data?.workshop_data || [];

  const validationSchema = useMemo(() => {
    return WorkshopSchema.shape({
      priority: (WorkshopSchema.fields.priority as any).test(
        "unique-priority",
        "This priority is already assigned to another workshop",
        (val: any) => {
          if (val === undefined || val === null || val === '') return true;
          return !allWorkshops.some((w: any) => w._id !== editing?._id && Number(w.priority) === Number(val));
        }
      )
    });
  }, [allWorkshops, editing]);

  const defaults = { 
    title: '', 
    subTitle: '', 
    about: '', 
    image: '', 
    pdfAttach: '', 
    price: '', 
    mrpPrice: '', 
    validFor: '', 
    couponCode: '', 
    language: '', 
    duration: '',
    priority: '',
  };
  
  const initialValues = useMemo(() => (editing ? { 
    ...defaults, 
    ...editing,
    price: editing.price ?? '',
    mrpPrice: editing.mrpPrice ?? '',
    pdfAttach: editing.pdfAttach ?? '',
    validFor: editing.validFor ?? '',
    couponCode: editing.couponCode ?? '',
    priority: editing.priority ?? '',
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
    <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {() => (
        <CommonFormShell title={editing ? "Edit Workshop" : "Add Workshop"} description="Use a single, plain form to create or update workshop details." onClose={onClose} closeLabel="Cancel">
          <Form className="course-form-shell">
            <CommonFormSection title="Workshop Details">
              <CommonValidationTextField name="title" label="Title" required />
              <CommonValidationTextField name="subTitle" label="Subtitle" required />
              <CommonValidationTextField name="language" label="Language" required />
              <CommonValidationTextField name="duration" label="Duration (Hours)" required />
              <CommonRichTextEditor name="about" label="About Workshop" required className="col-span-full" />       
              <CommonImageUpload name="image" label="Workshop Banner" shape="square" size={120} required className="col-span-full" />
              <CommonAttachmentUpload name="pdfAttach" label="Workshop Material (PDF)" className="col-span-full" />
            </CommonFormSection>
            
            <CommonFormSection title="Pricing & Access">
              <CommonValidationTextField name="price" label="Selling Price (₹)" type="number" />
              <CommonValidationTextField name="mrpPrice" label="MRP Price (₹)" type="number" required />
              <CommonValidationTextField name="validFor" label="Access Validity (e.g. 30 Days)" required />
              <CommonValidationTextField name="couponCode" label="Coupon Code" />
              <CommonPrioritySelect
                name="priority"
                label="Priority / Order"
                required
                usedPriorities={allWorkshops.map((w: any) => Number(w.priority))}
                editingId={editing?._id}
                editingPriority={editing?.priority}
              />
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