//Base URL
const BASE_URL = 'https://app1.com.bot';
//const BASE_URL = "http://localhost:8800";
// const BASE_URL = "https://lexicostatistical-giggliest-sharika.ngrok-free.dev"
// const BASE_URL = "https://prismatic-crostata-7afb05.netlify.app/"

export const VERIFICATION_MAIL = BASE_URL + '/api/chat_panel/chat/verification';

export const UPDATE_ACCOUNT = BASE_URL + '/api/2/user/update';

//LOGIN
export const POST_LOGIN = BASE_URL + '/api/2/user/login';

export const POST_VERIFICATION = BASE_URL + '/api/2/user/verify';

//Register
export const POST_REGISTER = BASE_URL + '/api/2/user/create';

//Forgot Password
export const POST_FORGOT_PASS = BASE_URL + '/api/2/user/_forgot_password_request';

//Forgot Password
export const RESET_PASSWORD = BASE_URL + '/api/2/user/reset_password';

//Get WABA List
export const GET_WABA_LIST = BASE_URL + '/api/waba/list/all';

//Post WABA Update Name
export const POST_WABA_RENAME = BASE_URL + '/api/waba/update/name';

//Post WABA Validate BSP
export const POST_WABA_VALIDATE_BSP_KEY = BASE_URL + '/api/waba/validate/key';

//Post WABA Update BSP
export const POST_WABA_UPDATE_BSP_KEY = BASE_URL + '/api/waba/update/bsp';

//Post WABA Validate BSP
export const POST_WABA_ADD_BALANCE = BASE_URL + '/api/waba/update/balance';

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

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//CRM Custom Field API URLs Start Here

export const GET_CUSTOM_FIELD = BASE_URL + '/api/custom_field/list';

export const POST_CUSTOM_FIELD = BASE_URL + '/api/custom_field/create';

export const UPDATE_CUSTOM_FIELD = BASE_URL + '/api/custom_field/update';

export const DELETE_CUSTOM_FIELD = BASE_URL + '/api/custom_field/delete';

//CRM Custom Field API URLs End Here
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//CRM Filter List API URLs Start Here

export const GET_FILTER_LIST = BASE_URL + '/api/condition_list/list';

export const POST_FILTER_LIST = BASE_URL + '/api/condition_list/create';

export const UPDATE_FILTER_LIST = BASE_URL + '/api/condition_list/update';

export const DELETE_FILTER_LIST = BASE_URL + '/api/condition_list/delete';

export const COUNT_FILTER_TARGET = BASE_URL + '/api/chat_panel/chat/count_in_filter';

export const UPDATE_FILTER_TARGET = BASE_URL + '/api/chat_panel/chat/update_count_in_filter';

//CRM Filter List API URLs End Here
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//CRM Event Hook API URLs Start Here

export const GET_EVENT_HOOK = BASE_URL + '/api/chat_panel/event/webhook/list';

export const POST_EVENT_HOOK = BASE_URL + '/api/chat_panel/event/webhook/create';

export const UPDATE_EVENT_HOOK = BASE_URL + '/api/chat_panel/event/webhook/update';

export const DELETE_EVENT_HOOK = BASE_URL + '/api/chat_panel/event/webhook/delete';

//CRM Event Hook API URLs End Here
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//CRM Canned Replies API URLs Start Here

export const GET_CANNED_REPLIES = BASE_URL + '/api/chat_panel/quickreply/listall';

export const POST_CANNED_REPLIES = BASE_URL + '/api/chat_panel/quickreply/create';

export const UPDATE_CANNED_REPLIES = BASE_URL + '/api/chat_panel/quickreply/update';

export const DELETE_CANNED_REPLIES = BASE_URL + '/api/chat_panel/quickreply/delete';

//CRM Canned Replies API URLs End Here
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//CRM Channel API URLs Start Here
export const GET_CHANNEL_PROVIDER = BASE_URL + '/api/miniapp/listchannel';

export const GET_CHANNEL_AUTH = BASE_URL + '/api/auth/listall';

export const GET_CHANNEL = BASE_URL + '/api/channel/listall';

export const GET_SINGLE_CHANNEL = BASE_URL + '/api/channel/listone';

export const POST_CHANNEL = BASE_URL + '/api/channel/create';

export const UPDATE_CHANNEL = BASE_URL + '/api/channel/update';

export const DELETE_CHANNEL = BASE_URL + '/api/channel/delete';

export const SYNC_CHANNEL_TEMPLATE = BASE_URL + '/api/channel/sync_template';

export const FETCH_WHATSAPP_NUMBER = BASE_URL + '/api/chat_panel/quickreply/delete';

export const GET_CHANNEL_WEBHOOK = BASE_URL + '/api/chat_panel/chat/webhook/list';

export const POST_CHANNEL_WEBHOOK = BASE_URL + '/api/chat_panel/chat/webhook/create';

export const UPDATE_CHANNEL_WEBHOOK = BASE_URL + '/api/chat_panel/chat/webhook/update';

export const DELETE_CHANNEL_WEBHOOK = BASE_URL + '/api/chat_panel/chat/webhook/delete';

//CRM Channel API URLs End Here
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//CRM Contact API URLs Start Here
export const GET_CONTACT = BASE_URL + '/api/chat_panel/chat/listall';

export const ALLOCATE_CONTACT = BASE_URL + '/api/chat_panel/chat/allocate';

export const POST_CONTACT = BASE_URL + '/api/chat_panel/chat/createnew';

export const EXPORT_CONTACT = BASE_URL + '/api/chat_panel/chat/export';

export const UPDATE_CONTACT = BASE_URL + '/api/chat_panel/chat/updateall';

export const VALIDATE_CONTACT = BASE_URL + '/api/chat_panel/chat/validateall';

export const VALIDATE_ALLOCATED_CONTACT = BASE_URL + '/api/chat_panel/chat/allocated_validation';

export const DELETE_CONTACT = BASE_URL + '/api/chat_panel/chat/deleteall';

export const UPDATE_COLUMNS = BASE_URL + '/api/custom_field/update_display';

//CRM Contact API URLs End Here
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//CRM Broadcast API URLs Start Here
export const GET_BROADCAST = BASE_URL + '/api/broadcast_list/listall';

export const POST_BROADCAST = BASE_URL + '/api/broadcast_list/create';

export const UPDATE_BROADCAST = BASE_URL + '/api/broadcast_list/updateall';

export const DELETE_BROADCAST = BASE_URL + '/api/broadcast_list/deleteall';

export const REFRESH_STAT = BASE_URL + '/api/broadcast_list/stat_refresh';

export const UPDATE_MESSAGE_STATUS = BASE_URL + '/api/broadcast_list/message_status';

export const TEST_MESSAGE = BASE_URL + '/api/broadcast_list/test_message';

export const TRIGER_BROADCAST = BASE_URL + '/api/broadcast_list/trigger';

export const CANCEL_BROADCAST = BASE_URL + '/api/broadcast_list/cancel';

export const REPORT_BROADCAST = BASE_URL + '/api/chat_panel/chat/broadcastreport';
//CRM Broadcast API URLs End Here
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//CRM Channel Group API URLs Start Here

export const GET_CHANNEL_GROUP = BASE_URL + '/api/channelgroup/listall';

export const GET_FILTERED_CHANNEL = BASE_URL + '/api/channelgroup/channel';

export const POST_CHANNEL_GROUP = BASE_URL + '/api/channelgroup/create';

export const UPDATE_CHANNEL_GROUP = BASE_URL + '/api/channelgroup/update';

export const DELETE_CHANNEL_GROUP = BASE_URL + '/api/channelgroup/delete';

export const POST_CG_TEMPLATE = BASE_URL + '/api/channelgroup/create_template';

export const SYNC_CG_TEMPLATE = BASE_URL + '/api/channelgroup/sync_template';

//CRM Channel Group API URLs End Here
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//Workspace User Role API URLs Start Here

export const GET_USER_ROLES = BASE_URL + '/api/setting/userrole/listall';

export const POST_USER_ROLES = BASE_URL + '/api/setting/userrole/create';

export const UPDATE_USER_ROLES = BASE_URL + '/api/setting/userrole/update';

export const DELETE_USER_ROLES = BASE_URL + '/api/setting/userrole';

//Workspace User Role API URLs End Here
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//Agency CRM Subscription API URLs Start Here
export const GET_SUBS_CHANNEL = BASE_URL + '/api/product/channel/listallchannel';

export const GET_SUBS_CHANNEL_CHILD = BASE_URL + '/api/product/channel/findchild';

export const SHARE_SUBS_CHANNEL = BASE_URL + '/api/product/channel/share';

export const ADD_SUBS_CHANNEL = BASE_URL + '/api/product/channel/updatewithchild';

export const REVOKE_SUBS_CHANNEL = BASE_URL + '/api/product/channel/revokechannel';

export const GET_SUBS_CUSTOMER = BASE_URL + '/api/product/customer/listallcustomer';

export const GET_SUBS_CUSTOMER_CHILD = BASE_URL + '/api/product/customer/findchild';

export const SHARE_SUBS_CUSTOMER = BASE_URL + '/api/product/customer/share';

export const ADD_SUBS_CUSTOMER = BASE_URL + '/api/product/customer/updatewithchild';

export const REVOKE_SUBS_CUSTOMER = BASE_URL + '/api/product/customer/revokecustomer';

export const GET_SUBS_CO = BASE_URL + '/api/product/chatoperator/listallchatoperator';

export const GET_SUBS_CO_CHILD = BASE_URL + '/api/product/chatoperator/findchild';

export const SHARE_SUBS_CO = BASE_URL + '/api/product/chatoperator/share';

export const ADD_SUBS_CO = BASE_URL + '/api/product/chatoperator/updatewithchild';

export const REVOKE_SUBS_CO = BASE_URL + '/api/product/chatoperator/revokechatoperator';

export const GET_AGENCY_SUBACCOUNT = BASE_URL + '/api/subaccount/agency/list';
//Agency CRM Subscription API URLs End Here
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//Workspace Team Member API URLs Start Here

export const GET_TEAM_MEMBER = BASE_URL + '/api/setting/team/listall';

export const POST_TEAM_MEMBER = BASE_URL + '/api/setting/team/create';

export const UPDATE_TEAM_MEMBER = BASE_URL + '/api/setting/team/update';

export const DELETE_TEAM_MEMBER = BASE_URL + '/api/setting/team/delete';

//Workspace Team Member API URLs End Here
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//Workspace Panel Users API URLs Start Here

export const GET_PANEL_USER = BASE_URL + '/api/2/user/list-agency';

export const EXPORT_PANEL_USER = BASE_URL + '/api/2/user/export-agency';

export const LOGIN_AS = BASE_URL + '/api/2/user/login-as';

//Workspace Panel Users API URLs End Here
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//Workspace Panel Users API URLs Start Here

export const AIW_PROJECT_LIST = BASE_URL + '/api/aiwriter/project/listall';

export const AIW_PROJECT_POST = BASE_URL + '/api/aiwriter/project/create';

export const AIW_PROJECT_UPDATE = BASE_URL + '/api/aiwriter/project/update';

export const AIW_CONTENT_REGEN = BASE_URL + '/api/aiwriter/project/retry';

export const AIW_PROJECT_GET = BASE_URL + '/api/aiwriter/project/findone';

export const AIW_PROJECT_DELETE = BASE_URL + '/api/aiwriter/project/delete';

//Workspace Panel Users API URLs End Here
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//Workspace Panel Users API URLs Start Here

export const GET_AI_CREDIT = BASE_URL + '/api/aiwriter/credit/listall';

export const GET_AI_CREDIT_CHILD = BASE_URL + '/api/aiwriter/credit/findchild';

export const SHARE_AI_CREDIT = BASE_URL + '/api/aiwriter/credit/share';

export const ADD_AI_CREDIT = BASE_URL + '/api/aiwriter/credit/updatewithchild';

export const REVOKE_AI_CREDIT = BASE_URL + '/api/aiwriter/credit/revoke';

export const AI_CREDIT_HISTORY = BASE_URL + '/api/aiwriter/credit/history/listall';

