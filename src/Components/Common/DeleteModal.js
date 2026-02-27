import { useParams, withRouter } from 'react-router-dom';

import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React from 'react';
import { Modal, ModalBody } from 'reactstrap';

const DeleteModal = (props) => {
  const { message, show, onDeleteClick, onCloseClick, data } = props;
  return (
    <Modal isOpen={show} toggle={onCloseClick} centered={true}>
      <ModalBody className='py-1 px-2'>
        <div className='mt-1 text-center'>
          <div className='mt-4 pt-2 fs-15 mx-4 mx-sm-5'>
            <h4>{props.t('Are you sure')} ?</h4>
            <p className='text-muted mb-0' style={{ textAlign: 'start' }}>
              {message}
            </p>
          </div>
        </div>
        <div className='d-flex gap-2 justify-content-center mt-4 mb-2'>
          <button type='button' className='btn w-sm btn-light' data-bs-dismiss='modal' onClick={onCloseClick}>
            {props.t('Close')}
          </button>
          <button
            type='button'
            className='btn w-sm'
            style={{ background: 'red', color: 'white' }}
            id='delete-record'
            onClick={() => onDeleteClick(data)}
          >
            {props.t('Yes, Proceed')}!
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

DeleteModal.propTypes = {
  onCloseClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  status: PropTypes.any,
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(DeleteModal));
