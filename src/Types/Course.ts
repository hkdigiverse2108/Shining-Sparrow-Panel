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
