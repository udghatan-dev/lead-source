import React, { useState, useEffect } from 'react';
import {
  ModalBody,
  ModalFooter,
  Spinner,
  Alert,
} from 'reactstrap';
import { MdOutlineWebhook } from 'react-icons/md';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { getGenericWebhookConnection } from '../../../helpers/backend_helper';

const GenericWebhookConfigForm = ({ connection, onSave, toggle }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectionDetails, setConnectionDetails] = useState(null);
  const [copied, setCopied] = useState(false);

  const connectionId = connection?._id || connection?.id;

  useEffect(() => {
    if (!connectionId) return;
    setLoading(true);
    setError('');
    getGenericWebhookConnection(connectionId)
      .then((res) => {
        setConnectionDetails(res.data || res || {});
      })
      .catch(() => {
        setError('Failed to load webhook connection details');
      })
      .finally(() => setLoading(false));
  }, [connectionId]);

  const config = connectionDetails?.configuration || connection?.configuration || {};
  const webhookUrl = config.webhookUrl || connectionDetails?.webhookUrl || '';

  const handleCopy = () => {
    if (!webhookUrl) return;
    navigator.clipboard.writeText(webhookUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <ModalBody>
        {error && (
          <Alert color='danger' className='mb-3' style={{ fontSize: '0.85rem' }} toggle={() => setError('')}>
            {error}
          </Alert>
        )}

        {loading ? (
          <div className='text-center py-4'>
            <Spinner color='primary' />
            <p className='text-muted mt-2' style={{ fontSize: '0.85rem' }}>Loading connection details...</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className='p-3 rounded mb-3' style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <div className='d-flex align-items-center justify-content-between'>
                <p className='mb-0 fw-medium' style={{ fontSize: '0.85rem', color: '#2563eb' }}>
                  <MdOutlineWebhook className='me-1' />
                  Custom Webhook Connection
                </p>
                <span
                  className='badge'
                  style={{
                    backgroundColor: connection?.status === 'active' ? '#22c55e' : '#f59e0b',
                    color: '#fff',
                    fontSize: '0.7rem',
                  }}
                >
                  {connection?.status || 'active'}
                </span>
              </div>
            </div>

            {/* Connection Details */}
            <div className='p-3 rounded mb-3' style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#15803d' }}>
                Connection Details
              </div>
              <div style={{ fontSize: '0.8rem' }}>
                {config.connectionName && (
                  <div className='d-flex justify-content-between mb-1'>
                    <span className='text-muted'>Name</span>
                    <strong>{config.connectionName}</strong>
                  </div>
                )}
                {(connection?.name || connectionDetails?.name) && (
                  <div className='d-flex justify-content-between mb-1'>
                    <span className='text-muted'>Name</span>
                    <strong>{connection?.name || connectionDetails?.name}</strong>
                  </div>
                )}
                {config.type && (
                  <div className='d-flex justify-content-between mb-1'>
                    <span className='text-muted'>Type</span>
                    <strong>{config.type}</strong>
                  </div>
                )}
                {connection?.createdAt && (
                  <div className='d-flex justify-content-between mb-1'>
                    <span className='text-muted'>Created</span>
                    <strong>{new Date(connection.createdAt).toLocaleString()}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Webhook URL */}
            {webhookUrl && (
              <div className='p-3 rounded mb-3' style={{ backgroundColor: '#fefce8', border: '1px solid #fde68a' }}>
                <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#a16207' }}>
                  Inbound Webhook URL
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
                    {webhookUrl}
                  </code>
                  <button
                    className='btn btn-sm btn-outline-primary d-flex align-items-center'
                    onClick={handleCopy}
                    title='Copy URL'
                    style={{ minWidth: '36px' }}
                  >
                    {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                  </button>
                </div>
                <p className='mb-0 mt-2' style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Send a POST request with your lead data (JSON) to this URL to ingest leads.
                </p>
              </div>
            )}

            {/* Sample Payload */}
            <div className='p-3 rounded mb-3' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#475569' }}>
                Sample Payload
              </div>
              <pre
                style={{
                  fontSize: '0.75rem',
                  backgroundColor: '#1e293b',
                  color: '#e2e8f0',
                  padding: '12px',
                  borderRadius: '6px',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                }}
              >
{`POST ${webhookUrl || '<your-webhook-url>'}
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "company": "Acme Inc"
}`}
              </pre>
            </div>

            {/* Info */}
            <div className='p-3 rounded' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <p className='mb-0' style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Leads sent to this webhook URL will be automatically saved, forwarded to any configured outbound webhooks, and
                CRM contacts will be created if field mappings are set up.
              </p>
            </div>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <button className='btn btn-sm btn-soft-danger' onClick={toggle}>Close</button>
      </ModalFooter>
    </>
  );
};

export default GenericWebhookConfigForm;
