export const LEADSOURCE_BASE_URL = 'https://mapi.1automations.com/api/lead-source';

// Lead Source APIs
export const LEAD_CONNECTIONS = '/api/auth/connections';
export const DELETE_CONNECTION = '/api/auth/facebook';
export const SAVE_CONNECTION = '/api/auth/facebook/save-selection';
export const FACEBOOK_PAGES = '/api/auth/facebook/pages';
export const FACEBOOK_FORMS = '/api/auth/facebook/forms';
export const WEBHOOK_GET_ALL = '/api/auth/webhook';
export const WEBHOOK_CREATE = '/api/auth/webhook/create';
export const WEBHOOK_EDIT = '/api/auth/webhook/edit';
export const WEBHOOK_DELETE = '/api/auth/webhook/delete';
export const WEBHOOK_LOGS = '/webhook/logs';
// IndiaMART APIs
export const INDIAMART_CONNECT = '/api/auth/indiamart/connect';
export const INDIAMART_CONNECT_UPDATE = '/api/auth/indiamart/connection';
export const INDIAMART_CONNECTION = '/api/auth/indiamart/connection';
export const INDIAMART_DELETE = '/api/auth/indiamart';
export const INDIAMART_PULL_LEADS = '/api/auth/indiamart/pull-leads?secret=4abbfe3a-f598-404c-8447-f57639f15a40';
export const INDIAMART_GET_FIELD_LIST = '/api/auth/indiamart/get-field-list';

export const CRM_FIELDS = 'https://mapi.1automations.com/api/v2/crm/fields';
export const FIELD_MAPPING = '/api/auth/field-mapping';
export const FIELD_MAPPING_UPSERT = '/api/auth/field-mapping/upsert';
export const SESSION_TOKEN = '/api/auth/generate-session';
