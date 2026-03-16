import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from 'reactstrap';
import { IoWarningOutline } from 'react-icons/io5';
import { MdToggleOn, MdToggleOff } from 'react-icons/md';

const StatusToggleModal = ({ isOpen, toggle, connection, onConfirm }) => {
  const [processing, setProcessing] = useState(false);

  const isActive = connection?.status === 'active';

  const handleConfirm = async () => {
    setProcessing(true);
    try {
      await onConfirm(connection._id, isActive ? 'inactive' : 'active');
    } finally {
      setProcessing(false);
    }
  };

  if (!connection) return null;

  const indiaMartWarnning = connection?.provider === 'indiamart' && connection?.status === 'active';

  const displayName =
    connection?.configuration?.pageName
      ? `${connection.configuration.pageName} - ${connection.configuration.formName || ''}`
      : connection?.configuration?.accountName || connection.name || connection.source;

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        <div className='d-flex align-items-center gap-2' style={{ color: isActive ? '#f59e0b' : '#22c55e' }}>
          <span>{isActive ? 'Deactivate' : 'Activate'} Connection</span>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className='text-center py-3'>
          <IoWarningOutline style={{ fontSize: '3rem', color: '#f59e0b' }} />
          <h5 className='mt-3 mb-2'>Are you sure?</h5>
          <p className='text-muted mb-0'>
            You are about to {isActive ? 'deactivate' : 'activate'} <strong>{displayName}</strong>.
            {isActive
              ? ' This will stop receiving leads from this connection.'
              : ' This will resume receiving leads from this connection.'}
          </p>
          {indiaMartWarnning && (
            <div className='alert alert-danger mt-3'>
              <strong>Warning:</strong> Your IndiaMART leads depend on regular data syncing. If the key is unused for 7+ days, IndiaMART deactivates it. We sync periodically to keep your key active and leads uninterrupted.
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <button className='btn btn-sm btn-soft-dark' onClick={toggle} disabled={processing}>
          Cancel
        </button>
        <button
          className='btn btn-sm d-flex align-items-center gap-1'
          style={{
            backgroundColor: isActive ? '#fef3c7' : '#dcfce7',
            border: `1px solid ${isActive ? '#fde68a' : '#bbf7d0'}`,
            color: isActive ? '#a16207' : '#16a34a',
            fontWeight: '500',
            fontSize: '0.8rem',
            padding: '0.3rem 0.5rem',
          }}
          onClick={handleConfirm}
          disabled={processing}
        >
          <span>{processing ? 'Processing...' : isActive ? 'Confirm Deactivate' : 'Confirm Activate'}</span>
        </button>
      </ModalFooter>
    </Modal>
  );
};

StatusToggleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  connection: PropTypes.object,
  onConfirm: PropTypes.func.isRequired,
};

export default StatusToggleModal;
