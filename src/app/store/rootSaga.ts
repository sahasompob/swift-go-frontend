import { all, fork } from 'redux-saga/effects';
import authSaga from './auth/authSaga';
import bookingSaga from './booking/bookingSaga';



export default function* rootSaga() {
    yield all([
    fork(bookingSaga),
    fork(authSaga),
  ]);
}
