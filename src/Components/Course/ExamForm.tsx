import { type FC, useMemo } from 'react';
import { Formik, Form } from 'formik';
import { CommonFormSection, CommonFormShell, CommonPrioritySelect } from '@/Components';
import { CommonButton, CommonValidationTextField } from '@/Attribute';
import { ExamSchema } from '@/Utils';

interface ExamFormProps {
  editing: any | null;
  onSave: (values: any) => void;
  loading: boolean;
  lessonId: string;
  existingPriorities?: number[];
}

export const ExamForm: FC<ExamFormProps> = ({ editing, onSave, loading, lessonId, existingPriorities }) => {
  const defaults = { title: '', description: '', passingMarks: '', totalMarks: '', timeLimit: '', priority: '' };
  const initialValues = useMemo(() => (editing ? { 
    ...defaults, 
    ...editing,
    passingMarks: editing.passingMarks ?? '',
    totalMarks: editing.totalMarks ?? '',
    timeLimit: editing.timeLimit ?? '',
    priority: editing.priority ?? '',
  } : defaults), [editing]);

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
      {({ values }) => (
        <CommonFormShell
          title={editing ? 'Edit Exam' : 'Add Exam'}
          description="Set the timing, total marks, and passing threshold for the lesson exam."
        >
          <Form className="course-form-shell">
            <CommonFormSection title="Exam Configuration">
              <CommonValidationTextField name="title" label="Exam Title" required />
              <CommonValidationTextField name="description" label="Description" />
              <CommonValidationTextField name="timeLimit" label="Time Limit (Minutes)" type="number" required />
              <CommonValidationTextField name="totalMarks" label="Total Marks" type="number" required />
              <CommonValidationTextField name="passingMarks" label="Passing Marks" type="number" required />
              <CommonPrioritySelect
                name="priority"
                label="Priority"
                required
                usedPriorities={existingPriorities || []}
                editingId={editing?._id}
                editingPriority={editing?.priority}
              />
            </CommonFormSection>

            {values.passingMarks !== undefined && values.totalMarks !== undefined && Number(values.passingMarks) > Number(values.totalMarks) && (
              <div className="mb-4 p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-lg flex items-start gap-2.5 text-amber-600 dark:text-amber-400">
                <span className="text-sm font-semibold leading-relaxed">
                  ⚠️ Warning: Passing marks ({values.passingMarks}) cannot be greater than total marks ({values.totalMarks}). Please check this configuration before saving.
                </span>
              </div>
            )}

            <div className="course-form-actions">
              <CommonButton htmlType="submit" type="primary" title={editing ? 'Update Exam' : 'Create Exam'} loading={loading} block className="course-button course-button--primary" />
            </div>
          </Form>
        </CommonFormShell>
      )}
    </Formik>
  );
};
