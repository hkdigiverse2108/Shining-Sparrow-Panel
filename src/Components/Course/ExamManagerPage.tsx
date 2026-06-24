import { useState, useMemo, type FC, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Spin, Button, Select } from 'antd'; 
import { ArrowLeftOutlined, EditOutlined, PlusOutlined, DeleteOutlined, FileProtectOutlined, ClockCircleOutlined, StarOutlined, TrophyOutlined, QuestionCircleOutlined, RightOutlined, BarsOutlined, AppstoreOutlined, CalculatorOutlined, PictureOutlined, SoundOutlined, FileTextOutlined, } from '@ant-design/icons';
import { Queries, Mutations } from '@/Api';
import { KEYS } from '@/Constants';
import { useQueryClient } from '@tanstack/react-query';
import { CommonBreadcrumbs, CommonPageWrapper, CommonDeleteModal } from '@/Components'; 
import { extractArray } from '@/Utils';

const ExamManagerPage: FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Track selected exam ID
  const urlSelectedExamId = searchParams.get('selectedExamId');
  const [selectedExamId, setSelectedExamId] = useState<string | null>(urlSelectedExamId);

  const { data: courseRes, isLoading: courseLoading } = Queries.useGetCourses({ page: 1, limit: 1000 });
  const { data: lessRes, isLoading: lessLoading } = Queries.useGetLessons();
  const { data: examRes, isLoading: examLoading } = Queries.useGetExams();
  const { data: quesRes, isLoading: quesLoading } = Queries.useGetQuestions();

  const deleteExamMutation = Mutations.useDeleteExam();
  const deleteQuestionMutation = Mutations.useDeleteQuestion();

  // State for Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'exam' | 'question', id?: string } | null>(null);

  const course = useMemo(() => extractArray(courseRes).find((c: any) => c._id === courseId), [courseRes, courseId]);
  const lesson = useMemo(() => extractArray(lessRes).find((l: any) => l._id === lessonId), [lessRes, lessonId]);
  
  // Get all exams belonging to this lesson
  const lessonExams = useMemo(() => {
    return extractArray(examRes).filter((e: any) => String(e.courseLessonId?._id ?? e.courseLessonId) === String(lessonId));
  }, [examRes, lessonId]);

  // Sync selected exam ID with url and actual exams list
  useEffect(() => {
    if (lessonExams.length > 0) {
      const match = lessonExams.find(e => String(e._id) === String(urlSelectedExamId));
      if (match) {
        setSelectedExamId(String(match._id));
      } else if (!urlSelectedExamId || !lessonExams.some(e => String(e._id) === String(selectedExamId))) {
        setSelectedExamId(String(lessonExams[0]._id));
        setSearchParams({ selectedExamId: String(lessonExams[0]._id) }, { replace: true });
      }
    } else {
      setSelectedExamId(null);
    }
  }, [lessonExams, urlSelectedExamId, setSearchParams]);

  // The active exam document
  const lessonExam = useMemo(() => {
    if (!selectedExamId) return null;
    return lessonExams.find((e: any) => String(e._id) === String(selectedExamId)) || null;
  }, [lessonExams, selectedExamId]);

  const examQuestions = useMemo(() => {
    if (!lessonExam) return [];
    const allQuestions = extractArray(quesRes);
    return allQuestions.filter((q: any) => lessonExam.questionIds?.some((qid: any) => String(qid?._id ?? qid) === String(q._id)));
  }, [quesRes, lessonExam]);

  const correctCount = useMemo(() => examQuestions.length, [examQuestions]);
  const totalScore = useMemo(() => examQuestions.reduce((sum: number, question: any) => sum + Number(question.score || 0), 0), [examQuestions]);

  const openDeleteExamModal = () => {
    if (!lessonExam?._id) return;
    setDeleteTarget({ type: 'exam', id: lessonExam._id });
    setIsDeleteModalOpen(true);
  };

  const openDeleteQuestionModal = (qid: string) => {
    setDeleteTarget({ type: 'question', id: qid });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget || !deleteTarget.id) return;

    if (deleteTarget.type === 'exam') {
      deleteExamMutation.mutate(deleteTarget.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.EXAM.BASE] });
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
          // Reset URL selection
          setSearchParams({}, { replace: true });
        },
      });
    } else if (deleteTarget.type === 'question') {
      deleteQuestionMutation.mutate(deleteTarget.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.QUESTION.BASE] });
          queryClient.invalidateQueries({ queryKey: [KEYS.EXAM.BASE] });
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
        },
      });
    }
  };

  if (courseLoading || lessLoading || examLoading || quesLoading) {
    return (
      <div className="course-loading">
        <Spin size="large" />
      </div>
    );
  }

  const openExamEditorForEdit = () => {
    if (lessonExam?._id) {
      navigate(`/courses/${courseId}/lesson/${lessonId}/exam/edit?examId=${lessonExam._id}`);
    }
  };

  const openExamEditorForNew = () => {
    navigate(`/courses/${courseId}/lesson/${lessonId}/exam/edit`);
  };

  const handleExamChange = (value: string) => {
    setSelectedExamId(value);
    setSearchParams({ selectedExamId: value });
  };

  return (
    <>
      <CommonBreadcrumbs
        title={`Assessments: ${lesson?.title || 'Lesson'}`}
        breadcrumbs={[
          { label: 'Courses', href: '/courses' },
          { label: `Manage: ${course?.name || 'Course'}`, href: `/courses/${courseId}/manage` },
          { label: 'Assessments' },
        ]}
      />

      <CommonPageWrapper className="course-shell">
        <div className="course-container course-container--wide">
          
          {/* Multi-Exam Switcher Bar */}
          <div className="bg-surface border border-border shadow-sm rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-text-muted text-sm">Select Assessment:</span>
              <Select
                value={selectedExamId || undefined}
                onChange={handleExamChange}
                placeholder="No assessment configured"
                className="w-64"
                options={lessonExams.map((e: any) => ({
                  value: String(e._id),
                  label: e.title || 'Untitled Assessment',
                }))}
              />
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openExamEditorForNew}
              className="course-button course-button--primary"
            >
              Add New Assessment
            </Button>
          </div>

          <section className="course-hero-card">
            <div className="course-hero-copy">
              <span className="course-hero-eyebrow">Assessment Builder</span>
              <div className="course-hero-title-row">
                <div className="course-hero-icon">
                  <FileProtectOutlined className="course-icon--glyph-xl" />
                </div>
                <div>
                  <h1 className="course-hero-title">{lessonExam?.title || lesson?.title || 'Lesson Assessment'}</h1>
                  <p className="course-hero-text">
                    {lessonExam?.description || 'Set the exam rules, manage questions, and keep the assessment status easy to read at a glance.'}
                  </p>
                </div>
              </div>
              <div className="course-hero-badges">
                <span className="course-chip course-chip--neutral">{examQuestions.length} Questions</span>
                <span className="course-chip course-chip--primary">{lessonExam?.timeLimit ?? '--'} min</span>
                <span className="course-chip course-chip--success">{lessonExam?.passingMarks ?? '--'} pass marks</span>
                <span className="course-chip course-chip--danger">{lessonExam ? 'Configured' : 'Not configured'}</span>
              </div>
            </div>

            <div className="course-hero-actions">
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(`/courses/${courseId}/manage`)}
                className="course-button course-button--ghost"
              >
                Back to Builder
              </Button>
              {lessonExam && (
                <Button danger type="dashed" icon={<DeleteOutlined />} onClick={openDeleteExamModal} className="course-button course-button--danger">
                  Delete Assessment
                </Button>
              )}
            </div>
          </section>

          <section className="course-stat-grid">
            <article className="course-stat-card">
              <div className="course-stat-icon course-stat-icon--primary"><ClockCircleOutlined /></div>
              <div>
                <span className="course-stat-label">Time Limit</span>
                <strong className="course-stat-value">{lessonExam?.timeLimit ?? '--'} <span className="course-kpi-unit">minutes</span></strong>
              </div>
            </article>
            <article className="course-stat-card">
              <div className="course-stat-icon course-stat-icon--success"><TrophyOutlined /></div>
              <div>
                <span className="course-stat-label">Passing Marks</span>
                <strong className="course-stat-value">{lessonExam?.passingMarks ?? '--'} <span className="course-kpi-unit">marks</span></strong>
              </div>
            </article>
            <article className="course-stat-card">
              <div className="course-stat-icon course-stat-icon--info"><StarOutlined /></div>
              <div>
                <span className="course-stat-label">Total Marks</span>
                <strong className="course-stat-value">{lessonExam?.totalMarks ?? '--'} <span className="course-kpi-unit">marks</span></strong>
              </div>
            </article>
            <article className="course-stat-card">
              <div className="course-stat-icon course-stat-icon--warning"><BarsOutlined /></div>
              <div>
                <span className="course-stat-label">Questions</span>
                <strong className="course-stat-value">{correctCount}</strong>
              </div>
            </article>
          </section>

          <section className="course-layout">
            <main className="course-main">
              <div className="course-section-card">
                <div className="course-section-card__header">
                  <div>
                    <h2 className="course-section-card__title">Assessment questions</h2>
                    <p className="course-section-card__text">Review, edit, or remove questions from the lesson assessment.</p>
                  </div>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate(`/courses/${courseId}/exam/${lessonExam?._id}/question/new`)}
                    disabled={!lessonExam?._id}
                    className="course-button course-button--primary course-button--compact"
                  >
                    Add Question
                  </Button>
                </div>

                {lessonExam ? (
                  examQuestions.length > 0 ? (
                    <div className="course-lesson-list">
                      {examQuestions.map((question: any, index: number) => (
                        <div key={question._id} className="course-lesson-card">
                          <div className="course-lesson-card__main">
                            <div className="course-lesson-index">{index + 1}</div>
                            <div className="course-lesson-content space-y-3">
                              {question.questionType === 'calculation' ? (
                                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                  {question.questionText ? question.questionText.split(question.questionText.includes('\n') ? '\n' : ' ').map((step: string, idx: number) => (
                                    <span key={idx} className="inline-flex items-center justify-center px-2 py-0.5 font-mono text-sm font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-md">
                                      {step}
                                    </span>
                                  )) : <span className="text-gray-400 italic">Empty calculation</span>}
                                  {question.questionText && question.questionText.includes('\n') && (
                                    <span className="text-xs text-text-muted italic ml-1">(Vertical format)</span>
                                  )}
                                </div>
                              ) : (
                                <h4 className="course-lesson-name">{question.questionText}</h4>
                              )}

                              {question.questionType === 'image' && question.questionImage && (
                                <div className="mt-2">
                                  <img 
                                    src={question.questionImage} 
                                    alt="Question Image" 
                                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Invalid';
                                    }}
                                  />
                                </div>
                              )}

                              {question.questionType === 'audio' && question.questionAudio && (
                                <div className="mt-2 flex items-center gap-2">
                                  <audio src={question.questionAudio} controls className="h-7 max-w-xs scale-90 origin-left" />
                                </div>
                              )}

                              <div className="course-lesson-meta flex flex-wrap gap-2 mt-1">
                                <span className={`course-chip inline-flex items-center gap-1 ${
                                  question.questionType === 'calculation' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                  question.questionType === 'image' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                  question.questionType === 'audio' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                  'bg-blue-50 text-blue-700 border-blue-100'
                                }`}>
                                  {question.questionType === 'calculation' && <CalculatorOutlined className="text-xs" />}
                                  {question.questionType === 'image' && <PictureOutlined className="text-xs" />}
                                  {question.questionType === 'audio' && <SoundOutlined className="text-xs" />}
                                  {question.questionType === 'text' && <FileTextOutlined className="text-xs" />}
                                  <span className="capitalize">{question.questionType}</span>
                                </span>
                                <span className="course-chip course-chip--primary font-medium">Correct: <span className="course-emphasis">{question.correctAnswer}</span></span>
                                <span className="course-chip course-chip--success">{question.score} point{question.score !== 1 ? 's' : ''}</span>
                              </div>
                            </div>
                          </div>

                          <div className="course-card-actions">
                            <Button
                              type="text"
                              icon={<EditOutlined />}
                              onClick={() => navigate(`/courses/${courseId}/exam/${lessonExam._id}/question/${question._id}`)}
                              className="course-button course-button--text course-button--icon"
                              title="Edit Question"
                            />
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => openDeleteQuestionModal(question._id)}
                              className="course-button course-button--text course-button--icon"
                              title="Delete Question"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="course-empty-panel">
                      <div className="course-empty-panel__icon">
                        <QuestionCircleOutlined className="course-icon--glyph-3xl" />
                      </div>
                      <h3 className="course-empty-panel__title">No questions yet</h3>
                      <p className="course-empty-panel__text">
                        Start by adding the first question. You can build the assessment gradually and keep it organized in one place.
                      </p>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate(`/courses/${courseId}/exam/${lessonExam._id}/question/new`)}
                        className="course-button course-button--primary"
                      >
                        Add First Question
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="course-empty-panel">
                    <div className="course-empty-panel__icon">
                      <FileProtectOutlined className="course-icon--glyph-3xl" />
                    </div>
                    <h3 className="course-empty-panel__title">Create the assessment first</h3>
                    <p className="course-empty-panel__text">
                      Configure time limit, marks, and passing threshold before you begin adding questions.
                    </p>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={openExamEditorForNew}
                      className="course-button course-button--primary"
                    >
                      Configure Assessment
                    </Button>
                  </div>
                )}
              </div>
            </main>

            <aside className="course-sidebar">
              <div className="course-sidebar-card">
                <span className="course-sidebar-label">Assessment snapshot</span>
                <h3 className="course-sidebar-title">Key details</h3>
                <div className="course-sidebar-list">
                  <div className="course-sidebar-item">
                    <span>Status</span>
                    <strong>{lessonExam ? 'Configured' : 'Draft'}</strong>
                  </div>
                  <div className="course-sidebar-item">
                    <span>Questions</span>
                    <strong>{examQuestions.length}</strong>
                  </div>
                  <div className="course-sidebar-item">
                    <span>Total score</span>
                    <strong>{totalScore}</strong>
                  </div>
                  <div className="course-sidebar-item">
                    <span>Passing score</span>
                    <strong>{lessonExam?.passingMarks ?? '--'}</strong>
                  </div>
                </div>
              </div>

              <div className="course-sidebar-card course-sidebar-card--accent">
                <span className="course-sidebar-label">Quick actions</span>
                <h3 className="course-sidebar-title">Keep moving</h3>
                <div className="course-sidebar-actions">
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={openExamEditorForEdit}
                    disabled={!lessonExam}
                    className="course-button course-button--primary course-button--compact course-button--wide"
                  >
                    Edit Selected Assessment
                  </Button>
                  <Button
                    icon={<AppstoreOutlined />}
                    onClick={() => navigate(`/courses/${courseId}/manage`)}
                    className="course-button course-button--ghost course-button--compact course-button--wide"
                  >
                    Course Builder
                  </Button>
                  <Button
                    icon={<RightOutlined />}
                    onClick={() => navigate(`/courses/${courseId}/exam/${lessonExam?._id}/question/new`)}
                    disabled={!lessonExam?._id}
                    className="course-button course-button--ghost course-button--compact course-button--wide"
                  >
                    New Question
                  </Button>
                </div>
              </div>

              <div className="course-sidebar-card">
                <span className="course-sidebar-label">Workflow tip</span>
                <p className="course-sidebar-text">
                  Keep the assessment configuration stable first, then use the question list to manage content as the lesson evolves.
                </p>
              </div>
            </aside>
          </section>
        </div>
      </CommonPageWrapper>

      <CommonDeleteModal open={isDeleteModalOpen} title={deleteTarget?.type === 'exam' ? 'Delete Assessment' : 'Delete Question'} itemName={deleteTarget?.type === 'exam' ? lessonExam?.title || lesson?.title : 'this question'} loading={deleteExamMutation.isPending || deleteQuestionMutation.isPending} onClose={() => { setIsDeleteModalOpen(false); setDeleteTarget(null); }} onConfirm={handleConfirmDelete} />
    </>
  );
};

export default ExamManagerPage;