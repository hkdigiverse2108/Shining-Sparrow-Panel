export interface WorkshopAgendaItem {
    time: string;
    title: string;
    desc: string;
}

export type RegistrationStatus = 'registered' | 'attended' | 'absent' | 'cancelled';
export interface WorkshopRegistration {
    userId: number;
    status: RegistrationStatus;
    registeredAt: string;
}

export interface WorkshopSpeaker {
    id: number;
    name: string;
}

export interface Workshop {
    id: number;
    title: string;
    date: string;
    time?: string;
    attendees?: number;
    category?: string;
    image?: string;
    description?: string;
    featured?: boolean;
    speaker?: WorkshopSpeaker;
    speakerId?: number;
    agenda?: WorkshopAgendaItem[];
    tag?: string;
    actionText?: string;
    registrations: WorkshopRegistration[];
}

export interface WorkshopAgendaFormProps {
  initialValues: any;
  onSubmit: (values: any) => void;
  isEditing: boolean;
}

export interface WorkshopFormProps {
  initialValues: any;
  onSubmit: (values: any) => void;
  isEditing?: boolean;
}

export interface AgendaItem { time: string; title: string; desc?: string; }
export interface WorkshopAgendaListProps {
    agenda: AgendaItem[];
    onAdd: () => void;
    onEdit: (index: number) => void;
    onDelete: (index: number) => void;
}


export interface Registration { userId: number; status: string; registeredAt: string; }
export interface User { id: number; username?: string; profileImage?: string; }

export interface WorkshopRegistrationsProps {
  registrations: Registration[];
  users: User[];
}
import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface WorkshopFormValues {
    id?: string; 
    workshopId?: string;
    image?: string;
    title?: string;
    subTitle?: string;
    about?: string;
    pdfAttach?: string;
    workshopCurriculum?: string[];
    workshopTestimonials?: string[];
    price?: number;
    mrpPrice?: number;
    validFor?: string;
    couponCode?: string;
    language?: string;
    duration?: string;
}

export type AddWorkshopPayload = WorkshopFormValues;

export type UpdateWorkshopPayload = AddWorkshopPayload;

export type WorkshopBase = WorkshopFormValues & CommonDataType;

export interface WorkshopDataResponse extends PageStatus {
    workshop_data: WorkshopBase[];
  totalData: number;
}

export interface WorkshopApiResponse extends MessageStatus {
    data: WorkshopDataResponse;
}
