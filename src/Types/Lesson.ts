import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface LessonFormValues {
    id?: string;
    courseId: string;
    title: string;
    subtitle?: string;
    description?: string;
    thumbnail?: string;
    videoLink?: string;
    duration?: string;
    priority?: number;
    practiceMaterial?: string;
    lessonLock?: boolean;
}

export type AddLessonPayload = LessonFormValues;

export type UpdateLessonPayload = AddLessonPayload;

export type LessonBase = LessonFormValues & CommonDataType;

export interface LessonDataResponse extends PageStatus {
    course_data: LessonBase[];
    totalData: number;
}

export interface LessonApiResponse extends MessageStatus {
    data: LessonDataResponse;
}