import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Col, Input } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { postChannelProp, resetChannel } from '../../store/actions';
import Preloader from '../Loaders/Preloader';
import CustomNotification from './CustomNotification';

const NewCAPIDataSet = (props) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const { isChannelPropPosted, channelApiResponse } = useSelector((state) => ({
    isChannelPropPosted: state.Channel.isChannelPropPosted,
    channelApiResponse: state.Channel.apiResponse,
  }));

  useEffect(() => {
    if (isChannelPropPosted) {
      setLoading(false);
      if (channelApiResponse.success) {
        CustomNotification.success('Dataset Created Successfully');
      } else {
        CustomNotification.error('Dataset Creation Failed');
      }
      dispatch(resetChannel('isChannelPropPosted', false));
      dispatch(resetChannel('apiResponse', {}));

      if (channelApiResponse.success) {
        props.handleClose();
      }
    }
  }, [isChannelPropPosted]);

  function createDataset() {
    if (!name) {
      return CustomNotification.error('Dataset name is required');
    }
    setLoading(true);
    dispatch(postChannelProp({ id: props.data._id, prop: 'capi_dataset', payload: { name } }));
  }

  return (
    <React.Fragment>
      <Modal id='showModal' isOpen={props.open} toggle={props.handleClose} centered size={'md'}>
        <ModalHeader className='bg-light p-3 py-1' toggle={props.handleClose}>
          {props.t('Create New Dataset') + ' for ' + props.data.basic_details.name}
        </ModalHeader>
        <ModalBody>
          <Col lg={12} className='mb-2'>
            <div>
              <label className='form-label'>Dataset Name</label>
              <Input
                type='text'
                value={name}
                className='form-control'
                placeholder={'Enter Dataset Name'}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
          </Col>
        </ModalBody>
        <ModalFooter>
          <div className='hstack gap-2 justify-content-end'>
            <button
              type='button'
              className='btn btn-primary btn-sm'
              id='edit-btn'
              onClick={() => {
                props.handleClose();
              }}
            >
              {props.t('Close')}
            </button>

            <button
              type='button'
              className='btn btn-primary btn-sm'
              id='edit-btn'
              onClick={() => {
                createDataset();
              }}
            >
              {props.t('Create Dataset')}
            </button>
          </div>
        </ModalFooter>
        {loading && <Preloader />}
      </Modal>
    </React.Fragment>
  );
};

NewCAPIDataSet.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};
export default withRouter(withTranslation()(NewCAPIDataSet));
