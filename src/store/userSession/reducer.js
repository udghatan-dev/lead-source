import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_USER_RNP,
  RESET_USER_RNP,
  GET_USER_STOKEN,
  GET_USER_WALLET_BALANCE,
} from './actionType';

const INIT_STATE = {
  userRNP: {},
  userWallet: {},
  userToken: '',
  error: {},
};

const userSession = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_USER_RNP:
          return {
            ...state,
            userRNP: action.payload.data,
          };
        case GET_USER_STOKEN:
          return {
            ...state,
            userToken: action.payload.data,
          };
        case GET_USER_WALLET_BALANCE:
          return {
            ...state,
            userWallet: action.payload.data,
          };
        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_USER_RNP:
          return {
            ...state,
            error: action.payload.error,
          };
        case GET_USER_STOKEN:
          return {
            ...state,
            error: action.payload.error,
          };
        case GET_USER_WALLET_BALANCE:
          return {
            ...state,
            error: action.payload.error,
          };
        default:
          return { ...state };
      }

    case GET_USER_RNP:
      return {
        ...state,
      };

    case GET_USER_WALLET_BALANCE:
      return {
        ...state,
      };

    case RESET_USER_RNP:
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

export default userSession;
