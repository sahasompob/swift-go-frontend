import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserInfo = {
  id: number | null;
  role: "CUSTOMER" | "DRIVER" | "ADMIN" | null;
  email?: string | null;
};

export interface AuthState {
  accessToken: string | null;
  user: UserInfo;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  user: { id: null, role: null, email: null },
  isAuthenticated: false,
  loading: false,
  error: null,
};

type LoginRequestPayload = { email: string; password: string };
type LoginSuccessPayload = {
  accessToken: string;
  user: { id: number; role: UserInfo["role"]; email?: string | null };
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state, _action: PayloadAction<LoginRequestPayload>) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<LoginSuccessPayload>) => {
      const { accessToken, user } = action.payload;
      state.accessToken = accessToken;
      state.user = {
        id: user.id,
        role: user.role ?? null,
        email: user.email ?? null,
      };
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.user = { id: null, role: null, email: null };
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = { id: null, role: null, email: null };
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } =
  authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuth = (s: any) => s.auth as AuthState;
export const selectToken = (s: any) => (s.auth as AuthState).accessToken;
export const selectUser = (s: any) => (s.auth as AuthState).user;
export const selectIsAuthed = (s: any) => (s.auth as AuthState).isAuthenticated;
export const selectAuthLoading = (s: any) => (s.auth as AuthState).loading;
export const selectAuthError = (s: any) => (s.auth as AuthState).error;
