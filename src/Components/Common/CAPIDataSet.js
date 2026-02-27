import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Row, Modal, ModalHeader, ModalBody, ModalFooter, CardBody, Col, Card } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getChannelProp, resetChannel } from '../../store/actions';
import Preloader from '../Loaders/Preloader';
import { IoCopyOutline } from 'react-icons/io5';
import { CopyToClipBoard } from './CopyToClipboard';
import NewCAPIDataSet from './NewCAPIDataSet';
import CustomNotification from './CustomNotification';

const CAPIDataSet = ({ open, handleClose, data, t }) => {
  const dispatch = useDispatch();
  const [datasetList, setDatasetList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openNewDataset, setOpenNewDataset] = useState(false);

  const { isChannelPropFetched, channelApiResponse } = useSelector((state) => ({
    isChannelPropFetched: state.Channel.isChannelPropFetched,
    channelApiResponse: state.Channel.apiResponse,
  }));

  // Load datasets
  const loadDatasets = useCallback(() => {
    setLoading(true);
    dispatch(getChannelProp({ id: data._id, prop: 'capi_dataset', query: {} }));
  }, [dispatch, data._id]);

  useEffect(() => {
    if (isChannelPropFetched) {
      setLoading(false);

      if (channelApiResponse.success && channelApiResponse.prop === 'capi_dataset' && channelApiResponse.channel === data._id) {
        setDatasetList(channelApiResponse?.data?.data ?? []);
      } else {
        CustomNotification.error('Failed to load datasets');
      }

      // Reset state after handling
      dispatch(resetChannel('isChannelPropFetched', false));
      dispatch(resetChannel('apiResponse', {}));
    }
  }, [isChannelPropFetched, channelApiResponse, data._id, dispatch]);

  useEffect(() => {
    loadDatasets();
  }, [loadDatasets]);

  // Memoized dataset cards
  const datasetCards = useMemo(
    () =>
      datasetList.map((post) => (
        <Col xl={4} lg={4} key={post.id || post.name}>
          <Card className='p-2 bg-white shadow mb-0'>
            <CardBody className='p-0 d-flex flex-column justify-content-start gap-1'>
              <div className='mt-1 fs-14 text-truncate' style={{ maxWidth: '90%' }}>
                {post.name}
              </div>
              <div className='position-relative border border-1 border-dark p-1 px-2 rounded-3'>
                <div className='position-relative'>
                  <span>ID: {post.id}</span>
                  <span style={{ position: 'absolute', bottom: 0, right: 0 }}>
                    <IoCopyOutline className='btn btn-sm m-0 p-0' onClick={() => CopyToClipBoard(post.id)} />
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      )),
    [datasetList]
  );

  return (
    <Modal id='showModal' isOpen={open} toggle={handleClose} centered size='lg'>
      <ModalHeader className='bg-light p-3 py-1' toggle={handleClose}>
        {t('CAPI Dataset')} {` for ${data.basic_details.name}`}
      </ModalHeader>

      <ModalBody>
        <Row className='g-2'>
          {datasetCards}

          {/* Add New Dataset */}
          <Col xl={4} lg={4}>
            <Card className='p-2 bg-white h-100 mb-0 card-animate btn btn-sm' onClick={() => setOpenNewDataset(true)}>
              <CardBody className='p-0 d-flex flex-column justify-content-center align-items-center gap-1'>
                <div className='mt-1 fs-14 d-flex align-items-center gap-1 px-2 py-1 rounded-3'>
                  <i className='bx bx-plus fs-14'></i>
                  {t('Add New Dataset')}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </ModalBody>

      <ModalFooter>
        <button type='button' className='btn btn-primary btn-sm' onClick={handleClose}>
          {t('Close')}
        </button>
      </ModalFooter>

      {loading && <Preloader />}

      {openNewDataset && (
        <NewCAPIDataSet
          open={openNewDataset}
          handleClose={() => {
            setOpenNewDataset(false);
            loadDatasets();
          }}
          data={data}
        />
      )}
    </Modal>
  );
};

CAPIDataSet.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default withRouter(withTranslation()(CAPIDataSet));
