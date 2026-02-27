import channel_menu from './Menu/channel.js';
import crm_menu from './Menu/crm.js';
import crm_v2_menu from './Menu/crm_v2.js';
import bot_menu from './Menu/bot.js';
import automation_menu from './Menu/automation.js';
import virtual_number_menu from './Menu/virtual_number.js';
import mini_app_menu from './Menu/mini_app.js';
import widget_menu from './Menu/chat_widget.js';
import payment_menu from './Menu/payment.js';
import dig_menu from './Menu/dig.js';
import department_menu from './Menu/department.js';
import workspace_menu from './Menu/workspace.js';
import { useSelector } from 'react-redux';

const SUBMENU = {
  CHANNEL: channel_menu,
  CRMV1: crm_menu,
  CRMV2: crm_v2_menu,
  BOT: bot_menu,
  AUTOMATION: automation_menu,
  VIRTUAL_NUMBER: virtual_number_menu,
  MINI_APP: mini_app_menu,
  CHAT_WIDGET: widget_menu,
  PAYMENT: payment_menu,
  DYNAMIC_EXPERIENCE: dig_menu,
  DEPARTMENT: department_menu,
  WORKSPACE: workspace_menu,
};

function generateSubMenu(menu_key) {
  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
  }));

  let menuItems = (SUBMENU[menu_key] || []).filter((menu) => {
    if (menu.permissions) {
      if ((userRNP?.permissions ?? []).some((item) => (menu?.permissions ?? []).includes(item))) {
        return menu;
      } else {
        if (userRNP?.role === 'user') {
          return menu;
        }
      }
    } else if (menu?.role) {
      if (menu?.role?.indexOf(userRNP?.role) !== -1) {
        return menu;
      }
    } else {
      return menu;
    }
  });

  return menuItems;
}

export default generateSubMenu;
