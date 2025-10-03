import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserSliceType = {
    username: string;
    access_token: string;
    _id: string;
    role: string;
}

const initialState: UserSliceType = {
    username: "",
    access_token: "",
    _id: "",
    role: "",
}

const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserSliceType>)=>{
            state._id = action.payload._id;
            state.access_token = action.payload.access_token;
            state.role = action.payload.role;
            state.username = action.payload.username;
        },
    }
})

export const { setUser } = userSlice.actions;
export default userSlice.reducer;