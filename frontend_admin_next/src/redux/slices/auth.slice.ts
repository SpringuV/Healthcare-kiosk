import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginThunk } from './user.thunk';
import { LoginResponseData } from '@/types/auth';

// Define the shape of the auth state
interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

// Define the User interface (adjust according to your needs)
interface User {
    _id: string;
    role?: string;
    // Add other user properties as needed
}

// Define the initial state
const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null,
};

// Create the auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Start login process
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        // Login success
        loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.loading = false;
            state.error = null;
        },

        // Login failure
        loginFailure: (state, action: PayloadAction<string>) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.loading = false;
            state.error = action.payload;
        },

        // Logout
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.loading = false;
            state.error = null;
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Set loading state
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        // Update user info
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },

        // Set authentication from stored data (e.g., localStorage)
        setAuthFromStorage: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
    },
    extraReducers: (builder) => {
        builder
            // pending
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // fulfilled
            .addCase(loginThunk.fulfilled, (state, action: PayloadAction<LoginResponseData>) => {
                state.loading = false;
                state.isAuthenticated = true;
                // Fix: Backend trả về _id và role riêng biệt, không có user object
                state.user = {
                    _id: action.payload?._id ?? '',  // Lấy trực tiếp từ _id, fallback về chuỗi rỗng nếu undefined
                    role: action.payload.role // Lấy trực tiếp từ role
                };
                state.token = action.payload.token_type;
                state.error = null;
            })
            // rejected
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                // action.payload là giá trị rejectWithValue, nếu không có payload fallback ra một string
                state.error = typeof action.payload === 'string' ? action.payload : "Login failed";
            });
    },
});

// Export actions
export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    clearError,
    setLoading,
    updateUser,
    setAuthFromStorage,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Các case quan trọng:
// pending (loginThunk.pending):
//     state.loading = true
//     state.error = null

// fulfilled (loginThunk.fulfilled):
//     state.isAuthenticated = true
//     state.user = action.payload.user
//     state.token = action.payload.token_type
//     state.loading = false
//     state.error = null

// rejected (loginThunk.rejected):
//     state.isAuthenticated = false
//     state.user = null
//     state.token = null
//     state.loading = false
//     state.error = action.payload (thông báo lỗi từ backend hoặc mặc định "Login failed")