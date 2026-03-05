import React, { useState, useEffect, useRef } from 'react';
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
import { IoMdAdd, IoMdClose } from 'react-icons/io';
import { FiSearch } from 'react-icons/fi';
import { getFacebookPages, getFacebookForms, getWebhooks, deleteWebhook } from '../../helpers/backend_helper';

// Searchable dropdown component
const SearchableSelect = ({ items, value, onChange, placeholder, disabled, nameKey = 'name', idKey = 'id' }) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Reset search when value changes externally
  useEffect(() => {
    if (!value) setSearch('');
  }, [value]);

  const filtered = items.filter((item) =>
    (item[nameKey] || '').toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (item) => {
    onChange(item);
    setSearch('');
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
    setSearch('');
  };

  if (disabled && items.length === 0) {
    return (
      <div
        className='form-control text-muted'
        style={{ fontSize: '0.85rem', backgroundColor: '#f8fafc', cursor: 'not-allowed' }}
      >
        {placeholder || 'No items available'}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      {/* Selected value display or search input */}
      {value && !isOpen ? (
        <div
          className='form-control d-flex align-items-center justify-content-between'
          style={{ fontSize: '0.85rem', cursor: 'pointer' }}
          onClick={() => setIsOpen(true)}
        >
          <span>{value[nameKey]}</span>
          <IoMdClose
            style={{ fontSize: '1rem', color: '#94a3b8', cursor: 'pointer' }}
            onClick={handleClear}
          />
        </div>
      ) : (
        <div className='position-relative'>
          <FiSearch
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              fontSize: '0.9rem',
            }}
          />
          <input
            type='text'
            className='form-control'
            style={{ fontSize: '0.85rem', paddingLeft: '32px' }}
            placeholder={placeholder || 'Search...'}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            autoFocus={isOpen}
          />
        </div>
      )}

      {/* Dropdown list */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1050,
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: '#fff',
            border: '1px solid #dee2e6',
            borderRadius: '0 0 6px 6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          {filtered.length === 0 ? (
            <div className='px-3 py-2 text-muted' style={{ fontSize: '0.83rem' }}>
              No results found
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item[idKey]}
                className='px-3 py-2'
                style={{
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  backgroundColor: value && value[idKey] === item[idKey] ? '#eff6ff' : 'transparent',
                  borderBottom: '1px solid #f1f5f9',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f9ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    value && value[idKey] === item[idKey] ? '#eff6ff' : 'transparent';
                }}
                onClick={() => handleSelect(item)}
              >
                {item[nameKey]}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

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

  const handlePageSelect = (page) => {
    if (!page) {
      setSelectedPage(null);
      setForms([]);
      setSelectedForm(null);
      return;
    }
    setSelectedPage(page);
  };

  const handleFormSelect = (form) => {
    setSelectedForm(form || null);
  };

  const handleAddWebhook = () => {
    const url = newWebhookUrl.trim();
    if (!url) return;
    const exists = webhooks.some((w) => (w.url || w) === url);
    if (exists) return;
    setWebhooks((prev) => [...prev, { url, _isNew: true }]);
    setNewWebhookUrl('');
  };

  const handleDeleteWebhook = async (webhook, index) => {
    if (webhook._isNew) {
      setWebhooks((prev) => prev.filter((_, i) => i !== index));
      return;
    }

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
            <SearchableSelect
              items={pages}
              value={selectedPage}
              onChange={handlePageSelect}
              placeholder='Search pages...'
              disabled={pages.length === 0}
            />
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
            <SearchableSelect
              items={forms}
              value={selectedForm}
              onChange={handleFormSelect}
              placeholder='Search forms...'
              disabled={forms.length === 0}
            />
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
