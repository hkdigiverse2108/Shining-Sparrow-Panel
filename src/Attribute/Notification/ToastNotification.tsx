import { notification } from "antd";
import type { NotificationType } from "@/Types/Common";

const ToastNotification = () => null;

export default ToastNotification;

// eslint-disable-next-line react-refresh/only-export-components
export const showNotification = (type: NotificationType, title: string, description?: string) => {
  const isMobile = window.innerWidth < 768;
  notification.open({
    type,
    message: title,
    description,
    placement: isMobile ? "top" : "topRight",
    duration: 3,
    className: isMobile
      ? `common-notification common-notification-${type} notification-mobile`
      : `common-notification common-notification-${type}`,
  });
};