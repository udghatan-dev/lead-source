import { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Container,
  Input,
  Spinner,
  Alert,
} from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import MetaTag from '../../Components/Common/Meta';
import { MdOutlineWebhook } from 'react-icons/md';
import { IoMdAdd } from 'react-icons/io';
import { FaTrashCan } from 'react-icons/fa6';
import { FiEdit2 } from 'react-icons/fi';
import { IoArrowBack } from 'react-icons/io5';
import { getWebhooks, deleteWebhook } from '../../helpers/backend_helper';

const WebhookPage = () => {
  const { id } = useParams();
  const history = useHistory();

  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editUrl, setEditUrl] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchWebhooks = useCallback(() => {
    if (!id) return;
    setLoading(true);
    getWebhooks(id)
      .then((res) => {
        setWebhooks(res.data || res || []);
      })
      .catch((err) => {
        console.error('Failed to fetch webhooks:', err);
        setWebhooks([]);
        setError('Failed to load webhooks');
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchWebhooks();
  }, [fetchWebhooks]);

  const handleAdd = () => {
    const url = newUrl.trim();
    if (!url) return;
    const exists = webhooks.some((w) => (w.url || w) === url);
    if (exists) {
      setError('This webhook URL already exists');
      return;
    }
    setWebhooks((prev) => [...prev, { url, _isNew: true }]);
    setNewUrl('');
    setError('');
  };

  const handleDelete = async (webhook, index) => {
    if (webhook._isNew) {
      setWebhooks((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    const webhookId = webhook._id || webhook.id;
    if (!webhookId) return;

    setDeletingId(webhookId);
    try {
      await deleteWebhook(webhookId);
      setWebhooks((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Failed to delete webhook:', err);
      setError('Failed to delete webhook');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditStart = (webhook) => {
    setEditingId(webhook._id || webhook.id);
    setEditUrl(webhook.url || webhook);
  };

  const handleEditSave = (index) => {
    const url = editUrl.trim();
    if (!url) return;
    setWebhooks((prev) =>
      prev.map((w, i) => (i === index ? { ...w, url, _isUpdated: true } : w)),
    );
    setEditingId(null);
    setEditUrl('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditUrl('');
  };

  return (
    <div className='page-content'>
      <MetaTag pageTitle='Webhooks' />
      <Container fluid>
        <BreadCrumb title='Webhooks' pageTitle='Lead Source' />

        {/* Back button */}
        <button
          className='btn btn-sm btn-soft-dark d-flex align-items-center gap-1 mb-3'
          onClick={() => history.push('/settings')}
        >
          <IoArrowBack />
          <span>Back to Connections</span>
        </button>

        {/* Header */}
        <div className='d-flex align-items-center justify-content-between mb-4'>
          <div className='d-flex align-items-center gap-2'>
            <MdOutlineWebhook style={{ fontSize: '1.5rem', color: '#3b82f6' }} />
            <h5 className='mb-0'>Webhook URLs</h5>
          </div>
        </div>

        {error && (
          <Alert color='danger' className='mb-3' style={{ fontSize: '0.85rem' }} toggle={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Add new webhook */}
        <div
          className='p-3 rounded mb-4'
          style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
        >
          <label className='fw-medium mb-2 d-block' style={{ fontSize: '0.85rem' }}>
            Add New Webhook
          </label>
          <div className='d-flex gap-2'>
            <Input
              type='text'
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder='https://your-webhook-url.com/endpoint'
              style={{ fontSize: '0.85rem' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
            <button
              className='btn btn-primary d-flex align-items-center gap-1 flex-shrink-0'
              onClick={handleAdd}
              disabled={!newUrl.trim()}
            >
              <IoMdAdd />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Webhook list */}
        {loading ? (
          <div className='text-center py-5'>
            <Spinner color='primary' />
            <p className='text-muted mt-2'>Loading webhooks...</p>
          </div>
        ) : webhooks.length === 0 ? (
          <div className='text-center py-5'>
            <MdOutlineWebhook style={{ fontSize: '3rem', color: '#cbd5e1' }} />
            <p className='text-muted mt-2'>No webhooks configured yet</p>
          </div>
        ) : (
          <div>
            {webhooks.map((webhook, index) => {
              const webhookUrl = webhook.url || webhook;
              const webhookId = webhook._id || webhook.id;
              const isDeleting = deletingId === webhookId;
              const isEditing = editingId === webhookId;

              return (
                <div
                  key={webhookId || index}
                  className='d-flex align-items-center gap-3 p-3 mb-2 rounded'
                  style={{
                    backgroundColor: '#fff',
                    border: `1px solid ${webhook._isNew ? '#bbf7d0' : webhook._isUpdated ? '#bae6fd' : '#e2e8f0'}`,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  }}
                >
                  <MdOutlineWebhook
                    className='flex-shrink-0'
                    style={{ fontSize: '1.2rem', color: '#64748b' }}
                  />

                  <div className='flex-grow-1'>
                    {isEditing ? (
                      <div className='d-flex gap-2'>
                        <Input
                          type='text'
                          bsSize='sm'
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          style={{ fontSize: '0.85rem' }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditSave(index);
                            if (e.key === 'Escape') handleEditCancel();
                          }}
                          autoFocus
                        />
                        <button
                          className='btn btn-sm btn-primary flex-shrink-0'
                          onClick={() => handleEditSave(index)}
                        >
                          Save
                        </button>
                        <button
                          className='btn btn-sm btn-soft-dark flex-shrink-0'
                          onClick={handleEditCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className='d-flex align-items-center gap-2'>
                        <span style={{ fontSize: '0.9rem', wordBreak: 'break-all' }}>
                          {webhookUrl}
                        </span>
                        {webhook._isNew && (
                          <span
                            className='badge flex-shrink-0'
                            style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '0.65rem' }}
                          >
                            New
                          </span>
                        )}
                        {webhook._isUpdated && (
                          <span
                            className='badge flex-shrink-0'
                            style={{ backgroundColor: '#dbeafe', color: '#2563eb', fontSize: '0.65rem' }}
                          >
                            Updated
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <div className='d-flex gap-1 flex-shrink-0'>
                      <button
                        className='btn btn-sm p-1 d-flex align-items-center'
                        style={{
                          backgroundColor: '#f0f9ff',
                          border: '1px solid #bae6fd',
                          color: '#0369a1',
                          borderRadius: '4px',
                        }}
                        onClick={() => handleEditStart(webhook)}
                        title='Edit webhook'
                      >
                        <FiEdit2 style={{ fontSize: '0.8rem' }} />
                      </button>
                      <button
                        className='btn btn-sm p-1 d-flex align-items-center'
                        style={{
                          backgroundColor: '#fee2e2',
                          border: '1px solid #fecaca',
                          color: '#dc2626',
                          borderRadius: '4px',
                        }}
                        onClick={() => handleDelete(webhook, index)}
                        disabled={isDeleting}
                        title='Delete webhook'
                      >
                        {isDeleting ? (
                          <Spinner size='sm' style={{ width: '14px', height: '14px' }} />
                        ) : (
                          <FaTrashCan style={{ fontSize: '0.8rem' }} />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
};

export default WebhookPage;
