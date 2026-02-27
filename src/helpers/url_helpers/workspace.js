//Base URL
const BASE_URL = 'https://mapi.1automations.com';
//const BASE_URL = 'http://localhost:9010';

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
//Workspace User Role API URLs Start Here

export const GET_USER_ROLES = BASE_URL + '/api/setting/userrole/v2/listall';

export const POST_USER_ROLES = BASE_URL + '/api/setting/userrole/v2/create';

export const UPDATE_USER_ROLES = BASE_URL + '/api/setting/userrole/v2/update';

export const DELETE_USER_ROLES = BASE_URL + '/api/setting/userrole/v2';

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

export const GET_TEAM_MEMBER = BASE_URL + '/api/setting/team/v2/listall';

export const GET_LOGIN_ANALYTICS = BASE_URL + '/api/setting/team/v2/login_analytics';

export const POST_TEAM_MEMBER = BASE_URL + '/api/setting/team/v2/create';

export const UPDATE_TEAM_MEMBER = BASE_URL + '/api/setting/team/v2/update';

export const DELETE_TEAM_MEMBER = BASE_URL + '/api/setting/team/v2/delete';

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

export const WALLET_LOG = BASE_URL + '/api/subscription/wallet_log';

export const WALLET_BALANCE = BASE_URL + '/api/subscription/wallet';

export const PLAN = BASE_URL + '/api/subscription/plan';

export const ADD_ON = BASE_URL + '/api/subscription/addon';

export const PAYMENT_LINK = BASE_URL + '/api/subscription/payment';

export const ACTIVE_PLAN = BASE_URL + '/api/subscription/my_plan';

export const RENEW_PLAN = BASE_URL + '/api/subscription/auto-renew';

export const GET_PLAN_WABA = BASE_URL + '/api/subscription/get_waba';

export const SUBSCRIBE_PLAN = BASE_URL + '/api/subscription/subscribe';
