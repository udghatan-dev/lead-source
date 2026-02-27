import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Collapse } from 'reactstrap';
// Import Data
import navdata from './LayoutMenuData';
//i18n
import { withTranslation } from 'react-i18next';

const SidebarContent = (props) => {
  const navData = navdata().props.children;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const initMenu = () => {
      const pathName = process.env.PUBLIC_URL + props.location.pathname;
      const ul = document.getElementById('navbar-nav');
      const items = ul.getElementsByTagName('a');
      let itemsArray = [...items]; // converts NodeList to Array
      //removeActivation(itemsArray);
      let matchingMenuItem = itemsArray.find((x) => {
        return x.pathname === pathName;
      });
      if (matchingMenuItem) {
        //activateParentDropdown(matchingMenuItem);
      }
    };
    if (props.layoutType === 'vertical') {
      initMenu();
    }
  }, [props.location.pathname, props.layoutType]);

  function activateParentDropdown(item) {
    item.classList.add('active');
    let parentCollapseDiv = item.closest('.collapse.menu-dropdown');

    if (parentCollapseDiv) {
      // to set aria expand true remaining
      parentCollapseDiv.classList.add('show');
      parentCollapseDiv.parentElement.children[0].classList.add('active');
      parentCollapseDiv.parentElement.children[0].setAttribute('aria-expanded', 'true');
      if (parentCollapseDiv.parentElement.closest('.collapse.menu-dropdown')) {
        parentCollapseDiv.parentElement.closest('.collapse').classList.add('show');
        if (parentCollapseDiv.parentElement.closest('.collapse').previousElementSibling)
          parentCollapseDiv.parentElement.closest('.collapse').previousElementSibling.classList.add('active');
      }
      return false;
    }
    return false;
  }

  const removeActivation = (items) => {
    let actiItems = items.filter((x) => x.classList.contains('active'));

    actiItems.forEach((item) => {
      if (item.classList.contains('menu-link')) {
        if (!item.classList.contains('active')) {
          item.setAttribute('aria-expanded', false);
        }
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove('show');
        }
      }
      if (item.classList.contains('nav-link')) {
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove('show');
        }
        item.setAttribute('aria-expanded', false);
      }
      item.classList.remove('active');
    });
  };

  return (
    <React.Fragment>
      {/* menu Items */}
      {(navData || []).map((item, key) => {
        return (
          <React.Fragment key={key}>
            {/* Main Header */}
            {item['isHeader'] ? (
              <li className='menu-title'>
                <span data-key='t-menu'>{props.t(item.label)}</span>
              </li>
            ) : item.subItems ? (
              <li className='nav-item'>
                <Link
                  onClick={item.click}
                  className='nav-link menu-link'
                  to={item.link ? item.link : '/#'}
                  data-bs-toggle='collapse'
                  aria-expanded={item.stateVariables?.split('#')[0] === item.id ? 'true' : 'false'}
                >
                  <i className={item.icon}></i> <span data-key='t-apps'>{props.t(item.label)}</span>
                </Link>
                {/** state variable
                 * isOpen={subItem.stateVariables}
                 */}
                <Collapse className='menu-dropdown' isOpen={item.stateVariables?.split('#')[0] === item.id} id='sidebarApps'>
                  <ul className='nav nav-sm flex-column test'>
                    {/* subItms  */}
                    {item.subItems &&
                      (item.subItems || []).map((subItem, key) => (
                        <React.Fragment key={key}>
                          {!subItem.isChildItem ? (
                            <li className='nav-item'>
                              <Link
                                to={subItem.link ? subItem.link : '/#'}
                                className={
                                  props.location.pathname === subItem.link ? 'nav-link nav-custom-link active' : 'nav-link nav-custom-link'
                                }
                              >
                                {subItem.icon !== undefined && <i className={subItem.icon}></i>}
                                {props.t(subItem.label)}
                              </Link>
                            </li>
                          ) : (
                            <li className='nav-item'>
                              <Link
                                onClick={subItem.click}
                                className={
                                  props.location.pathname === subItem.link ? 'nav-link nav-custom-link active' : 'nav-link nav-custom-link'
                                }
                                to='/#'
                                data-bs-toggle='collapse'
                                aria-expanded={subItem.stateVariables?.split('#')[1] === subItem.id ? 'true' : 'false'}
                              >
                                {subItem.icon !== undefined && <i className={subItem.icon}></i>} {props.t(subItem.label)}
                              </Link>
                              <Collapse
                                className='menu-dropdown'
                                isOpen={subItem.stateVariables?.split('#')[1] === subItem.id}
                                id='sidebarEcommerce'
                              >
                                <ul className='nav nav-sm flex-column'>
                                  {/* child subItms  */}
                                  {subItem.childItems &&
                                    (subItem.childItems || []).map((childItem, key) => (
                                      <React.Fragment key={key}>
                                        {!childItem.isChildItem ? (
                                          <li className='nav-item' key={key}>
                                            <Link
                                              to={childItem.link ? childItem.link : '/#'}
                                              className={
                                                props.location.pathname === childItem.link
                                                  ? 'nav-link nav-custom-link active'
                                                  : 'nav-link nav-custom-link'
                                              }
                                            >
                                              {childItem.icon !== undefined && <i className={childItem.icon}></i>}
                                              {props.t(childItem.label)}
                                            </Link>
                                          </li>
                                        ) : (
                                          <li className='nav-item'>
                                            <Link
                                              onClick={childItem.click}
                                              className={
                                                props.location.pathname === childItem.link
                                                  ? 'nav-link nav-custom-link active'
                                                  : 'nav-link nav-custom-link'
                                              }
                                              to='/#'
                                              data-bs-toggle='collapse'
                                              aria-expanded={childItem.stateVariables?.split('#')[2] === childItem.id ? 'true' : 'false'}
                                            >
                                              {childItem.icon !== undefined && <i className={childItem.icon}></i>}{' '}
                                              {props.t(childItem.label)}
                                            </Link>
                                            <Collapse
                                              className='menu-dropdown'
                                              isOpen={childItem.stateVariables?.split('#')[2] === childItem.id}
                                              id='sidebarEcommerce'
                                            >
                                              <ul className='nav nav-sm flex-column'>
                                                {/* child subItms  */}
                                                {childItem.childItems &&
                                                  (childItem.childItems || []).map((subChildItem, key) => (
                                                    <li className='nav-item' key={key}>
                                                      <Link
                                                        to={subChildItem.link ? subChildItem.link : '/#'}
                                                        className={
                                                          props.location.pathname === subChildItem.link
                                                            ? 'nav-link nav-custom-link active'
                                                            : 'nav-link nav-custom-link'
                                                        }
                                                      >
                                                        {subChildItem.icon !== undefined && <i className={subChildItem.icon}></i>}
                                                        {props.t(subChildItem.label)}
                                                      </Link>
                                                    </li>
                                                  ))}
                                              </ul>
                                            </Collapse>
                                          </li>
                                        )}
                                      </React.Fragment>
                                    ))}
                                </ul>
                              </Collapse>
                            </li>
                          )}
                        </React.Fragment>
                      ))}
                  </ul>
                </Collapse>
              </li>
            ) : (
              <li className='nav-item menu-transform'>
                <Link onClick={item.isCustom ? item.click : ''} className='nav-link menu-link' to={item.link ? item.link : '/#'}>
                  <i className={item.icon}></i> <span>{props.t(item.label)}</span>
                  {item.new === true ? <span className={item.tagClass}>{props.t(item.tag)}</span> : ''}
                </Link>
              </li>
            )}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
