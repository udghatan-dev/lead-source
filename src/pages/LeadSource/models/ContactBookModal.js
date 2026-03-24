import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { RiContactsBook2Line } from 'react-icons/ri';
import { QRCodeSVG } from 'qrcode.react';
import { connectContactBook } from '../../../helpers/backend_helper';

const toSlug = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');

const ContactBookModal = ({ isOpen, toggle, onSuccess }) => {
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
      const res = await connectContactBook({ accountName: toSlug(name), name });
      setResult(res.data || res);
      onSuccess?.();
    } catch (err) {
      setError(err?.msg || err?.response?.data?.msg || 'Failed to create contact book connection.');
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
          <RiContactsBook2Line style={{ color: '#10b981', fontSize: '1.3rem' }} />
          <span>Create Contact Book Connection</span>
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
              Contact Book connection created successfully!
            </Alert>

            {result.webhookUrl && (
              <div className='p-3 rounded mb-3' style={{ backgroundColor: '#fefce8', border: '1px solid #fde68a' }}>
                <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#a16207' }}>
                  Your Webhook URL
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
              </div>
            )}

            {result.webhookUrl && (
              <div className='p-3 rounded mb-3' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#475569' }}>
                  Scan QR Code with your Phone
                </div>
                <p className='text-muted mb-3' style={{ fontSize: '0.75rem' }}>
                  Open your phone camera and scan this QR code to share contacts from your contact book.
                </p>
                <div className='d-flex justify-content-center'>
                  <QRCodeSVG
                    value={JSON.stringify({ name: result.name || name, url: result.webhookUrl })}
                    size={200}
                    level='M'
                    includeMargin
                    style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px', backgroundColor: '#fff' }}
                  />
                </div>
              </div>
            )}

            <div className='p-3 rounded' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#475569' }}>
                How to Use
              </div>
              <ol className='mb-0 ps-3' style={{ fontSize: '0.8rem', color: '#64748b' }}>
                <li className='mb-1'>Scan the QR code above with your phone camera</li>
                <li className='mb-1'>Open the link to share contacts from your contact book</li>
                <li>Contacts will automatically be imported as leads</li>
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
                placeholder='e.g. My Contact Book'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className='p-3 rounded' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <p className='mb-0' style={{ fontSize: '0.8rem', color: '#64748b' }}>
                A webhook URL will be created and a QR code will be generated for you to scan with your phone to share contacts from your contact book.
              </p>
            </div>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <button className='btn btn-sm btn-soft-danger' onClick={handleClose}>
          {result ? 'Close' : 'Cancel'}
        </button>
        {!result && (
          <button
            className='btn btn-sm btn-primary d-flex align-items-center gap-2'
            onClick={handleCreate}
            disabled={creating || !name}
          >
            {creating && <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>}
            <span>{creating ? 'Creating...' : 'Create Connection'}</span>
          </button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default ContactBookModal;
