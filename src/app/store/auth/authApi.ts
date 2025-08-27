import { api } from "../apiClient";

export type ApiLoginResponse = {
  accessToken: string;
  user: { id: number; role: 'CUSTOMER' | 'DRIVER' | 'ADMIN'; email?: string | null };
};


export function postLogin(payload: { email: string; password: string }) {
  return api.post<ApiLoginResponse>('/auth/login', payload, { auth: false });
}
