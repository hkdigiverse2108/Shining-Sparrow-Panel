
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface BlogFormValues {
  _id?: string;
    title: string;
    subTitle: string;
    content: string;
    category: string;
    coverImage: string;
    mainImage: string;
    author: string
    isFeatured: boolean;
    isDeleted: boolean;
    isBlocked: boolean;
}

export type AddBlogPayload = BlogFormValues;

export type UpdateBlogPayload = AddBlogPayload;

export type BlogBase = BlogFormValues & CommonDataType;

export interface BlogDataResponse extends PageStatus {
    blog_data: BlogBase[];
  totalData: number;
}

export interface BlogApiResponse extends MessageStatus {
    data: BlogDataResponse;
}

export interface BlogHandlerProps {
    onEdit: (coursecategory: BlogFormValues) => void;
  onToggleStatus: (id: number) => void;
  onDelete: (id: string) => void;
}


export interface BlogFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
    editingCategory: BlogBase | null;
}