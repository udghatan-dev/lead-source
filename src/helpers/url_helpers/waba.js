//Base URL
const BASE_URL = 'https://mapi.1automations.com';
//const BASE_URL = 'http://localhost:9010';

export const VERIFICATION_MAIL = BASE_URL + '/api/chat_panel/chat/verification';

export const UPDATE_ACCOUNT = BASE_URL + '/api/2/user/update';

export const NEW_LOGIN = BASE_URL + '/api/2/authentication/login';

export const NEW_LOGOUT = BASE_URL + '/api/2/authentication/logout';

export const GET_USER_RNP = BASE_URL + '/auth/user/role';

export const GET_USER_PROFILE = BASE_URL + '/api/2/user/findone';

export const NOTICE_CONSENT_STATUS = BASE_URL + '/api/2/user/consent';

export const GET_USER_STOKEN = BASE_URL + '/auth/user/token';

export const POST_VERIFICATION = BASE_URL + '/api/2/authentication/verify';

//Register
export const POST_REGISTER = BASE_URL + '/api/2/authentication/create';

//Register
export const GET_CURRENCY = BASE_URL + '/api/2/authentication/currency';

//Forgot Password
export const POST_FORGOT_PASS = BASE_URL + '/api/2/authentication/_forgot_password_request';

//Forgot Password
export const RESET_PASSWORD = BASE_URL + '/api/2/authentication/reset_password';

//Get WABA List
export const GET_WABA_LIST = BASE_URL + '/api/waba/list/all';

//Get WABA Stat
export const GET_WABA_STAT = BASE_URL + '/api/waba/stat/all';

//Get Single WABA
export const GET_SINGLE_WABA = BASE_URL + '/api/waba/find';

//Post WABA Update Name
export const POST_WABA_RENAME = BASE_URL + '/api/waba/update/name';

//Post WABA Validate BSP
export const POST_WABA_VALIDATE_BSP_KEY = BASE_URL + '/api/waba/validate/key';

//Post WABA Update BSP
export const POST_WABA_UPDATE_BSP_KEY = BASE_URL + '/api/waba/update/bsp';

//Post WABA Validate BSP
export const POST_WABA_ADD_BALANCE = BASE_URL + '/api/waba/update/balance';

//Post WABA Agency Margin
export const POST_WABA_AGENCY_MARGIN = BASE_URL + '/api/waba/update/margin';

//Post WABA Update BSP
export const POST_WABA_UPDATE_BILLING_VISIBILITY = BASE_URL + '/api/waba/update/visibility';

//Post WABA Validate BSP
export const POST_WABA_SHARE = BASE_URL + '/api/waba/update/share';

//Post WABA Update BSP
export const POST_WABA_REVOKE = BASE_URL + '/api/waba/revoke';

//Post WABA Regenrate API Key
export const POST_WABA_REGEN_APIKEY = BASE_URL + '/api/waba/regenrate/key';

//Post WABA Reset Webhook
export const POST_WABA_RESET_WEBHOOK = BASE_URL + '/api/waba/reset/webhook';

//Get WABA List
export const GET_WABA_WEBHOOK = BASE_URL + '/api/waba/webhook/list';

//Get WABA List
export const POST_WABA_WEBHOOK = BASE_URL + '/api/waba/webhook/create';

//Get WABA List
export const UPDATE_WABA_WEBHOOK = BASE_URL + '/api/waba/webhook/update';

//Get WABA List
export const DELETE_WABA_WEBHOOK = BASE_URL + '/api/waba/webhook/delete';

//Get WABA Conversation List
export const GET_WABA_CONVERSATION = BASE_URL + '/api/waba/conversation/list';

//Get WABA Template List
export const GET_WABA_TEMPLATES = BASE_URL + '/api/waba/template/list';

//Create WABA Template
export const POST_WABA_TEMPLATE = BASE_URL + '/api/waba/template/create';

//Delete WABA Template
export const DELETE_WABA_TEMPLATE = BASE_URL + '/api/waba/template/delete';

//Load WABA Profile
export const GET_WABA_PROFILE = BASE_URL + '/api/waba/fetch/profile';

//Load WABA Profile About
export const GET_WABA_PROFILE_ABOUT = BASE_URL + '/api/waba/fetch/about';

//Load WABA Profile Image
export const GET_WABA_PROFILE_IMAGE = BASE_URL + '/api/waba/fetch/profilePic';

//Load WABA Profile
export const POST_WABA_PROFILE = BASE_URL + '/api/waba/post/profile';

//Load WABA Profile About
export const POST_WABA_PROFILE_ABOUT = BASE_URL + '/api/waba/post/about';

//Load WABA Profile Image
export const POST_WABA_PROFILE_IMAGE = BASE_URL + '/api/waba/post/profilePic';

//Load Redeem History
export const GET_REDEEM_HISTORY = BASE_URL + '/api/redeem/history';

//Redeem New Key
export const POST_REDEEM_KEY = BASE_URL + '/api/redeem';

//Redeem New Key
export const GET_PANEL_SETTINGS = BASE_URL + '/api/website/fetch';

//Redeem New Key
export const POST_PANEL_SETTINGS = BASE_URL + '/api/website/push';

//Redeem New Key
export const GET_THEME_SETTINGS = BASE_URL + '/api/website/theme/fetch';

//Redeem New Key
export const POST_THEME_SETTINGS = BASE_URL + '/api/website/theme/push';

//Report Conversation
export const GET_CONVERSATION_REPORT = BASE_URL + '/api/waba/conversation/report';

//Test Email
export const POST_TEST_EMAIL = BASE_URL + '/api/website/test_email';

//GET User List
export const GET_USER_LIST = BASE_URL + '/api/2/user/list';

//Load WABA Compliance
export const GET_WABA_COMPLIANCE = BASE_URL + '/api/waba/fetch/businesscompliance';

//Load WABA Compliance
export const POST_WABA_COMPLIANCE = BASE_URL + '/api/waba/post/businesscompliance';

//Load WABA Compliance
export const GET_EMBEDDED_WABA = BASE_URL + '/api/waba/embedded/list';

//Load WABA Compliance
export const POST_EMBEDDED_WABA = BASE_URL + '/api/waba/embedded/update';

//Load WABA Compliance
export const REAUTHORIZE_EMBEDDED_WABA = BASE_URL + '/api/waba/embedded/reauthorize';

//Update FB Admin Control
export const FBADMIN_EMBEDDED_WABA = BASE_URL + '/api/waba/embedded/admincontrol';

//Update FB Admin Control
export const REQUEST_PAYMENT_SETUP = BASE_URL + '/api/waba/embedded/payment_setup_request';

//Clear WABA Connection
export const CLEAR_WABA_CONNECTION = BASE_URL + '/api/waba/embedded/clearconnection';

//Deregister Connection
export const DEREGSITER_WABA = BASE_URL + '/api/waba/embedded/deregister';

//Deregister Connection
export const FETCH_COMMERCE_SETTING = BASE_URL + '/api/waba/fetch/commerce_setting';
export const POST_COMMERCE_SETTING = BASE_URL + '/api/waba/post/commerce_setting';

export const GET_HEALTH_STATUS = BASE_URL + '/api/waba/health_check';
