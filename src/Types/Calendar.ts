import type { Dayjs } from "dayjs";

export interface CalendarHeaderProps {
  viewMode: "month" | "year" | "day";
  setViewMode: (mode: "month" | "year" | "day") => void;
  selectedDate: Dayjs;
  onNavigate: (direction: "prev" | "next") => void;
}

export interface DayTimelineProps {
  dayEvents: any[];
}

export interface SchedulePanelProps {
  selectedDate: Dayjs;
  dayEvents: any[];
  onEdit: (event: any) => void;
  onDelete: (id: number) => void;
}


export interface EventFormProps {
  initialValues: any;
  onSubmit: (values: any) => void;
  isEditing?: boolean;
}


export interface DayTimelineProps { dayEvents: any[]; }
