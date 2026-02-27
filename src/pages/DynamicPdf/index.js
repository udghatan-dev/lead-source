import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';

import {
  Button, Col, Container, Row, Card, CardHeader, CardBody,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, FormFeedback, Alert
} from 'reactstrap';

// import Preloader from '../../../Components/Loaders/Preloader';
import Preloader from '../../Components/Loaders/Preloader';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import CustomNotification from '../../Components/Common/CustomNotification';
import TableContainer from '../../Components/Common/TableContainer';
import MetaTag from '../../Components/Common/Meta';
import WarningDialogModal from '../DynamicImage/WarningDialogModal';

import { useSelector, useDispatch } from 'react-redux';
import { resetPdfExp, listPdfExp, deletePdfExp } from '../../store/actions';
import moment from 'moment';

import CheckFeatureAccess from '../../common/utils/CheckFeatureAccess';
import { API_KEY_GENERATE, API_KEY_GET } from '../../helpers/url_helpers/dig';

// --- IMPORT BACKEND HELPERS ---
// Storage configuration moved to /storage page (StorageExplorer.js)
// import { getStorageCreds, createStorageCreds } from '../../helpers/backend_helper';

/* STORAGE CONFIG MODAL - MOVED TO /storage PAGE
const StorageConfigModal = ({ isOpen, toggle, userRNP }) => {
  const [loading, setLoading] = useState(false);
  const [isServiceEnabled, setIsServiceEnabled] = useState(false);
  const [storageType, setStorageType] = useState('system');
  const [s3Config, setS3Config] = useState({
    bucket_name: '',
    region: 'us-east-1',
    access_key: '',
    secret_key: '',
    endpoint_url: ''
  });

  useEffect(() => {
    if (isOpen && userRNP?.subscription?.id) {
      fetchStorageSettings();
    }
  }, [isOpen, userRNP]);

  const fetchStorageSettings = async () => {
    try {
      setLoading(true);
      const response = await getStorageCreds();

      if (response && response.storage_type && response.storage_type !== '') {
        const type = response.storage_type || 'system';
        setStorageType(type);

        // Check if user has configured storage
        // Toggle ON if config exists (not null)
        // Toggle OFF if config is null (no storage configured)

        let hasConfiguration = false;

        if (type === 's3') {
          // For S3, check if config exists with bucket_name
          hasConfiguration = response.config && response.config.bucket_name;
        } else if (type === 'system') {
          // For System, check if config is not null (can be empty object {})
          hasConfiguration = response.config !== null && response.config !== undefined;
        }

        setIsServiceEnabled(hasConfiguration);

        // If S3 config exists, populate state
        if (type === 's3' && response.config && response.config.bucket_name) {
          setS3Config({
            bucket_name: response.config.bucket_name || '',
            region: response.config.region || 'us-east-1',
            access_key: response.config.access_key || '',
            secret_key: '', // Always empty for security - backend sends masked value
            endpoint_url: response.config.endpoint_url || ''
          });
        } else {
          // Reset S3 config
          setS3Config({
            bucket_name: '',
            region: 'us-east-1',
            access_key: '',
            secret_key: '',
            endpoint_url: ''
          });
        }
      } else {
        // No config found or empty response, keep toggle disabled
        setIsServiceEnabled(false);
        setStorageType('system');
        setS3Config({
          bucket_name: '',
          region: 'us-east-1',
          access_key: '',
          secret_key: '',
          endpoint_url: ''
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to load storage settings", error);
      // On error, keep toggle disabled
      setIsServiceEnabled(false);
      setStorageType('system');
      setS3Config({
        bucket_name: '',
        region: 'us-east-1',
        access_key: '',
        secret_key: '',
        endpoint_url: ''
      });
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setS3Config(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let payload;

      if (!isServiceEnabled) {
        payload = {
          storage_type: 'system',
          config: null
        };
      } else if (storageType === 'system') {
        payload = {
          storage_type: 'system',
          config: {}
        };
      } else if (storageType === 's3') {
        payload = {
          storage_type: 's3',
          config: {
            bucket_name: s3Config.bucket_name,
            region: s3Config.region,
            access_key: s3Config.access_key,
            secret_key: s3Config.secret_key,
            ...(s3Config.endpoint_url && { endpoint_url: s3Config.endpoint_url })
          }
        };
      }

      // Use createStorageCreds helper OR axios directly
      try {
        await createStorageCreds(payload);
      } catch (helperError) {
        console.warn("createStorageCreds failed, using direct axios call");
        const userId = userRNP?.subscription?.id;
        await axios.post(
          '/v1/user/storage-config',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Authentication': JSON.stringify({ user_id: userId })
            }
          }
        );
      }

      CustomNotification.success("Storage configuration updated successfully!");
      toggle();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Failed to update storage configuration.";
      CustomNotification.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Storage Settings</ModalHeader>
      <ModalBody>
        {loading ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5">
            <i className="bx bx-loader bx-spin text-primary" style={{ fontSize: '30px' }}></i>
            <span className="text-muted mt-2">Loading settings...</span>
          </div>
        ) : (
          <div className="animate__animated animate__fadeIn">
            <Alert color="info" className="mb-4 d-flex align-items-center">
              <i className="bx bx-info-circle me-2 fs-5"></i>
              <span className="fs-13">Configure where your generated PDFs will be stored.</span>
            </Alert>

            {/* TOGGLE SWITCH * /}
            <div className="d-flex align-items-center justify-content-between p-3 border rounded mb-4 bg-light">
              <div>
                <h6 className="mb-0 text-dark">Use Storage Services</h6>
                <span className="text-muted fs-12">Enable to save generated PDFs to cloud storage</span>
              </div>
              <div className="form-check form-switch form-switch-lg mb-0" dir="ltr">
                <Input
                  type="switch"
                  className="form-check-input"
                  id="storageToggle"
                  checked={isServiceEnabled}
                  onChange={(e) => setIsServiceEnabled(e.target.checked)}
                />
              </div>
            </div>

            {/* CONDITIONAL CONTENT * /}
            {isServiceEnabled && (
              <div className="animate__animated animate__fadeIn">
                <Label className="form-label text-muted text-uppercase fw-bold fs-11 mb-2">Select Provider</Label>
                <div className="d-flex gap-3 mb-4">
                  {/* System Radio * /}
                  <div
                    className={`flex-grow-1 border rounded p-3 cursor-pointer ${storageType === 'system' ? 'border-primary bg-soft-primary' : 'bg-white'}`}
                    onClick={() => setStorageType('system')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <i className={`bx bx-cloud fs-4 me-2 ${storageType === 'system' ? 'text-primary' : 'text-muted'}`}></i>
                        <div>
                          <h6 className="mb-0 fs-14">System Cloud</h6>
                          <span className="text-muted fs-11">Managed Hosting</span>
                        </div>
                      </div>
                      {storageType === 'system' && <i className="bx bx-check-circle text-primary fs-5"></i>}
                    </div>
                  </div>

                  {/* S3 Radio * /}
                  <div
                    className={`flex-grow-1 border rounded p-3 cursor-pointer ${storageType === 's3' ? 'border-primary bg-soft-primary' : 'bg-white'}`}
                    onClick={() => setStorageType('s3')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <i className={`bx bx-data fs-4 me-2 ${storageType === 's3' ? 'text-primary' : 'text-muted'}`}></i>
                        <div>
                          <h6 className="mb-0 fs-14">S3 Compatible</h6>
                          <span className="text-muted fs-11">Bring Your Own</span>
                        </div>
                      </div>
                      {storageType === 's3' && <i className="bx bx-check-circle text-primary fs-5"></i>}
                    </div>
                  </div>
                </div>

                {/* S3 FORM * /}
                {storageType === 's3' && (
                  <div className="border rounded p-3 bg-light animate__animated animate__fadeInUp">
                    {s3Config.bucket_name && (
                      <Alert color="warning" className="mb-3 py-2 d-flex align-items-center">
                        <i className="bx bx-info-circle me-2"></i>
                        <small>To update your S3 configuration, please re-enter your Secret Key for security.</small>
                      </Alert>
                    )}
                    <FormGroup>
                      <Label>
                        Endpoint URL
                        <span className="text-muted ms-1">(Optional)</span>
                      </Label>
                      <Input
                        type="text"
                        name="endpoint_url"
                        value={s3Config.endpoint_url}
                        onChange={handleChange}
                        placeholder="(leave empty for AWS S3)"
                        className="form-control-sm"
                      />
                      <small className="text-muted">
                        Required for Wasabi, DigitalOcean Spaces, MinIO, etc. Leave empty for AWS S3.
                      </small>
                    </FormGroup>
                    <FormGroup>
                      <Label>Bucket Name <span className="text-danger">*</span></Label>
                      <Input
                        type="text"
                        name="bucket_name"
                        value={s3Config.bucket_name}
                        onChange={handleChange}
                        placeholder="e.g. my-pdf-reports"
                        className="form-control-sm"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Region <span className="text-danger">*</span></Label>
                      <Input
                        type="select"
                        name="region"
                        value={s3Config.region}
                        onChange={handleChange}
                        className="form-control-sm"
                      >
                        <option value="us-east-1">US East (N. Virginia)</option>
                        <option value="us-east-2">US East (Ohio)</option>
                        <option value="us-west-1">US West (N. California)</option>
                        <option value="us-west-2">US West (Oregon)</option>
                        <option value="eu-west-1">EU (Ireland)</option>
                        <option value="eu-central-1">EU (Frankfurt)</option>
                        <option value="ap-south-1">Asia Pacific (Mumbai)</option>
                        <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                      </Input>
                    </FormGroup>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label>Access Key <span className="text-danger">*</span></Label>
                          <Input
                            type="text"
                            name="access_key"
                            value={s3Config.access_key}
                            onChange={handleChange}
                            placeholder="AKIA..."
                            className="form-control-sm"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label>Secret Key <span className="text-danger">*</span></Label>
                          <Input
                            type="password"
                            name="secret_key"
                            value={s3Config.secret_key}
                            onChange={handleChange}
                            // placeholder="••••••" 
                            className="form-control-sm"
                          />
                          {!s3Config.secret_key && s3Config.access_key && (
                            <small className="text-danger">Required to update configuration</small>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="light" onClick={toggle} disabled={loading}>Cancel</Button>
        <Button color="primary" onClick={handleSave} disabled={loading}>
          {loading ? <i className="bx bx-loader bx-spin me-1"></i> : <i className="bx bx-save me-1"></i>}
          Save Changes
        </Button>
      </ModalFooter>
    </Modal>
  );
};
STORAGE CONFIG MODAL - END */

// API KEY - DISPLAY ONLY (No Fetching)
const ApiKeyManager = ({ userRNP, onKeyGenerated, generatedKey, showKey, setGeneratedKey, setShowKey }) => {
  const [loading, setLoading] = useState(false);

  const handleGenerateKey = async () => {
    setLoading(true);

    try {
      const userId = userRNP?.subscription?.id;
      if (!userId) {
        CustomNotification.error("User ID not found. Please refresh.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        API_KEY_GENERATE,
        {},
        { headers: { "X-Authentication": JSON.stringify({ user_id: userId }) } }
      );

      let responseData;
      let newKey = null;

      if (response && typeof response === 'object') {
        if ('status' in response && 'data' in response) {
          responseData = response.data;
        } else if ('key' in response) {
          responseData = response;
        }
      }

      if (responseData) {
        if (responseData.key) {
          newKey = responseData.key;
        } else if (responseData.data && responseData.data.key) {
          newKey = responseData.data.key;
        }
      }

      if (newKey) {
        setGeneratedKey(newKey);
        setShowKey(true);
        onKeyGenerated(newKey);
        CustomNotification.success("API Key generated successfully!");
      } else {
        CustomNotification.error("Could not extract key from response");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || "Failed to generate API Key";
      CustomNotification.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const copyKey = () => {
    navigator.clipboard.writeText(generatedKey);
    CustomNotification.success("Key copied!");
  };

  return (
    <div className="bg-light border rounded p-3 mb-3">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="fw-medium text-dark">
          <i className="bx bx-key text-primary me-1"></i>
          API Key
        </span>
        <Button
          color={generatedKey ? "dark" : "primary"}
          size="sm"
          onClick={handleGenerateKey}
          disabled={loading}
        >
          {loading ? (
            <><i className="bx bx-loader bx-spin me-1"></i>Generating...</>
          ) : (
            <>{generatedKey ? <><i className="bx bx-refresh me-1"></i>Regenerate Key</> : <><i className="bx bx-plus me-1"></i>Generate</>}</>
          )}
        </Button>
      </div>
      {generatedKey && showKey ? (
        <div className="d-flex align-items-center gap-2">
          <code className="bg-white px-2 py-1 rounded border font-monospace small flex-grow-1" style={{ fontSize: '11px' }}>
            {generatedKey}
          </code>
          <Button color="light" size="sm" onClick={copyKey}>
            <i className="bx bx-copy"></i>
          </Button>
        </div>
      ) : (
        <small className="text-muted">Generate your API key to use this endpoint</small>
      )}
    </div>
  );
};

// MAIN PDF BUILDER COMPONENT

const PdfBuilder = (props) => {
  const history = useHistory();
  const [initLoad, setInitLoad] = useState(false);
  const [preLoading, setPreLoading] = useState(false);

  const dispatch = useDispatch();

  const [pdfExpList, setPdfExpList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showCurlModal, setShowCurlModal] = useState(false);
  // const [showStorageModal, setShowStorageModal] = useState(false); // Moved to /storage page
  const [curlData, setCurlData] = useState({});

  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const [showCreateOptionModal, setShowCreateOptionModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // --- NEW: Toggle function ---
  const toggleCreateOptionModal = () => {
    setShowCreateOptionModal(!showCreateOptionModal);
  };

  const toggleApiKeyModal = () => {
    setShowApiKeyModal(!showApiKeyModal);
  };

  // --- NEW: Navigation Handlers ---
  const handleProceedToCreate = (hasTable) => {
    setShowCreateOptionModal(false); // Close modal
    if (hasTable) {
      history.push('/table/new'); // User wants table -> Table Editor
    } else {
      history.push('/pdf/new');   // User does NOT want table -> Standard/Konva Editor
    }
  };
  const {
    isPdfExpListed,
    isPdfExpDeleted,
    pdfExpApiResponse,
    userRNP,
    currentUser
  } = useSelector((state) => ({
    isPdfExpListed: state.PdfExp.isPdfExpListed,
    isPdfExpDeleted: state.PdfExp.isPdfExpDeleted,
    pdfExpApiResponse: state.PdfExp.apiResponse,
    userRNP: state.UserSession.userRNP,
    currentUser: state.UserSession.user,
  }));

  // Fetch API key on page load
  useEffect(() => {
    const fetchExistingKey = async () => {
      const userId = userRNP?.subscription?.id;
      if (!userId) return;

      try {
        const getUrl = API_KEY_GET || API_KEY_GENERATE.replace('/generate', '/get');

        const response = await axios.get(
          getUrl,
          {
            headers: {
              "X-Authentication": JSON.stringify({ user_id: userId })
            }
          }
        );

        let existingKey = null;

        if (response && typeof response === 'object') {
          let responseData;

          if ('status' in response && 'data' in response) {
            responseData = response.data;
          } else if ('key' in response) {
            responseData = response;
          }

          if (responseData) {
            if (responseData.key) {
              existingKey = responseData.key;
            } else if (responseData.data && responseData.data.key) {
              existingKey = responseData.data.key;
            }
          }
        }

        if (existingKey) {
          setApiKey(existingKey);
          setShowApiKey(true);
        }
      } catch (error) {
        if (error.response && error.response.status !== 404) {
        }
      }
    };

    if (CheckFeatureAccess(userRNP, 'dig.img_exp.READ') && userRNP?.subscription?.id) {
      fetchExistingKey();
    }
  }, [userRNP]);

  useEffect(() => {
    if (!CheckFeatureAccess(userRNP, 'dig.img_exp.READ')) {
      return history.push('/dig');
    }
    setPreLoading(true);
    dispatch(listPdfExp({ page, rows: 20 }));
  }, [dispatch, userRNP, history, page]);

  useEffect(() => {
    if (isPdfExpListed) {
      setInitLoad(true);
      setPreLoading(false);
      if (pdfExpApiResponse.success) {
        setPdfExpList(pdfExpApiResponse.data);
        setTotal(pdfExpApiResponse.count);
      } else {
        CustomNotification.error(pdfExpApiResponse.data);
      }
      dispatch(resetPdfExp('apiResponse', {}));
      dispatch(resetPdfExp('isPdfExpListed', false));
    }
  }, [isPdfExpListed, pdfExpApiResponse, dispatch]);

  useEffect(() => {
    if (isPdfExpDeleted) {
      setPreLoading(false);
      if (pdfExpApiResponse.success) {
        setPdfExpList((prev) => {
          return prev.filter((c) => c._id !== pdfExpApiResponse.data);
        });
        CustomNotification.success('PDF Deleted Successfully');
      } else {
        CustomNotification.error(pdfExpApiResponse.data);
      }
      dispatch(resetPdfExp('apiResponse', {}));
      dispatch(resetPdfExp('isPdfExpDeleted', false));
    }
  }, [isPdfExpDeleted, pdfExpApiResponse, dispatch]);

  useEffect(() => {
    if (initLoad) {
      setPreLoading(true);
      dispatch(listPdfExp({ page, rows: 20 }));
    }
  }, [page, initLoad, dispatch]);

  const closeModal = () => {
    setWarningModal({ status: false });
  };

  const toggleCurlModal = () => {
    setShowCurlModal(!showCurlModal);
  };

  // Moved to /storage page
  // const toggleStorageModal = () => {
  //   setShowStorageModal(!showStorageModal);
  // };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    CustomNotification.success("Copied to clipboard!");
  };

  const callBack = (action, data) => {
    if (action === 'delete_pdf') {
      setPreLoading(true);
      dispatch(deletePdfExp({ pdf: data.id }));
      closeModal();
    }
  };

  const generateCurlCommand = (data, key) => {
    const { baseUrl, templateId, variablesObject } = data;
    const displayKey = key || '<YOUR_API_KEY>';

    const payload = JSON.stringify({
      variables: variablesObject
    }, null, 2);
    const storage_flag = true;
    return `curl --location '${baseUrl}/v1/pdf/generate/${templateId}/' \\
--header 'Content-Type: application/json' \\
--header 'X-Api-Key: ${displayKey}' \\
--header 'store-file: ${storage_flag}'\\
--data '${payload}'`;
  };

  const columns = useMemo(
    () => [
      {
        Header: props.t('Name'),
        Cell: (item) => (
          <div className='d-flex flex-column align-items-start justify-content-start' title={item.row.original.name}>
            <span className='text-dark'>{item.row.original.name}</span>
          </div>
        ),
      },
      // {
      //   Header: props.t('Pages'),
      //   Cell: (item) => {
      //     let pageCount = 0;
      //     if (item.row.original.pages && Array.isArray(item.row.original.pages)) {
      //       pageCount = item.row.original.pages.length;
      //     } else if (item.row.original.layer) {
      //       pageCount = 1;
      //     }
      //     return (
      //       <div className='d-flex flex-column align-items-start justify-content-start' title={pageCount}>
      //         <span className='text-dark'>{pageCount}</span>
      //       </div>
      //     );
      //   },
      // },
      {
        Header: props.t('Variables'),
        Cell: (item) => {
          const varList = item.row.original.variables || item.row.original.variable || [];
          return (
            <div className='d-flex flex-column align-items-start justify-content-start' title={varList.length}>
              <span className='text-dark'>{varList.length}</span>
            </div>
          );
        },
      },
      {
        Header: props.t('Created At'),
        Cell: (item) => (
          <div className='d-flex flex-column align-items-start'>
            {moment(item.row.original.createdAt).format('hh:mm A, DD MMM YYYY')}
          </div>
        ),
      },
      {
        Header: props.t('Updated At'),
        Cell: (item) => (
          <div className='d-flex flex-column align-items-start'>
            {moment(item.row.original.updatedAt).format('hh:mm A, DD MMM YYYY')}
          </div>
        ),
      },
      // --- REPLACED ACTION COLUMN ---
      {
        Header: props.t('ACTION'),
        Cell: (item) => {
          const doc = item.row.original;

          // --- 1. Edit Navigation (Corrected URL Structure) ---
          const handleEditClick = () => {
            // Route: /prefix / :id / :mode
            if (doc.type === 'FLOW' || doc.type === 'dyTableEditor') {
              // New Table Editor
              history.push(`/table/${doc._id}/edit`);
            } else {
              // Old Legacy Editor
              history.push(`/pdf/${doc._id}/edit`);
            }
          };

          // --- 2. Clone Navigation (Corrected URL Structure) ---
          const handleCloneClick = () => {
            if (doc.type === 'FLOW' || doc.type === 'dyTableEditor') {
              history.push(`/table/${doc._id}/clone`);
            } else {
              history.push(`/pdf/${doc._id}/clone`);
            }
          };

          // --- 3. cURL Logic (Unchanged) ---
          const handleOpenCurl = () => {
            const templateId = doc._id;
            const baseUrl = "https://dynamicpdf.1automations.com";
            const vars = doc.variable || doc.variables || [];

            let variablesObject = {};
            let variableExamples = [];

            if (vars.length > 0) {
              vars.forEach(v => {
                let val = v.fallback;
                const displayVal = val !== undefined && val !== null ? val : "sample_value";
                variablesObject[v.name] = displayVal;
                variableExamples.push({
                  name: v.name,
                  value: displayVal,
                  type: typeof displayVal
                });
              });
            }

            setCurlData({
              baseUrl,
              templateId,
              variablesObject,
              variables: variableExamples,
              templateName: doc.name
            });
            setShowCurlModal(true);
          };

          return (
            <ul className='list-inline hstack gap-1 mb-0'>

              {/* Copy Template ID Button */}
              <li className='list-inline-item' title='Copy Template ID'>
                <Link to={'#'} className='d-inline-block' onClick={() => {
                  navigator.clipboard.writeText(doc._id);
                  CustomNotification.success("Template ID copied!");
                }}>
                  <i className='bx bx-copy-alt fs-18 text-dark btn-sm'></i>
                </Link>
              </li>

              {/* API / cURL Button */}
              <li className='list-inline-item edit' title='Get API cURL'>
                <Link to={'#'} className='d-inline-block' onClick={handleOpenCurl}>
                  <i className='bx bx-code-alt fs-18 text-primary btn-sm'></i>
                </Link>
              </li>

              {/* Edit Button */}
              {CheckFeatureAccess(userRNP, 'dig.img_exp.UPDATE') && (
                <li className='list-inline-item edit' title='Edit'>
                  <Link to={'#'} className='d-inline-block' onClick={handleEditClick}>
                    <i className='bx bxs-edit fs-18 text-dark btn-sm'></i>
                  </Link>
                </li>
              )}

              {/* Clone Button */}
              {CheckFeatureAccess(userRNP, 'dig.img_exp.CREATE') && (
                <li className='list-inline-item edit' title='Clone'>
                  <Link to={'#'} className=' d-inline-block' onClick={handleCloneClick}>
                    <i className='bx bx-copy fs-18 text-dark btn-sm'></i>
                  </Link>
                </li>
              )}

              {/* Delete Button */}
              {CheckFeatureAccess(userRNP, 'dig.img_exp.DELETE') && (
                <li className='list-inline-item edit' title='Delete'>
                  <Link to={'#'} className=' d-inline-block' onClick={() => {
                    setWarningModal({
                      status: true,
                      action: 'delete_pdf',
                      message: 'DELETE_PDF_EXP',
                      data: { id: doc._id },
                    });
                  }}
                  >
                    <i className='bx bxs-trash fs-18 text-dark btn-sm'></i>
                  </Link>
                </li>
              )}
            </ul>
          );
        },
      },
    ],
    [props, history, userRNP]
  );
  const goToPage = (p) => {
    if (parseInt(p) < 0) return;
    setPage(parseInt(p + 1));
  };

  const [warningModal, setWarningModal] = useState({ status: false });

  return (
    <Suspense fallback={<Preloader />}>
      <React.Fragment>
        <div className='page-content'>
          <MetaTag pageTitle='PDF Experience' />
          <Container fluid>
            <BreadCrumb title='PDF Experience' pageTitle='PDF Experience' />
            <Row>
              <Col xxl={12}>
                <Card id='contactList' className='border-0'>
                  <CardHeader className='border-1 border-right pt-0 pb-1 px-0'>
                    <div className='d-flex align-items-center flex-wrap gap-2'>
                      <div className='flex-grow-1'>
                        <h5 className="card-title mb-0">My Templates</h5>
                      </div>
                      <div className='d-flex flex-shrink-0 gap-2'>

                        {/* Storage button moved to /storage page
                        <Button
                          type='button'
                          color='light'
                          className='btn btn-sm'
                          onClick={toggleStorageModal}
                        >
                          <i className='bx bx-cloud me-1' /> Storage
                        </Button>
                        */}
                        <button
                          type='button'
                          className='btn btn-sm'
                          onClick={toggleApiKeyModal}
                          style={{
                            backgroundColor: '#f3f3f9',
                            color: '#212529',
                            border: '1px solid #e9ebec'
                          }}
                        >
                          <i className='bx bx-key me-1' /> API Key
                        </button>
                        {CheckFeatureAccess(userRNP, 'dig.img_exp.CREATE') && (
                          <Button
                            type='button'
                            color='primary'
                            className='btn btn-sm'
                            // CHANGED: Open modal instead of direct push
                            onClick={toggleCreateOptionModal}
                          >
                            <i className='mdi mdi-plus me-1' /> {props.t('Create New PDF')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className='border-1'>
                    <Row>
                      <Col xl={12} lg={12}>
                        {pdfExpList.length === 0 && (
                          <div className='d-flex align-items-center justify-content-center text-muted card card-body border-0'>
                            {props.t('No PDFs Found')}
                          </div>
                        )}
                        {pdfExpList.length > 0 && (
                          <div>
                            <TableContainer
                              columns={columns}
                              data={pdfExpList}
                              isGlobalFilter={false}
                              isAddUserList={false}
                              customPageSize={20}
                              isCustomPagination={true}
                              activePageIndex={page}
                              goTo={goToPage}
                              totalRecords={total}
                              divClass='table-responsive table-card mb-3 minHeight rounded-1'
                              tableClass='align-middle table-nowrap'
                              theadClass='table-light text-muted'
                            />
                          </div>
                        )}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
          {preLoading && <Preloader />}

          {warningModal.status ? (
            <WarningDialogModal
              open={warningModal.status}
              handleClose={closeModal}
              action={warningModal.action}
              data={warningModal.data}
              cb={callBack}
              message={warningModal.message}
            />
          ) : (
            ''
          )}

          {/* Modal for cURL */}
          <Modal isOpen={showCurlModal} toggle={toggleCurlModal} centered size="lg">
            <ModalHeader toggle={toggleCurlModal}>
              API Integration
            </ModalHeader>
            <ModalBody className="px-4 py-3">
              <div className="mb-2">
                <div className="bg-dark text-light p-3 rounded position-relative" style={{ fontSize: '12px' }}>
                  <Button
                    color="secondary"
                    size="sm"
                    className="position-absolute top-0 end-0 m-2"
                    onClick={() => copyToClipboard(generateCurlCommand(curlData, apiKey))}
                  >
                    <i className="bx bx-copy me-1"></i> Copy
                  </Button>
                  <pre className="text-light mb-0" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    {generateCurlCommand(curlData, apiKey)}
                  </pre>
                </div>
              </div>

              {curlData.variables && curlData.variables.length > 0 && (
                <small className="text-muted d-block">
                  <i className="bx bx-info-circle me-1"></i>
                  {curlData.variables.length} variable(s): {curlData.variables.map(v => v.name).join(', ')}
                </small>
              )}
            </ModalBody>
            <ModalFooter className="border-top py-2">
              <Button color="light" size="sm" onClick={toggleCurlModal}>Close</Button>
            </ModalFooter>
          </Modal>

          {/* StorageConfigModal moved to /storage page
          <StorageConfigModal
            isOpen={showStorageModal}
            toggle={toggleStorageModal}
            userRNP={userRNP}
          />
          */}

          {/* --- NEW: Template Selection Modal --- */}
          <Modal isOpen={showCreateOptionModal} toggle={toggleCreateOptionModal} centered>
            <ModalHeader toggle={toggleCreateOptionModal}>
              Create New Document
            </ModalHeader>
            <ModalBody className="text-center p-4">
              <div className="mb-4">
                {/* <i className="bx bx-question-mark h1 text-primary border rounded-circle p-2"></i> */}
                <h5 className="mt-3">Does your document require a dynamic table?</h5>
                <p className="text-muted">
                  Select "Yes" if you need rows that expand automatically based on data (e.g., Invoices).
                </p>
              </div>

              <div className="d-flex justify-content-center gap-3">
                {/* NO - Standard PDF */}
                <Button
                  color="light"
                  className="px-4 py-2 d-flex align-items-center"
                  onClick={() => handleProceedToCreate(false)}
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderColor: '#dee2e6',
                    color: '#212529'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#343a40';
                    e.target.style.borderColor = '#343a40';
                    e.target.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f8f9fa';
                    e.target.style.borderColor = '#dee2e6';
                    e.target.style.color = '#212529';
                  }}
                >
                  <i className="bx bx-file me-2"></i>
                  No, Simple PDF
                </Button>

                {/* YES - Table PDF */}
                <Button
                  color="primary"
                  className="px-4 py-2 d-flex align-items-center"
                  onClick={() => handleProceedToCreate(true)}
                  style={{
                    backgroundColor: '#0d6efd',
                    borderColor: '#0d6efd',
                    color: '#fff'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#343a40';
                    e.target.style.borderColor = '#343a40';
                    e.target.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#0d6efd';
                    e.target.style.borderColor = '#0d6efd';
                    e.target.style.color = '#fff';
                  }}
                >
                  <i className="bx bx-table me-2"></i>
                  Yes, with Tables
                </Button>
              </div>
            </ModalBody>
          </Modal>

          {/* API Key Modal */}
          <Modal isOpen={showApiKeyModal} toggle={toggleApiKeyModal} centered>
            <ModalHeader toggle={toggleApiKeyModal}>
              API Key
            </ModalHeader>
            <ModalBody className="px-4 py-3">
              <ApiKeyManager
                userRNP={userRNP}
                onKeyGenerated={setApiKey}
                generatedKey={apiKey}
                showKey={showApiKey}
                setGeneratedKey={setApiKey}
                setShowKey={setShowApiKey}
              />
            </ModalBody>
            {/* <ModalFooter className="border-top py-2">
              <Button color="light" size="sm" onClick={toggleApiKeyModal}>Close</Button>
            </ModalFooter> */}
          </Modal>

        </div>
      </React.Fragment>
    </Suspense>
  );
};

PdfBuilder.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};
export default withRouter(withTranslation()(PdfBuilder));