import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface ExamFormValues {
    _id?: string;
    examId?: string;
    courseId: string;
    courseLessonId: string;
    title: string;
    description?: string;
    questionIds?: string[];
    passingMarks: number;
    totalMarks: number;
    timeLimit: number;
}

export type AddExamPayload = ExamFormValues;

export type UpdateExamPayload = AddExamPayload;

export type ExamBase = ExamFormValues & CommonDataType;

export interface ExamDataResponse extends PageStatus {
    course_data: ExamBase[];
    totalData: number;
}

export interface ExamApiResponse extends MessageStatus {
    data: ExamDataResponse;
}
