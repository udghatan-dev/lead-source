import React, { useEffect, useState } from 'react';
import UserPermissions from '../../Routes/UserPermissions';

//Icons
import { VscEditorLayout } from 'react-icons/vsc';
import { HiCog } from 'react-icons/hi2';
import generateSubMenu from './SubMenu';
import { useSelector } from 'react-redux';
import { useProduct } from '../../Components/Hooks/ProductHooks';
import axios from 'axios';

const Navdata = () => {
  const productVisibility = useProduct();
  const { userRNP } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
  }));

  const [isDynamicExp, setIsDynamicExp] = useState(false);
  const [crmVersion, setCrmVersion] = useState('v1');

  useEffect(() => {
    axios({
      url: 'https://mapi.1automations.com/api/v2/crm/migration',
      method: 'get',
    })
      .then((response) => {
        if (response.success) {
          setCrmVersion('v2');
        }
      })
      .catch((err) => {});
  }, []);

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

  const menuItems = [
    {
      label: 'Menu',
      isHeader: true,
    },
    {
      id: 'dashboard',
      label: 'All Products',
      icon: 'bx bxs-dashboard',
      link: '/products',
      click: function (e) {
        e.preventDefault();
        setIscurrentState('Dashboard');
      },
    },
    {
      id: 'leadsource',
      label: 'LeadSource',
      icon: 'bx bx-link',
      link: '/settings',
      click: function (e) {
        e.preventDefault();
        setIscurrentState('LeadSource');
      },
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'bx bx-bar-chart-alt-2',
      link: '/settings/analytics',
      parentId: 'leadsource',
      click: function (e) {
        e.preventDefault();
        setIscurrentState('Analytics');
      },
    },
    // {
    //   id: 'dynamic_experience',
    //   label: 'Dynamic Experience',
    //   icon: <VscEditorLayout className='fs-18' style={{ fill: 'currentColor' }} />,
    //   iconType: 'component',
    //   link: '/#',
    //   path: '/image',
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsDynamicExp(!isDynamicExp);
    //     setIscurrentState('DYNAMIC_EXPERIENCE');
    //     updateIconSidebar(e);
    //   },
    //   stateVariables: isDynamicExp,
    //   subItems: generateSubMenu('DYNAMIC_EXPERIENCE'),
    //   permissions: [...UserPermissions.DIG.IMAGE_EXPERIENCE],
    // },
    {
      label: 'Workspace & Settings',
      isHeader: true,
    },
    {
      id: 'workspace',
      label: 'Workspace',
      icon: <HiCog className='fs-18' style={{ fill: 'currentColor' }} />,
      iconType: 'component',
      link: '/workspace',
      click: function (e) {
        e.preventDefault();
        setIscurrentState('Dashboard');
      },
    },
  ];

  let activeProductPath = productVisibility
    .filter((product) => product.type === 'product' && product.isActive && !product.isCustom)
    .map((product) => {
      return product.hyperlink;
    });

  const filteredMenuItems = menuItems.filter((menu) => {
    if (menu.permissions) {
      if ((userRNP?.permissions ?? []).some((item) => (menu?.permissions ?? []).includes(item))) {
        if (menu.id === 'crm_v1' && crmVersion === 'v2') {
          //
        } else if (menu.id === 'crm_v2' && crmVersion === 'v1') {
          //
        } else {
          if (menu.id === 'crm_v1' || menu.id === 'crm_v2') {
            menu['label'] = 'CRM';
          }
          return menu;
        }
      }
    } else if (menu.path) {
      if (activeProductPath.indexOf(menu.path) !== -1) {
        return menu;
      }
    } else {
      return menu;
    }
  });
  return <React.Fragment>{filteredMenuItems}</React.Fragment>;
};
export default Navdata;
