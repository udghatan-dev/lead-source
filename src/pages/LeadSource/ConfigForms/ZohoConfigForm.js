import React, { useState, useEffect } from 'react';
import {
  ModalBody,
  ModalFooter,
  Spinner,
  Alert,
} from 'reactstrap';
import { SiZoho } from 'react-icons/si';
import { getZohoConnection } from '../../../helpers/backend_helper';

const ZohoConfigForm = ({ connection, onSave, toggle }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectionDetails, setConnectionDetails] = useState(null);

  const connectionId = connection?._id || connection?.id;

  useEffect(() => {
    if (!connectionId) return;
    setLoading(true);
    setError('');
    getZohoConnection(connectionId)
      .then((res) => {
        setConnectionDetails(res.data || res || {});
      })
      .catch(() => {
        setError('Failed to load Zoho connection details');
      })
      .finally(() => setLoading(false));
  }, [connectionId]);

  const config = connectionDetails?.configuration || connection?.configuration || {};

  const isTokenExpired = config.tokenExpiresAt && new Date(config.tokenExpiresAt) < new Date();

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
            <div className='p-3 rounded mb-3' style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
              <div className='d-flex align-items-center justify-content-between'>
                <p className='mb-0 fw-medium' style={{ fontSize: '0.85rem', color: '#dc2626' }}>
                  <SiZoho className='me-1' />
                  Zoho CRM Connection
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

            {/* Account Details */}
            <div className='p-3 rounded mb-3' style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#15803d' }}>
                Account Details
              </div>
              <div style={{ fontSize: '0.8rem' }}>
                {config.zohoUserName && (
                  <div className='d-flex justify-content-between mb-1'>
                    <span className='text-muted'>Name</span>
                    <strong>{config.zohoUserName}</strong>
                  </div>
                )}
                {config.zohoUserEmail && (
                  <div className='d-flex justify-content-between mb-1'>
                    <span className='text-muted'>Email</span>
                    <strong>{config.zohoUserEmail}</strong>
                  </div>
                )}
                {config.accountName && (
                  <div className='d-flex justify-content-between mb-1'>
                    <span className='text-muted'>Account</span>
                    <strong>{config.accountName}</strong>
                  </div>
                )}
                {config.region && (
                  <div className='d-flex justify-content-between mb-1'>
                    <span className='text-muted'>Region</span>
                    <strong>{config.region}</strong>
                  </div>
                )}
                {config.apiDomain && (
                  <div className='d-flex justify-content-between mb-1'>
                    <span className='text-muted'>API Domain</span>
                    <strong style={{ fontSize: '0.75rem' }}>{config.apiDomain}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Sync Status */}
            <div className='p-3 rounded mb-3' style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#1d4ed8' }}>
                Sync Status
              </div>
              <div style={{ fontSize: '0.8rem' }}>
                <div className='d-flex justify-content-between mb-1'>
                  <span className='text-muted'>Backfill Complete</span>
                  <span
                    className='badge'
                    style={{
                      backgroundColor: config.backfillComplete ? '#22c55e' : '#f59e0b',
                      color: '#fff',
                      fontSize: '0.7rem',
                    }}
                  >
                    {config.backfillComplete ? 'Yes' : 'In Progress'}
                  </span>
                </div>
                <div className='d-flex justify-content-between mb-1'>
                  <span className='text-muted'>Last Pulled At</span>
                  <strong>{config.lastPulledAt ? new Date(config.lastPulledAt).toLocaleString() : 'Never'}</strong>
                </div>
              </div>
            </div>

            {/* Token Status */}
            <div
              className='p-3 rounded mb-3'
              style={{
                backgroundColor: isTokenExpired ? '#fef2f2' : '#f8fafc',
                border: `1px solid ${isTokenExpired ? '#fecaca' : '#e2e8f0'}`,
              }}
            >
              <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: isTokenExpired ? '#dc2626' : '#475569' }}>
                Token Status
              </div>
              <div style={{ fontSize: '0.8rem' }}>
                <div className='d-flex justify-content-between mb-1'>
                  <span className='text-muted'>Access Token</span>
                  <strong>{'••••••••' + (config.accessToken ? config.accessToken.slice(-8) : '')}</strong>
                </div>
                <div className='d-flex justify-content-between mb-1'>
                  <span className='text-muted'>Refresh Token</span>
                  <strong>{'••••••••' + (config.refreshToken ? config.refreshToken.slice(-8) : '')}</strong>
                </div>
                <div className='d-flex justify-content-between mb-1'>
                  <span className='text-muted'>Expires At</span>
                  <strong style={{ color: isTokenExpired ? '#dc2626' : 'inherit' }}>
                    {config.tokenExpiresAt ? new Date(config.tokenExpiresAt).toLocaleString() : '-'}
                    {isTokenExpired && ' (Expired)'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className='p-3 rounded' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <p className='mb-0' style={{ fontSize: '0.8rem', color: '#64748b' }}>
                This connection was established via Zoho OAuth. To reconnect or change the account,
                delete this connection and create a new one from the Lead Sources page.
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

export default ZohoConfigForm;
