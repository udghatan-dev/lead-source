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

const INIT_STATE = {
  apiResponse: {},
  error: {},
};

const ImageExp = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case CREATE_IMAGE_EXP:
          return {
            ...state,
            isImageExpCreated: true,
            apiResponse: action.payload.data,
          };
        case FIND_IMAGE_EXP:
          return {
            ...state,
            isImageExpFound: true,
            apiResponse: action.payload.data,
          };
        case DELETE_IMAGE_EXP:
          return {
            ...state,
            isImageExpDeleted: true,
            apiResponse: action.payload.data,
          };
        case LIST_IMAGE_EXP:
          return {
            ...state,
            isImageExpListed: true,
            apiResponse: action.payload.data,
          };
        case UPDATE_IMAGE_EXP:
          return {
            ...state,
            isImageExpUpdated: true,
            apiResponse: action.payload.data,
          };
        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case CREATE_IMAGE_EXP:
          return {
            ...state,
            error: action.payload.error,
          };
        case FIND_IMAGE_EXP:
          return {
            ...state,
            error: action.payload.error,
          };
        case LIST_IMAGE_EXP:
          return {
            ...state,
            error: action.payload.error,
          };
        case DELETE_IMAGE_EXP:
          return {
            ...state,
            error: action.payload.error,
          };
        case UPDATE_IMAGE_EXP:
          return {
            ...state,
            error: action.payload.error,
          };
        default:
          return { ...state };
      }

    case RESET_IMAGE_EXP:
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

export default ImageExp;
