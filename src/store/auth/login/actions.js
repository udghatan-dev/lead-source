import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  LOGIN_USER,
  UPDATE_ACCOUNT,
  VERIFY_USER,
  LOGIN_AS,
  GET_PANEL_USER,
  EXPORT_PANEL_USER,
  RESET_PASSWORD,
  LOGIN_SUCCESS,
  USER_PROFILE,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  LOGIN_STATE_RESET,
  API_ERROR,
  SOCIAL_LOGIN,
  GET_USER_CONSENT_STATUS,
  REGISTER_USER_CONSENT_STATUS,
} from './actionTypes';

// common success
export const loginApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const loginApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const loginUser = (user, history) => {
  return {
    type: LOGIN_USER,
    payload: { user, history },
  };
};

export const userProfile = (data) => {
  return {
    type: USER_PROFILE,
    payload: data,
  };
};

export const getPanelUser = (data) => {
  return {
    type: GET_PANEL_USER,
    payload: data,
  };
};

export const exportPanelUser = (data) => {
  return {
    type: EXPORT_PANEL_USER,
    payload: data,
  };
};

export const verifyUser = (data) => {
  return {
    type: VERIFY_USER,
    payload: data,
  };
};

export const loginAs = (data) => {
  return {
    type: LOGIN_AS,
    payload: data,
  };
};

export const resetPassword = (data) => {
  return {
    type: RESET_PASSWORD,
    payload: data,
  };
};

export const getUserConsentStatus = (data) => {
  return {
    type: GET_USER_CONSENT_STATUS,
    payload: data,
  };
};

export const registerUserConsentStatus = (data) => {
  return {
    type: REGISTER_USER_CONSENT_STATUS,
    payload: data,
  };
};

export const loginSuccess = (user) => {
  return {
    type: LOGIN_SUCCESS,
    payload: user,
  };
};

export const updateAccount = (data) => {
  return {
    type: UPDATE_ACCOUNT,
    payload: data,
  };
};

export const logoutUser = (history) => {
  return {
    type: LOGOUT_USER,
    payload: { history },
  };
};

export const logoutUserSuccess = () => {
  return {
    type: LOGOUT_USER_SUCCESS,
    payload: {},
  };
};

export const apiError = (error) => {
  return {
    type: API_ERROR,
    payload: error,
  };
};

export const resetLogin = (flag, value) => ({
  type: LOGIN_STATE_RESET,
  payload: { flag, value },
});

export const socialLogin = (data, history, type) => {
  return {
    type: SOCIAL_LOGIN,
    payload: { data, history, type },
  };
};
