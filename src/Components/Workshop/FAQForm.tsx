// components/Workshop/FAQForm.tsx
import { type FC, useMemo } from 'react';
import { Formik, Form } from 'formik';
import { CommonFormSection } from '@/Components';
import { CommonButton, CommonValidationTextField } from '@/Attribute';
import * as Yup from 'yup';

interface FAQFormProps {
  editing: any | null;
  onSave: (values: any) => void;
  loading: boolean;
}

const FAQSchema = Yup.object({
  questionEn: Yup.string().required('Question is required'),
  answerEn: Yup.string().required('Answer is required'),
});

export const FAQForm: FC<FAQFormProps> = ({ editing, onSave, loading }) => {
  const initialValues = useMemo(() => {
    if (editing) {
      return {
        questionEn: editing.question?.en || '',
        answerEn: editing.answer?.en || '',
      };
    }
    return { questionEn: '', answerEn: '' };
  }, [editing]);

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={FAQSchema} onSubmit={onSave}>
      {() => (
        <Form className="space-y-6">
          <h2 className="text-xl font-bold mb-4">{editing ? 'Edit FAQ' : 'Add FAQ'}</h2>
          <CommonFormSection title="FAQ Content">
            <CommonValidationTextField name="questionEn" label="Question (English)" required className="col-span-full" />
            <CommonValidationTextField name="answerEn" label="Answer (English)" required className="col-span-full" placeholder="Write the answer here..." />
          </CommonFormSection>
          <div className="mt-6">
            <CommonButton htmlType="submit" type="primary" title={editing ? 'Update FAQ' : 'Create FAQ'} loading={loading} block />
          </div>
        </Form>
      )}
    </Formik>
  );
};
