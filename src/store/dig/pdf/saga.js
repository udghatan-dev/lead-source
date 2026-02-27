import { call, put, takeEvery, all, fork } from 'redux-saga/effects';

// Image Experience
import { CREATE_PDF_EXP, LIST_PDF_EXP, UPDATE_PDF_EXP, FIND_PDF_EXP, DELETE_PDF_EXP,  FETCH_PDF_CREDIT } from './actionType';

import { pdfExpApiResponseSuccess, 
  pdfExpApiResponseError,
 } from './action';

//Include Both Helper File with needed methods
import {
  createPdfExp as createPdfExpApi,
  listPdfExp as listPdfExpApi,
  updatePdfExp as updatePdfExpApi,
  fetchPdfExp as findPdfExpApi,
  deletePdfExp as deletePdfExpApi,
  fetchPdfCredit as fetchPdfCreditApi
} from '../../../helpers/backend_helper';


function* fetchPdfCreditSaga() {
  try {
    const response = yield call(fetchPdfCreditApi);
    yield put(pdfExpApiResponseSuccess(FETCH_PDF_CREDIT, response.data));
  } catch (error) {
    yield put(pdfExpApiResponseError(FETCH_PDF_CREDIT, error));
  }
}

function* postPdfExp({ payload: data }) {
  try {
    const response = yield call(createPdfExpApi, data);
    yield put(pdfExpApiResponseSuccess(CREATE_PDF_EXP, response));
  } catch (error) {
    yield put(pdfExpApiResponseError(CREATE_PDF_EXP, error));
  }
}

function* listPdfExp({ payload: data }) {
  try {
    const response = yield call(listPdfExpApi, data);
    yield put(pdfExpApiResponseSuccess(LIST_PDF_EXP, response));
  } catch (error) {
    yield put(pdfExpApiResponseError(LIST_PDF_EXP, error));
  }
}

function* updatePdfExp({ payload: data }) {
  try {
    const response = yield call(updatePdfExpApi, data);
    yield put(pdfExpApiResponseSuccess(UPDATE_PDF_EXP, response));
  } catch (error) {
    yield put(pdfExpApiResponseError(UPDATE_PDF_EXP, error));
  }
}

function* findPdfExp({ payload: data }) {
  try {
    const response = yield call(findPdfExpApi, data);
    yield put(pdfExpApiResponseSuccess(FIND_PDF_EXP, response));
  } catch (error) {
    yield put(pdfExpApiResponseError(FIND_PDF_EXP, error));
  }
}

function* deletePdfExp({ payload: data }) {
  try {
    const response = yield call(deletePdfExpApi, data);
    yield put(pdfExpApiResponseSuccess(DELETE_PDF_EXP, response));
  } catch (error) {
    yield put(pdfExpApiResponseError(DELETE_PDF_EXP, error));
  }
}

export function* watchPostPdfExp() {
  yield takeEvery(CREATE_PDF_EXP, postPdfExp);
}

export function* watchListPdfExp() {
  yield takeEvery(LIST_PDF_EXP, listPdfExp);
}

export function* watchUpdatePdfExp() {
  yield takeEvery(UPDATE_PDF_EXP, updatePdfExp);
}

export function* watchFindPdfExp() {
  yield takeEvery(FIND_PDF_EXP, findPdfExp);
}

export function* watchDeletePdfExp() {
  yield takeEvery(DELETE_PDF_EXP, deletePdfExp);
}

export function* watchFetchPdfCredit() {
  yield takeEvery(FETCH_PDF_CREDIT, fetchPdfCreditSaga);
}

function* PdfExpSaga() {
  yield all([
    fork(watchPostPdfExp),
    fork(watchListPdfExp),
    fork(watchUpdatePdfExp),
    fork(watchFindPdfExp),
    fork(watchDeletePdfExp),
    fork(watchFetchPdfCredit),
  ]);
}

export default PdfExpSaga;