import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Row, Col } from 'reactstrap';

const COMPONENTS = [
  {
    title: 'Image',
    help: 'Add Image Block',
    icon: 'bx bx-image',
    shape: 'image',
    defaultProps: {
      content: 'https://s3.eu-west-1.wasabisys.com/static-cdn/placeholders/image_placeholder.jpg',
      // fallback: 'https://s3.eu-west-1.wasabisys.com/static-cdn/placeholders/image_placeholder.jpg',
      width: 100,
      height: 100,
      stroke: '#000000',
      strokeWidth: 0,
      opacity: 1,
    },
  },
  {
    title: 'Text',
    help: 'Add Text Block',
    icon: 'bx bx-text',
    shape: 'text',
    defaultProps: {
      content: 'I am a text block',
      // fallback: 'I am a text block',
      width: 100,
      height: 100,
      stroke: '#000000',
      strokeWidth: 0,
      fontFamily: 'Arial',
      fontSize: 18,
      fontStyle: 'normal',
      align: 'center',
      fill: '#000000',
      verticalAlign: 'middle',
    },
  },
  {
    title: 'QR Code',
    help: 'Add QR Code Block',
    icon: 'bx bx-qr',
    shape: 'qr',
    defaultProps: {
      content: 'I am a QR',
      // fallback: 'I am a QR',
      width: 100,
      height: 100,
      stroke: '#000000',
      strokeWidth: 0,
      ecl: 'H',
      quality: 1,
      margin: 2,
      bgColor: '#FFFFFF',
      fgColor: '#000000',
    },
  },
];

const ElementBox = ({ addNewShape }) => {
  return (
    <React.Fragment>
      <Row>
        {COMPONENTS.map((component) => {
          return (
            <Col xxl={6} xl={6} lg={6}>
              <Card
                className={'card-animate'}
                style={{ cursor: 'pointer' }}
                title={component.help}
                onClick={() => {
                  addNewShape(component);
                }}
              >
                <CardHeader className={'border-0 p-1 d-flex align-items-center justify-content-center'}>
                  <i className={`${component.icon} text-muted`} style={{ fontSize: '36px' }}></i>
                </CardHeader>
                <CardBody className={'d-flex align-items-center justify-content-center p-1'}>
                  <span>{component.title}</span>
                </CardBody>
              </Card>
            </Col>
          );
        })}
      </Row>
    </React.Fragment>
  );
};

export default ElementBox;
