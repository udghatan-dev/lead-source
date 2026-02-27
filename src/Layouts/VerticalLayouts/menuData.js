var userProductMenu = (userRNP) => {
  return [
    {
      label: 'Menu',
      isHeader: true,
    },
    {
      id: 'dashboard',
      label: 'All Products',
      icon: 'bx bxs-dashboard',
      link: '/products',
    },
    {
      id: 'workspace',
      label: 'Workspace',
      icon: 'bx bxs-network-chart',
      link: '/workspace',
    },
  ];
};

var userWABAMenu = (userRNP) => {
  return [
    {
      label: 'Menu',
      isHeader: true,
    },
    {
      id: 'dashboard',
      label: 'All Products',
      icon: 'bx bxs-dashboard',
      link: '/products',
    },
    {
      id: 'dashboard',
      label: 'WABA',
      icon: 'bx bxl-whatsapp',
      link: '/products/waba',
    },
  ];
};

var userChannelMenu = (userRNP) => {
  return [
    {
      label: 'Menu',
      isHeader: true,
    },
    {
      id: 'dashboard',
      label: 'All Products',
      icon: 'bx bxs-dashboard',
      link: '/products',
    },
    {
      id: 'channel',
      label: 'Channels',
      icon: 'bx bx-git-compare',
      link: '/products/channel',
    },
  ];
};
var userCRMMenu = (userRNP) => {
  if (userRNP.role === 'team_member') {
    let permissions = userRNP.permissions;
    let menus = [
      {
        label: 'Menu',
        isHeader: true,
      },
      {
        id: 'dashboard',
        label: 'All Products',
        icon: 'bx bxs-dashboard',
        link: '/products',
      },
    ];
    if (permissions !== null) {
      if (permissions.CHAT_PANEL.VIEW) {
        menus.push({
          id: 'livechat',
          label: 'Live Chat',
          icon: 'bx bxs-chat',
          link: '/products/crm/livechat',
        });
      }
      if (permissions.CRM.CHANNEL.VIEW) {
        menus.push({
          id: 'channel',
          label: 'Channels',
          icon: 'bx bx-git-compare',
          link: '/products/crm/channel',
        });
      }
      if (permissions.CRM.CONTACT.VIEW) {
        menus.push({
          id: 'contact',
          label: 'Contacts',
          icon: 'bx bxs-contact',
          link: '/products/crm/contact',
        });
      }
      if (permissions.CRM.CUSTOM_FIELD.VIEW) {
        menus.push({
          id: 'custom-field',
          label: 'Custom Fields',
          icon: 'bx bxs-tag-alt',
          link: '/products/crm/custom-field',
        });
      }
      // if (permissions.CRM.EVENT_HOOK.VIEW) {
      //   menus.push({
      //     id: "event-hook",
      //     label: "Event Hooks",
      //     icon: "bx bx-link",
      //     link: "/products/crm/event-hook",
      //   });
      // }
      if (permissions.CRM.CANNED_REPLIES.VIEW) {
        menus.push({
          id: 'canned-replies',
          label: 'Canned Replies',
          icon: 'bx bxs-message-detail',
          link: '/products/crm/canned-replies',
        });
      }
      if (permissions.CRM.FILTER_LIST.VIEW || permissions.CRM.BROADCAST.VIEW) {
        menus.push({
          label: 'Broadcasting',
          isHeader: true,
        });
      }
      if (permissions.CRM.FILTER_LIST.VIEW) {
        menus.push({
          id: 'filter-list',
          label: 'Segments',
          icon: 'bx bx-filter',
          link: '/products/crm/filter-list',
        });
      }
      if (permissions.CRM.BROADCAST.VIEW) {
        menus.push({
          id: 'campaign',
          label: 'Campaign',
          icon: 'bx bxs-megaphone',
          link: '/products/crm/campaign',
          new: true,
          tag: 'New',
          tagClass: 'badge bg-primary',
        });
      }
      if (permissions.CRM.BROADCAST.VIEW) {
        // menus.push({
        //   id: "broadcast",
        //   label: "Broadcast",
        //   icon: "bx bxs-vector",
        //   link: "/products/crm/broadcast",
        //   new: true,
        //   tag: "Depreciated",
        //   tagClass: "badge bg-danger",
        // });
      }
      if (permissions.CRM.CHANNEL_GROUP.VIEW || permissions.CRM.MASS_BROADCAST.VIEW) {
        menus.push({
          label: 'Mass Broadcasting',
          isHeader: true,
        });
      }
      if (permissions.CRM.CHANNEL_GROUP.VIEW) {
        menus.push({
          id: 'channel-group',
          label: 'Channel Group',
          icon: 'bx bx-merge',
          link: '/products/crm/channel-group',
        });
      }
      if (permissions.CRM.MASS_BROADCAST.VIEW) {
        menus.push({
          id: 'mass-broadcast',
          label: 'Mass Broadcast',
          icon: 'bx bx-broadcast',
          link: '/products/crm/mass-broadcast',
        });
      }
      // if (permissions.CRM.BROADCAST.VIEW) {
      //   menus.push({
      //     id: "campaign",
      //     label: "Campaign",
      //     icon: "bx bxs-megaphone",
      //     link: "/products/crm/campaign",
      //   });
      // }
      menus.push({
        label: 'Automations',
        isHeader: true,
      });
      menus.push({
        id: 'automation-trigger',
        label: 'Triggers',
        icon: 'bx bx-link',
        link: '/products/crm/automation/trigger',
      });
    }
    return menus;
  } else {
    return [
      {
        label: 'Menu',
        isHeader: true,
      },
      {
        id: 'dashboard',
        label: 'All Products',
        icon: 'bx bxs-dashboard',
        link: '/products',
      },
      {
        id: 'livechat',
        label: 'Live Chat',
        icon: 'bx bxs-chat',
        link: '/products/crm/livechat',
      },
      {
        id: 'channel',
        label: 'Channels',
        icon: 'bx bx-git-compare',
        link: '/products/crm/channel',
      },
      {
        id: 'contact',
        label: 'Contacts',
        icon: 'bx bxs-contact',
        link: '/products/crm/contact',
      },
      {
        id: 'custom-field',
        label: 'Custom Fields',
        icon: 'bx bxs-tag-alt',
        link: '/products/crm/custom-field',
      },
      // {
      //   id: "event-hook",
      //   label: "Event Hooks",
      //   icon: "bx bx-link",
      //   link: "/products/crm/event-hook",
      // },
      {
        id: 'canned-replies',
        label: 'Canned Replies',
        icon: 'bx bxs-message-detail',
        link: '/products/crm/canned-replies',
      },
      {
        label: 'Broadcasting',
        isHeader: true,
      },
      {
        id: 'filter-list',
        label: 'Segments',
        icon: 'bx bx-filter',
        link: '/products/crm/filter-list',
      },
      {
        id: 'campaign',
        label: 'Campaign',
        icon: 'bx bxs-megaphone',
        link: '/products/crm/campaign',
        new: true,
        tag: 'New',
        tagClass: 'badge bg-primary',
      },
      // {
      //   id: "broadcast",
      //   label: "Broadcast",
      //   icon: "bx bxs-vector",
      //   link: "/products/crm/broadcast",
      //   new: true,
      //   tag: "Depreciated",
      //   tagClass: "badge bg-danger",
      // },
      {
        label: 'Mass Broadcasting',
        isHeader: true,
      },
      {
        id: 'channel-group',
        label: 'Channel Group',
        icon: 'bx bx-merge',
        link: '/products/crm/channel-group',
      },
      {
        id: 'mass-broadcast',
        label: 'Mass Broadcast',
        icon: 'bx bx-broadcast',
        link: '/products/crm/mass-broadcast',
      },
      {
        label: 'Automations',
        isHeader: true,
      },
      {
        id: 'automation-trigger',
        label: 'Triggers',
        icon: 'bx bx-link',
        link: '/products/crm/automation/trigger',
      },
      {
        label: 'Subscription',
        isHeader: true,
      },
      {
        id: 'crm-subscriptions',
        label: 'Subscriptions',
        icon: 'bx bxs-purchase-tag-alt',
        link: '/products/crm/subscription',
        // new: true,
        // tag: "New",
        // tagClass: "badge bg-primary",
      },
    ];
  }
};

var userWorkspaceMenu = (userRNP) => {
  if (userRNP.role === 'team_member') {
    return [
      {
        label: 'Menu',
        isHeader: true,
      },
      {
        id: 'dashboard',
        label: 'All Products',
        icon: 'bx bxs-dashboard',
        link: '/products',
      },
      {
        id: 'profile-settings',
        label: 'Account Settings',
        icon: 'bx bxs-cog',
        link: '/workspace/settings',
      },
    ];
  } else {
    return [
      {
        label: 'Menu',
        isHeader: true,
      },
      {
        id: 'dashboard',
        label: 'All Products',
        icon: 'bx bxs-dashboard',
        link: '/products',
      },
      {
        id: 'roleandpermission',
        label: 'Roles & Permissions',
        icon: 'bx bxs-user-badge',
        link: '/workspace/user-role',
      },
      {
        id: 'team-member',
        label: 'Team Members',
        icon: 'bx bxs-user-account',
        link: '/workspace/team-member',
      },
      {
        id: 'profile-settings',
        label: 'Account Settings',
        icon: 'bx bxs-cog',
        link: '/workspace/settings',
      },
      {
        id: 'support-ticket',
        label: 'Support Ticket',
        icon: 'las la-life-ring',
        link: '/workspace/ticket',
      },
    ];
  }
};

var userAutoBloggingMenu = (userRNP) => {
  if (userRNP.role === 'team_member') {
    return [];
  } else {
    return [
      {
        label: 'Menu',
        isHeader: true,
      },
      {
        id: 'dashboard',
        label: 'All Products',
        icon: 'bx bxs-dashboard',
        link: '/products',
      },
      {
        id: 'article-history',
        label: 'Project History',
        icon: 'bx bx-history',
        link: '/products/aiwriter/history',
      },
      {
        id: 'create-article',
        label: 'Create Project',
        icon: 'bx bxs-file-plus',
        link: '/products/aiwriter/create',
      },
      {
        id: 'aiwriter-billing',
        label: 'Billing',
        icon: 'bx bx-credit-card',
        link: '/products/aiwriter/billing',
      },
    ];
  }
};

var userAutomationMenu = [
  {
    label: 'Menu',
    isHeader: true,
  },
  {
    id: 'dashboard',
    label: 'All Products',
    icon: 'bx bxs-dashboard',
    link: '/products',
  },
  // {
  //     id: "my-apps",
  //     label: "My Apps",
  //     icon: "ri-apps-line",
  //     link: "/products/automation/app"
  // },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'ri-line-chart-line',
    link: '/products/automation/analytics',
  },
  {
    id: 'flow',
    label: 'Workflow',
    icon: 'ri-stackshare-line',
    link: '/products/automation/flow',
  },
  {
    label: 'Template',
    isHeader: true,
  },
  {
    id: 'my-template',
    label: 'My Templates',
    icon: 'bx bxs-book-content',
    link: '/products/automation/my-template',
  },
  {
    id: 'my-template',
    label: 'Template Store',
    icon: 'bx bxs-book-bookmark',
    link: '/products/automation/template',
  },
  {
    label: 'Integration',
    isHeader: true,
  },
  {
    id: 'data-store',
    label: 'Data Store',
    icon: 'bx bxs-data',
    link: '/products/automation/data-store',
    new: true,
    tag: 'New',
    tagClass: 'badge bg-primary',
  },
];

var userBotMenu = [
  {
    label: 'Menu',
    isHeader: true,
  },
  {
    id: 'dashboard',
    label: 'All Products',
    icon: 'bx bxs-dashboard',
    link: '/products',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'ri-line-chart-line',
    link: '/products/bot/analytics',
  },
  {
    id: 'flow',
    label: 'Workflow',
    icon: 'ri-stackshare-line',
    link: '/products/bot/flow',
  },
  {
    label: 'Template',
    isHeader: true,
  },
  {
    id: 'my-template',
    label: 'My Templates',
    icon: 'bx bxs-book-content',
    link: '/products/bot/my-template',
  },
  {
    id: 'my-template',
    label: 'Template Store',
    icon: 'bx bxs-book-bookmark',
    link: '/products/bot/template',
  },
  {
    label: 'Integration',
    isHeader: true,
  },
  {
    id: 'data-store',
    label: 'Data Store',
    icon: 'bx bxs-data',
    link: '/products/bot/data-store',
    new: true,
    tag: 'New',
    tagClass: 'badge bg-primary',
  },
  {
    label: 'Content',
    isHeader: true,
  },
  {
    id: 'bot-content',
    label: 'Bot Fields',
    icon: 'bx bx-code-alt',
    link: '/products/bot/bot-field',
    new: true,
    tag: 'New',
    tagClass: 'badge bg-primary',
  },
];

var userAdManagerMenu = [
  {
    label: 'Menu',
    isHeader: true,
  },
  {
    id: 'dashboard',
    label: 'All Products',
    icon: 'bx bxs-dashboard',
    link: '/products',
  },
  {
    id: 'overview',
    label: 'Overview',
    icon: 'bx bxs-bar-chart-alt-2',
    link: '/products/admanager/overview',
  },
  {
    id: 'campaign-analysis',
    label: 'Campaign Analysis',
    icon: 'bx bxs-report',
    link: '/products/admanager/campaign-analysis',
  },
  {
    id: 'campaign-list',
    label: 'Campaign List',
    icon: 'bx bx-list-ul',
    link: '/products/admanager/campaign',
  },
  {
    id: 'campaign',
    label: 'New Campaign',
    icon: 'bx bxs-rocket',
    link: '/products/admanager/create-campaign',
  },
  {
    label: 'Connections',
    isHeader: true,
  },
  {
    id: 'ad-settings',
    label: 'Settings',
    icon: 'bx bxs-cog',
    link: '/products/admanager/settings',
  },
];
export {
  userProductMenu,
  userWABAMenu,
  userCRMMenu,
  userWorkspaceMenu,
  userAutoBloggingMenu,
  userBotMenu,
  userChannelMenu,
  userAutomationMenu,
  userAdManagerMenu,
};

export const agencyProductMenu = [
  {
    label: 'Menu',
    isHeader: true,
  },
  {
    id: 'dashboard',
    label: 'All Products',
    icon: 'bx bxs-dashboard',
    link: '/products',
  },
  {
    id: 'workspace',
    label: 'Workspace',
    icon: 'bx bxs-network-chart',
    link: '/workspace',
  },
];

export const agencyWABAMenu = [
  {
    label: 'Menu',
    isHeader: true,
  },
  {
    id: 'dashboard',
    label: 'All Products',
    icon: 'bx bxs-dashboard',
    link: '/products',
  },
  {
    id: 'dashboard',
    label: 'WABA',
    icon: 'bx bxl-whatsapp',
    link: '/products/waba',
  },
];

export const agencyCRMMenu = [
  {
    label: 'Menu',
    isHeader: true,
  },
  {
    id: 'dashboard',
    label: 'All Products',
    icon: 'bx bxs-dashboard',
    link: '/products',
  },
  {
    id: 'livechat',
    label: 'Live Chat',
    icon: 'bx bxs-chat',
    link: '/products/crm/livechat',
  },
  {
    id: 'channel',
    label: 'Channels',
    icon: 'bx bx-git-compare',
    link: '/products/crm/channel',
  },
  {
    id: 'contact',
    label: 'Contacts',
    icon: 'bx bxs-contact',
    link: '/products/crm/contact',
  },
  {
    id: 'custom-field',
    label: 'Custom Fields',
    icon: 'bx bxs-tag-alt',
    link: '/products/crm/custom-field',
  },
  // {
  //   id: "event-hook",
  //   label: "Event Hooks",
  //   icon: "bx bx-link",
  //   link: "/products/crm/event-hook",
  // },
  {
    id: 'canned-replies',
    label: 'Canned Replies',
    icon: 'bx bxs-message-detail',
    link: '/products/crm/canned-replies',
  },
  {
    label: 'Broadcasting',
    isHeader: true,
  },
  {
    id: 'filter-list',
    label: 'Segments',
    icon: 'bx bx-filter',
    link: '/products/crm/filter-list',
  },
  {
    id: 'campaign',
    label: 'Campaign',
    icon: 'bx bxs-megaphone',
    link: '/products/crm/campaign',
    new: true,
    tag: 'New',
    tagClass: 'badge bg-primary',
  },
  // {
  //   id: "broadcast",
  //   label: "Broadcast",
  //   icon: "bx bxs-vector",
  //   link: "/products/crm/broadcast",
  //   new: true,
  //   tag: "Depreciated",
  //   tagClass: "badge bg-danger",
  // },
  {
    label: 'Mass Broadcasting',
    isHeader: true,
  },
  {
    id: 'channel-group',
    label: 'Channel Group',
    icon: 'bx bx-merge',
    link: '/products/crm/channel-group',
  },
  {
    id: 'mass-broadcast',
    label: 'Mass Broadcast',
    icon: 'bx bx-broadcast',
    link: '/products/crm/mass-broadcast',
  },
  {
    label: 'Subscription',
    isHeader: true,
  },
  {
    id: 'crm-subscriptions',
    label: 'Subscriptions',
    icon: 'bx bxs-purchase-tag-alt',
    link: '/products/crm/subscription',
    // new: true,
    // tag: "New",
    // tagClass: "badge bg-primary",
  },
];

export const agencyWorkspaceMenu = [
  {
    label: 'Menu',
    isHeader: true,
  },
  {
    id: 'dashboard',
    label: 'All Products',
    icon: 'bx bxs-dashboard',
    link: '/products',
  },
  {
    id: 'roleandpermission',
    label: 'Roles & Permissions',
    icon: 'bx bxs-user-badge',
    link: '/workspace/user-role',
  },
  {
    id: 'team-member',
    label: 'Team Members',
    icon: 'bx bxs-user-account',
    link: '/workspace/team-member',
  },
  {
    id: 'profile-settings',
    label: 'Account Settings',
    icon: 'bx bxs-cog',
    link: '/workspace/settings',
  },
];

export const agencyAutoBloggingMenu = [
  {
    label: 'Menu',
    isHeader: true,
  },
  {
    id: 'dashboard',
    label: 'All Products',
    icon: 'bx bxs-dashboard',
    link: '/products',
  },
  {
    id: 'article-history',
    label: 'Project History',
    icon: 'bx bx-history',
    link: '/products/aiwriter/history',
  },
  {
    id: 'create-article',
    label: 'Create Project',
    icon: 'bx bxs-file-plus',
    link: '/products/aiwriter/create',
  },
  {
    id: 'aiwriter-billing',
    label: 'Billing',
    icon: 'bx bx-credit-card',
    link: '/products/aiwriter/billing',
  },
];

export const whiteLabelProductMenu = [
  {
    label: 'Menu',
    isHeader: true,
  },
  {
    id: 'dashboard',
    label: 'All Products',
    icon: 'bx bxs-dashboard',
    link: '/products',
  },
  {
    id: 'workspace',
    label: 'Workspace',
    icon: 'bx bxs-network-chart',
    link: '/workspace',
  },
  {
    id: 'website-settings',
    label: 'Website Settings',
    icon: 'bx bx-cog',
    link: '/website/settings',
    new: false,
    tag: 'Update',
    tagClass: 'badge bg-success',
  },
  {
    id: 'ticket-manager',
    label: 'Ticket Manager',
    icon: 'las la-life-ring',
    link: '/ticket-manager',
  },
];

export const whiteLabelWABAMenu = [
  {
    label: 'Menu',
    isHeader: true,
  },
  {
    id: 'dashboard',
    label: 'All Products',
    icon: 'bx bxs-dashboard',
    link: '/products',
  },
  {
    id: 'dashboard',
    label: 'WABA',
    icon: 'bx bxl-whatsapp',
    link: '/products/waba',
  },
  {
    id: 'apps',
    label: 'Website Settings',
    icon: 'bx bx-cog',
    link: '/website/settings',
    new: false,
    tag: 'Update',
    tagClass: 'badge bg-success',
  },
];

export const whiteLabelCRMMenu = [
  {
    label: 'Menu',
    isHeader: true,
  },
  {
    id: 'dashboard',
    label: 'All Products',
    icon: 'bx bxs-dashboard',
    link: '/products',
  },
  {
    id: 'livechat',
    label: 'Live Chat',
    icon: 'bx bxs-chat',
    link: '/products/crm/livechat',
  },
  {
    id: 'channel',
    label: 'Channels',
    icon: 'bx bx-git-compare',
    link: '/products/crm/channel',
  },
  {
    id: 'contact',
    label: 'Contacts',
    icon: 'bx bxs-contact',
    link: '/products/crm/contact',
  },
  {
    id: 'custom-field',
    label: 'Custom Fields',
    icon: 'bx bxs-tag-alt',
    link: '/products/crm/custom-field',
  },
  // {
  //   id: "event-hook",
  //   label: "Event Hooks",
  //   icon: "bx bx-link",
  //   link: "/products/crm/event-hook",
  // },
  {
    id: 'canned-replies',
    label: 'Canned Replies',
    icon: 'bx bxs-message-detail',
    link: '/products/crm/canned-replies',
  },
  {
    label: 'Broadcasting',
    isHeader: true,
  },
  {
    id: 'filter-list',
    label: 'Segments',
    icon: 'bx bx-filter',
    link: '/products/crm/filter-list',
  },
  {
    id: 'campaign',
    label: 'Campaign',
    icon: 'bx bxs-megaphone',
    link: '/products/crm/campaign',
    new: true,
    tag: 'New',
    tagClass: 'badge bg-primary',
  },
  // {
  //   id: "broadcast",
  //   label: "Broadcast",
  //   icon: "bx bxs-vector",
  //   link: "/products/crm/broadcast",
  //   new: true,
  //   tag: "Depreciated",
  //   tagClass: "badge bg-danger",
  // },
  {
    label: 'Mass Broadcasting',
    isHeader: true,
  },
  {
    id: 'channel-group',
    label: 'Channel Group',
    icon: 'bx bx-merge',
    link: '/products/crm/channel-group',
  },
  {
    id: 'mass-broadcast',
    label: 'Mass Broadcast',
    icon: 'bx bx-broadcast',
    link: '/products/crm/mass-broadcast',
  },
  {
    label: 'Subscription',
    isHeader: true,
  },
  {
    id: 'crm-subscriptions',
    label: 'Subscriptions',
    icon: 'bx bxs-purchase-tag-alt',
    link: '/products/crm/subscription',
    // new: true,
    // tag: "New",
    // tagClass: "badge bg-primary",
  },
];

export const whiteLabelWorkspaceMenu = [
  {
    label: 'Menu',
    isHeader: true,
  },
  {
    id: 'dashboard',
    label: 'All Products',
    icon: 'bx bxs-dashboard',
    link: '/products',
  },
  {
    id: 'roleandpermission',
    label: 'Roles & Permissions',
    icon: 'bx bxs-user-badge',
    link: '/workspace/user-role',
  },
  {
    id: 'team-member',
    label: 'Team Members',
    icon: 'bx bxs-user-account',
    link: '/workspace/team-member',
  },
  {
    id: 'profile-settings',
    label: 'Account Settings',
    icon: 'bx bxs-cog',
    link: '/workspace/settings',
  },
  {
    id: 'panel-user',
    label: 'Panel Users',
    icon: 'bx bxs-user-circle',
    link: '/workspace/users',
  },
  {
    id: 'support-ticket',
    label: 'Support Ticket',
    icon: 'las la-life-ring',
    link: '/workspace/ticket',
  },
];

export const whiteLabelAutoBloggingMenu = [
  {
    label: 'Menu',
    isHeader: true,
  },
  {
    id: 'dashboard',
    label: 'All Products',
    icon: 'bx bxs-dashboard',
    link: '/products',
  },
  {
    id: 'article-history',
    label: 'Project History',
    icon: 'bx bx-history',
    link: '/products/aiwriter/history',
  },
  {
    id: 'create-article',
    label: 'Create Project',
    icon: 'bx bxs-dashboard',
    link: '/products/aiwriter/create',
  },
  {
    id: 'aiwriter-billing',
    label: 'Billing',
    icon: 'bx bx-credit-card',
    link: '/products/aiwriter/billing',
  },
];

export const adminProductMenu = [
  {
    label: 'Menu',
    isHeader: true,
  },
  {
    id: 'dashboard',
    label: 'All Products',
    icon: 'bx bxs-dashboard',
    link: '/products',
  },
  {
    id: 'apps',
    label: 'Website Settings',
    icon: 'bx bx-cog',
    link: '/website/settings',
    new: false,
    tag: 'Update',
    tagClass: 'badge bg-success',
  },
];

export const adminWABAMenu = [
  {
    label: 'Menu',
    isHeader: true,
  },
  {
    id: 'dashboard',
    label: 'All Products',
    icon: 'bx bxs-dashboard',
    link: '/products',
  },
  {
    id: 'dashboard',
    label: 'WABA',
    icon: 'bx bxl-whatsapp',
    link: '/products/waba',
  },
  {
    id: 'apps',
    label: 'Website Settings',
    icon: 'bx bx-cog',
    link: '/website/settings',
    new: false,
    tag: 'Update',
    tagClass: 'badge bg-success',
  },
];

export const adminCRMMenu = [];

export const adminAutoBloggingMenu = [
  {
    label: 'Menu',
    isHeader: true,
  },
  {
    id: 'dashboard',
    label: 'All Products',
    icon: 'bx bxs-dashboard',
    link: '/products',
  },
  {
    id: 'article-history',
    label: 'Project History',
    icon: 'bx bx-history',
    link: '/products/aiwriter/history',
  },
  {
    id: 'create-article',
    label: 'Create Project',
    icon: 'bx bxs-dashboard',
    link: '/products/aiwriter/create',
  },
  {
    id: 'aiwriter-billing',
    label: 'Billing',
    icon: 'bx bx-credit-card',
    link: '/products/aiwriter/billing',
  },
];

export const adminAutomationMenu = [
  {
    label: 'Menu',
    isHeader: true,
  },
  {
    id: 'dashboard',
    label: 'All Products',
    icon: 'bx bxs-dashboard',
    link: '/products',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'ri-line-chart-line',
    link: '/products/automation/analytics',
  },
  {
    id: 'my-apps',
    label: 'My Apps',
    icon: 'ri-apps-line',
    link: '/products/automation/app',
  },
  {
    id: 'flow',
    label: 'Workflow',
    icon: 'ri-stackshare-line',
    link: '/products/automation/flow',
  },
  {
    label: 'Template',
    isHeader: true,
  },
  {
    id: 'my-template',
    label: 'My Templates',
    icon: 'bx bxs-book-content',
    link: '/products/automation/my-template',
  },
  {
    id: 'my-template',
    label: 'Template Store',
    icon: 'bx bxs-book-bookmark',
    link: '/products/automation/template',
  },
  {
    label: 'Integration',
    isHeader: true,
  },
  {
    id: 'data-store',
    label: 'Data Store',
    icon: 'bx bxs-data',
    link: '/products/automation/data-store',
    new: true,
    tag: 'New',
    tagClass: 'badge bg-primary',
  },
  {
    label: 'Content',
    isHeader: true,
  },
  {
    id: 'bot-content',
    label: 'Bot Fields',
    icon: 'bx bx-code-alt',
    link: '/products/automation/bot-field',
    new: true,
    tag: 'New',
    tagClass: 'badge bg-primary',
  },
];

export const adminBotMenu = [
  {
    label: 'Menu',
    isHeader: true,
  },
  {
    id: 'dashboard',
    label: 'All Products',
    icon: 'bx bxs-dashboard',
    link: '/products',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'ri-line-chart-line',
    link: '/products/bot/analytics',
  },
  {
    id: 'flow',
    label: 'Workflow',
    icon: 'ri-stackshare-line',
    link: '/products/bot/flow',
  },
  {
    label: 'Template',
    isHeader: true,
  },
  {
    id: 'my-template',
    label: 'My Templates',
    icon: 'bx bxs-book-content',
    link: '/products/bot/my-template',
  },
  {
    id: 'my-template',
    label: 'Template Store',
    icon: 'bx bxs-book-bookmark',
    link: '/products/bot/template',
  },
  {
    label: 'Integration',
    isHeader: true,
  },
  {
    id: 'data-store',
    label: 'Data Store',
    icon: 'bx bxs-data',
    link: '/products/bot/data-store',
    new: true,
    tag: 'New',
    tagClass: 'badge bg-primary',
  },
  {
    label: 'Content',
    isHeader: true,
  },
  {
    id: 'bot-content',
    label: 'Bot Fields',
    icon: 'bx bx-code-alt',
    link: '/products/bot/bot-field',
    new: true,
    tag: 'New',
    tagClass: 'badge bg-primary',
  },
];

export const developerProductMenu = [
  {
    label: 'Menu',
    isHeader: true,
  },
  {
    id: 'dashboard',
    label: 'All Products',
    icon: 'bx bxs-dashboard',
    link: '/products',
  },
];
