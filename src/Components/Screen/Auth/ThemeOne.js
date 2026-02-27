import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form, FormFeedback } from 'reactstrap';
import { isMobile } from 'react-device-detect';

import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

//React Toast

import MetaTag from '../../Common/Meta';
import './Style.css';

const ThemeOne = (props) => {
  const [bgType, setBgType] = useState('color');
  const [bg, setBg] = useState('#172236');

  const [bgImageType, setBgImageType] = useState('gradient');
  const [bgImage, setBgImage] = useState(
    'radial-gradient(650px circle at 0% 0%,hsl(218, 41%, 35%) 15%,hsl(218, 41%, 30%) 35%,hsl(218, 41%, 20%) 75%,hsl(218, 41%, 19%) 80%,transparent 100%),radial-gradient(1250px circle at 100% 100%,hsl(218, 41%, 45%) 15%,hsl(218, 41%, 30%) 35%,hsl(218, 41%, 20%) 75%,hsl(218, 41%, 19%) 80%,transparent 100%)'
  );

  const [titleText, setTitleText] = useState('One stop solution');
  const [subTitleText, setSubTitleText] = useState('for your business');
  const [paraText, setParaText] = useState(
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
  }, [props]);
  return (
    <React.Fragment>
      <div className='auth-page-wrapper pt-0 pb-0'>
        <div
          //background-radial-gradient
          className='auth-page-content p-1 position-absolute pb-0'
          style={{
            top: 0,
            bottom: 0,
            overflowX: 'hidden',
            overflowY: 'auto',
            backgroundColor: bgType === 'color' ? bg : bgType === 'none' ? 'transparent' : '',
            backgroundImage: bgImageType === 'image' ? `url(${bgImage})` : bgImageType === 'gradient' ? bgImage : '',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
          }}
        >
          <MetaTag pageTitle={props.title} />
          <Container>
            <Row className='mt-3'>
              {!isMobile && (
                <Col lg={6} className='text-center text-md-start d-flex flex-column justify-content-center d-sm-none d-md-none d-lg-block'>
                  <h1 className='my-5 display-3 fw-bold ls-tight px-3' style={{ color: 'hsl(218, 81%, 95%)' }}>
                    {titleText} <br />
                    <span style={{ color: 'hsl(218, 81%, 75%)' }}>{subTitleText}</span>
                  </h1>

                  <p className='px-3' style={{ color: 'hsl(218, 81%, 85%)' }}>
                    {paraText}
                  </p>
                </Col>
              )}
              <Col lg={6} sm={12} className='position-relative'>
                {/* <div id='radius-shape-1' className='position-absolute rounded-circle shadow-5-strong'></div>
                <div id='radius-shape-2' className='position-absolute shadow-5-strong'></div> */}
                <Row className='justify-content-center align-items-center'>
                  <Col md={8} lg={12} xl={10} className='align-items-center'>
                    {props.children}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </React.Fragment>
  );
};

ThemeOne.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};
export default withRouter(withTranslation()(ThemeOne));
