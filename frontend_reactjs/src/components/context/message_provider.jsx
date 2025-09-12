import { message } from "antd"

export const useMessageProvider = () => {
    const [messageApi, contextHolder] = message.useMessage()

    const success = (text) => {
        messageApi.open({ type: "success", content: text })
    }

    const error = (text) => {
        messageApi.open({ type: "error", content: text })
    }

    const warning = (text) => {
        messageApi.open({ type: "warning", content: text })
    }

    return { success, error, warning, contextHolder }
}