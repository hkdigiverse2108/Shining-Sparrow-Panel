import type { NotificationInstance } from "antd/es/notification/interface";

let notificationApi: NotificationInstance;

export const setNotificationApi = (api: NotificationInstance) => {
    notificationApi = api;
};

export const getNotificationApi = () => {
    return notificationApi;
};