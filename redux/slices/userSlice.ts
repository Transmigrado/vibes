import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    user: any | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    loading: false,
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
    },
});

export const { loginRequest, loginSuccess, loginFailure, logout } = userSlice.actions;
export default userSlice.reducer;
