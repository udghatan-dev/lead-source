export const WABA_REGEN_KEY = [
  'Your previous WABA integration with any CRM platform will stop working',
  'Your previous WABA integration with any third-party platform will stop working',
  'WABA will not accept any API call which uses previous API Key for authentication',
];

export const WABA_REVOKE = [
  'Revoke WABA will affect the integration of user to any CRM platform',
  'Previous WABA integration with any third-party platform will stop working for user',
  'WABA will not accept any API call from this user',
];

export const WABA_RESET_WEBHOOK = [
  'All the webhooks for this WABA will be deleted',
  'Your integration to any third-party platform will stop gettting webhook push from this WABA',
];

export const DELETE_TRIGGER = ['Your previous integration with any third-party platform will stop working'];

export const CUSTOM_FIELD_DELETE = [
  'Custom Field will be removed from your account',
  'You will not be able to set it for contacts after deletion',
];

export const FILTER_LIST_DELETE = [
  'List will be deleted from your account permanently',
  'You will not be able to use this list in broadcast filter',
];

export const EVENT_HOOK_DELETE = [
  'This event hook will be deleted permanently',
  'Your integration to any third-party platform will stop gettting webhook push for any update of custom field',
];

export const CANNED_REPLIES_DELETE = [
  'Selected Canned Replies will be deleted permanently',
  'You will not be able to use it in chat panel for Quick-Reply',
];

export const CONTACT_DELETE = [
  'Selected Contacts will be deleted permanently',
  'You will not be able to use retrive the chat associated with these contact',
];

export const CONTACT_DELETE_RECONFIRM = [
  'Selected Contacts will be deleted permanently',
  'You will not be able to use retrive the chat associated with these contact',
];

export const BROADCAST_DELETE = [
  'Selected Broadcast will be deleted permanently',
  'You will not be able to change visibility of messages from this broadcast',
  'You will not be able to generate any report or clone it in future',
];

export const CHANNEL_DELETE = [
  'Channel will be deleted permanently',
  'You will not be able to get messages from this channel in your live chat panel',
  'Any third party integration will stop receiving message update of this channel',
];

export const TICKET_DELETE = ['Ticket will be deleted permanently', 'You will not be able to recover this ticket'];

export const USER_ROLE = ['User Role will be deleted permanently', 'You will not be able to assign it to any team member'];

export const TEAM_MEMBER_DELETE = ['User will be deleted permanently', 'User will not be able to login'];

export const WORKFLOW_DELETE = [
  'Workflow will be deleted permanently',
  'Your task related to this workflow will stop',
  'Once deleted this workflow can not be restored',
];

export const FOLDER_DELETE = ['Folder will be deleted permanently', 'Once deleted this folder can not be restored'];

export const CONNECTION_DELETE = [
  'Database Connection will be deleted permanently',
  'You will not be able to save, update and retrive data in automation',
  'Once deleted this connection can not be restored',
];

export const SCHEMA_DELETE = [
  'Data Store will be deleted permanently from our Record',
  'You will not be able to save, update and retrive data in automation',
  'Once deleted this Data Store Configuration can not be restored',
];

export const RECORD_DELETE = ['Record will be deleted permanently from Your Database', 'Once deleted this Record can not be restored'];

export const BOT_FIELD_DELETE = ['Bot Field will be deleted permanently', 'You will not be able to use this bot field in chatbot flow'];

export const WABA_CLEAR_CONNECTION = [
  'Existing WABA connection will be cleared.',
  'Your existing integration might get affected by this action.',
  'You will not be able to restore it again.',
];

export const DEACTIVATE_USER = ['User will not be able to login'];

export const MARK_AS_DONE = [
  'Current chat operator will be removed from these chats.',
  'These chats will no longer visible in Live Chat untill USER sends the message.',
  'Bot attached with these chats will be released.',
];

export const GHL_CONVERSATION_DELETE = ['You will not be able to restore it again.'];

export const CLEAR_MAIN_FLOW = ['Flow will be removed from current channel.'];

export const WABA_DE_REGISTER = [
  'Deregistration will disconnects the number from Cloud API.',
  'Your existing integration might get affected by this action.',
];

export const GHL_CONVERSATION_MIGRATE = [
  'Previous Conversations of this location id with any other channel will be migrated to current channel.',
  'If Previous connection (with our platform) to this location is still active and in use than it will stop incoming message delivery.',
  'We strongly recommend to migrate conversation only if any previous connection to this location with our platform is not in use.',
];

export const PREV_GHL_CONVERSATION_DELETE = [
  'Previous Conversations of this location id with any other channel will be deleted.',
  'We strongly recommend to delete conversation only if any previous connection to this location with our platform is not in use.',
];

export const TROUBLESHOOT_RECURRING = [
  'Troubleshoot will restart the recurring campaign.',
  'We strongly recommend to use this option only if your recurring campaigns stopped working.',
];

export const DELETE_PAYMENT_GATEWAY = [
  'This action will delete selected gateway from your account.',
  'This might affect the integration and campaign attached to this gateway.',
];

export const PO_REFERENCE_DELETE = [
  'This action will delete payment order from your account.',
  'We strongly recommend to use this action only if you have taken backup of this data.',
];

export const DELETE_IMAGE_EXP = [
  'This action will delete image experience from your account.',
  'Your existing integration might get affected by this action.',
];
