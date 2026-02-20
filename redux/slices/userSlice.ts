import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    user: any | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    loading: true,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginRequest: (state, action: PayloadAction<any>) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.user = action.payload;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
        checkSession: (state) => {
            state.loading = true;
        },
    },
});

export const { loginRequest, loginSuccess, loginFailure, logout, checkSession } = userSlice.actions;
export default userSlice.reducer;
