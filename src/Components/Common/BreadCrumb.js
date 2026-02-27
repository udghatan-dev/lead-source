import React from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { FaArrowLeft } from 'react-icons/fa';

const BreadCrumb = ({ title, pageTitle, redirectTo, parentRoute, goBackConfig }) => {
  const history = useHistory();
  return (
    <React.Fragment>
      <Row>
        <Col xs={12}>
          <div className='page-title-box d-sm-flex align-items-center justify-content-between'>
            <div className='d-sm-flex align-items-center justify-content-between gap-2'>
              {goBackConfig && (
                <FaArrowLeft
                  className='fs-13'
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    goBackConfig.onClick();
                  }}
                />
              )}
              <h4 className='mb-sm-0'>{title.replaceAll('-', ' ')}</h4>
            </div>

            <div className='page-title-right'>
              <ol className='breadcrumb m-0'>
                <li
                  className='breadcrumb-item'
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (parentRoute !== undefined) {
                      history.push(parentRoute);
                    } else {
                      history.goBack();
                    }
                  }}
                >
                  {pageTitle}
                  {/* {redirectTo !== undefined ? (
                    <Link to={redirectTo[0]}>{pageTitle}</Link>
                  ) : (
                    <Link to={'/products/' + (pageTitle !== 'Products' ? pageTitle.toLowerCase() : '')}>{pageTitle}</Link>
                  )} */}
                </li>
                {/* {pageTitle !== 'WABA' ? (
                  <li className='breadcrumb-item active'>
                    {redirectTo !== undefined ? (
                      <Link to={redirectTo[1]}>{title.replaceAll('-', ' ')}</Link>
                    ) : (
                      <Link
                        to={
                          pageTitle !== 'Products'
                            ? '/products/' + pageTitle.toLowerCase() + '/' + title.toLowerCase()
                            : '/products/' + title.toLowerCase()
                        }
                      >
                        {title.replaceAll('-', ' ')}
                      </Link>
                    )}
                  </li>
                ) : (
                  ''
                )} */}
                <li className='breadcrumb-item active'>{title.replaceAll('-', ' ')}</li>
              </ol>
            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default BreadCrumb;
