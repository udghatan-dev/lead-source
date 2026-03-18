import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { connectGenericWebhook } from '../../../helpers/backend_helper';

const ICON_PATH = '/leadsource/assets/icons';

const toSlug = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');

const WebhookCreationModal = ({ isOpen, toggle, onSuccess }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleClose = () => {
    setName('');
    setType('');
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
      const res = await connectGenericWebhook({
        type: type || 'generic',
        accountName: toSlug(name),
        name,
      });
      setResult(res.data || res);
      onSuccess?.();
    } catch (err) {
      setError(err?.msg || err?.response?.data?.msg || 'Failed to create webhook connection.');
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
          <img src={`${ICON_PATH}/webhook-icon.svg`} alt="Webhook" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          <span>Create Webhook Connection</span>
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
              Webhook connection created successfully!
            </Alert>
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
                Send a POST request with JSON lead data to this URL to ingest leads automatically.
              </p>
            </div>
            <div className='p-3 rounded' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#475569' }}>
                Sample Request
              </div>
              <pre
                style={{
                  fontSize: '0.73rem',
                  backgroundColor: '#1e293b',
                  color: '#e2e8f0',
                  padding: '10px',
                  borderRadius: '6px',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {`POST ${result.webhookUrl}
                        Content-Type: application/json
                        {
                          "name": "John Doe",
                          "email": "john@example.com",
                          "phone": "555-1234"
                        }`}
              </pre>
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
                placeholder='e.g. My Google Sheet Webhook'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className='mb-3'>
              <label className='form-label fw-medium'>
                Type <span className='text-muted fw-normal'>(optional)</span>
              </label>
              <input
                type='text'
                className='form-control'
                placeholder='e.g. googlesheet, custom'
                value={type}
                onChange={(e) => {
                  const val = e.target.value.toLowerCase().replace(/[^a-z]/g, '');
                  setType(val);
                }}
              />
              <small className='text-muted'>A label to identify the source type. Leave blank for "generic".</small>
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
              <span>{creating ? 'Creating...' : 'Create Webhook'}</span>
            </button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default WebhookCreationModal;
