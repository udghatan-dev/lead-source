import { call, put, takeEvery, all, fork } from 'redux-saga/effects';
import { AES, enc } from 'crypto-js';
// User Session Management
import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_USER_RNP,
  GET_USER_STOKEN,
  RESET_USER_RNP,
  GET_USER_WALLET_BALANCE,
} from './actionType';

import { userSessionApiResponseSuccess, userSessionApiResponseError } from './action';

//Include Both Helper File with needed methods
import {
  getWalletBalance as getWalletBalanceApi,
  getUserRnP as getUserRnPApi,
  getUserSecretToken as getUserSecretTokenApi,
} from '../../helpers/backend_helper';

function* getUserWallet({ payload: data }) {
  try {
    const response = yield call(getWalletBalanceApi, data);
    yield put(userSessionApiResponseSuccess(GET_USER_WALLET_BALANCE, response));
  } catch (error) {
    yield put(userSessionApiResponseError(GET_USER_WALLET_BALANCE, error));
  }
}

function* getUserRNP({ payload: data }) {
  try {
    const response = yield call(getUserRnPApi, data);
    if (response.success) {
      yield put(userSessionApiResponseSuccess(GET_USER_RNP, response.data));
    } else {
      localStorage.removeItem('authToken');
    }
  } catch (error) {
    yield put(userSessionApiResponseError(GET_USER_RNP, error));
  }
}

function* getUserSecretToken({ payload: data }) {
  try {
    const response = yield call(getUserSecretTokenApi, data);
    if (response.success) {
      let s_k = window.location.origin;
      let bytes = AES.decrypt(response.token, s_k);
      let token = bytes.toString(enc.Utf8);
      yield put(userSessionApiResponseSuccess(GET_USER_STOKEN, token));
    } else {
      localStorage.removeItem('authToken');
      window.location.href = '/login?expired=1';
    }
  } catch (error) {
    yield put(userSessionApiResponseError(GET_USER_STOKEN, error));
  }
}

export function* watchGetUserRNP() {
  yield takeEvery(GET_USER_RNP, getUserRNP);
}

export function* watchGetUserWallet() {
  yield takeEvery(GET_USER_WALLET_BALANCE, getUserWallet);
}

export function* watchGetSecretToken() {
  yield takeEvery(GET_USER_STOKEN, getUserSecretToken);
}

function* UserSessionSaga() {
  yield all([fork(watchGetUserRNP), fork(watchGetUserWallet), fork(watchGetSecretToken)]);
}

export default UserSessionSaga;
