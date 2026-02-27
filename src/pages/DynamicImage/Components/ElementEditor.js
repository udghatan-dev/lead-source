import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Row, Col } from 'reactstrap';

const ElementEditor = ({ addNewShape }) => {
  return (
    <React.Fragment>
      <Row>
        {COMPONENTS.map((component) => {
          return (
            <Col lg={4}>
              <Card
                className={'card-animate'}
                style={{ cursor: 'pointer' }}
                title={component.help}
                onClick={() => {
                  addNewShape(component);
                }}
              >
                <CardHeader className={'border-0 p-1 d-flex align-items-center justify-content-center'}>
                  <i className={`${component.icon} text-muted`} style={{ fontSize: '48px' }}></i>
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

export default ElementEditor;
