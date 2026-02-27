import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_WABA_MENU,
  GET_CRM_MENU,
  GET_HOME_MENU,
  GET_AUTOMATION_MENU,
  GET_VN_MENU,
  GET_WORKSPACE_MENU,
  GET_BOT_MENU,
  RESET_PANEL_MENU,
  GET_PROFILE_MENU,
} from './actionType';

// common success
export const panelMenuApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const panelMenuApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getWABAMenu = (data) => ({
  type: GET_WABA_MENU,
  payload: data,
});

export const getCRMMenu = (data) => ({
  type: GET_CRM_MENU,
  payload: data,
});

export const getHomeMenu = (data) => ({
  type: GET_HOME_MENU,
  payload: data,
});

export const getAutomtionMenu = (data) => ({
  type: GET_AUTOMATION_MENU,
  payload: data,
});

export const getBotMenu = (data) => ({
  type: GET_BOT_MENU,
  payload: data,
});

export const getWorkspaceMenu = (data) => ({
  type: GET_WORKSPACE_MENU,
  payload: data,
});

export const getVNMenu = (data) => ({
  type: GET_VN_MENU,
  payload: data,
});

export const getProfileMenu = (data) => ({
  type: GET_PROFILE_MENU,
  payload: data,
});

export const resetPanelMenu = (flag, value) => ({
  type: RESET_PANEL_MENU,
  payload: { flag, value },
});
