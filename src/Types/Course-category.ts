
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface CourseCategoryFormValues {
  _id: string;
    name: string;
    image: string;
    description: string;
    isFeatured: boolean;
    isDeleted: boolean;
    isBlocked: boolean;
}

export type AddCourseCategoryPayload = CourseCategoryFormValues;

export type UpdateCourseCategoryPayload = AddCourseCategoryPayload;

export type CourseCategoryBase = CourseCategoryFormValues & CommonDataType;

export interface CourseCategoryDataResponse extends PageStatus {
    coursecategory_data: CourseCategoryBase[];
  toatalData: number;
}

export interface CourseCategoryApiResponse extends MessageStatus {
    data: CourseCategoryDataResponse;
}

export interface HandlerProps {
    onEdit: (coursecategory: CourseCategoryFormValues) => void;
  onToggleStatus: (id: number) => void;
  onDelete: (id: string) => void;
}


export interface CourseCategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
  editingCategory: CourseCategoryBase | null;
}