import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import moment from 'moment';

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
      <div className='page-content py-3'>
        <Row className='g-3 d-flex align-items-center justify-content-center'>
          <Col lg={6}>
            <div className='card card-body bg-light'>
              <p className='fs-14 fw-bold'>📢 Important Announcement: Maintenance Downtime</p>
              <p>
                We are performing scheduled maintenance on our database cluster to enhance performance and reliability. Please review the
                following details carefully:
              </p>

              <p className='fs-14 fw-bold'>🔧 Maintenance Schedule:</p>

              <p>
                ➡️ <b>{moment(1732541400000).format('hh:mm A, DD MMM')}</b> to <b>{moment(1732606200000).format('hh:mm A, DD MMM')}</b>
              </p>
              <p>
                Save Functionality (Bots, Automations, Custom Fields, Contact Import,Campaign creation, Bulk message creation, etc.) will be
                disabled.
              </p>
              <p>
                ➡️ <b>{moment(1732588200000).format('hh:mm A, DD MMM')}</b> to <b>{moment(1732599000000).format('hh:mm A, DD MMM')}</b>
              </p>
              <p>All panel (Main, Inbox, Ecommerce and other) will be unavailable to login and access.</p>
              <p className='fs-14 fw-bold'>🌐 What Works During Maintenance:</p>
              <p>
                All scheduled campaigns, Chatbots, Automations, APIs, and Webhooks will continue operating in the background during this
                time. <b>LOGIN WON'T WORK TO ANY PLATFORM AREA FOR 3 HOURS</b>
              </p>
              <p>
                ✨ <b>Post-Maintenance</b>
              </p>
              <p>
                You can resume creating and editing campaigns, bots and automations from{' '}
                <b>{moment(1732606200000).format('hh:mm A, DD MMM')}</b> onwards. We appreciate your patience and understanding during this
                maintenance period! 
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
      </div>
    </React.Fragment>
  );
};

UserConsent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};
export default withRouter(withTranslation()(UserConsent));
