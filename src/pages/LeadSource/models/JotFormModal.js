import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { connectJotForm } from '../../../helpers/backend_helper';

const ICON_PATH = '/leadsource/assets/icons';

const toSlug = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');

const JotFormModal = ({ isOpen, toggle, onSuccess }) => {
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleClose = () => {
    setName('');
    setError('');
    setResult(null);
    setCopied(false);
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
      const res = await connectJotForm({ accountName: toSlug(name), name });
      setResult(res.data || res);
      onSuccess?.();
    } catch (err) {
      setError(err?.msg || err?.response?.data?.msg || 'Failed to create JotForm connection.');
    } finally {
      setCreating(false);
    }
  };

  const handleCopyUrl = () => {
    const url = result?.webhookUrl;
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size='md' centered>
      <ModalHeader toggle={handleClose}>
        <div className='d-flex align-items-center gap-2'>
          <img src={`${ICON_PATH}/JotForm-icon.svg`} alt="JotForm" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          <span>Create JotForm Connection</span>
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
              JotForm connection created successfully!
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
                    {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                  </button>
                </div>
                <p className='mb-0 mt-2' style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Add this URL as a webhook in your JotForm form settings.
                </p>
              </div>
            )}
            <div className='p-3 rounded' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#475569' }}>
                Next Steps
              </div>
              <ol className='mb-0 ps-3' style={{ fontSize: '0.8rem', color: '#64748b' }}>
                <li className='mb-1'>Open your form in JotForm</li>
                <li className='mb-1'>Go to <strong>Settings</strong> &rarr; <strong>Integrations</strong></li>
                <li className='mb-1'>Search for <strong>WebHooks</strong> and select it</li>
                <li className='mb-1'>Paste the webhook URL above</li>
                <li className='mb-1'>Click <strong>Complete Integration</strong></li>
                <li>Submit a test response to verify</li>
              </ol>
            </div>
          </>
        ) : (
          <>
            <div className='mb-3'>
              <label className='form-label fw-medium'>Connection Name <span className='text-danger'>*</span></label>
              <input
                type='text'
                className='form-control'
                placeholder='e.g. My JotForm Leads'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className='p-3 rounded' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <p className='mb-0' style={{ fontSize: '0.8rem', color: '#64748b' }}>
                After creating the connection, you will receive a webhook URL to add in your JotForm form's webhook integration settings.
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

export default JotFormModal;
