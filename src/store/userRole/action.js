import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_USER_ROLES,
  POST_USER_ROLES,
  UPDATE_USER_ROLES,
  DELETE_USER_ROLES,
  RESET_USER_ROLES
} from "./actionType";

// common success
export const userRolesApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const userRolesApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getUserRoles = (data) => ({
  type: GET_USER_ROLES,
  payload: data
})

export const postUserRoles = (data) => ({
  type: POST_USER_ROLES,
  payload: data
})

export const updateUserRoles = (data) => ({
  type: UPDATE_USER_ROLES,
  payload: data
})

export const deleteUserRoles = (data) => ({
  type: DELETE_USER_ROLES,
  payload: data
})

export const resetUserRoles = (flag, value) => ({
  type: RESET_USER_ROLES,
  payload: { flag, value },
});