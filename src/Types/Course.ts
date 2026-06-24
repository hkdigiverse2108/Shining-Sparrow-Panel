export interface CurriculumItem {
    title: string;
    duration: string;
    completed: boolean;
    locked: boolean;
}

export interface Course {
    id: number;
    title: string;
    instructor?: string;
    category: string;
    price: string;
    fullPrice?: string;
    rating: number;
    image: string;
    description?: string;
    curriculum?: CurriculumItem[];
    status: "published" | "draft" | "archived";
    createdAt: string;
    updatedAt: string;
    enrollmentsCount: number;
    enrolledStudents: number[];
    instructorId?: number; 
}
export interface CourseFormProps {
  initialValues: any;
  onSubmit: (values: any) => void;
  isEditing?: boolean;
}

export interface Category {
    id: string;
    name: string;
    color: string;
}

export interface CategoryState {
    data: Category[];
}


import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface CourseFormValues {
    _id: string;
    name: string;
    courseCurriculumIds: string[];
    description: string;
    price: number;
    mrpPrice: number;
    language?: string;
    image: string;
    pdf: string;
    duration?: number;
    purchasedCoursesShow: boolean;
    enrolledLearners: number;
    classCompleted: number;
    satisfactionRate: number;
    isDeleted: boolean;
    isBlocked: boolean;
    courseId?: string;
}

export type AddCoursePayload = CourseFormValues;

export type UpdateCoursePayload = AddCoursePayload;

export type CourseBase = CourseFormValues & CommonDataType;

export interface CourseDataResponse extends PageStatus {
    course_data: CourseBase[];
  totalData: number;
}

export interface CourseApiResponse extends MessageStatus {
    data: CourseDataResponse;
}

// Inside @/Types

export interface CourseFormProps {
    open: boolean;
    onClose: () => void;
    onSave: (values: any) => void;
    editing: any | null;
}

export interface CourseColumnProps {
    onEdit: (course: any) => void;
    onManage: (record: any) => void; 
    onToggleStatus: (course: any) => void;
    onDelete: (id: string) => void;
}

export interface CourseHandlerProps {
    open: boolean;
    onClose: () => void;
    onSave: (values: any) => void;
    editing: any | null;
}