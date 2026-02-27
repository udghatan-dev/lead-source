import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  CREATE_IMAGE_EXP,
  LIST_IMAGE_EXP,
  UPDATE_IMAGE_EXP,
  FIND_IMAGE_EXP,
  DELETE_IMAGE_EXP,
  RESET_IMAGE_EXP,
} from './actionType';

// common success
export const imageExpApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const imageExpApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const createImageExp = (data) => ({
  type: CREATE_IMAGE_EXP,
  payload: data,
});

export const listImageExp = (data) => ({
  type: LIST_IMAGE_EXP,
  payload: data,
});

export const deleteImageExp = (data) => ({
  type: DELETE_IMAGE_EXP,
  payload: data,
});

export const findImageExp = (data) => ({
  type: FIND_IMAGE_EXP,
  payload: data,
});

export const updateImageExp = (data) => ({
  type: UPDATE_IMAGE_EXP,
  payload: data,
});

export const resetImageExp = (flag, value) => ({
  type: RESET_IMAGE_EXP,
  payload: { flag, value },
});
