import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form, FormFeedback } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import MetaTag from './../../Common/Meta';

const DefaultLogin = (props) => {
  const [bgType, setBgType] = useState('none');
  const [bg, setBg] = useState('');

  const [bgImageType, setBgImageType] = useState('none');
  const [bgImage, setBgImage] = useState('');

  useEffect(() => {
    if (props?.authVariables?.bgType) {
      if (props?.authVariables?.bgType === 'none') {
        setBgType('none');
        setBg('');
      }
      if (props?.authVariables?.bgType === 'color') {
        setBgType('color');
        setBg(props?.authVariables?.bg);
      }
    }

    if (props?.authVariables?.bgImageType) {
      if (props?.authVariables?.bgImageType === 'image') {
        setBgImageType('image');
        setBgImage(props?.authVariables?.bgImage);
      }
      if (props?.authVariables?.bgImageType === 'none') {
        setBgImageType('none');
        setBgImage('');
      }
      if (props?.authVariables?.bgImageType === 'gradient') {
        setBgImageType('gradient');
        setBgImage(props?.authVariables?.bgImage);
      }
    }
  }, [props]);
  return (
    <React.Fragment>
      <div className='auth-page-wrapper pt-0'>
        <div
          className='auth-page-content p-1 position-absolute'
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
            <Row className='justify-content-center mt-5'>
              <Col md={8} lg={6} xl={5}>
                {props.children}
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </React.Fragment>
  );
};

export default withRouter(DefaultLogin);
