import { call, put, takeEvery, all, fork } from 'redux-saga/effects';

// Image Experience
import { CREATE_IMAGE_EXP, LIST_IMAGE_EXP, UPDATE_IMAGE_EXP, FIND_IMAGE_EXP, DELETE_IMAGE_EXP } from './actionType';

import { imageExpApiResponseSuccess, imageExpApiResponseError } from './action';

//Include Both Helper File with needed methods
import {
  createImageExp as createImageExpApi,
  listImageExp as listImageExpApi,
  updateImageExp as updateImageExpApi,
  fetchImageExp as findImageExpApi,
  deleteImageExp as deleteImageExpApi,
} from '../../../helpers/backend_helper';

function* postImageExp({ payload: data }) {
  try {
    const response = yield call(createImageExpApi, data);
    yield put(imageExpApiResponseSuccess(CREATE_IMAGE_EXP, response));
  } catch (error) {
    yield put(imageExpApiResponseError(CREATE_IMAGE_EXP, error));
  }
}

function* listImageExp({ payload: data }) {
  try {
    const response = yield call(listImageExpApi, data);
    yield put(imageExpApiResponseSuccess(LIST_IMAGE_EXP, response));
  } catch (error) {
    yield put(imageExpApiResponseError(LIST_IMAGE_EXP, error));
  }
}

function* updateImageExp({ payload: data }) {
  try {
    const response = yield call(updateImageExpApi, data);
    yield put(imageExpApiResponseSuccess(UPDATE_IMAGE_EXP, response));
  } catch (error) {
    yield put(imageExpApiResponseError(UPDATE_IMAGE_EXP, error));
  }
}

function* findImageExp({ payload: data }) {
  try {
    const response = yield call(findImageExpApi, data);
    yield put(imageExpApiResponseSuccess(FIND_IMAGE_EXP, response));
  } catch (error) {
    yield put(imageExpApiResponseError(FIND_IMAGE_EXP, error));
  }
}

function* deleteImageExp({ payload: data }) {
  try {
    const response = yield call(deleteImageExpApi, data);
    yield put(imageExpApiResponseSuccess(DELETE_IMAGE_EXP, response));
  } catch (error) {
    yield put(imageExpApiResponseError(DELETE_IMAGE_EXP, error));
  }
}

export function* watchPostImageExp() {
  yield takeEvery(CREATE_IMAGE_EXP, postImageExp);
}

export function* watchListImageExp() {
  yield takeEvery(LIST_IMAGE_EXP, listImageExp);
}

export function* watchUpdateImageExp() {
  yield takeEvery(UPDATE_IMAGE_EXP, updateImageExp);
}

export function* watchFindImageExp() {
  yield takeEvery(FIND_IMAGE_EXP, findImageExp);
}

export function* watchDeleteImageExp() {
  yield takeEvery(DELETE_IMAGE_EXP, deleteImageExp);
}

function* ImageExpSaga() {
  yield all([
    fork(watchPostImageExp),
    fork(watchListImageExp),
    fork(watchUpdateImageExp),
    fork(watchFindImageExp),
    fork(watchDeleteImageExp),
  ]);
}

export default ImageExpSaga;
