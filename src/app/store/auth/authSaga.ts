// src/store/auth/authSaga.ts
import { call, put, takeLatest } from 'redux-saga/effects';
import { loginRequest, loginSuccess, loginFailure } from './authSlice';
import { postLogin } from './authApi'; 

interface ApiLoginResponse {
  accessToken: string;
  user: {
    id: number;
    role: 'CUSTOMER' | 'DRIVER' | 'ADMIN';
    email?: string | null;
  };
}

function* handleLogin({ payload }: ReturnType<typeof loginRequest>) {
  try {
    const res: ApiLoginResponse = yield call(postLogin, payload);
    yield put(
      loginSuccess({
        accessToken: res.accessToken,
        user: { id: res.user.id, role: res.user.role, email: res.user.email ?? null },
      })
    );
  } catch (err: any) {
    const message =
      (typeof err?.message === 'string' && err.message) || 'ไม่สามารถเข้าสู่ระบบได้';
    yield put(loginFailure(message)); 
  }
}

// Watcher
export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
}
