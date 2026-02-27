import React from 'react';
import { withRouter } from 'react-router-dom';

import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, Modal } from 'reactstrap';
import { MyToastContainer, ToastMe } from '../../Components/Common/ToastInit';
import { DELETE_IMAGE_EXP } from '../../common/data/waningMessages';

const WarningDialogModal = (props) => {
  const closeModal = props.handleClose;
  const callBack = props.cb;
  const open = props.open;
  const data = props.data;
  const action = props.action;
  const messageType = props.message;

  return (
    <React.Fragment>
      <div className='page-content'>
        <Modal centered isOpen={open} toggle={() => closeModal()}>
          <div className='modal-header'>
            <h5 className='modal-title'>
              {messageType === 'CONTACT_DELETE_RECONFIRM' ? props.t('Final Confirmation for Your Action') : props.t('Confirm Your Action')}
            </h5>
            <Button
              onClick={() => {
                closeModal();
              }}
              type='button'
              className='btn-close'
              aria-label='Close'
            ></Button>
          </div>
          <div className='modal-body'>
            <h6 className='fs-15'>{props.t('Your action can cause following issues')}-</h6>
            {messageType === 'WABA_REGEN_KEY'
              ? WABA_REGEN_KEY.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'WABA_REVOKE'
              ? WABA_REVOKE.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'WABA_RESET_WEBHOOK'
              ? WABA_RESET_WEBHOOK.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'CUSTOM_FIELD_DELETE'
              ? CUSTOM_FIELD_DELETE.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'FILTER_LIST_DELETE'
              ? FILTER_LIST_DELETE.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'EVENT_HOOK_DELETE'
              ? EVENT_HOOK_DELETE.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'CANNED_REPLIES_DELETE'
              ? CANNED_REPLIES_DELETE.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'CONTACT_DELETE'
              ? CONTACT_DELETE.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'CONTACT_DELETE_RECONFIRM'
              ? CONTACT_DELETE_RECONFIRM.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'BROADCAST_DELETE'
              ? BROADCAST_DELETE.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'CHANNEL_DELETE'
              ? CHANNEL_DELETE.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'USER_ROLE'
              ? USER_ROLE.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'TEAM_MEMBER_DELETE'
              ? TEAM_MEMBER_DELETE.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'WORKFLOW_DELETE'
              ? WORKFLOW_DELETE.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'FOLDER_DELETE'
              ? FOLDER_DELETE.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'CONNECTION_DELETE'
              ? CONNECTION_DELETE.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'SCHEMA_DELETE'
              ? SCHEMA_DELETE.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'RECORD_DELETE'
              ? RECORD_DELETE.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'BOT_FIELD_DELETE'
              ? BOT_FIELD_DELETE.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'TICKET_DELETE'
              ? TICKET_DELETE.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'WABA_CLEAR_CONNECTION'
              ? WABA_CLEAR_CONNECTION.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'DEACTIVATE_USER'
              ? DEACTIVATE_USER.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'MARK_AS_DONE'
              ? MARK_AS_DONE.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'GHL_CONVERSATION_DELETE'
              ? GHL_CONVERSATION_DELETE.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'CLEAR_MAIN_FLOW'
              ? CLEAR_MAIN_FLOW.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'DELETE_TRIGGER'
              ? DELETE_TRIGGER.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'WABA_DE_REGISTER'
              ? WABA_DE_REGISTER.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'GHL_CONVERSATION_MIGRATE'
              ? GHL_CONVERSATION_MIGRATE.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'PREV_GHL_CONVERSATION_DELETE'
              ? PREV_GHL_CONVERSATION_DELETE.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'TROUBLESHOOT_RECURRING'
              ? TROUBLESHOOT_RECURRING.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'DELETE_PAYMENT_GATEWAY'
              ? DELETE_PAYMENT_GATEWAY.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'PO_REFERENCE_DELETE'
              ? PO_REFERENCE_DELETE.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : messageType === 'DELETE_IMAGE_EXP'
              ? DELETE_IMAGE_EXP.map((msg, i) => {
                  return (
                    <div className='d-flex mt-2' key={'msg_' + i}>
                      <div className='flex-shrink-0'>
                        <i className='ri-checkbox-circle-fill text-warning'></i>
                      </div>
                      <div className='flex-grow-1 ms-2 '>
                        <p className='text-muted mb-0'>{msg}</p>
                      </div>
                    </div>
                  );
                })
              : ''}
          </div>
          <div className='modal-footer'>
            <Button color='ghost-primary' onClick={() => closeModal()}>
              {props.t('Dismiss')}
            </Button>
            <Button color='ghost-primary' onClick={() => callBack(action, data)}>
              {props.t('Agree')}
            </Button>
          </div>
        </Modal>
      </div>
      <MyToastContainer />
    </React.Fragment>
  );
};

WarningDialogModal.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};
export default withRouter(withTranslation()(WarningDialogModal));
