import { notification } from "antd";

type NotificationType = "success" | "error" | "warning" | "info"
export const useAppNotification = () => {
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (messageTitle: string, description: string, type: NotificationType) => {
        api[type]({
            message: messageTitle,
            description: description,
        });
    };

    return { contextHolder, openNotificationWithIcon }
}