import { useState, useMemo, type FC, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Spin, Button } from 'antd'; 
import { ArrowLeftOutlined, EditOutlined, PlusOutlined, DeleteOutlined, FileProtectOutlined, QuestionCircleOutlined, CalculatorOutlined, PictureOutlined, SoundOutlined, FileTextOutlined, LockOutlined, UnlockOutlined, BookOutlined } from '@ant-design/icons';
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
  const editExamMutation = Mutations.useUpdateExam();
  const editQuestionMutation = Mutations.useUpdateQuestion();

  const handleToggleBlockExam = () => {
    if (!lessonExam?._id) return;
    editExamMutation.mutate(
      { examId: lessonExam._id, isBlocked: !lessonExam.isBlocked } as any,
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.EXAM.BASE] });
        },
      }
    );
  };

  const handleSyncTotalMarks = () => {
    if (!lessonExam?._id) return;
    editExamMutation.mutate(
      { examId: lessonExam._id, totalMarks: totalScore } as any,
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.EXAM.BASE] });
        },
      }
    );
  };

  const handleToggleBlockQuestion = (question: any) => {
    editQuestionMutation.mutate(
      { questionId: question._id, isBlocked: !question.isBlocked } as any,
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [KEYS.QUESTION.BASE] });
          queryClient.invalidateQueries({ queryKey: [KEYS.EXAM.BASE] });
        },
      }
    );
  };

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
          
          {/* Lesson Details Card (On Top) */}
          <section className="course-hero-card mb-6 animate-fade-in">
            <div className="course-hero-copy">
              <span className="course-hero-eyebrow">Lesson Details</span>
              <div className="course-hero-title-row">
                <div className="course-hero-icon bg-primary/10 text-primary">
                  <BookOutlined className="course-icon--glyph-xl" />
                </div>
                <div>
                  <h1 className="course-hero-title">{lesson?.title || 'Lesson Overview'}</h1>
                  <p className="course-hero-text">
                    {lesson?.subtitle || 'Manage the curriculum content, learning resources, and active student assessments.'}
                  </p>
                </div>
              </div>
              {lesson?.description && (
                <div 
                  className="text-xs text-text-muted mt-3 pt-3 border-t border-border/40 max-w-3xl line-clamp-2 course-hero-description-wrapper"
                  dangerouslySetInnerHTML={{ __html: lesson.description }}
                />
              )}
              <div className="course-hero-badges mt-4">
                {lesson?.duration && <span className="course-chip course-chip--primary">{lesson.duration} mins</span>}
                {lesson?.priority !== undefined && <span className="course-chip course-chip--neutral">Priority Order: {lesson.priority}</span>}
                {lesson?.lessonLock === 'true' && <span className="course-chip course-chip--danger">Locked</span>}
              </div>
            </div>
            
            <div className="course-hero-actions">
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(`/courses/${courseId}/manage`)}
                className="course-button course-button--ghost"
              >
                Back to Course Builder
              </Button>
            </div>
          </section>

          {/* Multi-Exam Visual Switcher Grid */}
          <div className="mb-6 bg-surface border border-border shadow-sm rounded-2xl p-5 animate-fade-in">
            <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <FileProtectOutlined className="text-primary text-lg" />
                  Select Assessment ({lessonExams.length})
                </h3>
                <p className="text-xs text-text-muted mt-0.5">Switch between active tests or configure a new assessment for this lesson.</p>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openExamEditorForNew}
                className="course-button course-button--primary course-button--compact"
              >
                Add New Assessment
              </Button>
            </div>

            {lessonExams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lessonExams.map((e: any) => {
                  const isActive = String(e._id) === String(selectedExamId);
                  const isBlocked = e.isBlocked;
                  const eQuestions = extractArray(quesRes).filter((q: any) => e.questionIds?.some((qid: any) => String(qid?._id ?? qid) === String(q._id)));
                  const qCount = eQuestions.length;
                  const eTotalScore = eQuestions.reduce((sum: number, q: any) => sum + Number(q.score || 0), 0);
                  const isMismatched = eTotalScore !== Number(e.totalMarks);

                  return (
                    <div
                      key={e._id}
                      onClick={() => handleExamChange(String(e._id))}
                      className={`cursor-pointer group relative overflow-hidden rounded-xl border transition-all duration-300 p-4 bg-surface-muted/40 hover:bg-surface-muted/60 ${
                        isActive
                          ? 'border-primary shadow-sm ring-2 ring-primary/10'
                          : 'border-border hover:border-text-muted/40'
                      }`}
                    >
                      {/* Active Indicator bar */}
                      {isActive && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-light" />
                      )}

                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-bold text-sm truncate group-hover:text-primary transition-colors ${
                            isActive ? 'text-primary font-extrabold' : 'text-foreground'
                          }`}>
                            {e.title || 'Untitled Assessment'}
                          </h4>
                          <p className="text-xs text-text-muted mt-0.5 truncate">{e.description || 'No description provided.'}</p>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          {isBlocked && (
                            <span className="course-chip course-chip--danger text-[10px] px-1.5 py-0.5 scale-90 origin-right">Blocked</span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-border/60 text-center">
                        <div>
                          <span className="text-[10px] text-text-muted block uppercase tracking-wider font-semibold">Questions</span>
                          <span className="text-xs font-bold text-foreground">{qCount}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-text-muted block uppercase tracking-wider font-semibold">Total Marks</span>
                          <span className="text-xs font-bold text-foreground">
                            {e.totalMarks || '--'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-text-muted block uppercase tracking-wider font-semibold">Time Limit</span>
                          <span className="text-xs font-bold text-foreground">{e.timeLimit ?? '--'}m</span>
                        </div>
                      </div>

                      {/* Warnings / Status footer */}
                      {isMismatched && (
                        <div className="mt-3 bg-red-500/10 text-red-600 border border-red-500/20 text-[10px] py-1 px-2 rounded-lg flex items-center justify-center gap-1 font-semibold animate-pulse">
                          <CalculatorOutlined /> Marks Mismatch ({eTotalScore} vs {e.totalMarks})
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="course-empty-panel p-6 border border-dashed border-border rounded-xl text-center bg-surface-muted/10">
                <FileProtectOutlined className="text-text-muted text-3xl mb-2" />
                <h4 className="text-sm font-bold text-foreground">No assessments configured for this lesson</h4>
                <p className="text-xs text-text-muted max-w-sm mx-auto mt-1">
                  Click 'Add New Assessment' above to begin configuring questions.
                </p>
              </div>
            )}
          </div>

          <section className="course-layout">
            <main className="course-main">
              {/* ── Marks Mismatch Warning Bar ── */}
              {lessonExam && totalScore !== Number(lessonExam.totalMarks) && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-xl shadow-sm flex items-start justify-between gap-4 animate-fade-in">
                  <div className="flex items-start gap-3">
                    <div className="text-red-500 mt-0.5"><CalculatorOutlined className="text-lg" /></div>
                    <div>
                      <h4 className="font-bold text-red-800 text-sm">Marks Mismatch Warning</h4>
                      <p className="text-red-700 text-xs mt-1 leading-relaxed">
                        The sum of individual question scores (<strong>{totalScore}</strong> points) does not match the configured Exam Total Marks (<strong>{lessonExam.totalMarks}</strong> marks). Students will see a mismatch. Please adjust question scores or edit the assessment marks.
                      </p>
                    </div>
                  </div>
                  <Button 
                    type="primary" 
                    danger 
                    size="small"
                    onClick={handleSyncTotalMarks}
                    className="flex-shrink-0 text-xs font-semibold"
                    loading={editExamMutation.isPending}
                  >
                    Sync Exam Marks to {totalScore}
                  </Button>
                </div>
              )}

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
                      {examQuestions.map((question: any, index: number) => {
                        let instructions = '';
                        let displayQuestionText = question.questionText || '';
                        if (displayQuestionText.includes('|||')) {
                          const parts = displayQuestionText.split('|||');
                          instructions = parts[0];
                          displayQuestionText = parts.slice(1).join('|||');
                        }

                        return (
                          <div key={question._id} className={`course-lesson-card ${question.isBlocked ? 'opacity-75 border-red-200 bg-red-50/5' : ''}`}>
                            <div className="course-lesson-card__main">
                              <div className="course-lesson-index">{index + 1}</div>
                              <div className="course-lesson-content space-y-3">
                                {instructions && (
                                  <div className="bg-surface border border-border/80 px-3 py-2 rounded-xl text-xs text-text-muted italic flex gap-1.5 items-start">
                                    <span className="font-bold text-primary not-italic">Instructions:</span>
                                    <span>{instructions}</span>
                                  </div>
                                )}
                                {question.questionType === 'calculation' ? (
                                  displayQuestionText.includes('\n') ? (
                                    <div className="inline-flex flex-col items-end border-b border-indigo-200/80 pb-1.5 px-4 py-2.5 bg-indigo-50/20 border border-indigo-100 rounded-xl font-mono text-sm font-bold text-indigo-700 min-w-[80px] mt-1 shadow-xs" style={{ alignSelf: 'flex-start' }}>
                                      {displayQuestionText.split('\n').map((step: string, idx: number) => (
                                        <div key={idx} className="tracking-wider leading-relaxed">
                                          {step}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    /* Horizontal Flow Layout */
                                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                      {displayQuestionText ? displayQuestionText.split(' ').map((step: string, idx: number) => (
                                        <span key={idx} className="inline-flex items-center justify-center px-2.5 py-1 font-mono text-sm font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg shadow-xs">
                                          {step}
                                        </span>
                                      )) : <span className="text-gray-400 italic">Empty calculation</span>}
                                    </div>
                                  )
                                ) : (
                                  <h4 className="course-lesson-name">{displayQuestionText}</h4>
                                )}

                                {question.questionType === 'image' && question.questionImage && (
                                  <div className="mt-2">
                                    <img 
                                      src={question.questionImage} 
                                      alt="Question Image" 
                                      className="w-16 h-16 object-cover rounded-lg border border-border shadow-sm"
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

                                <div className="course-lesson-meta flex flex-wrap gap-2 mt-2">
                                  <span className={`course-chip inline-flex items-center gap-1.5 ${
                                    question.questionType === 'calculation' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                    question.questionType === 'image' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                    question.questionType === 'audio' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                    'bg-sky-50 text-sky-700 border-sky-100'
                                  } border px-2 py-0.5 rounded-full text-[10px] font-bold`}>
                                    {question.questionType === 'calculation' && <CalculatorOutlined className="text-xs" />}
                                    {question.questionType === 'image' && <PictureOutlined className="text-xs" />}
                                    {question.questionType === 'audio' && <SoundOutlined className="text-xs" />}
                                    {question.questionType === 'text' && <FileTextOutlined className="text-xs" />}
                                    <span className="capitalize">{question.questionType}</span>
                                  </span>

                                  <span className="course-chip bg-emerald-50 text-emerald-700 border-emerald-100 border px-2 py-0.5 rounded-full text-[10px] font-bold">
                                    ✔ Correct Answer: <span className="underline decoration-wavy underline-offset-2 ml-0.5 font-extrabold">{question.correctAnswer}</span>
                                  </span>

                                  <span className="course-chip bg-slate-50 text-slate-700 border-slate-100 border px-2 py-0.5 rounded-full text-[10px] font-bold">
                                    ★ {question.score} point{question.score !== 1 ? 's' : ''}
                                  </span>

                                  {question.isBlocked && (
                                    <span className="course-chip course-chip--danger text-[10px] px-2 py-0.5 rounded-full font-bold">Blocked</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="course-card-actions">
                              <div className="inline-flex items-center rounded-xl border border-border/80 bg-surface-muted/30 p-0.5 overflow-hidden shadow-sm">
                                <Button
                                  type="text"
                                  icon={question.isBlocked ? <UnlockOutlined /> : <LockOutlined />}
                                  onClick={() => handleToggleBlockQuestion(question)}
                                  className={`rounded-lg h-8 w-8 flex items-center justify-center p-0 hover:scale-[1.05] transition-all border border-transparent ${
                                    !question.isBlocked ? 'text-text-muted hover:text-foreground hover:bg-surface' : 'text-red-500 hover:bg-red-500/10'
                                  }`}
                                  title={question.isBlocked ? "Unblock Question" : "Block Question"}
                                  loading={editQuestionMutation.isPending}
                                />
                                <div className="w-[1px] h-4 bg-border/60 mx-0.5" />
                                <Button
                                  type="text"
                                  icon={<EditOutlined />}
                                  onClick={() => navigate(`/courses/${courseId}/exam/${lessonExam._id}/question/${question._id}`)}
                                  className="rounded-lg h-8 w-8 flex items-center justify-center p-0 hover:scale-[1.05] transition-all border border-transparent text-text-muted hover:text-foreground hover:bg-surface"
                                  title="Edit Question"
                                />
                                <div className="w-[1px] h-4 bg-border/60 mx-0.5" />
                                <Button
                                  type="text"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => openDeleteQuestionModal(question._id)}
                                  className="rounded-lg h-8 w-8 flex items-center justify-center p-0 hover:scale-[1.05] transition-all border border-transparent text-red-500 hover:bg-red-500/10"
                                  title="Delete Question"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
              {lessonExam ? (
                <div className="course-sidebar-card shadow-sm border border-border bg-surface">
                  <span className="course-sidebar-label">Active Assessment Config</span>
                  <h3 className="course-sidebar-title truncate">{lessonExam.title || 'Untitled Assessment'}</h3>
                  {lessonExam.description && <p className="text-xs text-text-muted mb-4">{lessonExam.description}</p>}
                  
                  <div className="course-sidebar-list">
                    <div className="course-sidebar-item">
                      <span>Time Limit</span>
                      <strong>{lessonExam.timeLimit ?? '--'} min</strong>
                    </div>
                    <div className="course-sidebar-item">
                      <span>Passing Marks</span>
                      <strong>{lessonExam.passingMarks ?? '--'} marks</strong>
                    </div>
                    <div className="course-sidebar-item">
                      <span>Configured Total Marks</span>
                      <strong>{lessonExam.totalMarks ?? '--'} marks</strong>
                    </div>
                    <div className="course-sidebar-item">
                      <span>Actual Question Sum</span>
                      <strong>{totalScore} points</strong>
                    </div>
                    <div className="course-sidebar-item">
                      <span>Questions Count</span>
                      <strong>{examQuestions.length} items</strong>
                    </div>
                    <div className="course-sidebar-item">
                      <span>Status</span>
                      <strong className={lessonExam.isBlocked ? 'text-red-500' : 'text-green-500'}>
                        {lessonExam.isBlocked ? 'Blocked' : 'Active'}
                      </strong>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/60">
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={openExamEditorForEdit}
                      className="w-full flex items-center justify-center rounded-lg"
                    >
                      Edit Config
                    </Button>
                    <Button
                      type="default"
                      danger={!lessonExam.isBlocked}
                      icon={lessonExam.isBlocked ? <UnlockOutlined /> : <LockOutlined />}
                      onClick={handleToggleBlockExam}
                      loading={editExamMutation.isPending}
                      className="w-full flex items-center justify-center rounded-lg"
                    >
                      {lessonExam.isBlocked ? 'Unblock Assessment' : 'Block Assessment'}
                    </Button>
                    <Button 
                      danger 
                      type="dashed" 
                      icon={<DeleteOutlined />} 
                      onClick={openDeleteExamModal} 
                      className="w-full flex items-center justify-center rounded-lg"
                    >
                      Delete Assessment
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="course-sidebar-card shadow-sm border border-border bg-surface text-center py-6">
                  <span className="course-sidebar-label">No Assessment Active</span>
                  <p className="text-xs text-text-muted mt-2">Select an assessment from the grid above or create one to configure rules.</p>
                </div>
              )}

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