import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { connectGoogleForms, getGoogleFormsAppsScript } from '../../../helpers/backend_helper';

const ICON_PATH = '/leadsource/assets/icons';

const toSlug = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');

const GoogleFormsModal = ({ isOpen, toggle, onSuccess }) => {
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const handleClose = () => {
    setName('');
    setError('');
    setResult(null);
    setCopiedUrl(false);
    setCopiedScript(false);
    toggle();
  };

  const handleCreate = async () => {
    if (!name) {
      setError('Please enter a connection name.');
      return;
    }
    setCreating(true);
    setError('');
    try {
      const res = await connectGoogleForms({ accountName: toSlug(name), name });
      const connectionData = res.data || res;
      const connectionId = connectionData?._id || connectionData?.id || connectionData?.connectionId;

      let appsScript = connectionData?.appsScript || '';
      if (!appsScript && connectionId) {
        try {
          const scriptRes = await getGoogleFormsAppsScript(connectionId);
          appsScript = scriptRes?.data?.script || scriptRes?.script || scriptRes?.data?.appsScript || scriptRes?.appsScript || '';
        } catch (e) {
          console.error('Failed to fetch Apps Script:', e);
        }
      }

      setResult({ ...connectionData, appsScript });
      onSuccess?.();
    } catch (err) {
      setError(err?.msg || err?.response?.data?.msg || 'Failed to create Google Forms connection.');
    } finally {
      setCreating(false);
    }
  };

  const handleCopyUrl = () => {
    const url = result?.webhookUrl;
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    });
  };

  const handleCopyScript = () => {
    const script = result?.appsScript;
    if (!script) return;
    navigator.clipboard.writeText(script).then(() => {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    });
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size='md' centered>
      <ModalHeader toggle={handleClose}>
        <div className='d-flex align-items-center gap-2'>
          <img src={`${ICON_PATH}/google-forms-icon.svg`} alt="Google Forms" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          <span>Create Google Forms Connection</span>
        </div>
      </ModalHeader>
      <ModalBody>
        {error && (
          <Alert color='danger' className='mb-3' style={{ fontSize: '0.85rem' }} toggle={() => setError('')}>
            {error}
          </Alert>
        )}

        {result ? (
          <>
            <Alert color='success' className='mb-3' style={{ fontSize: '0.85rem' }}>
              Google Forms connection created successfully!
            </Alert>

            {result.webhookUrl && (
              <div className='p-3 rounded mb-3' style={{ backgroundColor: '#fefce8', border: '1px solid #fde68a' }}>
                <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#a16207' }}>
                  Your Inbound Webhook URL
                </div>
                <div className='d-flex align-items-center gap-2'>
                  <code
                    className='flex-grow-1 p-2 rounded'
                    style={{
                      fontSize: '0.75rem',
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      wordBreak: 'break-all',
                      display: 'block',
                    }}
                  >
                    {result.webhookUrl}
                  </code>
                  <button
                    className='btn btn-sm btn-outline-primary d-flex align-items-center'
                    onClick={handleCopyUrl}
                    title='Copy URL'
                    style={{ minWidth: '36px' }}
                  >
                    {copiedUrl ? <FiCheck size={14} /> : <FiCopy size={14} />}
                  </button>
                </div>
              </div>
            )}

            {result.appsScript && (
              <div className='p-3 rounded mb-3' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className='d-flex align-items-center justify-content-between mb-2'>
                  <div className='fw-medium' style={{ fontSize: '0.83rem', color: '#475569' }}>
                    Google Apps Script
                  </div>
                  <button
                    className='btn btn-sm btn-outline-secondary d-flex align-items-center gap-1'
                    onClick={handleCopyScript}
                    style={{ fontSize: '0.75rem' }}
                  >
                    {copiedScript ? <FiCheck size={14} /> : <FiCopy size={14} />}
                    <span>{copiedScript ? 'Copied!' : 'Copy Script'}</span>
                  </button>
                </div>
                <pre
                  style={{
                    fontSize: '0.73rem',
                    backgroundColor: '#1e293b',
                    color: '#e2e8f0',
                    padding: '12px',
                    borderRadius: '6px',
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }}
                >
                  {result.appsScript}
                </pre>
              </div>
            )}

            <div className='p-3 rounded' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#475569' }}>
                Setup Instructions
              </div>
              <ol className='mb-0 ps-3' style={{ fontSize: '0.8rem', color: '#64748b' }}>
                <li className='mb-1'>Open your Google Form in edit mode</li>
                <li className='mb-1'>Click the three-dot menu and select "Script editor"</li>
                <li className='mb-1'>Replace the default code with the Apps Script above</li>
                <li className='mb-1'>Save the script and set up a trigger for "onFormSubmit"</li>
                <li>Form responses will automatically be sent as leads</li>
              </ol>
            </div>
          </>
        ) : (
          <>
            <div className='mb-3'>
              <label className='form-label fw-medium'>
                Connection Name <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                className='form-control'
                placeholder='e.g. My Google Form Leads'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className='p-3 rounded' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <p className='mb-0' style={{ fontSize: '0.8rem', color: '#64748b' }}>
                After creating the connection, you will receive a webhook URL and an Apps Script code to paste into your Google Form's
                script editor.
              </p>
            </div>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        {result ? (
          <button className='btn btn-sm btn-primary' onClick={handleClose}>
            Done
          </button>
        ) : (
          <>
            <button className='btn btn-sm btn-soft-danger' onClick={handleClose}>
              Cancel
            </button>
            <button
              className='btn btn-sm btn-primary d-flex align-items-center gap-2'
              onClick={handleCreate}
              disabled={creating || !name}
            >
              {creating && <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>}
              <span>{creating ? 'Creating...' : 'Create Connection'}</span>
            </button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default GoogleFormsModal;
