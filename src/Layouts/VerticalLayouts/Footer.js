import React, { useEffect } from 'react';
import { Col, Container, Row } from 'reactstrap';

const Footer = () => {
  // const [isMinimized, setIsMinimized] = React.useState(true);

  // const handleToggleMinimize = () => {
  //   setIsMinimized((prev) => !prev);
  // };

  // useEffect(() => {
  //   console.log('Footer Rendered');
  // }, []);
  return (
    <React.Fragment>
      <footer className='footer bg-light' style={{ zIndex: 1002, left: 0, right: 0, height: '20px', bottom: 0, position: 'fixed' }}>
        <Container fluid>
          {/* <Row>
            <Col sm={6}>{new Date().getFullYear()} © Automations.</Col>
            <Col sm={6}>
              <div className='text-sm-end d-none d-sm-block'>Design & Develop by Automations</div>
            </Col>
          </Row> */}
          {/* <div
            style={{
              position: 'fixed',
              bottom: 0,
              right: 0,
              width: window.innerWidth < 512 ? '100%' : '400px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              padding: '10px',
              zIndex: 1000,
              transition: 'height 0.3s ease',
              height: isMinimized ? '40px' : '300px',
              overflow: 'hidden',
            }}
          >
            {isMinimized ? (
              <div onClick={handleToggleMinimize} style={{ cursor: 'pointer' }}>
                Expand
              </div>
            ) : (
              <>
                <div onClick={handleToggleMinimize} style={{ cursor: 'pointer' }}>
                  Minimize
                </div>
                <p>Your widget content goes here...</p>
              </>
            )}
          </div>

          <div
            style={{
              position: 'fixed',
              bottom: 0,
              right: 400,
              width: window.innerWidth < 512 ? '100%' : '400px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              padding: '10px',
              zIndex: 1000,
              transition: 'height 0.3s ease',
              height: isMinimized ? '40px' : '300px',
              overflow: 'hidden',
            }}
          >
            {isMinimized ? (
              <div onClick={handleToggleMinimize} style={{ cursor: 'pointer' }}>
                Expand
              </div>
            ) : (
              <>
                <div onClick={handleToggleMinimize} style={{ cursor: 'pointer' }}>
                  Minimize
                </div>
                <p>Your widget content goes here...</p>
              </>
            )}
          </div> */}
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
