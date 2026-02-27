import { call, put, takeEvery, all, fork } from 'redux-saga/effects';

// Ecoomerce Redux States
import { API_RESPONSE_SUCCESS, API_RESPONSE_ERROR, REGISTER_USER, RESET_REGISTER_USER, GET_CURRENCIES } from './actionTypes';

import { registerApiResponseSuccess, registerApiResponseError } from './actions';

//Include Both Helper File with needed methods
import { postRegister, getCurrencyList } from '../../../helpers/backend_helper';

function* registerUser({ payload: data }) {
  try {
    const response = yield call(postRegister, data);
    yield put(registerApiResponseSuccess(REGISTER_USER, response));
  } catch (error) {
    yield put(registerApiResponseError(REGISTER_USER, error));
  }
}

function* getCurrency({ payload: data }) {
  try {
    const response = yield call(getCurrencyList, data);
    yield put(registerApiResponseSuccess(GET_CURRENCIES, response));
  } catch (error) {
    yield put(registerApiResponseError(GET_CURRENCIES, error));
  }
}

export function* watchCreateregister() {
  yield takeEvery(REGISTER_USER, registerUser);
}

export function* watchGetCurrencies() {
  yield takeEvery(GET_CURRENCIES, getCurrency);
}

function* registerSaga() {
  yield all([fork(watchCreateregister), fork(watchGetCurrencies)]);
}

export default registerSaga;
