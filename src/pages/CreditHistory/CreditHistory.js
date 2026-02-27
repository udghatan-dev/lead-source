import React, { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardHeader, Spinner, Table } from 'reactstrap';
import MetaTag from '../../Components/Common/Meta';
import Preloader from '../../Components/Loaders/Preloader';
import CustomNotification from '../../Components/Common/CustomNotification';
import { getCreditHistory } from '../../helpers/backend_helper';

const CreditHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preLoading, setPreLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [rowsPerPage] = useState(50);

  useEffect(() => {
    fetchCreditHistory();
  }, [currentPage]);

  const fetchCreditHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getCreditHistory({
        page: currentPage,
        rows: rowsPerPage
      });

      // Handle the response structure from backend
      const transactionData = response.data || [];
      const paginationInfo = response.pagination || {};

      setTransactions(transactionData);
      setTotalRecords(paginationInfo.total_items || 0);

      // Set current balance from the most recent transaction
      if (transactionData.length > 0) {
        setCurrentBalance(transactionData[0].balance_after || 0);
      }
    } catch (err) {
      console.error('Error fetching credit history:', err);
      setError('Failed to load credit history. Please try again.');
      CustomNotification.error('Failed to load credit history.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      // Ensure the date string is treated as UTC by appending 'Z' if not present
      let isoString = dateString;
      if (!dateString.endsWith('Z') && !dateString.includes('+')) {
        isoString = dateString + 'Z';
      }

      const date = new Date(isoString);

      // Convert to local time string
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return dateString;
    }
  };

  const getRelativeTime = (dateString) => {
    try {
      // Ensure the date string is treated as UTC by appending 'Z' if not present
      let isoString = dateString;
      if (!dateString.endsWith('Z') && !dateString.includes('+')) {
        isoString = dateString + 'Z';
      }

      const date = new Date(isoString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);

      if (diffInSeconds < 60) {
        return 'just now';
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
      } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
      } else if (diffInSeconds < 31536000) {
        const months = Math.floor(diffInSeconds / 2592000);
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;
      } else {
        const years = Math.floor(diffInSeconds / 31536000);
        return `${years} ${years === 1 ? 'year' : 'years'} ago`;
      }
    } catch {
      return '';
    }
  };

  const getTypeBadge = (type) => {
    if (type === 'CREDIT') {
      return (
        <span
          className="badge px-2 py-1"
          style={{ backgroundColor: '#16A34A', color: 'white', border: 'none', fontSize: '10px' }}
        >
          CREDIT
        </span>
      );
    }
    return (
      <span
        className="badge px-2 py-1"
        style={{ backgroundColor: '#DC2626', color: 'white', border: 'none', fontSize: '10px' }}
      >
        DEBIT
      </span>
    );
  };

  const getActionBadge = (action) => {
    const actionStyles = {
      'PDF_GENERATION': { bg: '#6B7280', text: 'white', label: 'PDF_GENERATION' },
      'WITHDRAW': { bg: '#DC2626', text: 'white', label: 'WITHDRAW' },
      'RECHARGE': { bg: '#16A34A', text: 'white', label: 'RECHARGE' },
      'DEDUCT': { bg: '#F97316', text: 'white', label: 'DEDUCT' },
      'deduct': { bg: '#F97316', text: 'white', label: 'DEDUCT' },
      'add': { bg: '#16A34A', text: 'white', label: 'RECHARGE' },
      'REFUND': { bg: '#3B82F6', text: 'white', label: 'REFUND' },
      'refund': { bg: '#3B82F6', text: 'white', label: 'REFUND' },
      'Recharge': { bg: '#16A34A', text: 'white', label: 'RECHARGE' },
    };

    const style = actionStyles[action] || { bg: '#6B7280', text: 'white', label: action || 'N/A' };

    return (
      <span
        className="badge px-2 py-1"
        style={{
          backgroundColor: style.bg,
          color: style.text,
          border: 'none',
          fontSize: '10px',
          fontWeight: '500'
        }}
      >
        {style.label}
      </span>
    );
  };

  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  if (loading && transactions.length === 0) {
    return (
      <div className="page-content">
        <MetaTag title_content="Credit History" />
        <Container fluid>
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <Spinner color="primary" />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content" style={{ fontSize: '13px' }}>
        <MetaTag title_content="Credit History" />
        <Container fluid>
          {preLoading && <Preloader />}

          {/* Page Header */}
          <Row className="mb-3">
            <Col>
              <h5 className="mb-0" style={{ fontSize: '16px' }}>Credit History</h5>
              <p className="text-muted" style={{ fontSize: '12px' }}>View all your credit transactions</p>
            </Col>
          </Row>

          {/* Current Balance Card */}
          <Row className="mb-3">
            <Col xl={4} lg={6} md={6}>
              <Card className="border-0 shadow-sm">
                <CardBody className="py-2 px-3">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <p className="text-muted mb-1" style={{ fontSize: '11px' }}>Current Balance</p>
                      <h5 className="mb-0 fw-bold" style={{ fontSize: '18px' }}>{currentBalance} Credits</h5>
                    </div>
                    <div className="avatar-sm">
                      <div className="avatar-title bg-soft-primary text-primary rounded" style={{ fontSize: '16px' }}>
                        <i className="ri-wallet-3-line"></i>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4} lg={6} md={6}>
              <Card className="border-0 shadow-sm">
                <CardBody className="py-2 px-3">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <p className="text-muted mb-1" style={{ fontSize: '11px' }}>Total Transactions</p>
                      <h5 className="mb-0 fw-bold" style={{ fontSize: '18px' }}>{totalRecords}</h5>
                    </div>
                    <div className="avatar-sm">
                      <div className="avatar-title bg-soft-info text-info rounded" style={{ fontSize: '16px' }}>
                        <i className="ri-history-line"></i>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Error Banner */}
          {error && (
            <Row className="mb-3">
              <Col>
                <div className="alert alert-danger d-flex align-items-center justify-content-between mb-0">
                  <span>{error}</span>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => fetchCreditHistory()}
                  >
                    Retry
                  </button>
                </div>
              </Col>
            </Row>
          )}

          {/* Transactions Table */}
          <Row>
            <Col>
              <Card className="border-0 shadow-sm">
                <CardHeader className="bg-transparent border-bottom py-2">
                  <h6 className="mb-0" style={{ fontSize: '14px' }}>Transaction History</h6>
                </CardHeader>
                <CardBody className="p-0 position-relative">
                  {/* Loading Overlay for Pagination */}
                  {loading && transactions.length > 0 && (
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        zIndex: 10,
                        minHeight: '200px'
                      }}
                    >
                      <div className="text-center">
                        <Spinner color="primary" style={{ width: '2rem', height: '2rem' }} />
                        <p className="text-muted mt-2 mb-0" style={{ fontSize: '12px' }}>Loading transactions...</p>
                      </div>
                    </div>
                  )}

                  {transactions.length === 0 && !loading ? (
                    <div className="text-center py-5">
                      <i className="ri-file-list-3-line fs-1 text-muted"></i>
                      <p className="text-muted mt-3 mb-0" style={{ fontSize: '12px' }}>No transactions found</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table className="table-hover table-nowrap align-middle mb-0" style={{ fontSize: '12px' }}>
                        <thead className="table-light">
                          <tr style={{ fontSize: '11px' }}>
                            <th style={{ padding: '8px 12px' }}>Date & Time</th>
                            <th style={{ padding: '8px 12px' }}>Type</th>
                            <th style={{ padding: '8px 12px' }}>Action</th>
                            <th style={{ padding: '8px 12px' }}>Description</th>
                            <th className="text-end" style={{ padding: '8px 12px' }}>Amount</th>
                            <th className="text-end" style={{ padding: '8px 12px' }}>Balance After</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((transaction, index) => (
                            <tr key={transaction.id || transaction._id || index}>
                              <td style={{ padding: '8px 12px' }}>
                                <div>
                                  <div className="fw-medium" style={{ fontSize: '12px' }}>{formatDate(transaction.date || transaction.created_at)}</div>
                                  <small className="text-muted" style={{ fontSize: '10px' }}>{getRelativeTime(transaction.date || transaction.created_at)}</small>
                                </div>
                              </td>
                              <td style={{ padding: '8px 12px' }}>{getTypeBadge(transaction.type)}</td>
                              <td style={{ padding: '8px 12px' }}>{getActionBadge(transaction.action)}</td>
                              <td style={{ padding: '8px 12px' }}>
                                <span className="text-muted" style={{ fontSize: '12px' }}>{transaction.description || '-'}</span>
                              </td>
                              <td className="text-end" style={{ padding: '8px 12px' }}>
                                <span
                                  className="fw-medium"
                                  style={{
                                    fontSize: '12px',
                                    color: transaction.type === 'CREDIT' ? '#16A34A' : '#DC2626'
                                  }}
                                >
                                  {transaction.type === 'CREDIT' ? '+' : ''}{transaction.amount}
                                </span>
                              </td>
                              <td className="text-end" style={{ padding: '8px 12px' }}>
                                <span className="fw-medium" style={{ fontSize: '12px' }}>{transaction.balance_after}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </CardBody>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="card-footer bg-transparent border-top">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="text-muted">
                        Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, totalRecords)} of {totalRecords} transactions
                      </div>
                      <div className="d-flex gap-2 align-items-center">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1 || loading}
                        >
                          <i className="ri-arrow-left-s-line"></i> Previous
                        </button>
                        <div className="btn btn-sm btn-light disabled">
                          Page {currentPage} of {totalPages}
                        </div>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages || loading}
                        >
                          Next <i className="ri-arrow-right-s-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CreditHistory;
