import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Spinner,
  Badge,
} from 'reactstrap';
import { FiFileText } from 'react-icons/fi';
import { getWebhookLogs } from '../../helpers/backend_helper';

const LogsModal = ({ isOpen, toggle, connection }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0,
  });

  const fetchLogs = useCallback(
    (pageNum = 1) => {
      if (!connection) return;
      setLoading(true);
      getWebhookLogs({ page: pageNum, limit: 5, connectionId: connection._id })
        .then((res) => {
          setLogs(res.data || []);
          setPagination(
            res.pagination || { total: 0, page: pageNum, limit: 5, totalPages: 0 },
          );
        })
        .catch((err) => {
          console.error('Failed to fetch logs:', err);
          setLogs([]);
        })
        .finally(() => setLoading(false));
    },
    [connection],
  );

  useEffect(() => {
    if (isOpen && connection) {
      setPage(1);
      fetchLogs(1);
    } else {
      setLogs([]);
      setPage(1);
      setPagination({ total: 0, page: 1, limit: 5, totalPages: 0 });
    }
  }, [isOpen, connection]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchLogs(newPage);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      success: { color: '#22c55e', label: 'Success' },
      forwarded: { color: '#3b82f6', label: 'Forwarded' },
      failed: { color: '#ef4444', label: 'Failed' },
      error: { color: '#ef4444', label: 'Error' },
      pending: { color: '#f59e0b', label: 'Pending' },
      delivered: { color: '#10b981', label: 'Delivered' },
      received: { color: '#8b5cf6', label: 'Received' },
    };
    const s = statusMap[status?.toLowerCase()] || { color: '#94a3b8', label: status || 'Unknown' };
    return (
      <span
        className='badge'
        style={{ backgroundColor: s.color, color: '#fff', fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
      >
        {s.label}
      </span>
    );
  };

  const getSourceBadge = (source) => {
    const map = {
      facebook: { color: '#1877F2', label: 'Facebook' },
      google: { color: '#ea4335', label: 'Google' },
      linkedin: { color: '#0a66c2', label: 'LinkedIn' },
      webhook: { color: '#6366f1', label: 'Webhook' },
    };
    const s = map[source?.toLowerCase()] || { color: '#64748b', label: source || '-' };
    return (
      <span
        className='badge'
        style={{ backgroundColor: s.color, color: '#fff', fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}
      >
        {s.label}
      </span>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  if (!connection) return null;

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size='lg'>
      <ModalHeader toggle={toggle}>
        <div className='d-flex align-items-center gap-2'>
          <FiFileText />
          <span>Webhook Logs</span>
          <span className='text-muted' style={{ fontSize: '0.8rem', fontWeight: 400 }}>
            {connection?.configuration?.pageName || connection.source}
          </span>
          <span className='text-muted' style={{ fontSize: '0.8rem', fontWeight: 400 }}>
            {connection?.configuration?.formName || connection.source}
          </span>
        </div>
      </ModalHeader>
      <ModalBody>
        {loading ? (
          <div className='text-center py-5'>
            <Spinner color='primary' />
            <p className='text-muted mt-2' style={{ fontSize: '0.85rem' }}>Loading logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className='text-center py-5'>
            <FiFileText style={{ fontSize: '2.5rem', color: '#cbd5e1' }} />
            <p className='text-muted mt-2'>No logs found</p>
          </div>
        ) : (
          <>
            <div className='table-responsive'>
              <table className='table table-sm table-hover align-middle mb-0'>
                <thead>
                  <tr style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    <th style={{ fontWeight: 600 }}>#</th>
                    <th style={{ fontWeight: 600 }}>Source</th>
                    <th style={{ fontWeight: 600 }}>Status</th>
                    <th style={{ fontWeight: 600 }}>Leadgen ID</th>
                    <th style={{ fontWeight: 600 }}>Payload</th>
                    <th style={{ fontWeight: 600 }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr key={log._id || index} style={{ fontSize: '0.83rem' }}>
                      <td className='text-muted'>
                        {(page - 1) * pagination.limit + index + 1}
                      </td>
                      <td>{getSourceBadge(log.source)}</td>
                      <td>{getStatusBadge(log.status)}</td>
                      <td
                        className='text-truncate'
                        style={{ maxWidth: '150px', fontSize: '0.78rem' }}
                        title={log.leadgenId}
                      >
                        {log.leadgenId || '-'}
                      </td>
                      <td className='text-muted truncate-3-lines' style={{ fontSize: '0.78rem' }}>
                        {(log?.lead?.fieldData && JSON.stringify(log.lead.fieldData)) || '-'}
                      </td>
                      <td className='text-muted' style={{ whiteSpace: 'nowrap', fontSize: '0.78rem' }}>
                        {formatDate(log.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className='d-flex justify-content-between align-items-center mt-3 pt-2 border-top'>
                <span className='text-muted' style={{ fontSize: '0.8rem' }}>
                  Showing {(page - 1) * pagination.limit + 1} -{' '}
                  {Math.min(page * pagination.limit, pagination.total)} of {pagination.total}
                </span>
                <ul className='pagination pagination-sm mb-0'>
                  <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button className='page-link' onClick={() => handlePageChange(1)}>
                      <i className='ri-skip-back-mini-line'></i>
                    </button>
                  </li>
                  <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button className='page-link' onClick={() => handlePageChange(page - 1)}>
                      <i className='ri-arrow-left-s-line'></i>
                    </button>
                  </li>
                  {(() => {
                    const items = [];
                    const maxVisible = 5;
                    let start = Math.max(1, page - Math.floor(maxVisible / 2));
                    let end = Math.min(pagination.totalPages, start + maxVisible - 1);
                    if (end - start + 1 < maxVisible) {
                      start = Math.max(1, end - maxVisible + 1);
                    }
                    if (start > 1) {
                      items.push(
                        <li key='s-dots' className='page-item disabled'>
                          <span className='page-link'>...</span>
                        </li>,
                      );
                    }
                    for (let i = start; i <= end; i++) {
                      items.push(
                        <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
                          <button className='page-link' onClick={() => handlePageChange(i)}>
                            {i}
                          </button>
                        </li>,
                      );
                    }
                    if (end < pagination.totalPages) {
                      items.push(
                        <li key='e-dots' className='page-item disabled'>
                          <span className='page-link'>...</span>
                        </li>,
                      );
                    }
                    return items;
                  })()}
                  <li className={`page-item ${page === pagination.totalPages ? 'disabled' : ''}`}>
                    <button className='page-link' onClick={() => handlePageChange(page + 1)}>
                      <i className='ri-arrow-right-s-line'></i>
                    </button>
                  </li>
                  <li className={`page-item ${page === pagination.totalPages ? 'disabled' : ''}`}>
                    <button className='page-link' onClick={() => handlePageChange(pagination.totalPages)}>
                      <i className='ri-skip-forward-mini-line'></i>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </>
        )}
      </ModalBody>
    </Modal>
  );
};

LogsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  connection: PropTypes.object,
};

export default LogsModal;
