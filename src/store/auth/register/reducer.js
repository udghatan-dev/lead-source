import { API_RESPONSE_SUCCESS, API_RESPONSE_ERROR, REGISTER_USER, RESET_REGISTER_USER, GET_CURRENCIES } from './actionTypes';

const INIT_STATE = {
  registerApiResponse: {},
  error: {},
};

const Register = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case REGISTER_USER:
          return {
            ...state,
            isRegistered: true,
            registerApiResponse: action.payload.data,
          };
        case GET_CURRENCIES:
          return {
            ...state,
            isCurrencyListed: true,
            registerApiResponse: action.payload.data,
          };
        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case REGISTER_USER:
          return {
            ...state,
            error: action.payload.error,
          };
        case GET_CURRENCIES:
          return {
            ...state,
            error: action.payload.error,
          };
        default:
          return { ...state };
      }

    case RESET_REGISTER_USER:
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

export default Register;
