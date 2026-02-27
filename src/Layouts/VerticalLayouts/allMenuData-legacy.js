import UserPermissions from '../../Routes/UserPermissions';

let ProductMenu = () => {
  return [
    {
      label: 'Menu',
      isHeader: true,
      permissions: [],
    },
    {
      id: 'dashboard',
      label: 'All Products',
      icon: 'bx bxs-dashboard',
      link: '/products',
      permissions: [],
    },
    {
      id: 'workspace',
      label: 'Workspace',
      icon: 'bx bxs-network-chart',
      link: '/workspace',
      permissions: [],
    },
  ];
};

let WABAMenu = () => {
  return [
    {
      label: 'Menu',
      isHeader: true,
      permissions: [],
    },
    {
      id: 'dashboard',
      label: 'All Products',
      icon: 'bx bxs-dashboard',
      link: '/products',
      permissions: [],
    },
    {
      id: 'dashboard',
      label: 'WABA',
      icon: 'bx bxl-whatsapp',
      link: '/products/waba',
      permissions: UserPermissions.WABA.WABA,
    },
  ];
};

let VirtualNumberMenu = () => {
  return [
    {
      label: 'Menu',
      isHeader: true,
      permissions: [],
    },
    {
      id: 'dashboard',
      label: 'All Products',
      icon: 'bx bxs-dashboard',
      link: '/products',
      permissions: [],
    },
    {
      id: 'virtual_number',
      label: 'Virtual Numbers',
      icon: 'bx bxs-phone-call',
      link: '/products/virtual_number',
      permissions: UserPermissions.VIRTUAL_NUMBER.NUMBER,
    },
    {
      id: 'webhook',
      label: 'Webhooks',
      icon: 'bx bx-link',
      link: '/products/virtual_number/webhook',
      permissions: UserPermissions.VIRTUAL_NUMBER.NUMBER,
    },
  ];
};

let CRMMenu = () => {
  return [
    {
      label: 'Menu',
      isHeader: true,
      permissions: [],
    },
    {
      id: 'dashboard',
      label: 'All Products',
      icon: 'bx bxs-dashboard',
      link: '/products',
      permissions: [],
    },
    {
      id: 'livechat',
      label: 'Live Chat',
      icon: 'bx bxs-chat',
      link: '/products/crm/livechat',
      permissions: UserPermissions.CRM.LIVE_CHAT,
    },
    {
      id: 'channel',
      label: 'Channels',
      icon: 'bx bx-git-compare',
      link: '/products/crm/channel',
      permissions: UserPermissions.CRM.CHANNEL,
    },
    {
      id: 'contact',
      label: 'Contacts',
      icon: 'bx bxs-contact',
      link: '/products/crm/contact',
      permissions: UserPermissions.CRM.CONTACT,
    },
    {
      id: 'custom-field',
      label: 'Custom Fields',
      icon: 'bx bxs-tag-alt',
      link: '/products/crm/custom-field',
      permissions: UserPermissions.CRM.CUSTOM_FIELD,
    },
    {
      id: 'canned-replies',
      label: 'Canned Replies',
      icon: 'bx bxs-message-detail',
      link: '/products/crm/canned-replies',
      permissions: UserPermissions.CRM.CANNED_REPLY,
    },
    {
      label: 'Broadcasting',
      isHeader: true,
      permissions: UserPermissions.CRM.SEGMENT.concat(UserPermissions.CRM.CAMPAIGN),
    },
    {
      id: 'filter-list',
      label: 'Segments',
      icon: 'bx bx-filter',
      link: '/products/crm/filter-list',
      permissions: UserPermissions.CRM.SEGMENT,
    },
    {
      id: 'campaign',
      label: 'Campaign',
      icon: 'bx bxs-megaphone',
      link: '/products/crm/campaign',
      new: true,
      tag: 'New',
      tagClass: 'badge bg-primary',
      permissions: UserPermissions.CRM.CAMPAIGN,
    },
    {
      label: 'Mass Broadcasting',
      isHeader: true,
      permissions: UserPermissions.CRM.CHANNEL_GROUP.concat(UserPermissions.CRM.MASS_BROADCAST),
    },
    {
      id: 'channel-group',
      label: 'Channel Group',
      icon: 'bx bx-merge',
      link: '/products/crm/channel-group',
      permissions: UserPermissions.CRM.CHANNEL_GROUP,
    },
    {
      id: 'mass-broadcast',
      label: 'Mass Broadcast',
      icon: 'bx bx-broadcast',
      link: '/products/crm/mass-broadcast',
      permissions: UserPermissions.CRM.MASS_BROADCAST,
    },
    {
      label: 'Automations',
      isHeader: true,
      permissions: UserPermissions.CRM.TRIGGER,
    },
    {
      id: 'automation-trigger',
      label: 'Triggers',
      icon: 'bx bx-link',
      link: '/products/crm/automation/trigger',
      permissions: UserPermissions.CRM.TRIGGER,
    },
    // {
    //   label: 'Subscription',
    //   isHeader: true,
    //   permissions: [],
    // },
    // {
    //   id: 'crm-subscriptions',
    //   label: 'Subscriptions',
    //   icon: 'bx bxs-purchase-tag-alt',
    //   link: '/products/crm/subscription',
    //   permissions: [],
    //   // new: true,
    //   // tag: "New",
    //   // tagClass: "badge bg-primary",
    // },
  ];
};

let WorkspaceMenu = () => {
  return [
    {
      label: 'Menu',
      isHeader: true,
      permissions: [],
    },
    {
      id: 'dashboard',
      label: 'All Products',
      icon: 'bx bxs-dashboard',
      link: '/products',
      permissions: [],
    },
    {
      label: 'Manage Team',
      isHeader: true,
      permissions: [],
    },
    {
      id: 'roleandpermission',
      label: 'Roles & Permissions',
      icon: 'bx bxs-user-badge',
      link: '/workspace/user-role',
      permissions: [],
    },
    {
      id: 'team-member',
      label: 'Team Members',
      icon: 'bx bxs-user-account',
      link: '/workspace/team-member',
      permissions: [],
    },
    {
      label: 'Settings',
      isHeader: true,
      permissions: [],
    },
    {
      id: 'profile-settings',
      label: 'Account Settings',
      icon: 'bx bxs-cog',
      link: '/workspace/settings',
      permissions: [],
    },
    {
      id: 'wallet',
      label: 'Wallet & Transactions',
      icon: 'bx bxs-wallet',
      link: '/workspace/wallet',
      permissions: [],
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: 'bx bxs-credit-card',
      link: '/workspace/billing',
      permissions: [],
    },
    {
      label: 'Help & Support',
      isHeader: true,
      permissions: [],
    },
    {
      id: 'support-ticket',
      label: 'Support Ticket',
      icon: 'las la-life-ring',
      link: '/workspace/ticket',
      permissions: [],
    },
  ];
};

let AutomationMenu = () => {
  return [
    {
      label: 'Menu',
      isHeader: true,
      permissions: [],
    },
    {
      id: 'dashboard',
      label: 'All Products',
      icon: 'bx bxs-dashboard',
      link: '/products',
      permissions: [],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'ri-line-chart-line',
      link: '/products/automation/analytics',
      permissions: UserPermissions.AUTOMATION.WORKFLOW,
    },
    {
      id: 'flow',
      label: 'Workflow',
      icon: 'ri-stackshare-line',
      link: '/products/automation/flow',
      permissions: UserPermissions.AUTOMATION.WORKFLOW,
    },
    {
      label: 'Template',
      isHeader: true,
      permissions: UserPermissions.AUTOMATION.TEMPLATE.concat(UserPermissions.AUTOMATION.TEMPLATE_STORE),
    },
    {
      id: 'my-template',
      label: 'My Templates',
      icon: 'bx bxs-book-content',
      link: '/products/automation/my-template',
      permissions: UserPermissions.AUTOMATION.TEMPLATE,
    },
    {
      id: 'my-template',
      label: 'Template Store',
      icon: 'bx bxs-book-bookmark',
      link: '/products/automation/template',
      permissions: UserPermissions.AUTOMATION.TEMPLATE_STORE,
    },
    {
      label: 'Integration',
      isHeader: true,
      permissions: UserPermissions.AUTOMATION.DATA_STORE,
    },
    {
      id: 'data-store',
      label: 'Data Store',
      icon: 'bx bxs-data',
      link: '/products/automation/data-store',
      new: true,
      tag: 'New',
      tagClass: 'badge bg-primary',
      permissions: UserPermissions.AUTOMATION.DATA_STORE,
    },
  ];
};

let BotMenu = () => {
  return [
    {
      label: 'Menu',
      isHeader: true,
      permissions: [],
    },
    {
      id: 'dashboard',
      label: 'All Products',
      icon: 'bx bxs-dashboard',
      link: '/products',
      permissions: [],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'ri-line-chart-line',
      link: '/products/bot/analytics',
      permissions: UserPermissions.BOT.WORKFLOW,
    },
    {
      id: 'flow',
      label: 'Workflow',
      icon: 'ri-stackshare-line',
      link: '/products/bot/flow',
      permissions: UserPermissions.BOT.WORKFLOW,
    },
    {
      label: 'Template',
      isHeader: true,
      permissions: UserPermissions.BOT.TEMPLATE.concat(UserPermissions.BOT.TEMPLATE_STORE),
    },
    {
      id: 'my-template',
      label: 'My Templates',
      icon: 'bx bxs-book-content',
      link: '/products/bot/my-template',
      permissions: UserPermissions.BOT.TEMPLATE,
    },
    {
      id: 'my-template',
      label: 'Template Store',
      icon: 'bx bxs-book-bookmark',
      link: '/products/bot/template',
      permissions: UserPermissions.BOT.TEMPLATE_STORE,
    },
    {
      label: 'Integration',
      isHeader: true,
      permissions: UserPermissions.BOT.DATA_STORE,
    },
    {
      id: 'data-store',
      label: 'Data Store',
      icon: 'bx bxs-data',
      link: '/products/bot/data-store',
      new: true,
      tag: 'New',
      tagClass: 'badge bg-primary',
      permissions: UserPermissions.BOT.DATA_STORE,
    },
    {
      label: 'Content',
      isHeader: true,
      permissions: UserPermissions.BOT.BOT_FIELD,
    },
    {
      id: 'bot-content',
      label: 'Bot Fields',
      icon: 'bx bx-code-alt',
      link: '/products/bot/bot-field',
      new: true,
      tag: 'New',
      tagClass: 'badge bg-primary',
      permissions: UserPermissions.BOT.BOT_FIELD,
    },
  ];
};

export { WorkspaceMenu, CRMMenu, WABAMenu, VirtualNumberMenu, AutomationMenu, BotMenu, ProductMenu };
