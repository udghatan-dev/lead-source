import React, { useState, useEffect } from 'react';
import {
  ModalBody,
  ModalFooter,
  Spinner,
  Alert,
} from 'reactstrap';
import { SiGoogleforms } from 'react-icons/si';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { getGoogleFormsConnection, getGoogleFormsAppsScript } from '../../../helpers/backend_helper';

const GoogleFormsConfigForm = ({ connection, onSave, toggle }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectionDetails, setConnectionDetails] = useState(null);
  const [appsScript, setAppsScript] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const connectionId = connection?._id || connection?.id;

  useEffect(() => {
    if (!connectionId) return;
    setLoading(true);
    setError('');

    Promise.all([
      getGoogleFormsConnection(connectionId),
      getGoogleFormsAppsScript(connectionId),
    ])
      .then(([connRes, scriptRes]) => {
        setConnectionDetails(connRes.data || connRes || {});
        setAppsScript(scriptRes.data?.script || scriptRes?.script || '');
      })
      .catch(() => {
        setError('Failed to load Google Forms connection details');
      })
      .finally(() => setLoading(false));
  }, [connectionId]);

  const config = connectionDetails?.configuration || connection?.configuration || {};
  const webhookUrl = config.webhookUrl || connectionDetails?.webhookUrl || '';

  const handleCopyUrl = () => {
    if (!webhookUrl) return;
    navigator.clipboard.writeText(webhookUrl).then(() => {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    });
  };

  const handleCopyScript = () => {
    if (!appsScript) return;
    navigator.clipboard.writeText(appsScript).then(() => {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
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
                  <SiGoogleforms className='me-1' />
                  Google Forms Connection
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
                {(config.connectionName || connection?.name || connectionDetails?.name) && (
                  <div className='d-flex justify-content-between mb-1'>
                    <span className='text-muted'>Name</span>
                    <strong>{config.connectionName || connection?.name || connectionDetails?.name}</strong>
                  </div>
                )}
                {config.formName && (
                  <div className='d-flex justify-content-between mb-1'>
                    <span className='text-muted'>Form</span>
                    <strong>{config.formName}</strong>
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
                    onClick={handleCopyUrl}
                    title='Copy URL'
                    style={{ minWidth: '36px' }}
                  >
                    {copiedUrl ? <FiCheck size={14} /> : <FiCopy size={14} />}
                  </button>
                </div>
              </div>
            )}

            {/* Apps Script Code */}
            {appsScript && (
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
                  {appsScript}
                </pre>
              </div>
            )}

            {/* Setup Instructions */}
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
        )}
      </ModalBody>
      <ModalFooter>
        <button className='btn btn-sm btn-soft-danger' onClick={toggle}>Close</button>
      </ModalFooter>
    </>
  );
};

export default GoogleFormsConfigForm;
