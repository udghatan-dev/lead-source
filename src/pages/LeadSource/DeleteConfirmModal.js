import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from 'reactstrap';
import { FaTrashCan } from 'react-icons/fa6';
import { IoWarningOutline } from 'react-icons/io5';

const DeleteConfirmModal = ({ isOpen, toggle, connection, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm(connection._id || connection.id);
    } finally {
      setDeleting(false);
    }
  };

  if (!connection) return null;

  const displayName =
    connection?.configuration?.pageName
      ? `${connection.configuration.pageName} - ${connection.configuration.formName || ''}`
      : connection.name || connection.source;

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        <div className='d-flex align-items-center gap-2' style={{ color: '#dc2626' }}>
          <FaTrashCan />
          <span>Delete Connection</span>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className='text-center py-3'>
          <IoWarningOutline style={{ fontSize: '3rem', color: '#f59e0b' }} />
          <h5 className='mt-3 mb-2'>Are you sure?</h5>
          <p className='text-muted mb-0'>
            You are about to delete <strong>{displayName}</strong>. This action cannot be undone.
          </p>
        </div>
      </ModalBody>
      <ModalFooter>
        <button className='btn btn-sm btn-soft-dark' onClick={toggle} disabled={deleting}>
          Cancel
        </button>
        <button
          className='btn btn-sm d-flex align-items-center gap-1'
          style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            fontWeight: '500',
            fontSize: '0.8rem',
            padding: '0.3rem 0.5rem',
          }}
          onClick={handleConfirm}
          disabled={deleting}
        >
          {deleting ? (
            <Spinner size='sm' />
          ) : (
            <FaTrashCan />
          )}
          <span>{deleting ? 'Deleting...' : 'Confirm Delete'}</span>
        </button>
      </ModalFooter>
    </Modal>
  );
};

DeleteConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  connection: PropTypes.object,
  onConfirm: PropTypes.func.isRequired,
};

export default DeleteConfirmModal;
