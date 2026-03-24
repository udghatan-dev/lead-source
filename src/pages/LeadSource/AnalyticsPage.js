import { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Spinner, Alert } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import MetaTag from '../../Components/Common/Meta';
import { IoArrowBack } from 'react-icons/io5';
import { FiBarChart2 } from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getLeadsBySource } from '../../helpers/backend_helper';

const COLORS = [
  '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#ec4899', '#f97316', '#14b8a6', '#6366f1',
  '#84cc16', '#a855f7',
];

const PROVIDER_LABELS = {
  facebook_leadgen: 'Facebook',
  facebook: 'Facebook',
  google_forms: 'Google Forms',
  zoho_crm: 'Zoho CRM',
  zoho: 'Zoho CRM',
  generic_webhook: 'Webhook',
  webhook: 'Webhook',
  phone_connect: 'Call History Connect',
  call_connect: 'Call History Connect',
  contact_connect: 'Contact Book',
  contact_book: 'Contact Book',
  jotform: 'JotForm',
  contactform7: 'Contact Form 7',
  typeform: 'Typeform',
  hubspot_crm: 'HubSpot',
  hubspot: 'HubSpot',
  indiamart: 'IndiaMART',
};

const getProviderLabel = (key) => PROVIDER_LABELS[key] || key;

const AnalyticsPage = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [range, setRange] = useState('month');
  const [data, setData] = useState(null);

  const fetchAnalytics = useCallback(() => {
    setLoading(true);
    setError('');
    getLeadsBySource({ range })
      .then((res) => {
        setData(res.data || res || null);
      })
      .catch((err) => {
        console.error('Failed to fetch analytics:', err);
        setError('Failed to load analytics data');
      })
      .finally(() => setLoading(false));
  }, [range]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Build chart data from API response
  const buildBarChartData = () => {
    if (!data?.labels || !data?.series) return [];
    return data.labels.map((label, i) => {
      const point = { date: label };
      (data.providers || Object.keys(data.series)).forEach((provider) => {
        point[provider] = data.series[provider]?.[i] || 0;
      });
      return point;
    });
  };

  const buildPieChartData = () => {
    if (!data?.totals) return [];
    return Object.entries(data.totals)
      .filter(([, val]) => val > 0)
      .map(([key, value]) => ({
        name: getProviderLabel(key),
        value,
      }));
  };

  const barChartData = buildBarChartData();
  const pieChartData = buildPieChartData();
  const providers = data?.providers || Object.keys(data?.series || {});
  const totalLeads = data?.totals
    ? Object.values(data.totals).reduce((a, b) => a + b, 0)
    : 0;

  const tab = new URLSearchParams(history.location.search).get('tab') || 'all';

  return (
    <div className='page-content'>
      <MetaTag pageTitle='Analytics - Lead Sources' />
      <Container fluid>
        <BreadCrumb title='Analytics' pageTitle='Lead Sources' />

        {/* Header */}
        <div className='d-flex align-items-center justify-content-between mb-4'>
          <div className='d-flex align-items-center gap-3'>
            <button
              className='btn btn-sm btn-soft-secondary d-flex align-items-center gap-1'
              onClick={() => history.push(`/settings?tab=${tab}`)}
            >
              <IoArrowBack size={14} />
              <span>Back</span>
            </button>
            <h5 className='mb-0 d-flex align-items-center gap-2'>
              <FiBarChart2 />
              Leads Analytics
            </h5>
          </div>
          <div className='btn-group' role='group'>
            {['day', 'month', 'year'].map((r) => (
              <button
                key={r}
                className='btn btn-sm'
                style={{
                  backgroundColor: range === r ? '#3b82f6' : '#f8fafc',
                  color: range === r ? '#fff' : '#64748b',
                  border: '1px solid #e2e8f0',
                  textTransform: 'capitalize',
                }}
                onClick={() => setRange(r)}
              >
                {r === 'day' ? 'Daily' : r === 'month' ? 'Monthly' : 'Yearly'}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <Alert color='danger' className='mb-3' style={{ fontSize: '0.85rem' }} toggle={() => setError('')}>
            {error}
          </Alert>
        )}

        {loading ? (
          <div className='text-center py-5'>
            <Spinner color='primary' />
            <p className='text-muted mt-2' style={{ fontSize: '0.85rem' }}>Loading analytics...</p>
          </div>
        ) : !data ? (
          <div className='text-center py-5'>
            <FiBarChart2 style={{ fontSize: '3rem', color: '#cbd5e1' }} />
            <p className='text-muted mt-3'>No analytics data available</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className='row g-3 mb-4'>
              <div className='col-md-3'>
                <div className='card border-0 shadow-sm'>
                  <div className='card-body text-center'>
                    <p className='text-muted mb-1' style={{ fontSize: '0.8rem' }}>Total Leads</p>
                    <h3 className='mb-0' style={{ color: '#3b82f6' }}>{totalLeads}</h3>
                  </div>
                </div>
              </div>
              <div className='col-md-3'>
                <div className='card border-0 shadow-sm'>
                  <div className='card-body text-center'>
                    <p className='text-muted mb-1' style={{ fontSize: '0.8rem' }}>Active Sources</p>
                    <h3 className='mb-0' style={{ color: '#22c55e' }}>{providers.length}</h3>
                  </div>
                </div>
              </div>
              <div className='col-md-3'>
                <div className='card border-0 shadow-sm'>
                  <div className='card-body text-center'>
                    <p className='text-muted mb-1' style={{ fontSize: '0.8rem' }}>Top Source</p>
                    <h5 className='mb-0' style={{ color: '#f59e0b', fontSize: '1.1rem' }}>
                      {data?.totals
                        ? getProviderLabel(
                            Object.entries(data.totals).sort((a, b) => b[1] - a[1])[0]?.[0] || '-',
                          )
                        : '-'}
                    </h5>
                  </div>
                </div>
              </div>
              <div className='col-md-3'>
                <div className='card border-0 shadow-sm'>
                  <div className='card-body text-center'>
                    <p className='text-muted mb-1' style={{ fontSize: '0.8rem' }}>Period</p>
                    <h5 className='mb-0' style={{ color: '#8b5cf6', fontSize: '1.1rem', textTransform: 'capitalize' }}>
                      {range === 'day' ? 'Daily' : range === 'month' ? 'Monthly' : 'Yearly'}
                    </h5>
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            {barChartData.length > 0 && (
              <div className='card border-0 shadow-sm mb-4'>
                <div className='card-header bg-transparent border-bottom'>
                  <h6 className='mb-0' style={{ fontSize: '0.9rem', color: '#334155' }}>
                    Leads by Source Over Time
                  </h6>
                </div>
                <div className='card-body'>
                  <ResponsiveContainer width='100%' height={350}>
                    <BarChart data={barChartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray='3 3' stroke='#f1f5f9' />
                      <XAxis
                        dataKey='date'
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e2e8f0' }}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e2e8f0' }}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          fontSize: '0.8rem',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                        }}
                        formatter={(value, name) => [value, getProviderLabel(name)]}
                      />
                      <Legend
                        formatter={(value) => getProviderLabel(value)}
                        wrapperStyle={{ fontSize: '0.8rem' }}
                      />
                      {providers.map((provider, i) => (
                        <Bar
                          key={provider}
                          dataKey={provider}
                          fill={COLORS[i % COLORS.length]}
                          radius={[4, 4, 0, 0]}
                          maxBarSize={40}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div className='row g-4'>
              {/* Pie Chart */}
              {pieChartData.length > 0 && (
                <div className='col-md-5'>
                  <div className='card border-0 shadow-sm h-100'>
                    <div className='card-header bg-transparent border-bottom'>
                      <h6 className='mb-0' style={{ fontSize: '0.9rem', color: '#334155' }}>
                        Lead Distribution
                      </h6>
                    </div>
                    <div className='card-body d-flex align-items-center justify-content-center'>
                      <ResponsiveContainer width='100%' height={280}>
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx='50%'
                            cy='50%'
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={3}
                            dataKey='value'
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={{ stroke: '#94a3b8' }}
                          >
                            {pieChartData.map((entry, i) => (
                              <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              fontSize: '0.8rem',
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Source Breakdown Table */}
              <div className={pieChartData.length > 0 ? 'col-md-7' : 'col-12'}>
                <div className='card border-0 shadow-sm h-100'>
                  <div className='card-header bg-transparent border-bottom'>
                    <h6 className='mb-0' style={{ fontSize: '0.9rem', color: '#334155' }}>
                      Source Breakdown
                    </h6>
                  </div>
                  <div className='card-body p-0'>
                    <div className='table-responsive'>
                      <table className='table table-sm table-hover align-middle mb-0'>
                        <thead style={{ backgroundColor: '#f8fafc' }}>
                          <tr style={{ fontSize: '0.8rem', color: '#475569' }}>
                            <th style={{ fontWeight: 600, padding: '10px 16px' }}>Source</th>
                            <th style={{ fontWeight: 600, padding: '10px 16px' }} className='text-end'>Total Leads</th>
                            <th style={{ fontWeight: 600, padding: '10px 16px' }} className='text-end'>Share</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.totals &&
                            Object.entries(data.totals)
                              .sort((a, b) => b[1] - a[1])
                              .map(([source, count], i) => (
                                <tr key={source} style={{ fontSize: '0.83rem' }}>
                                  <td style={{ padding: '10px 16px' }}>
                                    <div className='d-flex align-items-center gap-2'>
                                      <span
                                        style={{
                                          width: 10,
                                          height: 10,
                                          borderRadius: '50%',
                                          backgroundColor: COLORS[i % COLORS.length],
                                          display: 'inline-block',
                                        }}
                                      />
                                      {getProviderLabel(source)}
                                    </div>
                                  </td>
                                  <td className='text-end fw-medium' style={{ padding: '10px 16px' }}>
                                    {count}
                                  </td>
                                  <td className='text-end text-muted' style={{ padding: '10px 16px' }}>
                                    {totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(1) : 0}%
                                  </td>
                                </tr>
                              ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default AnalyticsPage;
