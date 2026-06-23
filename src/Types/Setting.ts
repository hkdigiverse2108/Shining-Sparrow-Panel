import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface SocialMediaLinks {
    facebook?: string | null;
    twitter?: string | null;
    instagram?: string | null;
    linkedin?: string | null;
}

export interface SettingFormValues {
    logo?: string;
    razorpayKey?: string;
    razorpaySecret?: string;
    enrolledLearners?: number;
    classCompleted?: number;
    satisfactionRate?: number;
    link?: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
    socialMediaLinks?: SocialMediaLinks;
}

export type AddSettingPayload = SettingFormValues;

export type UpdateSettingPayload = Omit<SettingFormValues, 'razorpaySecret'> & {
    razorpaySecret?: string;
};

export type SettingBase = Omit<SettingFormValues, 'razorpaySecret'> & CommonDataType & {
    isDeleted: boolean;
    razorpaySecret?: string; 
    socialMediaLinks: SocialMediaLinks; 
    enrolledLearners: number;
    classCompleted: number;
    satisfactionRate: number;
};

export interface SettingApiResponse extends MessageStatus {
    data: SettingBase;
}

export interface SettingDataResponse extends PageStatus {
    setting_data: SettingBase[];
    totalData: number;
}

export interface SettingListApiResponse extends MessageStatus {
    data: SettingDataResponse;
}