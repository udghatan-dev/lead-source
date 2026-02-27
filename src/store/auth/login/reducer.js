import {
  API_RESPONSE_SUCCESS,
  LOGIN_USER,
  UPDATE_ACCOUNT,
  VERIFY_USER,
  LOGIN_AS,
  GET_PANEL_USER,
  EXPORT_PANEL_USER,
  RESET_PASSWORD,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  LOGIN_STATE_RESET,
  USER_PROFILE,
  API_ERROR,
  GET_USER_CONSENT_STATUS,
  REGISTER_USER_CONSENT_STATUS,
} from './actionTypes';

const initialState = {
  error: '',
  user: '',
  userProfile: {},
  panelUser: {},
  exportData: {},
  apiResponse: {},
  loading: false,
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case VERIFY_USER:
          state = {
            ...state,
            isUserVerified: true,
            apiResponse: action.payload.data,
          };
          break;
        case USER_PROFILE:
          state = {
            ...state,
            isProfiledFetched: true,
            userProfile: action.payload.data,
          };
          break;
        case GET_PANEL_USER:
          state = {
            ...state,
            panelUser: action.payload.data,
          };
          break;
        case GET_USER_CONSENT_STATUS:
          state = {
            ...state,
            isUserConsentFetched: true,
            apiResponse: action.payload.data,
          };
          break;
        case REGISTER_USER_CONSENT_STATUS:
          state = {
            ...state,
            isUserConsentRegistered: true,
            apiResponse: action.payload.data,
          };
          break;
        case EXPORT_PANEL_USER:
          state = {
            ...state,
            isExportCompleted: true,
            exportData: action.payload.data,
          };
          break;
        case LOGIN_AS:
          state = {
            ...state,
            isLoggedInAsUser: true,
            apiResponse: action.payload.data,
          };
          break;
        case UPDATE_ACCOUNT:
          state = {
            ...state,
            isAccountUpdated: true,
            apiResponse: action.payload.data,
          };
          break;
        case RESET_PASSWORD:
          state = {
            ...state,
            isPassReset: true,
            apiResponse: action.payload.data,
          };
          break;
        default:
          return { ...state };
      }
    case LOGIN_USER:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOGIN_SUCCESS:
      state = {
        ...state,
        user: action.payload,
        loading: false,
      };
      break;
    case LOGOUT_USER:
      state = { ...state, isUserLogout: false };
      break;
    case LOGOUT_USER_SUCCESS:
      state = { ...state, isUserLogout: true };
      break;
    case API_ERROR:
      state = {
        ...state,
        error: action.payload,
        loading: false,
        isUserLogout: false,
      };
      break;
    case LOGIN_STATE_RESET:
      var flag = action.payload.flag;
      var value = action.payload.value;
      var flags = {};
      flags[flag] = value;

      return {
        ...state,
        ...flags,
      };
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default login;
