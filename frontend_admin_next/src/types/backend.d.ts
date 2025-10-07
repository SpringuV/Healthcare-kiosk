/* eslint-disable @typescript-eslint/no-explicit-any */
export { };
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
    interface IRequest {
        url: string;
        method: string;
        body?: { [key: string]: any };
        queryParams?: any;
        useCredentials?: boolean;
        headers?: any;
        nextOption?: any;
    }

    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }

    interface ILogin {
        user: {
            id: string;
            username: string;
            email: string;
            realname: string;
            isVerify: boolean;
            type: string;
            role: string;
        },
        access_token: string;
        refresh_token: string;
        token_type: string;
        expires_in: number;  // seconds
        refresh_expires_in: number;  // seconds
        session_id: string;
    }

    interface ISession {
        access_token: string;
        refresh_token: string;
        token_type: string;
        expires_in: number;
        session_id: string;
        user: {
            id: string;
            username: string;
            email: string;
            realname: string;
            isVerify: boolean;
            type: string;
            role: string;
        }
    }

    interface AdminHeaderProps {
        colorBackground: string;
        session: ISession;
    }
}
