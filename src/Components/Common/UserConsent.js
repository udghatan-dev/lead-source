import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Col, Row, Label, Input, Modal, ModalHeader, ModalBody, Form, ModalFooter } from 'reactstrap';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getUserConsentStatus, registerUserConsentStatus, resetLogin } from '../../store/actions';
import CustomNotification from './CustomNotification';
import Preloader from '../Loaders/Preloader';

const TimelineItem = ({ index, event }) => {
  const [open, setOpen] = useState(false);
  return (
    <div key={index} className='timeline-event'>
      <div className={`timeline-date-${open ? 'open' : 'closed'} fs-12 d-flex flex-column`} onClick={() => setOpen(!open)}>
        <span>{moment(event.timestamp * 1000).format('hh:mm A, DD MMM YYYY')}</span>
        <span className='fs-13'>{event.name}</span>
      </div>
    </div>
  );
};

const UserConsent = (props) => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [acknowledge, setAcknowledge] = useState(false);

  const dispatch = useDispatch();

  const { isUserConsentFetched, isUserConsentRegistered, apiResponse } = useSelector((store) => ({
    isUserConsentFetched: store.Login.isUserConsentFetched,
    isUserConsentRegistered: store.Login.isUserConsentRegistered,
    apiResponse: store.Login.apiResponse,
  }));

  React.useEffect(() => {
    if (isUserConsentFetched) {
      if (apiResponse.success) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
      dispatch(resetLogin('isUserConsentFetched', false));
      dispatch(resetLogin('apiResponse', {}));
    }
  }, [isUserConsentFetched]);

  React.useEffect(() => {
    if (isUserConsentRegistered) {
      setLoading(false);
      if (apiResponse.success) {
        setIsOpen(false);
      } else {
        setIsOpen(false);
        CustomNotification.error('Facing some issue');
      }
      dispatch(resetLogin('isUserConsentRegistered', false));
      dispatch(resetLogin('apiResponse', {}));
    }
  }, [isUserConsentRegistered]);

  React.useEffect(() => {
    if (moment().unix() <= 1732606200) {
      dispatch(getUserConsentStatus());
    }
  }, []);

  function handleClose() {
    setIsOpen(false);
  }

  function submitConsent() {
    setLoading(true);
    dispatch(registerUserConsentStatus());
  }

  const events = [
    {
      name: 'Changes in all modules will stop.',
      timestamp: 1732541400,
    },
    {
      name: 'Panel Login will be disabled.',
      timestamp: 1732588200,
    },
    {
      name: 'Panel Login will resume.',
      timestamp: 1732599000,
    },
    {
      name: 'Changes in all modules will resume.',
      timestamp: 1732606200,
    },
    {
      name: '✨ All services will back to normal.',
      timestamp: 1732606200,
    },
  ];

  return (
    <React.Fragment>
      {isOpen && (
        <div className='page-content'>
          <Modal id='showModal' isOpen={isOpen} toggle={handleClose} centered>
            <ModalHeader className='bg-light p-3 py-2' toggle={handleClose}>
              {props.t('Maintenance Notice')}
            </ModalHeader>

            <ModalBody>
              <Row className='g-3'>
                <Col lg={12}>
                  <div>
                    <p className='fs-14 fw-bold'>📢 Important Announcement: Maintenance Downtime</p>
                    <p>
                      We are performing scheduled maintenance on our database cluster to enhance performance and reliability. Please review
                      the following details carefully:
                    </p>

                    <p className='fs-14 fw-bold'>🔧 Maintenance Schedule:</p>

                    <p>
                      ➡️ <b>{moment(1732541400000).format('hh:mm A, DD MMM')}</b> to{' '}
                      <b>{moment(1732606200000).format('hh:mm A, DD MMM')}</b>
                    </p>
                    <p>
                      Save Functionality (Bots, Automations, Custom Fields, Contact Import,Campaign creation, Bulk message creation, etc.)
                      will be disabled.
                    </p>
                    <p>
                      ➡️ <b>{moment(1732588200000).format('hh:mm A, DD MMM')}</b> to{' '}
                      <b>{moment(1732599000000).format('hh:mm A, DD MMM')}</b>
                    </p>
                    <p>All panel (Main, Inbox, Ecommerce and other) will be unavailable to login and access.</p>
                    <p className='fs-14 fw-bold'>🌐 What Works During Maintenance:</p>
                    <p>
                      All scheduled campaigns, Chatbots, Automations, APIs, and Webhooks will continue operating in the background during
                      this time. <b>LOGIN WON'T WORK TO ANY PLATFORM AREA FOR 3 HOURS</b>
                    </p>
                    <p>
                      ✨ <b>Post-Maintenance</b>
                    </p>
                    <p>
                      You can resume creating and editing campaigns, bots and automations from{' '}
                      <b>{moment(1732606200000).format('hh:mm A, DD MMM')}</b> onwards. We appreciate your patience and understanding during
                      this maintenance period! 
                    </p>

                    <p className='fs-14 fw-bold'>⏱️ Maintenance Timeline:</p>
                    <div className='timeline mb-2'>
                      {events.map((event, index) => (
                        <TimelineItem event={event} index={index} />
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <div className='input-group'>
                  <input
                    className='form-control-checkbox'
                    id='consent'
                    type='checkbox'
                    checked={acknowledge}
                    onChange={(e) => setAcknowledge(e.target.checked)}
                  />
                  <label htmlFor='consent' className='input-group-text bg-transparent border-0'>
                    I have read the notice and understand the timeline.
                  </label>
                </div>
              </Row>
            </ModalBody>
            <ModalFooter>
              <div className='hstack gap-2 justify-content-end'>
                <button
                  type='button'
                  className='btn btn-sm btn-secondary'
                  id='edit-btn'
                  onClick={() => {
                    handleClose();
                  }}
                >
                  {props.t('Remind me Later')}
                </button>
                <button
                  type='button'
                  className='btn btn-sm btn-primary'
                  id='edit-btn'
                  disabled={!acknowledge}
                  onClick={() => {
                    submitConsent();
                  }}
                >
                  {props.t('Acknowledge')}
                </button>
              </div>
            </ModalFooter>
          </Modal>
          {loading && <Preloader />}
        </div>
      )}
    </React.Fragment>
  );
};

UserConsent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};
export default withRouter(withTranslation()(UserConsent));
