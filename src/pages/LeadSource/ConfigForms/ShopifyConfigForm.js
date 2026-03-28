import React, { useState, useEffect } from 'react';
import {
  ModalBody,
  ModalFooter,
  Spinner,
  Alert,
} from 'reactstrap';
import { FiCheck } from 'react-icons/fi';
import { getShopifyConnection, getShopifyForms, saveShopifySelection } from '../../../helpers/backend_helper';

const ShopifyConfigForm = ({ connection, toggle }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [connectionDetails, setConnectionDetails] = useState(null);

  // Source selection state (orders / checkouts)
  const [sources, setSources] = useState([]);
  const [loadingSources, setLoadingSources] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState('');
  const [saving, setSaving] = useState(false);

  const connectionId = connection?._id || connection?.id;

  useEffect(() => {
    if (!connectionId) return;
    setLoading(true);
    setError('');
    getShopifyConnection(connectionId)
      .then((res) => {
        const details = res.data || res || {};
        setConnectionDetails(details);
        const config = details?.configuration || connection?.configuration || {};
        if (config.sourceId) {
          setSelectedSourceId(config.sourceId);
        }
      })
      .catch(() => {
        setError('Failed to load Shopify connection details');
      })
      .finally(() => setLoading(false));
  }, [connectionId]);

  const handleLoadSources = async () => {
    setLoadingSources(true);
    setError('');
    try {
      const res = await getShopifyForms(connectionId);
      const sourceList = res?.forms || res?.sources || res?.data?.forms || res?.data?.sources || res?.data || res || [];
      setSources(Array.isArray(sourceList) ? sourceList : []);
    } catch (err) {
      setError(err?.msg || err?.message || 'Failed to load lead sources from Shopify.');
    } finally {
      setLoadingSources(false);
    }
  };

  useEffect(() => {
    if (connectionId) {
      handleLoadSources();
    }
  }, [connectionId]);

  const handleSaveSelection = async () => {
    if (!selectedSourceId) {
      setError('Please select a lead source.');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const selectedSource = sources.find((s) => s.id === selectedSourceId);
      await saveShopifySelection({
        connectionId,
        sourceId: selectedSourceId,
        sourceName: selectedSource?.name || selectedSource?.title || selectedSourceId,
      });
      setSuccess('Lead source selection saved successfully!');
    } catch (err) {
      setError(err?.msg || err?.message || 'Failed to save lead source selection.');
    } finally {
      setSaving(false);
    }
  };

  const config = connectionDetails?.configuration || connection?.configuration || {};

  return (
    <>
      <ModalBody>
        {error && (
          <Alert color='danger' className='mb-3' style={{ fontSize: '0.85rem' }} toggle={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert color='success' className='mb-3' style={{ fontSize: '0.85rem' }} toggle={() => setSuccess('')}>
            <FiCheck className='me-1' />{success}
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
            <div className='p-3 rounded mb-3' style={{ backgroundColor: '#f0fce8', border: '1px solid #b5e4a0' }}>
              <div className='d-flex align-items-center justify-content-between'>
                <p className='mb-0 fw-medium' style={{ fontSize: '0.85rem', color: '#5e8e3e' }}>
                  Shopify Connection
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
            {(config.shopName || config.accountName || config.connectionName || connection?.name) && (
              <div className='p-3 rounded mb-3' style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#15803d' }}>
                  Store Details
                </div>
                <div style={{ fontSize: '0.8rem' }}>
                  <div className='d-flex justify-content-between mb-1'>
                    <span className='text-muted'>Store</span>
                    <strong>{config.shopName || config.accountName || config.connectionName || connection?.name}</strong>
                  </div>
                  {config.email && (
                    <div className='d-flex justify-content-between mb-1'>
                      <span className='text-muted'>Email</span>
                      <strong>{config.email}</strong>
                    </div>
                  )}
                  {config.sourceName && (
                    <div className='d-flex justify-content-between mb-1'>
                      <span className='text-muted'>Selected Source</span>
                      <strong>{config.sourceName}</strong>
                    </div>
                  )}
                  {connection?.createdAt && (
                    <div className='d-flex justify-content-between mb-1'>
                      <span className='text-muted'>Connected</span>
                      <strong>{new Date(connection.createdAt).toLocaleString()}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Source Selection */}
            <div className='p-3 rounded mb-3' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className='fw-medium mb-2' style={{ fontSize: '0.83rem', color: '#475569' }}>
                Select Lead Source
              </div>
              <p className='text-muted mb-2' style={{ fontSize: '0.75rem' }}>
                Choose which Shopify event to capture leads from (e.g. new orders, abandoned checkouts).
              </p>

              {loadingSources ? (
                <div className='text-center py-2'>
                  <Spinner size='sm' color='primary' />
                  <span className='ms-2 text-muted' style={{ fontSize: '0.8rem' }}>Loading sources...</span>
                </div>
              ) : (
                <>
                  <select
                    className='form-select form-select-sm mb-2'
                    style={{ fontSize: '0.8rem' }}
                    value={selectedSourceId}
                    onChange={(e) => setSelectedSourceId(e.target.value)}
                  >
                    <option value=''>-- Select a source --</option>
                    {sources.map((source) => (
                      <option key={source.id} value={source.id}>
                        {source.name || source.title || source.id}
                      </option>
                    ))}
                  </select>
                  <div className='d-flex gap-2'>
                    <button
                      className='btn btn-sm btn-outline-secondary'
                      onClick={handleLoadSources}
                      disabled={loadingSources}
                    >
                      Refresh Sources
                    </button>
                    <button
                      className='btn btn-sm btn-primary d-flex align-items-center gap-1'
                      onClick={handleSaveSelection}
                      disabled={saving || !selectedSourceId}
                    >
                      {saving && <Spinner size='sm' />}
                      <span>{saving ? 'Saving...' : 'Save Selection'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Info */}
            <div className='p-3 rounded' style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <p className='mb-0' style={{ fontSize: '0.8rem', color: '#64748b' }}>
                After saving, Shopify will send new events directly to your CRM via webhook.
                Use Field Mapping to map Shopify fields to your CRM fields.
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

export default ShopifyConfigForm;
