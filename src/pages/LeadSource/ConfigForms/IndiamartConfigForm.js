import React, { useState, useEffect } from 'react';
import {
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Spinner,
  Alert,
} from 'reactstrap';
import { BsGearWideConnected } from 'react-icons/bs';
import { FaIndustry } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { updateIndiamartConnection } from '../../../helpers/backend_helper';

const IndiamartConfigForm = ({ connection, onSave, toggle }) => {
  const config = connection?.configuration || {};
  const [accountName, setAccountName] = useState(config.accountName || '');
  const [crmKey, setCrmKey] = useState(config.crmKey || '');
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setAccountName(config.accountName || '');
    setCrmKey(config.crmKey || '');
    setError('');
  }, [connection]);

  const handleSave = async () => {
    if (!crmKey.trim()) return;
    setSaving(true);
    setError('');
    try {
      await updateIndiamartConnection(connection._id || connection.id, {
        accountName: accountName.trim(),
        crmKey: crmKey.trim(),
      });
      await onSave(connection._id || connection.id, {
        _id: connection._id || connection.id,
        crmKey: crmKey.trim(),
        accountName: accountName.trim(),
      });
    } catch (err) {
      setError(err?.response?.data?.msg || 'Failed to update IndiaMART connection. Please check your CRM key.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ModalBody>
        {error && (
          <Alert color='danger' className='mb-3' style={{ fontSize: '0.85rem' }} toggle={() => setError('')}>
            {error}
          </Alert>
        )}

        {config.accountName && (
          <div className='p-3 rounded mb-3' style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <p className='mb-1 fw-medium' style={{ fontSize: '0.85rem', color: '#1d4ed8' }}>
              <FaIndustry className='me-1' />
              Current Configuration
            </p>
            <div className='d-flex gap-3 mt-2' style={{ fontSize: '0.8rem' }}>
              <div>
                <span className='text-muted'>Account:</span> <strong>{config.accountName}</strong>
              </div>
              <div>
                <span className='text-muted'>CRM Key:</span> <strong>{config.crmKey ? '••••••••' + config.crmKey.slice(-4) : '-'}</strong>
              </div>
            </div>
          </div>
        )}

        <FormGroup className='mb-3'>
          <Label for='indiamartAccountName' className='fw-medium'>
            Account Name
          </Label>
          <Input
            type='text'
            id='indiamartAccountName'
            placeholder='Enter account name'
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            style={{ fontSize: '0.85rem' }}
          />
        </FormGroup>

        <FormGroup className='mb-3'>
          <Label for='indiamartCrmKey' className='fw-medium'>
            CRM Key
          </Label>
          <div className='input-group'>
            <Input
              type={showKey ? 'text' : 'password'}
              id='indiamartCrmKey'
              placeholder='Enter your IndiaMART CRM key'
              value={crmKey}
              onChange={(e) => setCrmKey(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            />
            <button
              className='btn btn-secondary d-flex align-items-center'
              type='button'
              onClick={() => setShowKey((prev) => !prev)}
              title={showKey ? 'Hide key' : 'Show key'}
            >
              {showKey ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          <small className='text-muted'>
            You can find your CRM key in your IndiaMART seller dashboard under CRM settings.
          </small>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <button className='btn btn-sm btn-soft-danger' onClick={toggle}>Cancel</button>
        <button
          className='btn btn-sm btn-primary d-flex align-items-center gap-1'
          onClick={handleSave}
          disabled={!crmKey.trim() || saving}
        >
          {saving ? <Spinner size='sm' /> : <BsGearWideConnected />}
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </ModalFooter>
    </>
  );
};

export default IndiamartConfigForm;
