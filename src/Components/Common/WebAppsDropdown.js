import React, { useState } from 'react';
import { Col, Dropdown, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
//import images
import { Link } from 'react-router-dom';
import { decrypt } from '../../security';
import { useProduct } from '../Hooks/ProductHooks';

const WebAppsDropdown = (props) => {
  const [isWebAppDropdown, setIsWebAppDropdown] = useState(false);
  const toggleWebAppDropdown = () => {
    setIsWebAppDropdown(!isWebAppDropdown);
  };
  const productVisibility = useProduct();

  // let pv = localStorage.getItem("_pv");
  // pv = decrypt(pv);
  // if (pv !== null) {
  //   var showWaba = JSON.parse(pv).waba;
  //   var showCrm = JSON.parse(pv).crm;
  //   var showAutomation = JSON.parse(pv).automation;
  //   var showEcommerce = JSON.parse(pv).ecommerce;
  // } else {
  //   var showWaba = "hide";
  //   var showCrm = "hide";
  //   var showAutomation = "hide";
  //   var showEcommerce = "hide";
  // }
  return (
    <React.Fragment>
      <Dropdown isOpen={isWebAppDropdown} toggle={toggleWebAppDropdown} className='topbar-head-dropdown ms-1 header-item'>
        <DropdownToggle tag='button' type='button' className='btn btn-icon btn-topbar btn-ghost-secondary rounded-circle'>
          <i className='bx bx-category-alt fs-22'></i>
        </DropdownToggle>
        <DropdownMenu className='dropdown-menu-lg p-0 dropdown-menu-end'>
          <div className='p-3 border-top-0 border-start-0 border-end-0 border-dashed border'>
            <Row className='align-items-center'>
              <Col>
                <h6 className='m-0 fw-semibold fs-15'> {props.t('Products')} </h6>
              </Col>
              <div className='col-auto'>
                <Link to='/products' className='btn btn-sm btn-soft-info'>
                  {' '}
                  {props.t('View All Products')}
                  <i className='ri-arrow-right-s-line align-middle'></i>
                </Link>
              </div>
            </Row>
          </div>

          <div className='p-2'>
            <div className='row g-0'>
              {productVisibility.WABA ? (
                <Col lg={4} md={4}>
                  <Link className='dropdown-icon-item' to='/products/waba'>
                    <i className='mdi mdi-whatsapp fs-24 text-primary'></i>
                    <span>{props.t('WABA')}</span>
                  </Link>
                </Col>
              ) : (
                ''
              )}
              {productVisibility.CRM ? (
                <Col lg={4} md={4}>
                  <Link className='dropdown-icon-item' to='/products/crm'>
                    <i className='ri-briefcase-5-line fs-24 text-primary'></i>
                    <span>{props.t('CRM')}</span>
                  </Link>
                </Col>
              ) : (
                ''
              )}
              {productVisibility.CRM ? (
                <Col lg={4} md={4}>
                  <Link className='dropdown-icon-item' to='/products/crm/livechat'>
                    <i className='ri-chat-smile-2-line fs-24 text-primary'></i>
                    <span>{props.t('Unified Team Inbox')}</span>
                  </Link>
                </Col>
              ) : (
                ''
              )}
              {productVisibility.BOT_BUILDER ? (
                <Col lg={4} md={4}>
                  <Link className='dropdown-icon-item' to='/products/bot'>
                    <i className='bx bx-bot fs-24 text-primary'></i>
                    <span>{props.t('Bot Builder')}</span>
                  </Link>
                </Col>
              ) : (
                ''
              )}
              {productVisibility.AUTOMATION ? (
                <Col lg={4} md={4}>
                  <Link className='dropdown-icon-item' to='/products/automation'>
                    <i className='bx bx-git-repo-forked bx-rotate-90 fs-24 text-primary'></i>
                    <span>{props.t('Automations Builder')}</span>
                  </Link>
                </Col>
              ) : (
                ''
              )}
              {/* <Col>
                                <Link className="dropdown-icon-item" to="#">
                                    <img src={dribbble} alt="dribbble" />
                                    <span>Dribbble</span>
                                </Link>
                            </Col> */}
            </div>
            {/* 
                        <div className="row g-0">
                            <Col>
                                <Link className="dropdown-icon-item" to="#">
                                    <img src={dropbox} alt="dropbox" />
                                    <span>Dropbox</span>
                                </Link>
                            </Col>
                            <Col>
                                <Link className="dropdown-icon-item" to="#">
                                    <img src={mail_chimp} alt="mail_chimp" />
                                    <span>Mail Chimp</span>
                                </Link>
                            </Col>
                            <Col>
                                <Link className="dropdown-icon-item" to="#">
                                    <img src={slack} alt="slack" />
                                    <span>Slack</span>
                                </Link>
                            </Col>
                        </div> */}
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

WebAppsDropdown.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};
export default withRouter(withTranslation()(WebAppsDropdown));
