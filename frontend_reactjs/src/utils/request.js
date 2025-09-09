import { DOMAIN } from "../data/port"

export const get = async (path) => {
    try {
        const response = await fetch(`${DOMAIN}${path}`)
        const data = await response.json().catch(() => ({})) // tránh lỗi nếu không có body JSON
        return { status: response.status, ok: response.ok, data, error: !response.ok ? (data.message || "Request failed") : null }
    } catch (error) {
        console.error("Fetch POST error:", error)
        return { status: 500, ok: false, data: { message: "Network error" } }
    }
}

export const post = async (path, dataRequest) => {
    try {
        const response = await fetch(`${DOMAIN}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataRequest)
        })
        const data = await response.json().catch(() => ({})) // tránh lỗi nếu không có body JSON
        return { status: response.status, ok: response.ok, data, error: !response.ok ? (data.message || "Request failed") : null }
    } catch (error) {
        console.error("Fetch POST error:", error)
        return { status: 500, ok: false, data: { message: "Network error" } }
    }
}

export const put = async (path, dataRequest) => {
    try {
        const response = await fetch(`${DOMAIN}${path}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataRequest)
        })
        const data = await response.json().catch(() => ({})) // tránh lỗi nếu không có body JSON
        return { status: response.status, ok: response.ok, data, error: !response.ok ? (data.message || "Request failed") : null }
    } catch (error) {
        console.error("Fetch POST error:", error)
        return { status: 500, ok: false, data: { message: "Network error" } }
    }
}

export const del = async (path) => {
    try {
        const response = await fetch(`${DOMAIN}${path}`, {
            method: 'DELETE'
        })
        const data = await response.json().catch(() => ({})) // tránh lỗi nếu không có body JSON
        return { status: response.status, ok: response.ok, data, error: !response.ok ? (data.message || "Request failed") : null }
    } catch (error) {
        console.error("Fetch POST error:", error)
        return { status: 500, ok: false, data: { message: "Network error" } }
    }
}