import { call, put, takeEvery, all, fork } from "redux-saga/effects";

// Ecoomerce Redux States
import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_USER_ROLES,
  POST_USER_ROLES,
  UPDATE_USER_ROLES,
  DELETE_USER_ROLES,
  RESET_USER_ROLES
} from "./actionType";

import {
  userRolesApiResponseSuccess,
  userRolesApiResponseError,
} from "./action";

//Include Both Helper File with needed methods
import {
  getUserRoles as getUserRolesApi,
  postUserRoles as postUserRolesApi,
  updateUserRoles as updateUserRolesApi,
  deleteUserRoles as deleteUserRolesApi
} from "../../helpers/backend_helper";

function* getUserRoles({ payload: data }) {
  try {
    const response = yield call(getUserRolesApi, data);
    yield put(userRolesApiResponseSuccess(GET_USER_ROLES, response));
  } catch (error) {
    yield put(userRolesApiResponseError(GET_USER_ROLES, error));
  }
}

function* postUserRoles({ payload: data }) {
  try {
    const response = yield call(postUserRolesApi, data);
    yield put(userRolesApiResponseSuccess(POST_USER_ROLES, response));
  } catch (error) {
    yield put(userRolesApiResponseError(POST_USER_ROLES, error));
  }
}

function* updateUserRoles({ payload: data }) {
  try {
    const response = yield call(updateUserRolesApi, data);
    yield put(userRolesApiResponseSuccess(UPDATE_USER_ROLES, response));
  } catch (error) {
    yield put(userRolesApiResponseError(UPDATE_USER_ROLES, error));
  }
}

function* deleteUserRoles({ payload: data }) {
  try {
    const response = yield call(deleteUserRolesApi, data);
    yield put(userRolesApiResponseSuccess(DELETE_USER_ROLES, response));
  } catch (error) {
    yield put(userRolesApiResponseError(DELETE_USER_ROLES, error));
  }
}

export function* watchGetUserRoles() {
  yield takeEvery(GET_USER_ROLES, getUserRoles);
}

export function* watchPostUserRoles() {
  yield takeEvery(POST_USER_ROLES, postUserRoles);
}

export function* watchUpdateUserRoles() {
  yield takeEvery(UPDATE_USER_ROLES, updateUserRoles);
}

export function* watchDeleteUserRoles() {
  yield takeEvery(DELETE_USER_ROLES, deleteUserRoles);
}

function* UserRolesSaga() {
  yield all([
    fork(watchGetUserRoles),
    fork(watchPostUserRoles),
    fork(watchUpdateUserRoles),
    fork(watchDeleteUserRoles),
  ]);
}

export default UserRolesSaga;
