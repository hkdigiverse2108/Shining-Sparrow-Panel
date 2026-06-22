import { type FC, useMemo } from 'react';
import { Formik, Form } from 'formik';
import { CommonFormSection, CommonFormShell } from '@/Components';
import { CommonButton, CommonValidationTextField } from '@/Attribute';
import * as Yup from 'yup';

interface ExamFormProps {
  editing: any | null;
  onSave: (values: any) => void;
  loading: boolean;
  lessonId: string;
}

const ExamSchema = Yup.object({
  title: Yup.string().required('Exam title is required'),
  passingMarks: Yup.number().required('Required').min(0),
  totalMarks: Yup.number().required('Required').min(1),
  timeLimit: Yup.number().required('Required in minutes').min(1),
});

export const ExamForm: FC<ExamFormProps> = ({ editing, onSave, loading, lessonId }) => {
  const defaults = { title: '', description: '', passingMarks: 0, totalMarks: 0, timeLimit: 30 };
  const initialValues = useMemo(() => (editing ? { ...defaults, ...editing } : defaults), [editing]);

  const handleSubmit = (v: any) => {
    const { _id, createdAt, updatedAt, isDeleted, isBlocked, __v, courseId, courseLessonId, ...formData } = v;

    const payload: any = {
      ...formData,
      courseLessonId: lessonId,
    };

    if (editing) {
      payload.examId = editing._id;
      if (courseId) payload.courseId = courseId?._id ?? courseId;
    }

    if (payload.questionIds && Array.isArray(payload.questionIds)) {
      payload.questionIds = payload.questionIds.map((q: any) => String(q?._id ?? q));
    }

    onSave(payload);
  };

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={ExamSchema} onSubmit={handleSubmit}>
      {() => (
        <CommonFormShell
          title={editing ? 'Edit Exam' : 'Add Exam'}
          description="Set the timing, total marks, and passing threshold for the lesson assessment."
        >
          <Form className="course-form-shell">
            <CommonFormSection title="Exam Configuration">
              <CommonValidationTextField name="title" label="Exam Title" required />
              <CommonValidationTextField name="description" label="Description" />
              <CommonValidationTextField name="timeLimit" label="Time Limit (Minutes)" type="number" required />
              <CommonValidationTextField name="totalMarks" label="Total Marks" type="number" required />
              <CommonValidationTextField name="passingMarks" label="Passing Marks" type="number" required />
            </CommonFormSection>

            <div className="course-form-actions">
              <CommonButton htmlType="submit" type="primary" title={editing ? 'Update Exam' : 'Create Exam'} loading={loading} block className="course-button course-button--primary" />
            </div>
          </Form>
        </CommonFormShell>
      )}
    </Formik>
  );
};
