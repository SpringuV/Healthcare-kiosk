/* eslint-disable @typescript-eslint/no-explicit-any */
// Kiểu dữ liệu chung gửi đi
export type DataType = object | string | number | boolean | FormData | ArrayBuffer | Blob;

// Kiểu của object params query
export type QueryParams = Record<string, unknown>;

// Kiểu response chung
export interface ApiResponse<T> {
  data: T;
  message?: string;
  [key: string]: any;
}