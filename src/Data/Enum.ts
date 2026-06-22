import type { FormField } from "@/Types";
import { CheckCircleOutlined, StopOutlined, TeamOutlined } from "@ant-design/icons";
import type { AntdIconProps } from "@ant-design/icons/es/components/AntdIcon";
import type { ComponentType } from "react";

export const courseEditFields: FormField[] = [
    { name: 'title', label: 'Course Title', rules: [{ required: true }], placeholder: 'Enter course title' },
    { name: 'price', label: 'Price', rules: [{ required: true }], placeholder: 'e.g. $49.99' },
    { name: 'instructor', label: 'Instructor Name', rules: [{ required: true }], placeholder: 'e.g. Jane Doe' },
    { name: 'instructorTitle', label: 'Instructor Title', placeholder: 'e.g. Senior Developer' },
    { name: 'description', label: 'Description', rules: [{ required: true }], placeholder: 'Course description...', type: 'textarea' },
];

export const lectureFields: FormField[] = [
    { name: 'title', label: 'Lecture Title', rules: [{ required: true, message: 'Please input the lecture title!' }], placeholder: 'e.g. Introduction to React' },
    { name: 'duration', label: 'Duration', rules: [{ required: true, message: 'Please input the duration!' }], placeholder: 'e.g. 15:30' },
];

export const courseFields: FormField[] = [
    { name: 'title', label: 'Course Title', rules: [{ required: true, message: 'Please enter a title!' }], placeholder: 'e.g. Advanced React Patterns' },
    { name: 'instructor', label: 'Instructor Name', rules: [{ required: true, message: 'Please enter an instructor!' }], placeholder: 'e.g. John Doe' },
    { name: 'price', label: 'Price', rules: [{ required: true, message: 'Please enter a price!' }], placeholder: 'e.g. $49.99' },
    { name: 'category', label: 'Category', rules: [{ required: true, message: 'Please enter a category!' }], placeholder: 'e.g. Development' },
];

export const workshopFields: FormField[] = [
    { name: 'title', label: 'Workshop Title', rules: [{ required: true, message: 'Please enter a title!' }], placeholder: 'e.g. AI in 2025' },
    { name: 'date', label: 'Date', rules: [{ required: true }], placeholder: 'e.g. Dec 15, 2024' },
    { name: 'time', label: 'Time', rules: [{ required: true }], placeholder: 'e.g. 10:00 AM' },
    { name: 'description', label: 'Description', rules: [{ required: true }], placeholder: 'Workshop description...', type: 'textarea' },
];


export const workshopEditFields: FormField[] = [
    { name: 'title', label: 'Workshop Title', rules: [{ required: true }] },
    { name: 'date', label: 'Date', rules: [{ required: true }] },
    { name: 'time', label: 'Time', rules: [{ required: true }] },
    { name: 'description', label: 'Description', type: 'textarea', rules: [{ required: true }] },
    { name: ['speaker', 'name'], label: 'Speaker Name' }, // Supports nested objects natively
    { name: ['speaker', 'title'], label: 'Speaker Title' },
    { name: ['speaker', 'bio'], label: 'Speaker Bio', type: 'textarea' },
];

export const agendaFields: FormField[] = [
    { name: 'time', label: 'Time', rules: [{ required: true }], placeholder: 'e.g. 10:00 AM' },
    { name: 'title', label: 'Session Title', rules: [{ required: true }], placeholder: 'e.g. Introduction' },
    { name: 'desc', label: 'Description', type: 'textarea', placeholder: 'Optional details...' },
];


export const initialInbox = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', category: 'Course Content', message: 'How do I access the advanced React course materials? I bought the premium bundle but I can only see the introduction videos.', date: '2 hours ago' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', category: 'Technical Issue', message: 'Unable to login to my account. Can you help reset my password? I have tried the forgot password link but the email never arrives.', date: '1 day ago' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', category: 'Workshop Inquiry', message: 'Great workshop yesterday! Will the recording be available for download, or will it only be accessible for 30 days on the platform? Great workshop yesterday! Will the recording be available for download, or will it only be accessible for 30 days on the platform?', date: '3 days ago' },
];

export const contactEditFields: FormField[] = [
    { name: 'email', label: 'Support Email', rules: [{ required: true, type: 'email' }] },
    { name: 'phone', label: 'Phone Number', rules: [{ required: true }] },
    { name: 'hours', label: 'Office Hours', rules: [{ required: true }] },
    { name: 'location', label: 'Location', rules: [{ required: true }] },
];

export const catColor = (c: string) => ({ 'Course Content': 'blue', 'Technical Issue': 'red', 'Workshop Inquiry': 'green', 'Billing & Payments': 'gold' }[c] || 'default');


export const roleOptions = [
    { label: "All Roles", value: "all" },
    { label: "Admins", value: "admin" },
    { label: "Instructors", value: "instructor" },
    { label: "Students", value: "student" },
];

export type MetricKey = "total" | "active" | "blocked";

export const metricCards: {
    key: MetricKey;
    title: string;
    icon: ComponentType<AntdIconProps>;
}[] = [
        { key: "total", title: "Total Users", icon: TeamOutlined },
        { key: "active", title: "Active Users", icon: CheckCircleOutlined },
        { key: "blocked", title: "Blocked Users", icon: StopOutlined },
    ];

export const metricStyles: Record<string, string> = {
    total: 'user-metric-icon--total',
    active: 'user-metric-icon--active', // Make sure your CSS has these classes, or reuse existing ones
    blocked: 'user-metric-icon--blocked',
};
export const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Blocked", value: "blocked" },
];

export const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

export const permissionOptions = [
  { label: "Read", value: "read" },
  { label: "Write", value: "write" },
  { label: "Delete", value: "delete" },
  { label: "Manage Users", value: "users" },
];

export const courseStatusOptions = [
    { label: "Published", value: "published" },
    { label: "Draft", value: "draft" },
    { label: "Archived", value: "archived" },
];

export const courseCategoryOptions = [
    { label: "Development", value: "Development" },
    { label: "Design", value: "Design" },
    { label: "Backend", value: "Backend" },
    { label: "Marketing", value: "Marketing" },
    { label: "Data Science", value: "Data Science" },
    { label: "Cloud", value: "Cloud" },
];

export type ActiveDrawer = 'course' | 'curriculum' | null;

export const statusColors: Record<string, string> = {
    published: 'green',
    draft: 'orange',
    archived: 'default'
};

export const stepColors = ['var(--info)', 'var(--purple)', 'var(--pink)', 'var(--indigo)', 'var(--teal)', 'var(--orange)'];

export const roleColors: Record<string, string> = { 
  admin: 'user-role-admin', 
  instructor: 'user-role-instructor', 
  student: 'user-role-student' 
};

export const userStatusColors: Record<string, string> = { 
  active: 'user-status-active', 
  inactive: 'user-status-inactive', 
  blocked: 'user-status-blocked' 
};

