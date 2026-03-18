import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

const ICON_PATH = '/leadsource/assets/icons';

const FacebookLeadAdsModal = ({ isOpen, toggle, modalUrl }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size='md' centered>
      <ModalHeader toggle={toggle}>
        <div className='d-flex align-items-center gap-2'>
          <img src={`${ICON_PATH}/meta-icon.svg`} alt="Meta" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          <span>Facebook Lead Ads</span>
        </div>
      </ModalHeader>
      <ModalBody style={{ padding: 0, height: '70vh' }}>
        {modalUrl && (
          <iframe
            src={modalUrl}
            title='Facebook Lead Ads Connection'
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
          />
        )}
      </ModalBody>
    </Modal>
  );
};

export default FacebookLeadAdsModal;
