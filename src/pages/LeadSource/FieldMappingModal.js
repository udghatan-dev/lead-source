import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Spinner,
  Alert,
} from 'reactstrap';
import { BiLink, BiUnlink } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';
import { FiSearch } from 'react-icons/fi';
import { getCrmFields, getFieldMappings, upsertFieldMappings } from '../../helpers/backend_helper';

const FieldMappingModal = ({ isOpen, toggle, connection, formFields }) => {
  const [crmFields, setCrmFields] = useState([]);
  const [loadingCrm, setLoadingCrm] = useState(false);
  const [loadingMappings, setLoadingMappings] = useState(false);
  const [crmSearch, setCrmSearch] = useState('');
  const [crmPage, setCrmPage] = useState(1);
  const [crmPagination, setCrmPagination] = useState({ total: 0, totalPages: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Mapping state: { crmFieldId: formFieldKey }
  const [mappings, setMappings] = useState({});
  // Store full mapping data for building save payload
  const [mappingDetails, setMappingDetails] = useState({});

  const connectionId = connection?._id || connection?.id;

  const fetchCrmFields = useCallback((page = 1, search = '') => {
    setLoadingCrm(true);
    getCrmFields({ limit: 20, page, search })
      .then((res) => {
        setCrmFields(res.data || []);
        setCrmPagination(res.pagination || { total: 0, totalPages: 0 });
      })
      .catch((err) => {
        console.error('Failed to fetch CRM fields:', err);
        setCrmFields([]);
        setError('Failed to load CRM fields');
      })
      .finally(() => setLoadingCrm(false));
  }, []);

  // Fetch CRM fields and existing mappings on open
  useEffect(() => {
    if (isOpen && connectionId) {
      setError('');
      setCrmSearch('');
      setCrmPage(1);
      fetchCrmFields(1, '');

      // Fetch existing mappings from API
      setLoadingMappings(true);
      getFieldMappings(connectionId)
        .then((res) => {
          const existingMappings = res.data?.mappings || res.mappings || [];
          const mapState = {};
          const detailState = {};
          existingMappings.forEach((m) => {
            const key = m.crmFieldId || m.crmFieldKey;
            mapState[key] = m.formFieldKey || m.formFieldId;
            detailState[key] = m;
          });
          setMappings(mapState);
          setMappingDetails(detailState);
        })
        .catch((err) => {
          console.error('Failed to fetch field mappings:', err);
          setMappings({});
          setMappingDetails({});
        })
        .finally(() => setLoadingMappings(false));
    } else {
      setCrmFields([]);
      setMappings({});
      setMappingDetails({});
      setError('');
    }
  }, [isOpen, connectionId, fetchCrmFields]);

  const handleCrmSearch = (value) => {
    setCrmSearch(value);
    setCrmPage(1);
    fetchCrmFields(1, value);
  };

  const handleCrmPageChange = (newPage) => {
    setCrmPage(newPage);
    fetchCrmFields(newPage, crmSearch);
  };

  const handleMapField = (crmFieldId, formFieldKey) => {
    setMappings((prev) => {
      const updated = { ...prev };
      if (!formFieldKey) {
        delete updated[crmFieldId];
      } else {
        updated[crmFieldId] = formFieldKey;
      }
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const mappingsPayload = Object.entries(mappings).map(([crmFieldId, formFieldKey]) => {
        const crmField = crmFields.find((f) => (f._id || f.id || f.key) === crmFieldId);
        const formField = (formFields || []).find(
          (f) => (f.key || f.id || f.name) === formFieldKey,
        );
        return {
          crmFieldId,
          crmFieldName: crmField?.name || crmField?.label || mappingDetails[crmFieldId]?.crmFieldName || crmFieldId,
          crmFieldKey: crmField?.key || mappingDetails[crmFieldId]?.crmFieldKey || crmFieldId,
          crmSlug: crmField?.slug || mappingDetails[crmFieldId]?.crmSlug || crmFieldId,
          formFieldKey,
          formFieldName: formField?.name || formField?.label || mappingDetails[crmFieldId]?.formFieldName || formFieldKey,
        };
      });

      await upsertFieldMappings({
        connectionId,
        mappings: mappingsPayload,
      });

      toggle();
    } catch (err) {
      console.error('Failed to save mappings:', err);
      setError('Failed to save mappings');
    } finally {
      setSaving(false);
    }
  };

  const mappedCount = Object.keys(mappings).length;
  const availableFormFields = formFields || [];

  const isLoading = loadingCrm || loadingMappings;

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size='md'>
      <ModalHeader toggle={toggle}>
        <div className='d-flex align-items-center gap-2'>
          <BiLink style={{ fontSize: '1.2rem' }} />
          <span>Field Mapping</span>
          {mappedCount > 0 && (
            <span
              className='badge'
              style={{ backgroundColor: '#3b82f6', color: '#fff', fontSize: '0.7rem' }}
            >
              {mappedCount} mapped
            </span>
          )}
        </div>
      </ModalHeader>
      <ModalBody>
        {error && (
          <Alert color='danger' className='mb-3' style={{ fontSize: '0.85rem' }}>
            {error}
          </Alert>
        )}

        {/* CRM Search */}
        <div className='position-relative mb-3'>
          <FiSearch
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              fontSize: '0.85rem',
            }}
          />
          <input
            type='text'
            className='form-control form-control-sm'
            style={{ fontSize: '0.83rem', paddingLeft: '30px' }}
            placeholder='Search CRM fields...'
            value={crmSearch}
            onChange={(e) => handleCrmSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className='text-center py-5'>
            <Spinner color='primary' />
            <p className='text-muted mt-2' style={{ fontSize: '0.85rem' }}>Loading...</p>
          </div>
        ) : crmFields.length === 0 ? (
          <p className='text-muted text-center py-4' style={{ fontSize: '0.85rem' }}>
            No CRM fields found
          </p>
        ) : (
          <>
            {/* Mapping Table */}
            <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
              <table className='table table-sm align-middle mb-0'>
                <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
                  <tr style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    <th style={{ fontWeight: 600, width: '42%' }}>CRM Field</th>
                    <th style={{ fontWeight: 600, width: '8%', textAlign: 'center' }}></th>
                    <th style={{ fontWeight: 600, width: '50%' }}>Form Field</th>
                  </tr>
                </thead>
                <tbody>
                  {crmFields.map((crmField) => {
                    const crmId = crmField._id || crmField.id || crmField.key;
                    const mappedFormKey = mappings[crmId] || '';

                    return (
                      <tr key={crmId} style={{ fontSize: '0.83rem' }}>
                        <td>
                          <div className='fw-medium'>{crmField.name || crmField.label}</div>
                          {crmField.type && (
                            <span className='text-muted' style={{ fontSize: '0.7rem' }}>
                              {crmField.type}
                            </span>
                          )}
                        </td>
                        <td className='text-center'>
                          {mappedFormKey ? (
                            <BiLink style={{ color: '#22c55e', fontSize: '1.1rem' }} />
                          ) : (
                            <BiUnlink style={{ color: '#e2e8f0', fontSize: '1.1rem' }} />
                          )}
                        </td>
                        <td>
                          <div className='d-flex align-items-center gap-1'>
                            <Input
                              type='select'
                              bsSize='sm'
                              value={mappedFormKey}
                              onChange={(e) => handleMapField(crmId, e.target.value)}
                              style={{ fontSize: '0.8rem' }}
                            >
                              <option value=''>-- Not mapped --</option>
                              {availableFormFields.map((ff) => {
                                const ffKey = ff.key || ff.id || ff.name;
                                return (
                                  <option key={ffKey} value={ffKey}>
                                    {ff.name || ff.label}
                                  </option>
                                );
                              })}
                            </Input>
                            {mappedFormKey && (
                              <IoMdClose
                                style={{ color: '#94a3b8', cursor: 'pointer', fontSize: '1rem', flexShrink: 0 }}
                                onClick={() => handleMapField(crmId, '')}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* CRM Pagination */}
            {crmPagination.totalPages > 1 && (
              <div className='d-flex justify-content-center gap-2 mt-3 pt-2 border-top'>
                <button
                  className='btn btn-sm btn-outline-secondary py-0 px-2'
                  style={{ fontSize: '0.78rem' }}
                  disabled={crmPage === 1}
                  onClick={() => handleCrmPageChange(crmPage - 1)}
                >
                  Prev
                </button>
                <span className='text-muted align-self-center' style={{ fontSize: '0.78rem' }}>
                  Page {crmPage} of {crmPagination.totalPages}
                </span>
                <button
                  className='btn btn-sm btn-outline-secondary py-0 px-2'
                  style={{ fontSize: '0.78rem' }}
                  disabled={crmPage === crmPagination.totalPages}
                  onClick={() => handleCrmPageChange(crmPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <button className='btn btn-sm btn-soft-danger' onClick={toggle}>
          Cancel
        </button>
        <button
          className='btn btn-sm btn-primary d-flex align-items-center gap-1'
          onClick={handleSave}
          disabled={saving || mappedCount === 0}
        >
          {saving ? <Spinner size='sm' /> : <BiLink />}
          <span>{saving ? 'Saving...' : `Save Mappings (${mappedCount})`}</span>
        </button>
      </ModalFooter>
    </Modal>
  );
};

FieldMappingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  connection: PropTypes.object,
  formFields: PropTypes.array,
};

export default FieldMappingModal;
