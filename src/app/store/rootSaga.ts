import { all, fork, takeEvery } from 'redux-saga/effects';
import authSaga from './auth/authSaga';
import bookingSaga from './booking/bookingSaga';

function* debugAllActions() {
  yield takeEvery('*', function* (action: any) {
    console.log('[DEBUG] action:', action.type, action);
  });
}

export default function* rootSaga() {
    yield all([
    fork(bookingSaga),
    fork(authSaga),
    fork(debugAllActions)
  ]);
}
