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
  questionEn: Yup.string().required('Question (English) is required'),
  questionHi: Yup.string().nullable(),
  questionGu: Yup.string().nullable(),
  answerEn: Yup.string().required('Answer (English) is required'),
  answerHi: Yup.string().nullable(),
  answerGu: Yup.string().nullable(),
});

export const FAQForm: FC<FAQFormProps> = ({ editing, onSave, loading }) => {
  const initialValues = useMemo(() => {
    if (editing) {
      return {
        questionEn: editing.question?.en || '',
        questionHi: editing.question?.hi || '',
        questionGu: editing.question?.gu || '',
        answerEn: editing.answer?.en || '',
        answerHi: editing.answer?.hi || '',
        answerGu: editing.answer?.gu || '',
      };
    }
    return {
      questionEn: '',
      questionHi: '',
      questionGu: '',
      answerEn: '',
      answerHi: '',
      answerGu: '',
    };
  }, [editing]);

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={FAQSchema} onSubmit={onSave}>
      {() => (
        <Form className="space-y-6">
          <h2 className="text-xl font-bold mb-4">{editing ? 'Edit FAQ' : 'Add FAQ'}</h2>
          
          <CommonFormSection title="English Content">
            <CommonValidationTextField name="questionEn" label="Question (English)" required className="col-span-full" />
            <CommonValidationTextField name="answerEn" label="Answer (English)" required className="col-span-full" placeholder="Write the answer in English here..." />
          </CommonFormSection>

          <CommonFormSection title="Hindi Content (Optional)">
            <CommonValidationTextField name="questionHi" label="Question (Hindi)" className="col-span-full" />
            <CommonValidationTextField name="answerHi" label="Answer (Hindi)" className="col-span-full" placeholder="Write the answer in Hindi here..." />
          </CommonFormSection>

          <CommonFormSection title="Gujarati Content (Optional)">
            <CommonValidationTextField name="questionGu" label="Question (Gujarati)" className="col-span-full" />
            <CommonValidationTextField name="answerGu" label="Answer (Gujarati)" className="col-span-full" placeholder="Write the answer in Gujarati here..." />
          </CommonFormSection>

          <div className="mt-6">
            <CommonButton htmlType="submit" type="primary" title={editing ? 'Update FAQ' : 'Create FAQ'} loading={loading} block />
          </div>
        </Form>
      )}
    </Formik>
  );
};

