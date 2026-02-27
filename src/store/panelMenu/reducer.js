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

const INIT_STATE = {
  homeMenu: [],
  wabaMenu: [],
  crmMenu: [],
  botMenu: [],
  automationMenu: [],
  vnMenu: [],
  workspaceMenu: [],
  profileMenu: [],
  error: {},
};

const PanelMenu = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_HOME_MENU:
          return {
            ...state,
            homeMenu: action.payload.data,
          };
        case GET_WABA_MENU:
          return {
            ...state,
            wabaMenu: action.payload.data,
          };
        case GET_CRM_MENU:
          return {
            ...state,
            crmMenu: action.payload.data,
          };
        case GET_BOT_MENU:
          return {
            ...state,
            botMenu: action.payload.data,
          };
        case GET_AUTOMATION_MENU:
          return {
            ...state,
            automationMenu: action.payload.data,
          };
        case GET_VN_MENU:
          return {
            ...state,
            vnMenu: action.payload.data,
          };
        case GET_WORKSPACE_MENU:
          return {
            ...state,
            workspaceMenu: action.payload.data,
          };
        case GET_PROFILE_MENU:
          return {
            ...state,
            profileMenu: action.payload.data,
          };
        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_HOME_MENU:
          return {
            ...state,
            error: action.payload.error,
          };
        case GET_WABA_MENU:
          return {
            ...state,
            error: action.payload.error,
          };
        case GET_CRM_MENU:
          return {
            ...state,
            error: action.payload.error,
          };
        case GET_BOT_MENU:
          return {
            ...state,
            error: action.payload.error,
          };
        case GET_AUTOMATION_MENU:
          return {
            ...state,
            error: action.payload.error,
          };
        case GET_VN_MENU:
          return {
            ...state,
            error: action.payload.error,
          };
        case GET_WORKSPACE_MENU:
          return {
            ...state,
            error: action.payload.error,
          };
        case GET_PROFILE_MENU:
          return {
            ...state,
            error: action.payload.error,
          };
        default:
          return { ...state };
      }

    case GET_PROFILE_MENU:
      return {
        ...state,
      };

    case RESET_PANEL_MENU:
      var flag = action.payload.flag;
      var value = action.payload.value;
      var flags = {};
      flags[flag] = value;

      return {
        ...state,
        ...flags,
      };

    default:
      return { ...state };
  }
};

export default PanelMenu;
