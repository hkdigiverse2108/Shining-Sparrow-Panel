import { type FC, useMemo } from "react";
import { Formik, Form } from "formik";
import { CommonFormShell, CommonFormSection, CommonImageUpload } from "@/Components";
import { CommonButton, CommonValidationTextField, CommonValidationSelect, CommonRichTextEditor } from "@/Attribute";
import { Queries } from "@/Api";
import * as Yup from "yup";
import type { CourseHandlerProps } from "@/Types";

const CourseSchema = Yup.object({
  name: Yup.string().required("Course Name is required"),
  description: Yup.string().optional(),
  price: Yup.number().required("Price is required").min(0),
  mrpPrice: Yup.number().required("MRP Price is required").min(0),
  duration: Yup.number().optional(),
  courseCurriculumIds: Yup.array(Yup.string()).optional(),
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
  };

  const initialValues = useMemo(() => (editing ? {
    ...defaults,
    ...editing,
    courseCurriculumIds: (editing.courseCurriculumIds || []).map((sub: any) => typeof sub === 'object' ? sub._id : sub),
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
      language: v.language,
      image: v.image,
      duration: Number(v.duration),
      courseCurriculumIds: v.courseCurriculumIds,
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
              <CommonImageUpload name="image" label="Course Thumbnail" shape="square" size={120} className="col-span-full" />
              <CommonValidationTextField name="name" label="Course Name" required />
              <CommonValidationTextField name="price" label="Price (₹)" type="number" required />
              <CommonRichTextEditor name="description" label="Description" className="col-span-full" />
              <CommonValidationTextField name="mrpPrice" label="MRP Price (₹)" type="number" required />
              <CommonValidationTextField name="duration" label="Duration (Hours)" type="number" />
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
