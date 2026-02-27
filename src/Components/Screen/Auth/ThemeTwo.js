import React, { useEffect, useState } from 'react';
import MetaTags from 'react-meta-tags';
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form, FormFeedback } from 'reactstrap';
import { isMobile } from 'react-device-detect';

import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

//React Toast
import { ToastContainer, toast } from 'react-toastify';

import MetaTag from '../../Common/Meta';
import './Style.css';
import Preloader from '../../Loaders/Preloader';
import SimpleBar from 'simplebar-react';

const ThemeTwo = (props) => {
  const [bgType, setBgType] = useState('none');
  const [bg, setBg] = useState('');

  const [bgImageType, setBgImageType] = useState('none');
  const [bgImage, setBgImage] = useState('');

  const [bgTypeRight, setBgTypeRight] = useState('none');
  const [bgRight, setBgRight] = useState('');

  const [bgImageTypeRight, setBgImageTypeRight] = useState('gradient');
  const [bgImageRight, setBgImageRight] = useState('linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)');

  const [titleText, setTitleText] = useState('We are more than just a company');
  const [subTitleText, setSubTitleText] = useState(
    'Redefining limits of SaaS industry. Manage all your while label settings, manage panel users, manage billing, pricing and much more under single panel.'
  );

  useEffect(() => {
    if (props?.authVariables?.bgType) {
      if (props?.authVariables?.bgType === 'color') {
        setBgType('color');
        setBg(props?.authVariables?.bg);
      }
      if (props?.authVariables?.bgType === 'none') {
        setBgType('none');
        setBg('');
      }
      if (props?.authVariables?.titleText) {
        setTitleText(props?.authVariables?.titleText);
      }
      if (props?.authVariables?.subTitleText) {
        setSubTitleText(props?.authVariables?.subTitleText);
      }
      if (props?.authVariables?.paraText) {
        setParaText(props?.authVariables?.paraText);
      }
    }
    if (props?.authVariables?.bgImageType) {
      if (props?.authVariables?.bgImageType === 'image') {
        setBgImageType('image');
        setBgImage(props?.authVariables?.bgImage);
      }
      if (props?.authVariables?.bgImageType === 'gradient') {
        setBgImageType('gradient');
        setBgImage(props?.authVariables?.bgImage);
      }
      if (props?.authVariables?.bgImageType === 'none') {
        setBgImageType('none');
        setBgImage('');
      }
    }
    if (props?.authVariables?.bgTypeRight) {
      if (props?.authVariables?.bgTypeRight === 'color') {
        setBgTypeRight('color');
        setBgRight(props?.authVariables?.bgRight);
      }
      if (props?.authVariables?.bgTypeRight === 'none') {
        setBgTypeRight('none');
        setBgRight('');
      }
    }
    if (props?.authVariables?.bgImageTypeRight) {
      if (props?.authVariables?.bgImageTypeRight === 'image') {
        setBgImageTypeRight('image');
        setBgImageRight(props?.authVariables?.bgImageRight);
      }
      if (props?.authVariables?.bgImageTypeRight === 'gradient') {
        setBgImageTypeRight('gradient');
        setBgImageRight(props?.authVariables?.bgImageRight);
      }
      if (props?.authVariables?.bgImageTypeRight === 'none') {
        setBgImageTypeRight('none');
        setBgImageRight('');
      }
    }
  }, [props]);

  return !props.loading ? (
    <React.Fragment>
      <div className='auth-page-wrapper pt-0 pb-0'>
        <div
          //background-radial-gradient
          className='auth-page-content position-absolute pb-0'
          style={{
            top: 0,
            bottom: 0,
            overflowX: 'hidden',
            overflowY: 'auto',
            backgroundColor: bgType === 'color' ? bg : bgType === 'none' ? 'transparent' : '',
            backgroundRepeat: 'no-repeat',
            backgroundImage: bgImageType === 'image' ? `url(${bgImage})` : bgImageType === 'gradient' ? bgImage : '',
            backgroundSize: '100% 100%',
          }}
        >
          <MetaTag pageTitle={props.title} />
          <Container fluid style={{ height: '100vh' }}>
            {/* <Row className='h-100 bg-light'> */}
            <Row className='h-100'>
              <Col lg={4} md={12} sm={12}>
                <Col lg={10} md={12} sm={12} className={isMobile ? 'd-flex flex-column mt-5 mx-3' : 'd-flex flex-column mx-auto mt-5'}>
                  {props.children}
                </Col>
              </Col>
              {!isMobile && (
                <Col
                  lg={8}
                  className='text-center text-md-start d-flex flex-column justify-content-center d-sm-none d-md-none d-lg-block p-0 m-0'
                >
                  <div
                    //gradient-custom-2
                    className='d-flex flex-column justify-content-center h-100 mb-0'
                    style={{
                      backgroundColor: bgTypeRight === 'color' ? bgRight : bgTypeRight === 'none' ? 'transparent' : '',
                      backgroundRepeat: 'no-repeat',
                      backgroundImage:
                        bgImageTypeRight === 'image' ? `url(${bgImageRight})` : bgImageTypeRight === 'gradient' ? bgImageRight : '',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '100% 100%',
                    }}
                  >
                    <div className='text-white px-3 py-4 p-md-5 mx-md-4'>
                      <h4 className='mb-4 text-white text-center'>{titleText}</h4>
                      <p className='small mb-0 text-white text-center'>{subTitleText}</p>
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </Container>
        </div>
      </div>
      <ToastContainer />
    </React.Fragment>
  ) : (
    <Preloader />
  );
};

ThemeTwo.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};
export default withRouter(withTranslation()(ThemeTwo));
