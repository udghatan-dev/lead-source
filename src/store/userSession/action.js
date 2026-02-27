import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_USER_RNP,
  RESET_USER_RNP,
  GET_USER_STOKEN,
  GET_USER_WALLET_BALANCE,
} from './actionType';

// common success
export const userSessionApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const userSessionApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getUserRNP = (data) => ({
  type: GET_USER_RNP,
  payload: data,
});

export const getUserToken = (data) => ({
  type: GET_USER_STOKEN,
  payload: data,
});

export const getUserWallet = (data) => ({
  type: GET_USER_WALLET_BALANCE,
  payload: data,
});

export const resetUserSession = (flag, value) => ({
  type: RESET_USER_RNP,
  payload: { flag, value },
});
