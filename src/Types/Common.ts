import type { IconBaseProps } from "@ant-design/icons/es/components/Icon";
import type { ButtonProps, CardProps, ColProps, DrawerProps, InputProps } from "antd";
import type { ComponentType, MouseEvent, ReactNode } from "react";
import * as Yup from "yup";
import type { AdminSettingBase } from "./AdminSetting";
import type { StatItem } from "@/Data/DashboardData";
import type { Rule } from "antd/es/form";
import type { User, UserTable } from "./User";
import type { WorkshopBase } from "./Workshop";
import type { CourseBase } from ".";

type ShapeType = "circle" | "square" | "diamond" | "triangle";

export interface Params {
  [key: string]: any;
}


export interface FloatingShapeProps {
  className: string;
  type: ShapeType;
}

export interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  className: string;
}

// ************ Common Start ***********
export type CommonButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "success"
  | "danger"
  | "ghost"
  | "iconOnly"
  | "text"      
  | "link";  

export interface CommonButtonProps extends ButtonProps {
  buttonVariant?: CommonButtonVariant;
  iconOnly?: boolean;
  size?: "small" | "middle" | "large";
  title?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface CommonValidationTextFieldProps extends InputProps {
  name?: string;
  label?: string;
  required?: boolean;
  validating?: boolean;
  clearable?: boolean;
  showPasswordToggle?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  maxDigits?: number;
  isCurrency?: boolean;
  currencyDisabled?: boolean;
  error?: string;
  touched?: boolean;
  onCurrencyLog?: (value: "\u20b9" | "%") => void;
  multiline?: boolean;
  rows?: number;
}

export interface CommonCardProps {
  title?: string;
  children: ReactNode;
  cardProps?: CardProps;
  hideDivider?: boolean;
  topContent?: ReactNode;
  btnHref?: string;
  extra?: ReactNode;
  headerClassName?: string;
}

export interface CommonPageWrapperProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export interface CommonFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: Record<string, unknown>) => void;
  title: string;
  okText: string;
  fields: FormField[];
  initialValues?: Record<string, unknown>;
}

export interface CommonFormShellProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
  className?: string;
}

export interface CommonTagProps {
  color?: string;
  className?: string;
  children?: ReactNode;
  icon?: ReactNode;
  closable?: boolean;          
  onClose?: (e: MouseEvent) => void;
  style?: React.CSSProperties;      
}

export interface CommonSelectProps {
  label?: string;
  options: SelectOptionType[];
  value?: string | string[];
  onChange: (values: string | string[]) => void;
  multiple?: boolean;
  limitTags?: number;
  size?: "small" | "middle" | "large";
  grid?: ColProps;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  isLoading?: boolean;
  searchKeys?: string[];
  fullWidth?: boolean;
  maxTagCount?: number | 'responsive';
  showSearch?: boolean;
}

export interface CommonTableToolbarProps {
  searchText: string;
  setSearchText: (value: string) => void;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;

  isActive?: boolean;
  onActiveChange?: (checked: boolean) => void;

  onAdd?: () => void;

  columns: any[];
  visibleCols: string[];
  setVisibleCols: (cols: string[]) => void;

  onExportExcel: () => void;
  onExportPDF: () => void;
}

export interface CommonValidationSelectProps extends Omit<CommonSelectProps, "onChange" | "value"> {
  name: string;
  syncFieldName?: string;
}

export interface CommonDrawerProps extends DrawerProps {
  title: ReactNode;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export interface CommonTimePickerProps {
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  format?: string;
  isRange?: boolean;
}

export interface CommonImageUploadProps {
  name: string;
  label?: string;
  shape?: "circle" | "square";
  size?: number;
  required?: boolean;
  className?: string;
}

export interface CommonMultipleImageUploadProps {
  name: string;
  label?: string;
  maxCount?: number;
  required?: boolean;
  className?: string;
}

export interface CommonVideoUploadProps {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export interface CommonAttachmentUploadProps {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
}

// ************ Common End ***********

export interface AuthLayoutConfigProps {
  branding: {
    logoPath: string;
    logoAlt: string;
    brandName: string;
    brandHighlight?: string;
    subtitle: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    titleHighlight?: string;
    description: string;
  };
  stats: Array<{
    icon: ComponentType<IconBaseProps>;
    value: string;
    label: string;
  }>;
  footer?: {
    text: string;
    show: boolean;
  };
}

// ************ Validation Yup schema Start ***********

export type Primitive = string | number;
export type DepValue = Primitive | Primitive[] | undefined;

export type FieldSchemaArgs<K extends keyof FieldTypeMap> = [type: K, options?: FieldOptions<FieldTypeMap[K]>] | [type: K, label: string, options?: FieldOptions<FieldTypeMap[K]>];

export type FieldTypeMap<T = unknown> = {
  string: Yup.StringSchema<string | null | undefined>;
  number: Yup.NumberSchema<number | null | undefined>;
  boolean: Yup.BooleanSchema<boolean | null | undefined>;
  array: Yup.ArraySchema<T[], Yup.AnyObject>;
};

export interface FieldOptions<T> {
  required?: boolean;
  extraRules?: (schema: T) => T;
  minItems?: number;
}

// ************ Validation Yup schema End ***********

// ************ Common Api Data Type Start ***********

export interface PageState {
  page: number;
  limit: number;
  totalPages: number;
}

export interface PageStatus {
  totalData: number;
  state: PageState;
}

export interface MessageStatus {
  status?: number;
  message?: string;
  error?: Record<string, unknown>;
}

export interface CommonDataType {
  _id: string;
  isDeleted?: boolean;
  createdBy?: null;
  updatedBy?: null;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface AddressBase {
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  pinCode?: string;
}

// ************ Common Api Data Type End ***********


// ************ Breadcrumb Start ***********

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  maxItems?: number;
}

// ************ Breadcrumb Start ***********
export interface PhoneNumberType {
  countryCode?: string;
  number?: string;
}

export interface HeaderBrandProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

export interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
}

export interface SidebarProps {
  isExpanded: boolean;
}


export interface AuthStateProps {
  isAuthenticated: boolean;
  user: User | null;
}

export type LayoutStateProps = {
    isExpanded: boolean;
    isMobileOpen: boolean;
    isMobile: boolean;
    isHovered: boolean;
    isApplicationMenuOpen: boolean;
    openSubmenu: string | null;
    isToggleTheme: string;
    adminSetting: AdminSettingBase | null;
};


// page
export interface HeroSectionProps {
  name: string;
  goalPercentage: number;
  goalText: string;
}

export interface StatsGridProps {
  stats: StatItem[];
}

export interface UseCountUpProps {
    end: number;
    duration?: number; 
}

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface FormField {
  name: string | string[];
  label: string;
  rules?: Rule[];
  placeholder?: string;
  type?: 'text' | 'textarea';
}


export interface CourseFormValuesProps {
  title: string;
  instructor: string;
  price: string;
  category: string;
}


export type SelectOptionType = {
  label: string;
  value: string;
  [key: string]: any;
};

export interface AdvancedSearchFilterOption<T= any> {
  label: string;
  options: SelectOptionType[];
  value?: string | string[];
  onChange: (value: T) => void;   
  multiple?: boolean;
  limitTags?: number;
  grid?: ColProps;
  isLoading?: boolean;
}

export interface AdvancedSearchProps<T= any> {
  children?: ReactNode;
  filter?: AdvancedSearchFilterOption<T>[];
  defaultExpanded?: boolean;
}


export interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: UserTable) => void;
  editingUser: UserTable | null;
}

export interface Workshop {
  id: number;
  title: string;
  date: string;
  time?: string;
  tag: string;
  actionText: string;
}

export interface DashboardThemeToggleProps {
  isDark: boolean;
  setIsDark: (val: boolean) => void;
}

// ************ COntact Start ***********
export interface ContactFormProps {
  initialValues: any;
  onSubmit: (values: any) => void;
}
// ************ Contact End ***********


// ************ Modal Start ***********

export interface CommonModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
  title?: string;
  subTitle?: string;
}

type UploadType = "image" | "pdf";

export interface ModalStateSlice {
  isUploadModal: { open: boolean; type: UploadType; multiple?: boolean };
  selectedFiles: string[];
  isWorkShopModal: { open: boolean; data: WorkshopBase | null };
  isCourseModal: { open: boolean; data: CourseBase | null };
}

// ************ Modal End ***********

// ************ Delete Start ***********

export interface CommonDeleteModalProps {
  open: boolean;
  title?: string;
  description?: string;
  itemName?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

// ************ Delete End ***********