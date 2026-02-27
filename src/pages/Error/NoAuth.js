import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import MetaTags from 'react-meta-tags';

// Import Images
import error401cover from "../../assets/images/error-401.svg";

const NoAuth = () => {
    return (
        <React.Fragment>
            <div className="auth-page-content">
                <MetaTags>
                    <title>Not Authorized</title>
                </MetaTags>
                <div className="auth-page-wrapper py-5 d-flex justify-content-center align-items-center min-vh-100">
                    <div className="auth-page-content overflow-hidden p-0">
                        <Container>
                            <Row className="justify-content-center">
                                <Col xl={7} lg={8}>
                                    <div className="text-center">
                                        <img src={error401cover} alt="error img" className="img-fluid" style={{ height: "400px" }} />
                                        <div className="mt-3">
                                            <h3 className="text-uppercase">You are not authorized to visit this page</h3>
                                            <p className="text-muted mb-4">Kindly contact your admin to change permissions!</p>
                                            <Link to="/products" className="btn btn-success"><i className="mdi mdi-home me-1"></i>Back to home</Link>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default NoAuth;