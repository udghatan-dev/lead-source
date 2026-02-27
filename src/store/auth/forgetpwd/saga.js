import { takeEvery, fork, put, all, call } from 'redux-saga/effects';

// Login Redux States
import { FORGET_PASSWORD } from './actionTypes';
import { userForgetPasswordSuccess, userForgetPasswordError } from './actions';

import { postForgotPass } from '../../../helpers/backend_helper';

//If user is send successfully send mail link then dispatch redux action's are directly from here.
function* forgetUser({ payload: { user, history } }) {
  try {
    const response = yield call(postForgotPass, {
      email: user.email,
      panel: window.location.hostname,
      captcha: user.captcha,
    });
    if (response.success) {
      yield put(userForgetPasswordSuccess('Password Reset Link Send To Your Email, Kindly Check Your Inbox.'));
    } else {
      yield put(userForgetPasswordError(response.data !== undefined ? response.data : response.message));
    }
  } catch (error) {
    yield put(userForgetPasswordError(error));
  }
}

export function* watchUserPasswordForget() {
  yield takeEvery(FORGET_PASSWORD, forgetUser);
}

function* forgetPasswordSaga() {
  yield all([fork(watchUserPasswordForget)]);
}

export default forgetPasswordSaga;
