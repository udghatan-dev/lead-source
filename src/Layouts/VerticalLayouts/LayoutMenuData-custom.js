import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { useProduct } from '../../Components/Hooks/ProductHooks';
import { CustomMenu } from './allMenuData';
import { staticDecrypt } from '../../security';
import DefaultMenu from './Default';

const MENU_COOKIE = {
  PROFILE: '_mnp',
  WABA: '_mnw',
  CRM: '_mnc',
  BOT_BUILDER: '_mnb',
  AUTOMATION: '_mna',
  HOME: '_mnh',
  VIRTUAL_NUMBER: '_mnv',
  WORKSPACE: '_mnwr',
};

function getLocation(pathName) {
  if (pathName === '/products' || pathName === '/products/' || pathName === '/' || pathName.includes('/products/e/')) {
    return 'HOME';
  }
  if (pathName.includes('/products/waba')) {
    return 'WABA';
  }
  if (pathName.includes('/products/virtual_number')) {
    return 'VIRTUAL_NUMBER';
  }
  if (pathName.includes('/products/crm')) {
    return 'CRM';
  }
  if (pathName.includes('/products/channel')) {
    return 'CHANNEL';
  }
  if (pathName.includes('/products/bot')) {
    return 'BOT';
  }
  if (pathName.includes('/products/ecom')) {
    return 'ECOM';
  }
  if (pathName.includes('/products/automation')) {
    return 'AUTOMATION';
  }
  // if (pathName.includes('/products/tasks')) {
  //   return 'TASKSBOT';
  // }
  if (pathName.includes('/workspace')) {
    return 'WORKSPACE';
  }
}

const Navdata = () => {
  const dispatch = useDispatch();
  const productVisibility = useProduct();

  const [pageLoaded, setPageLoaded] = React.useState(false);
  const [pageSettings, setPageSettings] = React.useState(null);

  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
  }));

  let access = [];
  if (userRNP) {
    access = userRNP.permissions;
  }

  React.useEffect(() => {
    if (productVisibility.length > 0) {
      setPageSettings(productVisibility);
    }
  }, [productVisibility]);

  const history = useHistory();
  const location = useLocation();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);

  const [iscurrentState, setIscurrentState] = useState('Dashboard');

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute('subitems')) {
      const ul = document.getElementById('two-column-menu');
      const iconItems = ul.querySelectorAll('.nav-icon.active');
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove('active');
        var id = item.getAttribute('subitems');
        if (document.getElementById(id)) document.getElementById(id).classList.remove('show');
      });
    }
  }

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  useEffect(() => {
    document.body.classList.remove('twocolumn-panel');
    if (iscurrentState !== 'Dashboard') {
      setIsDashboard(false);
    }
    if (iscurrentState === 'Widgets') {
      history.push('/widgets');
      document.body.classList.add('twocolumn-panel');
    }
  }, [history, iscurrentState, isDashboard]);

  const pathName = location.pathname;

  let menuItems = [];

  if (userRNP !== null) {
    var userType = userRNP.role;
    let customMenu = [];

    let section = '';
    if (pathName === '/products' || pathName === '/products/' || pathName === '/' || pathName.includes('/products/e/')) {
      section = 'HOME';
      try {
        let homeMenu = localStorage.getItem(MENU_COOKIE['HOME']);
        if (homeMenu !== null) {
          customMenu = JSON.parse(staticDecrypt(homeMenu));
        } else {
          customMenu = DefaultMenu['HOME'];
        }
      } catch (error) {
        customMenu = DefaultMenu['HOME'];
      }
    }
    if (pathName.includes('/products/waba')) {
      section = 'WABA';
      try {
        let wabaMenu = localStorage.getItem(MENU_COOKIE['WABA']);
        if (wabaMenu !== null) {
          customMenu = JSON.parse(staticDecrypt(wabaMenu));
        } else {
          customMenu = DefaultMenu['WABA'];
        }
      } catch (error) {
        customMenu = DefaultMenu['WABA'];
      }
    }
    if (pathName.includes('/products/crm')) {
      section = 'CRM';
      try {
        let crmMenu = localStorage.getItem(MENU_COOKIE['CRM']);
        if (crmMenu !== null) {
          customMenu = JSON.parse(staticDecrypt(crmMenu));
        } else {
          customMenu = DefaultMenu['CRM'];
        }
      } catch (error) {
        customMenu = DefaultMenu['CRM'];
      }
    }
    if (pathName.includes('/products/crmv2')) {
      section = 'CRM';
      try {
        let crmMenu = localStorage.getItem(MENU_COOKIE['CRMV2']);
        if (crmMenu !== null) {
          customMenu = JSON.parse(staticDecrypt(crmMenu));
        } else {
          customMenu = DefaultMenu['CRMV2'];
        }
      } catch (error) {
        customMenu = DefaultMenu['CRMV2'];
      }
    }
    // if (pathName.includes('/products/tasks')) {
    //   section = 'TASKSBOT';
    //   try {
    //     let crmMenu = localStorage.getItem(MENU_COOKIE['TASKSBOT']);
    //     if (crmMenu !== null) {
    //       customMenu = JSON.parse(staticDecrypt(crmMenu));
    //     } else {
    //       customMenu = DefaultMenu['TASKSBOT'];
    //     }
    //   } catch (error) {
    //     customMenu = DefaultMenu['TASKSBOT'];
    //   }
    // }
    if (pathName.includes('/products/payment')) {
      section = 'PAYMENTS';
      try {
        let paymentMenu = localStorage.getItem(MENU_COOKIE['PAYMENTS']);
        if (paymentMenu !== null) {
          customMenu = JSON.parse(staticDecrypt(paymentMenu));
        } else {
          customMenu = DefaultMenu['PAYMENTS'];
        }
      } catch (error) {
        customMenu = DefaultMenu['PAYMENTS'];
      }
    }
    if (pathName.includes('/image')) {
      section = 'DIG';
      try {
        let paymentMenu = localStorage.getItem(MENU_COOKIE['DIG']);
        if (paymentMenu !== null) {
          customMenu = JSON.parse(staticDecrypt(paymentMenu));
        } else {
          customMenu = DefaultMenu['DIG'];
        }
      } catch (error) {
        customMenu = DefaultMenu['DIG'];
      }
    }
    if (pathName.includes('/pdf')) {
      section = 'DIG';
      try {
        let paymentMenu = localStorage.getItem(MENU_COOKIE['DIG']);
        if (paymentMenu !== null) {
          customMenu = JSON.parse(staticDecrypt(paymentMenu));
        } else {
          customMenu = DefaultMenu['DIG'];
        }
      } catch (error) {
        customMenu = DefaultMenu['DIG'];
      }
    }
    if (pathName.includes('/products/channel')) {
      section = 'CHANNEL';
      try {
        let crmMenu = localStorage.getItem(MENU_COOKIE['CHANNEL']);
        if (crmMenu !== null) {
          customMenu = JSON.parse(staticDecrypt(crmMenu));
        } else {
          customMenu = DefaultMenu['CHANNEL'];
        }
      } catch (error) {
        customMenu = DefaultMenu['CHANNEL'];
      }
    }
    if (pathName.includes('/products/virtual_number')) {
      section = 'VIRTUAL_NUMBER';
      try {
        let vnMenu = localStorage.getItem(MENU_COOKIE['VIRTUAL_NUMBER']);
        if (vnMenu !== null) {
          customMenu = JSON.parse(staticDecrypt(vnMenu));
          customMenu = customMenu.filter((menu) => {
            if (menu?.link?.indexOf('/products/virtual_number/webhook') === -1) {
              return menu;
            }
          });
        } else {
          customMenu = DefaultMenu['VIRTUAL_NUMBER'];
        }
      } catch (error) {
        customMenu = DefaultMenu['VIRTUAL_NUMBER'];
      }
    }
    if (pathName.includes('/products/bot')) {
      section = 'BOT_BUILDER';
      try {
        let botMenu = localStorage.getItem(MENU_COOKIE['BOT_BUILDER']);
        if (botMenu !== null) {
          customMenu = JSON.parse(staticDecrypt(botMenu));
        } else {
          customMenu = DefaultMenu['BOT_BUILDER'];
        }
      } catch (error) {
        customMenu = DefaultMenu['BOT_BUILDER'];
      }
    }
    if (pathName.includes('/products/automation')) {
      section = 'AUTOMATION';
      try {
        let automationMenu = localStorage.getItem(MENU_COOKIE['AUTOMATION']);
        if (automationMenu !== null) {
          customMenu = JSON.parse(staticDecrypt(automationMenu));
        } else {
          customMenu = DefaultMenu['AUTOMATION'];
        }
      } catch (error) {
        customMenu = DefaultMenu['AUTOMATION'];
      }
    }
    if (pathName.includes('/products/flows')) {
      section = 'WAPPFLOW';
      try {
        let wappFlowMenu = localStorage.getItem(MENU_COOKIE['WAPPFLOW']);
        if (wappFlowMenu !== null) {
          customMenu = JSON.parse(staticDecrypt(wappFlowMenu, false));
        } else {
          customMenu = DefaultMenu['WAPPFLOW'];
        }
      } catch (error) {
        customMenu = DefaultMenu['WAPPFLOW'];
      }
    }
    if (pathName.includes('/products/widget')) {
      section = 'WAPPWIDGET';
      try {
        let wappWidgetMenu = localStorage.getItem(MENU_COOKIE['WAPPWIDGET']);
        if (wappWidgetMenu !== null) {
          customMenu = JSON.parse(staticDecrypt(wappWidgetMenu, false));
        } else {
          customMenu = DefaultMenu['WAPPWIDGET'];
        }
      } catch (error) {
        customMenu = DefaultMenu['WAPPWIDGET'];
      }
    }
    if (pathName.includes('/workspace')) {
      section = 'WORKSPACE';
      try {
        let workspaceMenu = localStorage.getItem(MENU_COOKIE['WORKSPACE']);
        if (workspaceMenu !== null) {
          customMenu = JSON.parse(staticDecrypt(workspaceMenu, false));
        } else {
          customMenu = DefaultMenu['WORKSPACE'];
        }
      } catch (error) {
        customMenu = DefaultMenu['WORKSPACE'];
      }
    }
    if (pathName.includes('/products/department')) {
      section = 'DEPARTMENT';
      try {
        let workspaceMenu = localStorage.getItem(MENU_COOKIE['DEPARTMENT']);
        if (workspaceMenu !== null) {
          customMenu = JSON.parse(staticDecrypt(workspaceMenu, false));
        } else {
          customMenu = DefaultMenu['DEPARTMENT'];
        }
      } catch (error) {
        customMenu = DefaultMenu['DEPARTMENT'];
      }
    }

    customMenu = customMenu.filter((menu) => {
      if (menu?.link?.indexOf('/products/virtual_number/webhook') === -1) {
        return menu;
      }
    });

    menuItems = CustomMenu({
      iscurrentState,
      setIscurrentState,
      updateIconSidebar,
      section,
      customMenu,
    }).filter((menu) => {
      if (userRNP.role === 'team_member' && menu.id === 'workspace') {
        return;
      }
      if (menu.permissions.length > 0) {
        let available = false;
        access.map((perm) => {
          if (menu.permissions.indexOf(perm) !== -1) {
            available = true;
          }
        });
        if (available) {
          if (menu.subItems !== undefined) {
            menu.subItems = menu.subItems.filter((m) => {
              if (m.subItems !== undefined) {
                m.subItems = m.subItems.filter((p) => {
                  if (pathName === p.link && !iscurrentState.includes(p.id) && !pageLoaded) {
                    setIscurrentState(p.parentId + '#' + p.id);
                  }
                  if (p.permissions.length > 0) {
                    let a = false;
                    access.map((perm) => {
                      if (p.permissions.indexOf(perm) !== -1) {
                        a = true;
                      }
                    });
                    if (a) {
                      return p;
                    }
                  } else {
                    return p;
                  }
                });
              } else if (pathName === m.link && !iscurrentState.includes(m.id) && !pageLoaded) {
                setIscurrentState(m.parentId + '#' + m.id);
              }
              if (m.permissions.length > 0) {
                let a = false;
                access.map((perm) => {
                  if (m.permissions.indexOf(perm) !== -1) {
                    a = true;
                  }
                });
                if (a) {
                  return m;
                }
              } else {
                return m;
              }
            });
          }
          return {
            ...menu,
          };
        }
      } else {
        if (menu.subItems !== undefined) {
          menu.subItems = menu.subItems.filter((m) => {
            if (m.subItems !== undefined) {
              m.subItems = m.subItems.filter((p) => {
                if (pathName === p.link && !iscurrentState.includes(p.id) && !pageLoaded) {
                  setIscurrentState(p.parentId + '#' + p.id);
                }

                if (p.permissions.length > 0) {
                  let a = false;
                  access.map((perm) => {
                    if (p.permissions.indexOf(perm) !== -1) {
                      a = true;
                    }
                  });
                  if (a) {
                    return p;
                  }
                } else {
                  return p;
                }
              });
            } else if (pathName === m.link && !iscurrentState.includes(m.id) && !pageLoaded) {
              setIscurrentState(m.parentId + '#' + m.id);
            }
            if (m.permissions.length > 0) {
              let a = false;
              access.map((perm) => {
                if (m.permissions.indexOf(perm) !== -1) {
                  a = true;
                }
              });
              if (a) {
                return m;
              }
            } else {
              return m;
            }
          });
        }
        return {
          ...menu,
        };
      }
    });
  } else {
  }

  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
