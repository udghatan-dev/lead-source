import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  CREATE_PDF_EXP,
  LIST_PDF_EXP,
  UPDATE_PDF_EXP,
  FIND_PDF_EXP,
  DELETE_PDF_EXP,
  RESET_PDF_EXP,
  FETCH_PDF_CREDIT
} from './actionType';

const INIT_STATE = {
  apiResponse: {},
  error: {},
  isPdfCreditFetched: false,
  userCredits: 0,
};

const PdfExp = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case CREATE_PDF_EXP:
          return {
            ...state,
            isPdfExpCreated: true,
            apiResponse: action.payload.data,
          };
        case FIND_PDF_EXP:
          return {
            ...state,
            isPdfExpFound: true,
            apiResponse: action.payload.data,
          };
        case DELETE_PDF_EXP:
          return {
            ...state,
            isPdfExpDeleted: true,
            apiResponse: action.payload.data,
          };
        case LIST_PDF_EXP:
          return {
            ...state,
            isPdfExpListed: true,
            apiResponse: action.payload.data,
          };
        case UPDATE_PDF_EXP:
          return {
            ...state,
            isPdfExpUpdated: true,
            apiResponse: action.payload.data,
          };
        case UPDATE_PDF_EXP:
          return {
            ...state,
            isPdfExpUpdated: true,
            apiResponse: action.payload.data,
          };
        case FETCH_PDF_CREDIT:
          return {
            ...state,
            isPdfCreditFetched: true,
            userCredits: action.payload.data?.credits || 0,
          };
        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case CREATE_PDF_EXP:
          return {
            ...state,
            isPdfExpCreated: true,
            error: action.payload.error,
          };
        case FIND_PDF_EXP:
          return {
            ...state,
            isPdfExpFound: true,
            error: action.payload.error,
          };
        case LIST_PDF_EXP:
          return {
            ...state,
            error: action.payload.error,
          };
        case DELETE_PDF_EXP:
          return {
            ...state,
            error: action.payload.error,
          };
        case UPDATE_PDF_EXP:
          return {
            ...state,
            error: action.payload.error,
          };
        //       case FETCH_PDF_CREDIT: // ✅ This handles successful credit fetch
        // return {
        //   ...state,
        //   // isPdfCreditFetched: true,
        //   userCredits: action.payload.data?.credits || 0,
        // };
        default:
          return { ...state };
      }

    case RESET_PDF_EXP:
      var flag = action.payload.flag;
      var value = action.payload.value;
      var flags = {};
      flags[flag] = value;

      return {
        ...state,
        ...flags,
      };

    // case FETCH_PDF_CREDIT:
    //   return {
    //     ...state,
    //     isPdfCreditFetched: true,
    //     userCredits: 0,
    //   };

    default:
      return { ...state };
  }
};

export default PdfExp;