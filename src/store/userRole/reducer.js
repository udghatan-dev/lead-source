import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_USER_ROLES,
  POST_USER_ROLES,
  UPDATE_USER_ROLES,
  DELETE_USER_ROLES,
  RESET_USER_ROLES
} from "./actionType";

const INIT_STATE = {
  userRoles: [],
  apiResponse: {},
  error: {},
};

const UserRoles = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_USER_ROLES:
          return {
            ...state,
            userRoles: action.payload.data
          };
        case POST_USER_ROLES:
          return {
            ...state,
            isPosted: true,
            apiResponse: action.payload.data
          };
        case UPDATE_USER_ROLES:
          return {
            ...state,
            isUpdated: true,
            apiResponse: action.payload.data,
          };
        case DELETE_USER_ROLES:
          return {
            ...state,
            isDeleted: true,
            apiResponse: action.payload.data,
          };
        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_USER_ROLES:
          return {
            ...state,
            error: action.payload.error,
          };
        case POST_USER_ROLES:
          return {
            ...state,
            error: action.payload.error,
          };
        case UPDATE_USER_ROLES:
          return {
            ...state,
            error: action.payload.error,
          };
        case DELETE_USER_ROLES:
          return {
            ...state,
            error: action.payload.error,
          };
        default:
          return { ...state };
      }

    case RESET_USER_ROLES:
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

export default UserRoles;
