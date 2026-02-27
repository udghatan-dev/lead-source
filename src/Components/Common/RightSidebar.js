import React, { useState } from 'react';
import { Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap';

import { Label, Input } from 'reactstrap';
import Select from 'react-select';
import { ToastMe } from './../../Components/Common/ToastInit';
import Preloader from './../../Components/Loaders/Preloader';
import Alert from './../../Components/Alerts';

import AWSS3 from './../../Components/Common/AWS';
import uniqid from 'uniqid';

//redux
import { createSupportTicket, resetSupportTicket } from '../../store/actions';
import { useSelector, useDispatch } from 'react-redux';

//SimpleBar
import SimpleBar from 'simplebar-react';
import { useHistory } from 'react-router-dom';

const productsArray = [
  { label: 'WABA', value: 'WABA' },
  { label: 'CRM', value: 'CRM' },
  { label: 'Automation Builder', value: 'Automation Builder' },
  { label: 'Live Chat', value: 'Live Chat' },
  { label: 'Subscription', value: 'Subscription' },
  { label: 'Sales', value: 'Sales' },
];

const WABAFunctionalityArray = [
  { label: 'New WABA Registeration', value: 'New WABA Registeration' },
  { label: 'Template', value: 'Template' },
  { label: 'Webhook', value: 'Webhook' },
  { label: 'Conversation Billing', value: 'Conversation Billing' },
  { label: 'Business Profile', value: 'Business Profile' },
  { label: 'WABA Sharing', value: 'WABA Sharing' },
  { label: 'Other', value: 'Other' },
];

const CRMFunctionalityArray = [
  { label: 'Channel', value: 'Channel' },
  { label: 'Contact', value: 'Contact' },
  { label: 'Custom Field', value: 'Custom Field' },
  { label: 'Segments', value: 'Segments' },
  { label: 'Broadcast', value: 'Broadcast' },
  { label: 'Canned Replies', value: 'Canned Replies' },
  { label: 'Subscription', value: 'Subscription' },
  { label: 'Event Hook', value: 'Event Hook' },
  { label: 'Channel-Group', value: 'Channel-Group' },
  { label: 'Mass Broadcast', value: 'Mass Broadcast' },
  { label: 'Media Uploading issue', value: 'Media Uploading issue' },
  { label: 'Other', value: 'Other' },
];

const AutomationFunctionalityArray = [
  { label: 'Workflow', value: 'Workflow' },
  { label: 'Bot Field', value: 'Bot Field' },
  { label: 'Data Store', value: 'Data Store' },
  { label: 'Other', value: 'Other' },
];

const LiveChatFunctionalityArray = [
  { label: 'Chat Filter', value: 'Chat Filter' },
  { label: 'Chat Update', value: 'Chat Update' },
  { label: 'Message Sending', value: 'Message Sending' },
  { label: 'Other', value: 'Other' },
];

const SubscriptionFunctionalityArray = [
  { label: 'Code Redeem Issue', value: 'Code Redeem Issue' },
  { label: 'Other', value: 'Other' },
];

const SalesFunctionalityArray = [{ label: 'Other', value: 'Other' }];

const AccessDurationArray = [
  { label: '24 Hours', value: 24 },
  { label: '48 Hours', value: 48 },
  { label: '72 Hours', value: 72 },
];

const RightSidebar = ({ open, setOpen, handleClose }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { isCreated, apiResponse, userRNP } = useSelector((state) => ({
    isCreated: state.SupportTicket.isCreated,
    apiResponse: state.SupportTicket.apiResponse,
    userRNP: state.UserSession.userRNP,
  }));

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  // open offcanvas
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  //const [open, setOpen] = useState(false);
  const [mouseEffect, setMouseEffect] = useState(false);
  const toggleLeftCanvas = () => {
    if (open) {
      if (window.confirm('Do you want to leave ticket window?')) {
        handleClose();
      }
    } else {
      handleClose();
    }
  };

  const [functionalityOptions, setFunctionalityOptions] = useState([]);

  const [mediaFiles, setMediaFiles] = useState([]);
  const [product, setProduct] = useState('');
  const [functionality, setFunctionality] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [accessToAgent, setAccessToAgent] = useState(false);
  const [accessTime, setAccessTime] = useState(24);

  const [openAlert, setOpenAlert] = useState({
    status: false,
  });

  const handleCloseAlert = () => {
    setOpenAlert({ status: false });
  };

  React.useEffect(() => {
    if (product.value === 'WABA') {
      setFunctionalityOptions(WABAFunctionalityArray);
    } else if (product.value === 'CRM') {
      setFunctionalityOptions(CRMFunctionalityArray);
    } else if (product.value === 'Automation Builder') {
      setFunctionalityOptions(AutomationFunctionalityArray);
    } else if (product.value === 'Live Chat') {
      setFunctionalityOptions(LiveChatFunctionalityArray);
    } else if (product.value === 'Subscription') {
      setFunctionalityOptions(SubscriptionFunctionalityArray);
    } else if (product.value === 'Sales') {
      setFunctionalityOptions(SalesFunctionalityArray);
    } else {
      setFunctionalityOptions([]);
    }
  }, [product]);

  React.useEffect(() => {
    resetModule();
  }, [open]);

  React.useEffect(() => {
    if (isCreated) {
      setLoading(false);
      if (apiResponse.success) {
        setOpen(false);
        setOpenAlert({
          status: true,
          type: 'success',
          title: 'Ticket Created Successfully',
          body: '',
          onCancel: handleCloseAlert,
          onConfirm: handleCloseAlert,
        });
      } else {
        setOpenAlert({
          status: true,
          type: 'danger',
          title: 'Failed to Create Ticket',
          body: apiResponse.data,
          onCancel: handleCloseAlert,
          onConfirm: handleCloseAlert,
        });
      }
      dispatch(resetSupportTicket('isCreated', false));
      dispatch(resetSupportTicket('apiResponse', {}));
    }
  }, [isCreated]);

  function resetModule() {
    setFunctionalityOptions([]);
    setMediaFiles([]);
    setProduct('');
    setFunctionality('');
    setSubject('');
    setBody('');
    setAccessToAgent(false);
    setAccessTime(24);
  }

  React.useEffect(() => {
    if (location.pathname.includes('waba')) {
      setProduct(productsArray.filter((o) => o.value === 'WABA'));
    }
    if (location.pathname.includes('crm')) {
      setProduct(productsArray.filter((o) => o.value === 'CRM'));
    }
    if (location.pathname.includes('automation')) {
      setProduct(productsArray.filter((o) => o.value === 'Automation Builder'));
    }
  }, [location.pathname]);

  function saveAttachment(e, type) {
    var totalSize = 0;
    var objectUrl = URL.createObjectURL(e.target.files[0]);
    var files = mediaFiles.concat([
      {
        type: type,
        link: objectUrl,
        file: e.target.files[0],
      },
    ]);
    files.map((file) => {
      totalSize += file.file.size;
    });
    if (totalSize > 1024 * 1024 * 10) {
      showMediaError();
    } else {
      setMediaFiles(files);
    }
  }

  function showMediaError() {
    setError('Maximum attachment size is 10MB');
    setTimeout(() => {
      setError(null);
    }, 5000);
  }

  function createUploadOption(localLink) {
    var mFiles = mediaFiles.filter((media) => media.link === localLink);
    if (mFiles.length > 0) {
      var mediaFile = mFiles[0];
      var params = {
        Bucket: 'confidentialcontent',
        Key: 'ticket/' + uniqid() + '.' + mediaFile.file.name.split('.').pop(),
        Body: mediaFile.file,
        ContentType: mediaFile.file.type,
        ACL: 'public-read',
      };
      return params;
    } else {
      return null;
    }
  }

  async function submitTicket() {
    try {
      if (subject.trim().length === 0) {
        ToastMe('danger', 'top-right', 'Subject is required', 2000);
        return;
      }
      if (body.trim().length === 0) {
        ToastMe('danger', 'top-right', 'Kindly write explanation for ticket', 2000);
        return;
      }
      setLoading(true);
      var attachment = [];
      if (mediaFiles.length > 0) {
        for (var i = 0; i < mediaFiles.length; i++) {
          var file = mediaFiles[i];
          var params = createUploadOption(file.link);
          var d = await AWSS3.upload(params).promise();
          attachment.push({
            name: file.file.name,
            size: file.file.size,
            type: file.type,
            link: d.Location,
          });
        }
      }

      var due_date = new Date().getTime() + 3 * 24 * 60 * 60 * 1000;

      var expiry = 0;
      if (accessToAgent) {
        expiry = new Date().getTime() + parseInt(accessTime.value) * 60 * 60 * 1000;
        expiry = new Date(expiry).getTime();
      }

      var finalJson = {
        display_id:
          '#S' +
          parseInt(new Date().getTime() / 1000)
            .toString()
            .slice(2),
        panel: location.hostname,
        ticket: {
          category: product.value,
          sub_category: functionality.value,
          subject: subject,
          message: body,
          attachments: attachment,
        },
        client: {
          account_access: accessToAgent,
          access_time: accessToAgent === true ? accessTime.value : 0,
          expiry: expiry,
        },
        status: 'new',
        issue_type: '',
        tag: [],
        priority: 'normal',
        is_escalated: userRNP.role === 'white_label_agency' ? true : false,
        //is_escalated: false,
        marked_as_bug: false,
        support_agent: '',
        deleted: false,
        created_on: new Date().getTime(),
        due_on: due_date,
        updated_on: new Date().getTime(),
      };

      dispatch(createSupportTicket(finalJson));
    } catch (error) {
      setLoading(false);
    }
  }

  return (
    <React.Fragment>
      <div>
        {/* <div
          className={classnames(
            { 'customizer-setting d-md-block': !window.location.href.includes('/products/crmv2/chat') },
            { 'd-none': window.location.href.includes('/products/crmv2/chat') }
          )}
        >
          <div
            onClick={toggleLeftCanvas}
            className={
              mouseEffect
                ? 'btn-primary btn-rounded shadow-lg btn btn-icon btn-lg p-2 rounded-2'
                : 'btn-info btn-rounded shadow-lg btn btn-icon btn-md p-0'
            }
            onMouseEnter={() => setMouseEffect(true)}
            onMouseLeave={() => setMouseEffect(false)}
          >
            {mouseEffect ? <i className='bx bx-support bx-tada fs-24'></i> : <i className='bx bx-support fs-22'></i>}
          </div>
        </div> */}
        <Offcanvas isOpen={open} toggle={toggleLeftCanvas} direction='end' className='offcanvas-end border-0'>
          <OffcanvasHeader
            className='d-flex align-items-center bg-primary bg-gradient p-3 py-2 offcanvas-header-dark'
            toggle={toggleLeftCanvas}
          >
            <span className='m-0 me-2 text-white'>Support Ticket</span>
          </OffcanvasHeader>
          <OffcanvasBody className='p-0'>
            <SimpleBar className='h-100'>
              <div className='p-4'>
                <div className='row'>
                  <div className='col-12 mb-1'>
                    <Label className='form-label text-muted fs-14'>Create New Ticket</Label>
                  </div>

                  <div className='col-12 mb-3'>
                    <Label className='form-label text-muted fs-12'>Select Issue Category</Label>
                    <Select options={productsArray} onChange={(e) => setProduct(e)} value={product} />
                  </div>

                  {product.value !== undefined && product.value !== '' && (
                    <div className='col-12 mb-3'>
                      <Label className='form-label text-muted fs-12'>Select Issue Sub-Category</Label>
                      <Select options={functionalityOptions} onChange={(e) => setFunctionality(e)} value={functionality} />
                    </div>
                  )}

                  {functionality.value !== undefined && functionality.value !== '' && (
                    <div className='col-12 mb-3'>
                      <Label className='form-label text-muted fs-12'>Subject</Label>
                      <input
                        placeholder='Subject'
                        className='form-control'
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        maxLength={72}
                      />
                    </div>
                  )}

                  {functionality.value !== undefined && functionality.value !== '' && (
                    <div className='col-12 mb-3'>
                      <Label className='form-label text-muted fs-12'>Message</Label>
                      <textarea
                        rows={6}
                        placeholder='Write more about your issue'
                        className='form-control'
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                      ></textarea>
                    </div>
                  )}

                  {functionality.value !== undefined && functionality.value !== '' && (
                    <div className='col-12 mb-1'>
                      <input
                        type='file'
                        id={'ticket-attachments-image'}
                        style={{ display: 'none' }}
                        accept='image/*'
                        onChange={(e) => saveAttachment(e, 'image')}
                      />
                      <input
                        type='file'
                        id={'ticket-attachments-video'}
                        style={{ display: 'none' }}
                        accept='video/*'
                        onChange={(e) => saveAttachment(e, 'video')}
                      />
                      <input
                        type='file'
                        id={'ticket-attachments-document'}
                        style={{ display: 'none' }}
                        accept='*/*'
                        onChange={(e) => saveAttachment(e, 'file')}
                      />
                      <Label className='form-label text-muted fs-24' htmlFor={'ticket-attachments-image'}>
                        <i className='bx bx-image-add no-effect-cursor-pointer'></i>
                      </Label>
                      &nbsp;&nbsp;
                      <Label className='form-label text-muted fs-24 px-2' htmlFor={'ticket-attachments-video'}>
                        <i className='bx bxs-videos no-effect-cursor-pointer'></i>
                      </Label>
                      &nbsp;&nbsp;
                      <Label className='form-label text-muted fs-24' htmlFor={'ticket-attachments-document'}>
                        <i className='bx bxs-file-doc no-effect-cursor-pointer'></i>
                      </Label>
                    </div>
                  )}

                  {error !== null && (
                    <div className='col-12 mt-n2'>
                      <Label className='form-label text-danger'>{error}</Label>
                    </div>
                  )}

                  {mediaFiles.length > 0 ? (
                    <div className='col-12 mb-3'>
                      <Label className='form-label text-muted fs-12'>Attachements</Label>
                      <br />
                      {mediaFiles.map((media, index) => {
                        return (
                          <div className='d-flex justify-content-between align-items-center' key={'attachment-' + index}>
                            <label
                              className='btn-link no-effect-cursor-pointer w-25 text-truncate'
                              onClick={() => window.open(media.link, '_blank')}
                            >
                              {media.file.name}
                            </label>
                            <label className='text-muted'>{formatBytes(media.file.size)}</label>
                            <i
                              className='bx bx-x text-danger fs-22 no-effect-cursor-pointer'
                              onClick={(e) => setMediaFiles(mediaFiles.filter((o, i) => i !== index))}
                            ></i>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    ''
                  )}

                  {functionality.value !== undefined && functionality.value !== '' && (
                    <div className='col-12 mb-1'>
                      <div className='form-check form-switch-success'>
                        <Input
                          className='form-check-input'
                          id='access_account'
                          type='checkbox'
                          checked={accessToAgent}
                          onChange={(e) => {
                            setAccessToAgent(e.target.checked);
                            setAccessTime(AccessDurationArray[0]);
                          }}
                        />
                        <Label className='form-label text-muted fs-14' htmlFor='access_account'>
                          Give Account Access to Support Agent
                        </Label>
                      </div>
                    </div>
                  )}

                  {accessToAgent && (
                    <div className='col-12 mb-3'>
                      <Label className='form-label text-muted fs-12'>Select Access Duration</Label>
                      <Select options={AccessDurationArray} onChange={(e) => setAccessTime(e)} value={accessTime} />
                    </div>
                  )}

                  {functionality.value !== undefined && functionality.value !== '' && (
                    <div className='col-12 mb-1'>
                      <button className='btn btn-primary btn-sm w-100' onClick={() => submitTicket()}>
                        Submit
                      </button>
                    </div>
                  )}

                  {history.location.pathname !== '/workspace/ticket' && (
                    <div className='col-12 mb-1 d-flex justify-content-center'>
                      <button
                        className='btn btn-success btn-sm d-flex justify-content-center align-items-center w-50'
                        onClick={() => {
                          history.push('/workspace/ticket');
                          setOpen(!open);
                        }}
                      >
                        <i className='las la-life-ring' style={{ fontSize: '22px' }}></i>&nbsp;&nbsp; See All Tickets
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </SimpleBar>
          </OffcanvasBody>
        </Offcanvas>
        {loading && <Preloader />}
        {openAlert.status === true ? <Alert {...openAlert} /> : ''}
      </div>
    </React.Fragment>
  );
};

export default RightSidebar;
