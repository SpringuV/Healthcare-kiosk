// services/api.ts → instance axios + core request
import axios, { AxiosRequestConfig } from "axios";
// import https from "https";

type DataType = object | string | number | boolean | FormData | ArrayBuffer | Blob;

//Tạo httpsAgent để bỏ verify self-signed cert dev
// const httpsAgent = new https.Agent({ rejectUnauthorized: false });

//Tạo instance mặc định
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    timeout: 15000,
    withCredentials: true,
    // httpsAgent, // production thì bỏ ra
});

// Xử lý data → headers/body
function prepareRequest(data?: DataType): { body?: DataType; headers: Record<string, string> } {
    const headers: Record<string, string> = {};
    let body: DataType | undefined = data;

    if (data instanceof FormData) {
        headers["Content-Type"] = "multipart/form-data";
    } else if (data instanceof Blob || data instanceof ArrayBuffer) {
        headers["Content-Type"] = "application/octet-stream";
    } else if (typeof data === "string") {
        try {
            JSON.parse(data);
            headers["Content-Type"] = "application/json";
        } catch {
            headers["Content-Type"] = "text/plain";
        }
    } else if (typeof data === "number" || typeof data === "boolean") {
        headers["Content-Type"] = "text/plain";
        body = String(data);
    } else if (typeof data === "object" && data !== null) {
        headers["Content-Type"] = "application/json";
    }

    return { body, headers };
}

//  Core request
async function request<T>(
    method: "get" | "post" | "put" | "delete" | "patch",
    path: string,
    data?: DataType,
    params?: Record<string, unknown>,
    headers?: Record<string, string>
) {
    const { body, headers: dynamicHeaders } = prepareRequest(data);

    const config: AxiosRequestConfig = {
        method,
        url: path,
        params,
        headers: { ...dynamicHeaders, ...headers },
        data: body,
        // httpsAgent, //chắc chắn mỗi request cũng có agent
    };

    const res = await api.request<T>(config);
    return res;
}

// Export helpers
export const get = <T>(path: string, params?: Record<string, unknown>, headers?: Record<string, string>) =>
    request<T>("get", path, undefined, params, headers);

export const post = <T>(path: string, data?: DataType, params?: Record<string, unknown>, headers?: Record<string, string>) =>
    request<T>("post", path, data, params, headers);

export const put = <T>(path: string, data: DataType, params?: Record<string, unknown>, headers?: Record<string, string>) =>
    request<T>("put", path, data, params, headers);

export const del = <T>(path: string, params?: Record<string, unknown>, headers?: Record<string, string>) =>
    request<T>("delete", path, undefined, params, headers);
