import { type FC, useMemo, useState, useRef, useEffect } from 'react';
import { Formik, Form, useFormikContext } from 'formik';
import { CommonFormSection, CommonFormShell, CommonImageUpload } from '@/Components';
import { CommonButton, CommonValidationTextField, CommonValidationSelect } from '@/Attribute';
import { Segmented, Button, Progress, message, Input } from 'antd';
import { SoundOutlined, UploadOutlined } from '@ant-design/icons';
import * as Yup from 'yup';

interface QuestionFormProps {
  editing: any | null;
  onSave: (values: any) => void;
  loading: boolean;
  examId: string;
}

const QuestionSchema = Yup.object({
  questionText: Yup.string().required('Question text is required'),
  questionType: Yup.string().required('Type is required'),
  correctAnswer: Yup.string().required('Correct answer is required'),
  score: Yup.number().required('Required').min(0),
  priority: Yup.number().optional().min(0, 'Priority must be non-negative'),
});

// A Formik side-effect observer to keep the calculation steps, questionText, and correctAnswer in sync
const QuestionFormObserver: FC = () => {
  const { values, setFieldValue } = useFormikContext<any>();
  const lastStepsRef = useRef<string[]>([]);
  const lastTypeRef = useRef(values.questionType);

  // Sync calculationSteps when questionType changes to calculation
  useEffect(() => {
    if (values.questionType !== lastTypeRef.current) {
      lastTypeRef.current = values.questionType;
      if (values.questionType === 'calculation') {
        const steps = values.questionText ? values.questionText.split(' ').filter(Boolean) : [''];
        setFieldValue('calculationSteps', steps.length ? steps : ['']);
      }
    }
  }, [values.questionType, values.questionText, setFieldValue]);

  // Sync questionText from steps in real-time
  useEffect(() => {
    if (values.questionType === 'calculation' && values.calculationSteps) {
      const stepsStr = JSON.stringify(values.calculationSteps);
      if (stepsStr !== JSON.stringify(lastStepsRef.current)) {
        lastStepsRef.current = values.calculationSteps;
        
        // Join steps with space for questionText
        const joined = values.calculationSteps.join(' ');
        if (values.questionText !== joined) {
          setFieldValue('questionText', joined);
        }
      }
    }
  }, [values.calculationSteps, values.questionType, values.questionText, setFieldValue]);

  return null;
};

export const QuestionForm: FC<QuestionFormProps> = ({ editing, onSave, loading }) => {
  const defaults = { 
    questionText: '', 
    questionType: 'calculation', 
    correctAnswer: '', 
    score: 1,
    priority: 0,
    calculationSteps: [''],
    questionImage: '',
    questionAudio: ''
  };

  const initialValues = useMemo(() => {
    if (editing) {
      const steps = editing.questionType === 'calculation' && editing.questionText 
        ? editing.questionText.split(' ').filter(Boolean) 
        : [''];
      return { 
        ...defaults, 
        ...editing,
        calculationSteps: steps.length ? steps : ['']
      };
    }
    return defaults;
  }, [editing]);

  // Audio upload state management
  const initialAudioMode = useMemo(() => {
    if (editing?.questionAudio && editing.questionAudio.startsWith('http')) {
      return 'url';
    }
    return 'upload';
  }, [editing]);

  const [audioMode, setAudioMode] = useState<'upload' | 'url'>(initialAudioMode);
  const [audioUploading, setAudioUploading] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioUploading(true);
      setAudioProgress(0);
      
      const reader = new FileReader();
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setAudioProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setAudioUploading(false);
          reader.onloadend = () => {
            setFieldValue('questionAudio', reader.result as string);
            message.success('Audio file loaded successfully!');
          };
          reader.readAsDataURL(file);
        }
      }, 100);
    }
  };

  const handleSubmit = (v: any) => {
    if (v.questionType === 'image' && !v.questionImage) {
      message.error('Please upload an image for the question.');
      return;
    }
    if (v.questionType === 'audio' && !v.questionAudio) {
      message.error('Please upload or provide an audio URL for the question.');
      return;
    }

    // Construct the payload by copying only the keys allowed by the backend Joi schema
    const payload: any = {
      questionText: v.questionText,
      questionType: v.questionType,
      correctAnswer: v.correctAnswer,
      score: Number(v.score),
      priority: v.priority !== undefined && v.priority !== '' ? Number(v.priority) : 0,
    };
    
    if (v.questionType === 'image') {
      payload.questionImage = v.questionImage;
    }
    if (v.questionType === 'audio') {
      payload.questionAudio = v.questionAudio;
    }

    if (editing) {
      payload.questionId = editing._id;
    }

    onSave(payload);
  };

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={QuestionSchema} onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => (
        <CommonFormShell
          title={editing ? 'Edit Question' : 'Add Question'}
          description="Capture the prompt, answer, and question type in one consistent form."
        >
          <Form className="course-form-shell animate-fade-in">
            <QuestionFormObserver />

            <CommonFormSection title="Question Details">
              {/* Question Type Selection */}
              <CommonValidationSelect
                name="questionType"
                label="Question Type"
                required
                options={[
                  { label: 'Calculation', value: 'calculation' },
                  { label: 'Text', value: 'text' },
                  { label: 'Image', value: 'image' },
                  { label: 'Audio', value: 'audio' },
                ]}
              />

              {/* Score Input */}
              <CommonValidationTextField name="score" label="Score / Marks" type="number" required />

              {/* Priority Input */}
              <CommonValidationTextField name="priority" label="Priority / Order" type="number" />

              {/* Standard text question field (Hidden for calculation since it has its own builder) */}
              {values.questionType !== 'calculation' && (
                <div className="col-span-2">
                  <CommonValidationTextField 
                    name="questionText" 
                    label="Question Prompt / Text" 
                    required 
                    placeholder="Enter the question text or prompt here..."
                  />
                </div>
              )}

              {/* Dynamic Calculation Steps builder */}
              {values.questionType === 'calculation' && (
                <div className="col-span-2 mb-4 animate-fade-in">
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">
                    Calculation Steps
                  </label>
                  <div className="p-5 bg-gray-50/50 border border-gray-150 rounded-xl space-y-4 shadow-sm">
                    <div className="flex flex-wrap items-center gap-3">
                      {values.calculationSteps.map((step: string, index: number) => (
                        <div key={index} className="flex items-center gap-1.5 bg-white p-2 border border-gray-200 rounded-xl shadow-sm hover:border-indigo-300 transition-all">
                          <input
                            type="text"
                            value={step}
                            placeholder={`Box ${index + 1}`}
                            onChange={(e) => {
                              const newSteps = [...values.calculationSteps];
                              newSteps[index] = e.target.value;
                              setFieldValue('calculationSteps', newSteps);
                            }}
                            className="w-16 h-8 text-center text-sm font-semibold border-0 focus:outline-none focus:ring-0 p-0 text-indigo-700"
                          />
                          {values.calculationSteps.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newSteps = values.calculationSteps.filter((_: any, i: any) => i !== index);
                                setFieldValue('calculationSteps', newSteps);
                              }}
                              className="text-red-400 hover:text-red-600 p-0.5 text-xs font-bold font-sans transition-colors animate-fade-in"
                              title="Remove step"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const newSteps = [...values.calculationSteps, ''];
                          setFieldValue('calculationSteps', newSteps);
                        }}
                        className="flex items-center justify-center w-12 h-12 border border-dashed border-indigo-400 text-indigo-600 hover:border-indigo-650 hover:text-indigo-800 hover:bg-indigo-50/50 rounded-xl text-xl font-bold bg-white transition-all shadow-sm"
                        title="Add step"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-xs text-gray-500 bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between shadow-xs">
                      <div>
                        <span className="font-semibold text-gray-700 block text-xs uppercase tracking-wider text-muted mb-1">Generated Calculation String</span>
                        <span className="font-mono text-indigo-600 text-base font-bold bg-indigo-50/50 border border-indigo-100 px-3 py-1 rounded-lg inline-block mt-0.5">
                          {values.questionText || "(Empty)"}
                        </span>
                      </div>
                      <span className="text-muted text-[10px] uppercase font-bold tracking-wider">Auto-spaced</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Conditionally Render Image Upload Component */}
              {values.questionType === 'image' && (
                <CommonImageUpload 
                  name="questionImage" 
                  label="Question Image" 
                  shape="square" 
                  size={120} 
                  className="col-span-full mb-4 animate-fade-in" 
                />
              )}

              {/* Conditionally Render Audio Upload Component */}
              {values.questionType === 'audio' && (
                <div className="col-span-2 mb-4 animate-fade-in">
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">
                    Question Audio Resource
                  </label>
                  <div className="flex flex-col gap-3 p-4 bg-gray-50/50 border border-gray-150 rounded-xl">
                    <Segmented
                      options={[
                        { label: 'Upload Audio File', value: 'upload' },
                        { label: 'Audio URL Link', value: 'url' }
                      ]}
                      value={audioMode}
                      onChange={(val) => setAudioMode(val as 'url' | 'upload')}
                      className="w-fit"
                    />
                    
                    <input 
                      type="file" 
                      ref={audioFileInputRef} 
                      onChange={(e) => handleAudioFileChange(e, setFieldValue)} 
                      className="hidden" 
                      accept="audio/*" 
                    />

                    {audioMode === 'upload' ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Button 
                            icon={<UploadOutlined />} 
                            loading={audioUploading} 
                            onClick={() => audioFileInputRef.current?.click()}
                            className="rounded-lg h-10 border-gray-200"
                          >
                            Select Audio File
                          </Button>
                          <span className="text-xs text-gray-400">Supports MP3, WAV, OGG, etc.</span>
                        </div>

                        {audioUploading && (
                          <div className="w-full max-w-md bg-white p-3 border border-gray-150 rounded-lg">
                            <span className="text-xs font-medium text-gray-700 block mb-1">Uploading Audio...</span>
                            <Progress percent={audioProgress} size="small" status="active" />
                          </div>
                        )}

                        {!audioUploading && values.questionAudio && (
                          <div className="p-3 bg-white border border-gray-150 rounded-lg flex items-center justify-between max-w-md">
                            <div className="flex items-center gap-2 overflow-hidden mr-2">
                              <SoundOutlined className="text-indigo-500 text-lg flex-shrink-0" />
                              <span className="text-xs text-gray-600 truncate">Audio file loaded successfully</span>
                            </div>
                            <Button 
                              type="text" 
                              danger 
                              size="small" 
                              onClick={() => setFieldValue('questionAudio', '')}
                              className="hover:bg-red-50 rounded"
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Input
                          placeholder="Paste audio URL (e.g. https://example.com/audio.mp3)"
                          value={values.questionAudio && !values.questionAudio.startsWith('data:') ? values.questionAudio : ''}
                          onChange={(e) => setFieldValue('questionAudio', e.target.value)}
                          className="w-full h-10 rounded-lg border border-gray-200 px-3"
                        />
                      </div>
                    )}

                    {values.questionAudio && (
                      <div className="mt-2 p-3 bg-white border border-gray-100 rounded-lg max-w-md">
                        <span className="text-xs font-semibold text-gray-700 block mb-2">Audio Player Preview</span>
                        <audio src={values.questionAudio} controls className="w-full h-8" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Correct Answer Input */}
              <div className="col-span-2">
                <CommonValidationTextField 
                  name="correctAnswer" 
                  label="Correct Answer" 
                  required 
                  placeholder="Enter correct answer"
                />
              </div>
            </CommonFormSection>

            <div className="course-form-actions mt-6">
              <CommonButton htmlType="submit" type="primary" title={editing ? 'Update Question' : 'Create Question'} loading={loading} block className="course-button course-button--primary" />
            </div>
          </Form>
        </CommonFormShell>
      )}
    </Formik>
  );
};
