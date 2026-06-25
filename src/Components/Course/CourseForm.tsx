import { type FC, useMemo } from "react";
import { Formik, Form } from "formik";
import { CommonFormShell, CommonFormSection, CommonAttachmentUpload, CommonVideoUpload, CommonImageUpload } from "@/Components";
import { CommonButton, CommonValidationTextField, CommonValidationSelect, CommonRichTextEditor } from "@/Attribute";
import { Queries } from "@/Api";
import * as Yup from "yup";
import type { CourseHandlerProps } from "@/Types";

const CourseSchema = Yup.object({
  name: Yup.string().required("Course Name is required"),
  description: Yup.string().optional(),
  price: Yup.number().required("Main Price is required").min(0),
  mrpPrice: Yup.number().required("Price after Discount is required").min(0),
  duration: Yup.number().optional().min(0, "Duration must be positive"),
  accessDurationDays: Yup.number().optional().nullable().min(0, "Access duration must be positive"),
  language: Yup.string().optional().nullable(),
  pdf: Yup.string().optional().nullable(),
  courseCurriculumIds: Yup.array(Yup.string()).optional(),
  trailerUrl: Yup.string().url("Must be a valid URL").nullable().optional(),
  isBlocked: Yup.boolean().optional(),
});

export const CourseForm: FC<CourseHandlerProps> = ({ open, onClose, onSave, editing }) => {
  const defaults = {
    name: "",
    description: "",
    price: 0,
    mrpPrice: 0,
    language: "",
    image: "",
    duration: 0,
    courseCurriculumIds: [] as string[],
    isBlocked: false,
    accessDurationDays: "",
    trailerUrl: "",
    pdf: "",
  };

  const initialValues = useMemo(() => (editing ? {
    ...defaults,
    ...editing,
    courseCurriculumIds: (editing.courseCurriculumIds || []).map((sub: any) => typeof sub === 'object' ? sub._id : sub),
    accessDurationDays: editing.accessDurationDays ?? "",
    trailerUrl: editing.trailerUrl ?? "",
    pdf: editing.pdf ?? "",
  } : defaults), [editing]);

  const { data: courseResponse } = Queries.useGetCourses({ page: 1, limit: 1000 });
  const allCourses = courseResponse?.data?.course_data || [];

  const courseOptions = useMemo(() => {
    return allCourses
      .filter((c: any) => c._id !== editing?._id)
      .map((c: any) => ({ label: c.name, value: c._id }));
  }, [allCourses, editing]);

  const handleSubmit = (v: any) => {
    const payload: any = {
      name: v.name,
      description: v.description,
      price: Number(v.price),
      mrpPrice: Number(v.mrpPrice),
      language: v.language || null,
      image: v.image,
      duration: Number(v.duration),
      courseCurriculumIds: v.courseCurriculumIds,
      isBlocked: !!v.isBlocked,
      accessDurationDays: v.accessDurationDays ? Number(v.accessDurationDays) : null,
      trailerUrl: v.trailerUrl || null,
      pdf: v.pdf || null,
    };

    if (editing) {
      payload.courseId = editing._id;
    }

    onSave(payload);
  };

  if (!open) return null;

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={CourseSchema} onSubmit={handleSubmit}>
      {({ errors }) => (
        <CommonFormShell
          title={editing ? "Edit Course" : "Add Course"}
          description="Use a single, plain form to create or update course details."
          onClose={onClose}
          closeLabel="Cancel"
        >
          <Form className="course-form-shell">
            <CommonFormSection title="Course Details">
              <CommonValidationTextField name="name" label="Course Name" required />
              <CommonValidationTextField name="price" label="Main Price (₹)" type="number" required placeholder="Enter main price" />
              <CommonValidationTextField name="mrpPrice" label="Price after Discount (₹)" type="number" required placeholder="Enter price after discount" />
              
              <CommonValidationTextField name="language" label="Course Language" placeholder="e.g. English, Hindi" />
              <CommonValidationTextField name="duration" label="Course Duration (in Hours)" type="number" placeholder="e.g. 40" />
              <CommonValidationTextField name="accessDurationDays" label="Access Duration (in Days)" type="number" placeholder="e.g. 365" />
              
              <CommonImageUpload name="image" label="Course Thumbnail Image" shape="square" size={160} className="col-span-full" />
              
              <CommonRichTextEditor name="description" label="Description" className="col-span-full" />
              <CommonVideoUpload name="trailerUrl" label="Trailer Video" className="col-span-full" />
              
              <CommonAttachmentUpload name="pdf" label="Course Attachment (PDF)" className="col-span-full" />
              
              
              <CommonValidationSelect
                name="courseCurriculumIds"
                label="Bundle Courses (Included free)"
                multiple
                options={courseOptions}
                fullWidth
                maxTagCount={3}
                placeholder="Select courses to include in this bundle"
              />
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
              <CommonButton htmlType="submit" type="primary" title={editing ? "Update Course" : "Create Course"} block className="course-button course-button--primary" />
            </div>
          </Form>
        </CommonFormShell>
      )}
    </Formik>
  );
};
