import React, { useEffect, useState, useMemo, Suspense, lazy } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Col, Container, Row, Card, CardHeader, CardBody, Input } from 'reactstrap';

import Preloader from '../../Components/Loaders/Preloader';

import BreadCrumb from '../../Components/Common/BreadCrumb';
//Import actions
import { resetImageExp, listImageExp, deleteImageExp } from '../../store/actions';

//redux
import { useSelector, useDispatch } from 'react-redux';
import TableContainer from '../../Components/Common/TableContainer';
import MetaTag from '../../Components/Common/Meta';
import CustomNotification from '../../Components/Common/CustomNotification';
import moment from 'moment';
import WarningDialogModal from './WarningDialogModal';
import CheckFeatureAccess from '../../common/utils/CheckFeatureAccess';

const ImageExperience = (props) => {
  const history = useHistory();
  const [initLoad, setInitLoad] = useState(false);
  const [preLoading, setPreLoading] = useState(false);

  const dispatch = useDispatch();

  const [imgExpList, setImgExpList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState({
    status: false,
    term: '',
  });

  const { isImageExpListed, isImageExpDeleted, imageExpApiResponse, userRNP } = useSelector((state) => ({
    isImageExpListed: state.ImageExperience.isImageExpListed,
    isImageExpDeleted: state.ImageExperience.isImageExpDeleted,
    imageExpApiResponse: state.ImageExperience.apiResponse,
    userRNP: state.UserSession.userRNP,
  }));

  useEffect(() => {
    if (!CheckFeatureAccess(userRNP, 'dig.img_exp.READ')) {
      return history.push('/dig');
    }
    setPreLoading(true);
    dispatch(listImageExp({ page, rows: 20 }));
  }, [dispatch]);

  useEffect(() => {
    if (isImageExpListed) {
      setInitLoad(true);
      setPreLoading(false);
      if (imageExpApiResponse.success) {
        setImgExpList(imageExpApiResponse.data);
        setTotal(imageExpApiResponse.count);
      } else {
        CustomNotification.error(imageExpApiResponse.data);
      }
      dispatch(resetImageExp('apiResponse', {}));
      dispatch(resetImageExp('isImageExpListed', false));
    }
  }, [isImageExpListed]);

  useEffect(() => {
    if (isImageExpDeleted) {
      setPreLoading(false);
      if (imageExpApiResponse.success) {
        setImgExpList((prev) => {
          return prev.filter((c) => c._id != imageExpApiResponse.data);
        });
        CustomNotification.success('Image Deleted Successfully');
      } else {
        CustomNotification.error(imageExpApiResponse.data);
      }
      dispatch(resetImageExp('apiResponse', {}));
      dispatch(resetImageExp('isImageExpDeleted', false));
    }
  }, [isImageExpDeleted]);

  useEffect(() => {
    if (initLoad) {
      setPreLoading(true);
      dispatch(listWappFlow({ page, rows: 20 }));
    }
  }, [page]);

  useEffect(() => {}, [search]);

  const closeModal = () => {
    setWarningModal({ status: false });
  };

  const callBack = (action, data) => {
    if (action === 'delete_img') {
      setPreLoading(true);
      dispatch(deleteImageExp({ image: data.id }));
      closeModal();
    }
  };

  // Customber Column
  const columns = useMemo(
    () => [
      {
        Header: props.t('Name'),
        Cell: (item) => {
          return (
            <>
              <div className='d-flex flex-column align-items-start justify-content-start' title={item.row.original.name}>
                <span className='text-dark'>{item.row.original.name}</span>
              </div>
            </>
          );
        },
      },
      {
        Header: props.t('Layers'),
        Cell: (item) => {
          return (
            <>
              <div className='d-flex flex-column align-items-start justify-content-start' title={item.row.original.layer.length}>
                <span className='text-dark'>{item.row.original.layer.length}</span>
              </div>
            </>
          );
        },
      },
      {
        Header: props.t('Variables'),
        Cell: (item) => {
          return (
            <>
              <div className='d-flex flex-column align-items-start justify-content-start' title={item.row.original.variable.length}>
                <span className='text-dark'>{item.row.original.variable.length}</span>
              </div>
            </>
          );
        },
      },
      {
        Header: props.t('Created At'),
        Cell: (item) => {
          return (
            <>
              <div className='d-flex flex-column align-items-start'>
                {moment(item.row.original.createdAt).format('hh:mm A, DD MMM YYYY')}
              </div>
            </>
          );
        },
      },
      {
        Header: props.t('Updated At'),
        Cell: (item) => {
          return (
            <>
              <div className='d-flex flex-column align-items-start'>
                {moment(item.row.original.updatedAt).format('hh:mm A, DD MMM YYYY')}
              </div>
            </>
          );
        },
      },
      {
        Header: props.t('ACTION'),
        Cell: (item) => {
          return (
            <ul className='list-inline hstack gap-1 mb-0'>
              {CheckFeatureAccess(userRNP, 'dig.img_exp.UPDATE') && (
                <li className='list-inline-item edit' title='Edit'>
                  <Link
                    to={'#'}
                    className='d-inline-block'
                    onClick={() => {
                      history.push(`/image/${item.row.original._id}/edit`);
                    }}
                  >
                    <i className='bx bxs-edit fs-18 text-dark btn-sm'></i>
                  </Link>
                </li>
              )}
              {CheckFeatureAccess(userRNP, 'dig.img_exp.CREATE') && (
                <li className='list-inline-item edit' title='Clone'>
                  <Link
                    to={'#'}
                    className=' d-inline-block'
                    onClick={() => {
                      history.push(`/image/${item.row.original._id}/clone`);
                    }}
                  >
                    <i className='bx bx-copy fs-18 text-dark btn-sm'></i>
                  </Link>
                </li>
              )}
              {CheckFeatureAccess(userRNP, 'dig.img_exp.DELETE') && (
                <li className='list-inline-item edit' title='Clone'>
                  <Link
                    to={'#'}
                    className=' d-inline-block'
                    onClick={() => {
                      setWarningModal({
                        status: true,
                        action: 'delete_img',
                        message: 'DELETE_IMAGE_EXP',
                        data: { id: item.row.original._id },
                      });
                    }}
                  >
                    <i className='bx bxs-trash fs-18 text-dark btn-sm'></i>
                  </Link>
                </li>
              )}
            </ul>
          );
        },
      },
    ],
    []
  );

  const goToPage = (p) => {
    if (parseInt(p) < 0) {
      return;
    }
    setPage(parseInt(p + 1));
  };

  const [warningModal, setWarningModal] = useState({ status: false });

  return (
    <Suspense fallback={<Preloader />}>
      <React.Fragment>
        <div className='page-content'>
          <MetaTag pageTitle='Image Experience | DIG' />
          <Container fluid>
            <BreadCrumb title='Image Experience' pageTitle='Dynamic Image Generator' />
            <Row className={'px-3'}>
              <div className='my-2 text-dark d-flex align-items-center rounded-3 p-1 px-2' style={{ backgroundColor: '#FFFF00' }}>
                <i className='bx bx-info-circle me-1 fs-16'></i>
                <span>Currently free in beta. In the future, a fee will be applied to each dynamic experience generated.</span>
              </div>
            </Row>
            <Row>
              <Col xxl={12}>
                <Card id='contactList' className='border-0'>
                  <CardHeader className='border-1 border-right pt-0 pb-1 px-0'>
                    <div className='d-flex align-items-center flex-wrap gap-2'>
                      {/* <div className='search-box'>
                        <Input
                          type='text'
                          className='form-control search form-control-sm'
                          placeholder={props.t('Search flow with name ...')}
                          onChange={(e) => {
                            if (e.target.value.trim().length === 0) {
                              if (search.status === false) {
                                return;
                              }
                              setSearch({ status: false, term: '' });
                              setTimeout(() => {
                                setPage(0);
                              }, 200);
                            } else {
                              setSearch({ status: true, term: e.target.value.trim() });
                            }
                          }}
                        />
                        <i className='ri-search-line search-icon'></i>
                      </div> */}
                      <div className='d-flex flex-shrink-0 ms-auto gap-2'>
                        {CheckFeatureAccess(userRNP, 'dig.img_exp.CREATE') && (
                          <Button
                            type='button'
                            color='primary'
                            className='btn mb-2 me-2 btn-sm btn-outlined'
                            onClick={() => {
                              history.push('/image/new');
                            }}
                          >
                            <i className='mdi mdi-plus me-1' />
                            {props.t('Create New Experience')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className='border-1'>
                    <Row>
                      <Col xl={12} lg={12}>
                        {imgExpList.length === 0 && (
                          <div className='d-flex align-items-center justify-content-center text-muted card card-body border-0'>
                            {props.t('No Experience Found')}
                          </div>
                        )}
                        {imgExpList.length > 0 && (
                          <div>
                            <TableContainer
                              columns={columns}
                              data={imgExpList}
                              isGlobalFilter={false}
                              isAddUserList={false}
                              customPageSize={20}
                              isCustomPagination={true}
                              activePageIndex={page}
                              goTo={goToPage}
                              totalRecords={total}
                              divClass='table-responsive table-card mb-3 minHeight rounded-1'
                              tableClass='align-middle table-nowrap'
                              theadClass='table-light text-muted'
                            />
                          </div>
                        )}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
          {preLoading && <Preloader />}

          {warningModal.status ? (
            <WarningDialogModal
              open={warningModal.status}
              handleClose={closeModal}
              action={warningModal.action}
              data={warningModal.data}
              cb={callBack}
              message={warningModal.message}
            />
          ) : (
            ''
          )}
        </div>
      </React.Fragment>
    </Suspense>
  );
};

ImageExperience.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};
export default withRouter(withTranslation()(ImageExperience));
