// components/Workshop/FAQForm.tsx
import { type FC, useMemo, useEffect, useRef } from 'react';
import { Formik, Form } from 'formik';
import { CommonFormShell, CommonFormSection } from '@/Components';
import { CommonButton, CommonValidationTextField, CommonValidationSelect, CommonCheckbox } from '@/Attribute';
import * as Yup from 'yup';

const FormObserver: FC<{ type: string; onChange: (prev: string, next: string) => void }> = ({ type, onChange }) => {
  const prevTypeRef = useRef<string>(type);
  useEffect(() => {
    if (prevTypeRef.current !== type) {
      onChange(prevTypeRef.current, type);
      prevTypeRef.current = type;
    }
  }, [type, onChange]);
  return null;
};

interface FAQFormProps {
  editing: any | null;
  onSave: (values: any) => void;
  onClose: () => void;
  loading: boolean;
  showTypeSelector?: boolean;
  catalogOptions?: { value: string; label: string }[];
}

const FAQSchema = Yup.object({
  questionEn: Yup.string().required('Question (English) is required'),
  questionHi: Yup.string().nullable(),
  questionGu: Yup.string().nullable(),
  answerEn: Yup.string().required('Answer (English) is required'),
  answerHi: Yup.string().nullable(),
  answerGu: Yup.string().nullable(),
  type: Yup.string().oneOf(['home', 'course', 'workshop']),
  learningCatalogId: Yup.string().nullable(),
  isFeatured: Yup.boolean(),
  isBlocked: Yup.boolean(),
});

const FAQ_TYPE_OPTIONS = [
  { label: 'Global (Home Page)', value: 'home' },
  { label: 'Course Specific', value: 'course' },
  { label: 'Workshop Specific', value: 'workshop' },
];

export const FAQForm: FC<FAQFormProps> = ({ editing, onSave, onClose, loading, showTypeSelector = false, catalogOptions = [] }) => {
  const defaults = {
    questionEn: '',
    questionHi: '',
    questionGu: '',
    answerEn: '',
    answerHi: '',
    answerGu: '',
    type: 'home',
    learningCatalogId: '',
    isFeatured: false,
    isBlocked: false,
  };

  const initialValues = useMemo(() => {
    if (editing) {
      return {
        questionEn: editing.question?.en || '',
        questionHi: editing.question?.hi || '',
        questionGu: editing.question?.gu || '',
        answerEn: editing.answer?.en || '',
        answerHi: editing.answer?.hi || '',
        answerGu: editing.answer?.gu || '',
        type: editing.type || 'home',
        learningCatalogId: typeof editing.learningCatalogId === 'object' && editing.learningCatalogId !== null
          ? editing.learningCatalogId._id
          : editing.learningCatalogId || '',
        isFeatured: editing.isFeatured || false,
        isBlocked: editing.isBlocked || false,
      };
    }
    return defaults;
  }, [editing]);

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={FAQSchema} onSubmit={onSave}>
      {({ values, setFieldValue }) => {
        const currentTypeOptions = [
          { label: 'All', value: 'all' },
          ...catalogOptions
            .filter((opt: any) => opt.type === values.type)
            .map((opt: any) => ({ label: opt.label.replace(/^(Course|Workshop):\s*/, ''), value: opt.value }))
        ];

        return (
          <CommonFormShell
            title={editing ? 'Edit FAQ' : 'Add FAQ'}
            description="Manage FAQs classification and content details."
            onClose={onClose}
            closeLabel="Cancel"
          >
            <Form className="course-form-shell">
              {/* Formik value change observer to reset catalog selection value */}
              <FormObserver
                type={values.type}
                onChange={(prevType, nextType) => {
                  if (prevType && prevType !== nextType) {
                    setFieldValue('learningCatalogId', '');
                  }
                }}
              />
              {showTypeSelector && (
                <CommonFormSection title="FAQ Classification">
                  <CommonValidationSelect
                    name="type"
                    label="FAQ Type"
                    options={FAQ_TYPE_OPTIONS}
                    required
                    fullWidth={false}
                  />

                  {values.type === 'course' && (
                    <CommonValidationSelect
                      name="learningCatalogId"
                      label="Select Course"
                      options={currentTypeOptions}
                      required
                      fullWidth={false}
                    />
                  )}

                  {values.type === 'workshop' && (
                    <CommonValidationSelect
                      name="learningCatalogId"
                      label="Select Workshop"
                      options={currentTypeOptions}
                      required
                      fullWidth={false}
                    />
                  )}
                </CommonFormSection>
              )}

            {!showTypeSelector && (editing?.isFeatured !== undefined || editing?.isBlocked !== undefined) && (
              <div className="col-span-full pt-2 flex flex-col gap-2">
                {editing?.isFeatured !== undefined && (
                  <CommonCheckbox
                    checked={values.isFeatured}
                    onChange={(e) => setFieldValue('isFeatured', e.target.checked)}
                    label="Mark as Featured (shown on homepage)"
                  />
                )}
                {editing?.isBlocked !== undefined && (
                  <CommonCheckbox
                    checked={values.isBlocked}
                    onChange={(e) => setFieldValue('isBlocked', e.target.checked)}
                    label="Block FAQ"
                  />
                )}
              </div>
            )}

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
            
            <CommonCheckbox
              checked={values.isFeatured}
              onChange={(e) => setFieldValue('isFeatured', e.target.checked)}
              label="Mark as Featured"
            />

            <div className="course-form-actions">
              <CommonButton htmlType="submit" type="primary" title={editing ? 'Update FAQ' : 'Create FAQ'} loading={loading} block className="course-button course-button--primary" />
            </div>
            </Form>
          </CommonFormShell>
        );
      }}
    </Formik>
  );
};

