import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface QuestionFormValues {
    _id?: string;
    examId?: string;
    questionId?: string;
    courseId: string;
    questionText: string;
    questionImage?: string;
    questionAudio?: string;
    questionType: 'calculation' | 'image' | 'audio' | 'text';
    correctAnswer: string;
    score?: number;
    priority?: number;
    isBlocked?: boolean;
}

export type AddQuestionPayload = QuestionFormValues;

export type UpdateQuestionPayload = Partial<QuestionFormValues> & { questionId: string };

export type QuestionBase = QuestionFormValues & CommonDataType;

export interface QuestionDataResponse extends PageStatus {
    course_data: QuestionBase[];
    totalData: number;
}

export interface QuestionApiResponse extends MessageStatus {
    data: QuestionDataResponse;
}
