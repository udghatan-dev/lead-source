import { API_RESPONSE_SUCCESS, API_RESPONSE_ERROR, REGISTER_USER, RESET_REGISTER_USER, GET_CURRENCIES } from './actionTypes';

// common success
export const registerApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const registerApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const registerUser = (data) => {
  return {
    type: REGISTER_USER,
    payload: data,
  };
};

export const getCurrency = (data) => {
  return {
    type: GET_CURRENCIES,
    payload: data,
  };
};

export const resetregister = (flag, value) => ({
  type: RESET_REGISTER_USER,
  payload: { flag, value },
});
