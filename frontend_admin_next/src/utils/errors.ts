/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthError } from "next-auth";

export class CustomAuthError extends AuthError {
    static type: string;

    constructor(message?: any) {
        super();

        this.type = message;
    }
}

export class InvalidEmailPasswordError extends AuthError {
    static type = "InvalidEmailPassword"
}

export class AccountBeingUsedError extends AuthError {
    static type = "AccountBeingUsed"
}
export class AccountLockedError extends AuthError {
    static type = "AccountLocked"
}

export class AccountNotFoundError extends AuthError {
    static type = "AccountNotFound"
}