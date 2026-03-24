import React, { useState } from 'react';
import { withRouter, useHistory, useParams, useLocation } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Container,
  Card,
  CardBody,
  Input,
  Label,
  FormGroup,
  Alert,
} from 'reactstrap';

import BreadCrumb from '../../Components/Common/BreadCrumb';
import MetaTag from '../../Components/Common/Meta';
import { connectIndiamart } from '../../helpers/backend_helper';

//icons
import { FaMeta } from 'react-icons/fa6';
import { MdOutlineWebhook } from 'react-icons/md';
import { SiGoogleads } from 'react-icons/si';
import { SiLinkedin } from 'react-icons/si';
import { SiTypeform } from 'react-icons/si';
import { CgWebsite } from 'react-icons/cg';
import { SiGoogleforms } from 'react-icons/si';
import { ImMobile } from 'react-icons/im';
import { IoQrCodeOutline } from 'react-icons/io5';
import { SiZoho } from 'react-icons/si';
import { FaHubspot } from 'react-icons/fa';
import { LiaSalesforce } from 'react-icons/lia';
import { FaIndustry } from 'react-icons/fa';
import { FaHandshake } from 'react-icons/fa';
import { BsBuildingsFill } from 'react-icons/bs';
import { MdRestaurant } from 'react-icons/md';
import { BsGearWideConnected } from 'react-icons/bs';
import { IoArrowBack } from 'react-icons/io5';

const sourceConfig = {
  facebookLeadAds: { name: 'Facebook Lead Ads', icon: <FaMeta />, color: '#1877F2' },
  webhook: { name: 'Webhook', icon: <MdOutlineWebhook />, color: '#6366f1' },
  form: { name: 'Form', icon: <SiGoogleforms />, color: '#673AB7' },
  googleForm: { name: 'Google Form', icon: <SiGoogleforms />, color: '#673AB7' },
  typeform: { name: 'Typeform', icon: <SiTypeform />, color: '#262627' },
  googleAds: { name: 'Google Ads', icon: <SiGoogleads />, color: '#4285F4' },
  linkedinLeadGen: { name: 'LinkedIn Lead Gen', icon: <SiLinkedin />, color: '#0077B5' },
  landingPage: { name: 'Landing Page', icon: <CgWebsite />, color: '#10b981' },
  callConnect: { name: 'Call History Connect', icon: <ImMobile />, color: '#f59e0b' },
  ocrApp: { name: 'OCR App', icon: <IoQrCodeOutline />, color: '#8b5cf6' },
  zohoCrm: { name: 'Zoho CRM', icon: <SiZoho />, color: '#D32F2F' },
  hubspotCrm: { name: 'Hubspot CRM', icon: <FaHubspot />, color: '#FF7A59' },
  salesforce: { name: 'Salesforce', icon: <LiaSalesforce />, color: '#00A1E0' },
  indiaMart: { name: 'India Mart', icon: <FaIndustry />, color: '#2563eb' },
  tradeIndia: { name: 'Trade India', icon: <FaHandshake />, color: '#16a34a' },
  magicBricks: { name: 'Magic Bricks', icon: <BsBuildingsFill />, color: '#dc2626' },
  zomato: { name: 'Zomato', icon: <MdRestaurant />, color: '#e23744' },
};

const ConnectionSetup = () => {
  const history = useHistory();
  const { sourceKey } = useParams();
  const location = useLocation();

  const source = sourceConfig[sourceKey] || { name: sourceKey, icon: <BsGearWideConnected />, color: '#64748b' };

  const [connectionName, setConnectionName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [fetchLeadsSince, setFetchLeadsSince] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isIndiaMart = sourceKey === 'indiaMart';

  // Date limits for fetchLeadsSince (last 365 days)
  const today = new Date().toISOString().split('T')[0];
  const minDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const handleSave = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      if (isIndiaMart) {
        await connectIndiamart({
          accountName: connectionName,
          crmKey: apiKey,
          ...(fetchLeadsSince && { fetchLeadsSince }),
        });
      }
      history.push('/settings');
    } catch (err) {
      console.error('Failed to save connection:', err);
      setError(err?.msg || err?.response?.data?.msg || 'Failed to save connection. Please check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      <div className='page-content'>
        <MetaTag pageTitle={`Setup - ${source.name}`} />
        <Container fluid>
          <BreadCrumb title={source.name} pageTitle='Lead Source' />

          {/* Back Button */}
          <button
            className='btn btn-sm btn-soft-primary d-flex align-items-center gap-2 mb-4'
            onClick={() => history.push('/settings')}
          >
            <IoArrowBack />
            <span>Back to Lead Sources</span>
          </button>

          {/* Source Header */}
          <Card className='border mb-4'>
            <CardBody>
              <div className='d-flex align-items-center gap-3'>
                <div
                  style={{
                    fontSize: '2rem',
                    background: '#f1f5f9',
                    borderRadius: '10px',
                    padding: '0.6rem',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: source.color,
                  }}
                >
                  {source.icon}
                </div>
                <div>
                  <h4 className='mb-1' style={{ color: '#1e293b', fontWeight: '600' }}>
                    {source.name}
                  </h4>
                  <p className='text-muted mb-0'>Configure your connection settings below</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {error && (
            <Alert color='danger' className='mb-3' style={{ fontSize: '0.85rem' }} toggle={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Connection Form */}
          <Card className='border'>
            <CardBody>
              <h5 className='mb-4' style={{ fontWeight: '600', color: '#1e293b' }}>
                Connection Settings
              </h5>

              <FormGroup className='mb-3'>
                <Label for='connectionName' className='fw-medium'>
                  Connection Name
                </Label>
                <Input
                  type='text'
                  id='connectionName'
                  placeholder='Enter a name for this connection'
                  value={connectionName}
                  onChange={(e) => setConnectionName(e.target.value)}
                  autoComplete='off'
                />
              </FormGroup>

              <FormGroup className='mb-3'>
                <Label for='apiKey' className='fw-medium'>
                  {isIndiaMart ? 'CRM Key' : 'API Key'}
                </Label>
                <Input
                  type='password'
                  id='apiKey'
                  placeholder={isIndiaMart ? 'Enter your IndiaMART CRM key' : 'Enter your API key'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  autoComplete='new-password'
                />
                <small className='text-muted'>
                  {isIndiaMart
                    ? 'You can find your CRM key in your IndiaMART seller dashboard under CRM settings.'
                    : `You can find your API key in the ${source.name} dashboard settings.`}
                </small>
              </FormGroup>

              {isIndiaMart && (
                <FormGroup className='mb-3'>
                  <Label for='fetchLeadsSince' className='fw-medium'>
                    Fetch Leads Since
                  </Label>
                  <Input
                    type='date'
                    id='fetchLeadsSince'
                    value={fetchLeadsSince}
                    onChange={(e) => setFetchLeadsSince(e.target.value)}
                    min={minDate}
                    max={today}
                  />
                  <small className='text-muted'>
                    Select a date within the last 365 days to fetch leads from.
                  </small>
                </FormGroup>
              )}

              {!isIndiaMart && (
                <FormGroup className='mb-4'>
                  <Label for='webhookUrl' className='fw-medium'>
                    Webhook URL (Optional)
                  </Label>
                  <Input
                    type='text'
                    id='webhookUrl'
                    placeholder='https://...'
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                </FormGroup>
              )}

              <div className='d-flex gap-2'>
                <button
                  className='btn btn-primary d-flex align-items-center gap-2'
                  onClick={handleSave}
                  disabled={isSubmitting || !connectionName || !apiKey}
                >
                  {isSubmitting ? (
                    <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>
                  ) : (
                    <BsGearWideConnected />
                  )}
                  <span>{isSubmitting ? 'Saving...' : 'Save Connection'}</span>
                </button>
                <button
                  className='btn btn-soft-danger'
                  onClick={() => history.push('/settings')}
                >
                  Cancel
                </button>
              </div>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

ConnectionSetup.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(ConnectionSetup));
