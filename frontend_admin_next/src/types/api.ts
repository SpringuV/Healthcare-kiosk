type LoginAccountType = {
    username: string;
    password: string;
}

type LoginResponseType = {
    message: string;
    user: {
        id: string;
        username: string;
        email: string;
        realname: string;
        isVerify: string;
        type: string;
        role: string;
    },
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: string;
    refresh_expires_in: string;
    session_id: string
}