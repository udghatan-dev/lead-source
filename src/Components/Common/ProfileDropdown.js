import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { withRouter, useHistory } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
//import images
import Avatar from 'react-avatar';
import { useSelector } from 'react-redux';
import { staticDecrypt } from '../../security';

const ProfileDropdown = (props) => {
  //Dropdown Toggle
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const [balance, setBalance] = useState({ balance: 0, incoming: 0, outgoing: 0, currency: '' });
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };

  const { userRNP, userWallet, profileMenu } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
    userWallet: state.UserSession.userWallet,
    profileMenu: state.PanelMenu.profileMenu,
  }));

  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    try {
      let profile = localStorage.getItem('_mnp');
      if (profile !== null) {
        let m = staticDecrypt(profile);
        m = JSON.parse(m);
        setMenuItems(m);
      }
    } catch (error) {
      //
    }
  }, []);

  useEffect(() => {
    if (userWallet?.success) {
      setBalance(userWallet?.data);
    }
  }, [userWallet]);

  if (userRNP !== null) {
    var userName = userRNP?.profile?.name;
    var profileImage = '';
    var userName = userName ?? 'User';
    var userType = userRNP.role === 'team_member' ? 'Team Member' : 'User';
  } else {
    var profileImage = '';
    var userName = 'User';
    var userType = 'User';
  }

  // let menuItems = [
  //   {
  //     type: 'menu',
  //     label: 'Balance: {{wallet_balance}} {{wallet_currency}}',
  //     icon: 'bx bxs-wallet-alt',
  //     href: '#',
  //     m_type: 'page',
  //   },
  //   {
  //     type: 'divider',
  //   },
  //   {
  //     type: 'header',
  //     label: 'Settings',
  //   },
  //   {
  //     type: 'menu',
  //     label: 'Profile',
  //     icon: 'mdi mdi-account-circle',
  //     href: '/workspace/settings',
  //     m_type: 'page',
  //   },
  //   {
  //     type: 'menu',
  //     label: 'Wallet & Transactions',
  //     icon: 'bx bxs-wallet',
  //     href: '/workspace/wallet',
  //     m_type: 'page',
  //   },
  //   {
  //     type: 'menu',
  //     label: 'Billing',
  //     icon: 'bx bxs-credit-card',
  //     href: '/workspace/billing',
  //     m_type: 'page',
  //   },
  //   {
  //     type: 'divider',
  //   },
  //   {
  //     type: 'header',
  //     label: 'Support',
  //   },
  //   {
  //     type: 'menu',
  //     label: 'Support Ticket',
  //     icon: 'mdi mdi-lifebuoy',
  //     href: '/workspace/ticket',
  //     m_type: 'page',
  //   },
  //   {
  //     type: 'menu',
  //     label: 'Documentation',
  //     icon: 'mdi mdi-file-document',
  //     href: 'https://documentation.automationsbuilder.com/',
  //     m_type: 'custom',
  //   },
  // ];

  return (
    <React.Fragment>
      <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className='ms-sm-3 header-item topbar-user'>
        <DropdownToggle tag='button' type='button' className='btn'>
          <span className='d-flex align-items-center'>
            <Avatar src={profileImage} name={userName} round={true} size='30' />
            <span className='text-start ms-xl-2'>
              <span
                className='d-none d-xl-inline-block ms-1 fw-medium user-name-text'
                style={{
                  maxWidth: '100px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {userName}
              </span>
              <span className='d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text'>{userType}</span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className='dropdown-menu-end'>
          <span className='dropdown-header d-flex align-items-center'>
            <Avatar src={profileImage} name={userName} round='5px' size='30' />
            <span className='text-start ms-xl-2'>
              <span
                className='d-xl-inline-block ms-1 fw-medium user-name-text'
                style={{
                  maxWidth: '220px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {props.t('Welcome')}, {userName} !
              </span>
              <span className='d-xl-block ms-1 fs-12 text-muted user-name-sub-text d-flex align-items-center'>
                <i className='bx bxs-circle text-success ms-0 me-1 mb-0'></i>
                {props.t('Active')} ({userType})
              </span>
            </span>
          </span>
          {/* <h6 className='dropdown-header text-muted'>
            {props.t('Welcome')} {userName}!
          </h6> */}
          {menuItems.length > 0 && <div className='dropdown-divider'></div>}
          {menuItems.map((menu, index) => {
            if (menu.type === 'page') {
              return (
                <DropdownItem href={menu.link} className='text-muted' key={menu.link}>
                  <i className={menu.icon + ' text-muted fs-18 align-middle me-2'}></i>
                  <span className='align-middle'>
                    {menu.label.replaceAll('{{wallet_balance}}', balance.balance).replaceAll('{{wallet_currency}}', balance.currency)}
                  </span>
                </DropdownItem>
              );
            }
            if (menu.type === 'custom_link') {
              return (
                <DropdownItem href={menu.link} target='_blank' className='text-muted' key={menu.link}>
                  <i className={menu.icon + ' text-muted fs-18 align-middle me-2'}></i>
                  <span className='align-middle'>{menu.label}</span>
                </DropdownItem>
              );
            }
            if (menu.type === 'divider') {
              return <div className='dropdown-divider' key={index}></div>;
            }
            if (menu.type === 'header') {
              return (
                <h6 className='dropdown-header text-muted' key={index}>
                  {menu.label}
                </h6>
              );
            }
          })}
          {/* <DropdownItem href='/pages-profile'>
            <i className='mdi mdi-account-circle text-muted fs-16 align-middle me-1'></i>
            <span className='align-middle'>Profile</span>
          </DropdownItem>
          <DropdownItem href='/apps-chat'>
            <i className='mdi mdi-message-text-outline text-muted fs-16 align-middle me-1'></i>{' '}
            <span className='align-middle'>Messages</span>
          </DropdownItem>
          <DropdownItem href='/apps-tasks-kanban'>
            <i className='mdi mdi-calendar-check-outline text-muted fs-16 align-middle me-1'></i>{' '}
            <span className='align-middle'>Taskboard</span>
          </DropdownItem>
          <DropdownItem href='/pages-faqs'>
            <i className='mdi mdi-lifebuoy text-muted fs-16 align-middle me-1'></i> <span className='align-middle'>Help</span>
          </DropdownItem>
          <div className='dropdown-divider'></div>
          <DropdownItem href='/pages-profile'>
            <i className='mdi mdi-wallet text-muted fs-16 align-middle me-1'></i>{' '}
            <span className='align-middle'>
              Balance : <b>$5971.67</b>
            </span>
          </DropdownItem>
          <DropdownItem href='/pages-profile-settings'>
            <span className='badge bg-soft-success text-success mt-1 float-end'>New</span>
            <i className='mdi mdi-cog-outline text-muted fs-16 align-middle me-1'></i> <span className='align-middle'>Settings</span>
          </DropdownItem>
          <DropdownItem href='/auth-lockscreen-basic'>
            <i className='mdi mdi-lock text-muted fs-16 align-middle me-1'></i> <span className='align-middle'>Lock screen</span>
          </DropdownItem> */}
          <div className='dropdown-divider'></div>
          <DropdownItem href='/logout'>
            <i className='mdi mdi-logout text-muted fs-16 align-middle me-1'></i>
            <span className='align-middle' data-key='t-logout'>
              {props.t('Logout')}
            </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileDropdown.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};
export default withRouter(withTranslation()(ProfileDropdown));
