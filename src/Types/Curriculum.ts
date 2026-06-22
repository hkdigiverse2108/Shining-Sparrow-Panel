import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface CurriculumFormValues {
    id?: string; // present if editing
    courseId: string;
    title: string;
    description?: string;
    videoLink?: string;
    thumbnail?: string;
    duration?: string;
    attachment?: string;
    courseLessonsAssigned?: string[];
    courseLessonsPriority?: number;
    curriculumLock?: boolean;
}

export type AddCurriculumPayload = CurriculumFormValues;

export type UpdateCurriculumPayload = AddCurriculumPayload;

export type CurriculumBase = CurriculumFormValues & CommonDataType;

export interface CurriculumDataResponse extends PageStatus {
    curriculum_data: CurriculumBase[];
  totalData: number;
}

export interface CurriculumApiResponse extends MessageStatus {
    data: CurriculumDataResponse;
}
