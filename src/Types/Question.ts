import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface QuestionFormValues {
    _id?: string;
    examId?: string;
    courseId: string;
    questionText: string;
    questionImage?: string;
    questionAudio?: string;
    questionType: 'calculation' | 'image' | 'audio' | 'text';
    correctAnswer: string;
    score?: number;
    priority?: number;
}

export type AddQuestionPayload = QuestionFormValues;

export type UpdateQuestionPayload = AddQuestionPayload;

export type QuestionBase = QuestionFormValues & CommonDataType;

export interface QuestionDataResponse extends PageStatus {
    course_data: QuestionBase[];
    totalData: number;
}

export interface QuestionApiResponse extends MessageStatus {
    data: QuestionDataResponse;
}
