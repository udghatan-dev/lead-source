import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  CREATE_PDF_EXP,
  LIST_PDF_EXP,
  UPDATE_PDF_EXP,
  FIND_PDF_EXP,
  DELETE_PDF_EXP,
  RESET_PDF_EXP,
  FETCH_PDF_CREDIT
} from './actionType';

// common success
export const pdfExpApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const pdfExpApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const createPdfExp = (data) => ({
  type: CREATE_PDF_EXP,
  payload: data,
});

export const listPdfExp = (data) => ({
  type: LIST_PDF_EXP,
  payload: data,
});

export const deletePdfExp = (data) => ({
  type: DELETE_PDF_EXP,
  payload: data,
});

export const findPdfExp = (data) => ({
  type: FIND_PDF_EXP,
  payload: data,
});

export const updatePdfExp = (data) => ({
  type: UPDATE_PDF_EXP,
  payload: data,
});

export const resetPdfExp = (flag, value) => ({
  type: RESET_PDF_EXP,
  payload: { flag, value },
});

// Add these credit actions
export const fetchPdfCredit = () => ({
  type: FETCH_PDF_CREDIT,
  payload: {},
});