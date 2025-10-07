import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserSliceType = {
    id: string;
    username: string;
    email: string;
    realname: string;
    isVerify: boolean;
    type: string;
    role: string;
}

const initialState: UserSliceType = {
    id: "",
    username: "",
    email: "",
    realname: "",
    isVerify: false,
    type: "",
    role: "",
}

const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserSliceType>) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.role = action.payload.role;
            state.username = action.payload.username;
            state.isVerify = action.payload.isVerify;
            state.type = action.payload.type;
            state.role = action.payload.role;
        },
        clearUser: (state) => {
            state.id = "";
            state.username = "";
            state.email = "";
            state.realname = "";
            state.isVerify = false;
            state.type = "";
            state.role = "";
        }
    }
})

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;