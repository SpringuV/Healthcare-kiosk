import { message } from "antd";

type messageType = "success" | "error" | "warning" | "info" | "loading"
export const useAppMessageNotification = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const openMessageNotification = (type: messageType, content: string, duration?: number, icon?: React.ReactNode)  => {
        messageApi.open({
            type: type,
            content: content,
            duration: duration,
            icon: icon
        });
    }

    return { contextHolder, openMessageNotification }
}