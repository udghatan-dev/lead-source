import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Spinner,
  Alert,
} from 'reactstrap';
import { BsGearWideConnected } from 'react-icons/bs';
import { FaMeta } from 'react-icons/fa6';
import { MdOutlineWebhook } from 'react-icons/md';
import { FaTrashCan } from 'react-icons/fa6';
import { IoMdAdd } from 'react-icons/io';
import { getFacebookPages, getFacebookForms, getWebhooks, deleteWebhook } from '../../helpers/backend_helper';

const ConfigureModal = ({ isOpen, toggle, connection, onSave }) => {
  const [pages, setPages] = useState([]);
  const [forms, setForms] = useState([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [loadingForms, setLoadingForms] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [selectedPage, setSelectedPage] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);

  // Webhook state
  const [webhooks, setWebhooks] = useState([]);
  const [loadingWebhooks, setLoadingWebhooks] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [deletingWebhookId, setDeletingWebhookId] = useState(null);

  // Fetch pages and webhooks when modal opens
  useEffect(() => {
    if (isOpen && connection) {
      setError('');
      setLoadingPages(true);
      getFacebookPages()
        .then((res) => {
          const pageList = res.data || res || [];
          setPages(pageList);

          // Pre-select page if connection already has one configured
          if (connection?.configuration?.pageId) {
            const existing = pageList.find(
              (p) => p.id === connection.configuration.pageId,
            );
            if (existing) {
              setSelectedPage(existing);
            }
          }
        })
        .catch((err) => {
          console.error('Failed to fetch pages:', err);
          setError('Failed to load Facebook pages');
          setPages([]);
        })
        .finally(() => setLoadingPages(false));

      // Fetch webhooks
      fetchWebhooks();
    } else {
      // Reset state when modal closes
      setPages([]);
      setForms([]);
      setSelectedPage(null);
      setSelectedForm(null);
      setWebhooks([]);
      setNewWebhookUrl('');
      setError('');
    }
  }, [isOpen, connection]);

  const fetchWebhooks = () => {
    const id = connection?._id || connection?.id;
    if (!id) return;
    setLoadingWebhooks(true);
    getWebhooks(id)
      .then((res) => {
        setWebhooks(res.data || res || []);
      })
      .catch((err) => {
        console.error('Failed to fetch webhooks:', err);
        setWebhooks([]);
      })
      .finally(() => setLoadingWebhooks(false));
  };

  // Fetch forms when a page is selected
  useEffect(() => {
    if (selectedPage) {
      setLoadingForms(true);
      setSelectedForm(null);
      setForms([]);
      getFacebookForms({
        pageId: selectedPage.id,
        pageAccessToken: selectedPage.accessToken || selectedPage.access_token,
      })
        .then((res) => {
          const formList = res?.leadForms || res || [];
          setForms(formList);

          // Pre-select form if connection already has one configured
          if (connection?.configuration?.formId) {
            const existing = formList.find(
              (f) => f.id === connection.configuration.formId,
            );
            if (existing) {
              setSelectedForm(existing);
            }
          }
        })
        .catch((err) => {
          console.error('Failed to fetch forms:', err);
          setError('Failed to load forms for this page');
          setForms([]);
        })
        .finally(() => setLoadingForms(false));
    }
  }, [selectedPage]);

  const handlePageChange = (e) => {
    const pageId = e.target.value;
    if (!pageId) {
      setSelectedPage(null);
      setForms([]);
      setSelectedForm(null);
      return;
    }
    const page = pages.find((p) => p.id === pageId);
    setSelectedPage(page);
  };

  const handleFormChange = (e) => {
    const formId = e.target.value;
    if (!formId) {
      setSelectedForm(null);
      return;
    }
    const form = forms.find((f) => f.id === formId);
    setSelectedForm(form);
  };

  const handleAddWebhook = () => {
    const url = newWebhookUrl.trim();
    if (!url) return;
    // Avoid duplicates
    const exists = webhooks.some((w) => (w.url || w) === url);
    if (exists) return;
    setWebhooks((prev) => [...prev, { url, _isNew: true }]);
    setNewWebhookUrl('');
  };

  const handleDeleteWebhook = async (webhook, index) => {
    // If it's a new (unsaved) webhook, just remove from local state
    if (webhook._isNew) {
      setWebhooks((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    // For existing webhooks, call delete API
    const webhookId = webhook._id || webhook.id;
    if (!webhookId) return;

    setDeletingWebhookId(webhookId);
    try {
      await deleteWebhook(webhookId);
      setWebhooks((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Failed to delete webhook:', err);
      setError('Failed to delete webhook');
    } finally {
      setDeletingWebhookId(null);
    }
  };

  const handleSave = async () => {
    if (!selectedPage || !selectedForm) return;

    setSaving(true);
    try {
      const webhookUrls = webhooks.map((w) => w.url || w);
      await onSave(connection._id || connection.id, {
        _id: connection._id || connection.id,
        pageId: selectedPage.id,
        pageName: selectedPage.name,
        pageAccessToken: selectedPage.accessToken || selectedPage.access_token,
        formId: selectedForm.id,
        formName: selectedForm.name,
        webhookUrls,
      });
    } finally {
      setSaving(false);
    }
  };

  if (!connection) return null;

  const config = connection?.configuration || {};

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size='lg'>
      <ModalHeader toggle={toggle}>
        <div className='d-flex align-items-center gap-2'>
          <BsGearWideConnected />
          <span>Configure Connection</span>
        </div>
      </ModalHeader>
      <ModalBody>
        {error && (
          <Alert color='danger' className='mb-3' style={{ fontSize: '0.85rem' }}>
            {error}
          </Alert>
        )}

        {/* Current Configuration Info */}
        {config.pageName && (
          <div
            className='p-3 rounded mb-3'
            style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}
          >
            <p className='mb-1 fw-medium' style={{ fontSize: '0.85rem', color: '#0369a1' }}>
              <FaMeta className='me-1' style={{ color: '#1877F2' }} />
              Current Configuration
            </p>
            <div className='d-flex gap-3 mt-2' style={{ fontSize: '0.8rem' }}>
              <div>
                <span className='text-muted'>Page:</span>{' '}
                <strong>{config.pageName}</strong>
              </div>
              <div>
                <span className='text-muted'>Form:</span>{' '}
                <strong>{config.formName || '-'}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Page Selection */}
        <FormGroup className='mb-3'>
          <Label className='fw-medium'>
            Facebook Page
            {loadingPages && <Spinner size='sm' className='ms-2' />}
          </Label>
          {loadingPages ? (
            <div className='text-center py-2'>
              <Spinner size='sm' color='primary' />
              <span className='text-muted ms-2' style={{ fontSize: '0.85rem' }}>
                Loading pages...
              </span>
            </div>
          ) : (
            <Input
              type='select'
              value={selectedPage?.id || ''}
              onChange={handlePageChange}
              disabled={pages.length === 0}
            >
              <option value=''>
                {pages.length === 0 ? 'No pages available' : '-- Select a page --'}
              </option>
              {pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.name}
                </option>
              ))}
            </Input>
          )}
        </FormGroup>

        {/* Form Selection */}
        <FormGroup className='mb-3'>
          <Label className='fw-medium'>
            Lead Form
            {loadingForms && <Spinner size='sm' className='ms-2' />}
          </Label>
          {!selectedPage ? (
            <p className='text-muted mb-0' style={{ fontSize: '0.8rem' }}>
              Select a page first to load forms
            </p>
          ) : loadingForms ? (
            <div className='text-center py-2'>
              <Spinner size='sm' color='primary' />
              <span className='text-muted ms-2' style={{ fontSize: '0.85rem' }}>
                Loading forms...
              </span>
            </div>
          ) : (
            <Input
              type='select'
              value={selectedForm?.id || ''}
              onChange={handleFormChange}
              disabled={forms.length === 0}
            >
              <option value=''>
                {forms.length === 0 ? 'No forms available' : '-- Select a form --'}
              </option>
              {forms.map((form) => (
                <option key={form.id} value={form.id}>
                  {form.name}
                </option>
              ))}
            </Input>
          )}
        </FormGroup>

        {/* Webhook URLs Section */}
        <div className='mb-3'>
          <Label className='fw-medium d-flex align-items-center gap-1'>
            <MdOutlineWebhook />
            Webhook URLs
            <span className='text-muted fw-normal' style={{ fontSize: '0.75rem' }}>(Optional)</span>
          </Label>

          {loadingWebhooks ? (
            <div className='text-center py-2'>
              <Spinner size='sm' color='primary' />
              <span className='text-muted ms-2' style={{ fontSize: '0.85rem' }}>
                Loading webhooks...
              </span>
            </div>
          ) : (
            <>
              {/* Existing webhook list */}
              {webhooks.length > 0 && (
                <div className='mb-2'>
                  {webhooks.map((webhook, index) => {
                    const webhookUrl = webhook.url || webhook;
                    const webhookId = webhook._id || webhook.id;
                    const isDeleting = deletingWebhookId === webhookId;

                    return (
                      <div
                        key={webhookId || index}
                        className='d-flex align-items-center gap-2 mb-2 p-2 rounded'
                        style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                      >
                        <MdOutlineWebhook className='text-muted flex-shrink-0' />
                        <span
                          className='flex-grow-1 text-truncate'
                          style={{ fontSize: '0.83rem' }}
                          title={webhookUrl}
                        >
                          {webhookUrl}
                        </span>
                        {webhook._isNew && (
                          <span
                            className='badge'
                            style={{
                              backgroundColor: '#dbeafe',
                              color: '#2563eb',
                              fontSize: '0.65rem',
                            }}
                          >
                            New
                          </span>
                        )}
                        <button
                          className='btn btn-sm p-1 d-flex align-items-center'
                          style={{
                            backgroundColor: '#fee2e2',
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                            borderRadius: '4px',
                          }}
                          onClick={() => handleDeleteWebhook(webhook, index)}
                          disabled={isDeleting}
                          title='Delete webhook'
                        >
                          {isDeleting ? (
                            <Spinner size='sm' style={{ width: '14px', height: '14px' }} />
                          ) : (
                            <FaTrashCan style={{ fontSize: '0.75rem' }} />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {webhooks.length === 0 && (
                <p className='text-muted mb-2' style={{ fontSize: '0.8rem' }}>
                  No webhook URLs configured
                </p>
              )}

              {/* Add new webhook */}
              <div className='d-flex gap-2'>
                <Input
                  type='text'
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  placeholder='https://your-webhook-url.com/endpoint'
                  style={{ fontSize: '0.85rem' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddWebhook();
                    }
                  }}
                />
                <button
                  className='btn btn-sm btn-soft-primary d-flex align-items-center gap-1 flex-shrink-0'
                  onClick={handleAddWebhook}
                  disabled={!newWebhookUrl.trim()}
                >
                  <IoMdAdd />
                  <span>Add</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Selected Summary */}
        {selectedPage && selectedForm && (
          <div
            className='p-3 rounded'
            style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}
          >
            <p className='mb-1 fw-medium' style={{ fontSize: '0.85rem', color: '#15803d' }}>
              Updated Configuration
            </p>
            <div style={{ fontSize: '0.8rem' }}>
              <div className='mb-1'>
                <span className='text-muted'>Page:</span>{' '}
                <strong>{selectedPage.name}</strong>
              </div>
              <div className='mb-1'>
                <span className='text-muted'>Form:</span>{' '}
                <strong>{selectedForm.name}</strong>
              </div>
              {webhooks.length > 0 && (
                <div>
                  <span className='text-muted'>Webhooks:</span>{' '}
                  <strong>{webhooks.length}</strong>
                </div>
              )}
            </div>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <button className='btn btn-sm btn-soft-danger' onClick={toggle}>
          Cancel
        </button>
        <button
          className='btn btn-sm btn-primary d-flex align-items-center gap-1'
          onClick={handleSave}
          disabled={!selectedPage || !selectedForm || saving}
        >
          {saving ? <Spinner size='sm' /> : <BsGearWideConnected />}
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </ModalFooter>
    </Modal>
  );
};

ConfigureModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  connection: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default ConfigureModal;
