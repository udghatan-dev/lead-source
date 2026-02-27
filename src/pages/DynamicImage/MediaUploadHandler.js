import React, { useState, useEffect, useRef } from 'react';
import SimpleBar from 'simplebar-react';
import { Input, Row, Col, Card, CardHeader, CardBody } from 'reactstrap';

import { toast } from 'react-toastify';
import Dropzone from 'react-dropzone';
import AWSS3 from './../../Components/Common/AWS';
import uniqid from 'uniqid';

function FileManager(props) {
  const [formError, setFormError] = useState(null);

  const [identifier, setIdentifier] = useState('');
  const [type, setType] = useState('');
  const [multi, setMulti] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setIdentifier(props.data.identifier);
    setType(props.data.type);
    setMulti(props.data.multi ?? false);
  }, [props]);

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  function handleAcceptedFiles(files) {
    if (files.length === 1) {
      files.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          formattedSize: formatBytes(file.size),
        })
      );
      setFile(files);
    } else if (multi) {
      files.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          formattedSize: formatBytes(file.size),
        })
      );
      setFile(files);
    }
  }

  function uploadHeaderMedia() {
    return new Promise(async (resolve, reject) => {
      try {
        let locations = [];
        for (let index = 0; index < file.length; index++) {
          const local_file = file[index];
          var params = {
            Bucket: 'confidentialcontent',
            Key: 'flow/workflow/' + uniqid() + '.' + local_file.name.split('.').pop(),
            Body: local_file,
            ContentType: local_file.type,
            ACL: 'public-read',
          };

          var options = {
            partSize: 10 * 1024 * 1024, // 10 MB
            queueSize: 10,
          };

          try {
            let data = await AWSS3.upload(params, options).promise();
            locations.push({
              index: index,
              location: data.Location,
            });
          } catch (error) {}
        }
        if (locations.length === 0) {
          reject('Facing some issue');
        }
        resolve(locations);
      } catch (error) {
        reject(error.message);
      }
    });
  }

  function uploadContent() {
    setLoading(true);
    uploadHeaderMedia()
      .then((response) => {
        setLoading(false);
        if (!multi) {
          if (type === 'document') {
            props.successCallback([
              [identifier, response[0].location],
              ['filename', file[0].name.split('.')[0]],
            ]);
          } else {
            props.successCallback([[identifier, response[0].location]]);
          }
        } else {
          let payload = [];
          response.map((a) => {
            if (type === 'document') {
              payload.push({
                identifier: identifier,
                link: a.location,
                filename: file[a.index].name.split('.')[0],
              });
            } else {
              payload.push({
                identifier: identifier,
                link: a.location,
              });
            }
          });
          props.successCallback(payload, true);
        }
        toast.success('File Uploaded Successfully', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        props.closePopup({ status: false, target: '' });
      })
      .catch((error) => {
        toast.error('File Uploading Failed', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
  }

  return (
    <>
      <Col>
        <Card className=''>
          <CardHeader className='py-1'>
            <div className='d-flex align-items-center justify-content-between'>
              <h4 className='card-title mb-0'>File Manager</h4>
              <div className='d-flex align-items-center justify-content-between'>
                <button
                  onClick={() => props.closePopup({ status: false, target: '' })}
                  type='button'
                  className='btn btn-icon btn-topbar btn-ghost-secondary rounded-circle'
                >
                  <i className={'bx bx-x fs-24'}></i>
                </button>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className='mx-n3 my-n3'>
              {formError !== null && (
                <div className='d-flex justify-content-start align-items-center p-3 pb-1'>
                  <label className='text-danger'>{formError}</label>
                </div>
              )}
              {file == null && (
                <div className='p-4'>
                  <Dropzone
                    multiple={multi}
                    //maxFiles={1}
                    maxSize={
                      type === 'image'
                        ? props.data.limit !== undefined
                          ? props.data.limit
                          : 5242880
                        : type === 'video'
                        ? 16777216
                        : 104857600
                    }
                    accept={type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : type === 'audio' ? 'audio/*' : ''}
                    onDrop={(acceptedFiles) => {
                      handleAcceptedFiles(acceptedFiles);
                    }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div className='dropzone dz-clickable d-flex flex-column justify-content-center align-items-center'>
                        <div className='dz-message needsclick' {...getRootProps()}>
                          <div className='mb-3'>
                            <i className='display-4 text-muted ri-upload-cloud-2-fill' />
                          </div>
                          <h4 className='fs-14'>Drop file here or click to upload</h4>
                        </div>
                      </div>
                    )}
                  </Dropzone>
                </div>
              )}

              <div className='p-1 px-3 list-unstyled mb-0' id='file-previews'>
                <SimpleBar style={{ maxHeight: '220px', overflowX: 'hidden' }}>
                  {file !== null &&
                    file.map((f, i) => {
                      return (
                        <Card
                          className='mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete'
                          key={i + '-file'}
                        >
                          <div className='p-2'>
                            <Row className='align-items-center'>
                              <Col className='col-auto'>
                                <img
                                  height='80'
                                  className='avatar-sm rounded bg-light'
                                  alt={f.name}
                                  src={
                                    type === 'image'
                                      ? f.preview
                                      : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAJYCAIAAAAxBA+LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk4NTA4QkJFMjBENTExRTZCQTkxOTI4OTEwNjBBMEM0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk4NTA4QkJGMjBENTExRTZCQTkxOTI4OTEwNjBBMEM0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTg1MDhCQkMyMEQ1MTFFNkJBOTE5Mjg5MTA2MEEwQzQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTg1MDhCQkQyMEQ1MTFFNkJBOTE5Mjg5MTA2MEEwQzQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz70lpqjAAAXzklEQVR42uzd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zz8v8vlTJDBmkJ999tllOoovplnVmRQOuIjohK4vOgn9FjMHTPvir5A8I9aRMvy78TEEFBR9GuGomSsni3J3796Nju7u7saPv3jx4uxnPLGFik1b8pbil8PNmzcv8knhGMUfIoY6f5pKzKVGu7xcKZJr5ufeOip/nVIh5FTt+PjYKAAwtyyNAiCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEACCEAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAAghAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIAEIIgBAaAgCEEACEEACEEACEEACEEACEEACEEACEEACEEACEEACEEACEEACEEACEEACEEACEEACEEACEEACEEACEEACEEACEEACEEACEEACEEACEEADK838CDADieI1FiCxmagAAAABJRU5ErkJggg=='
                                  }
                                />
                              </Col>
                              <Col className='p-2'>
                                <a
                                  href={f.preview}
                                  target='_blank'
                                  className='text-muted font-weight-bold w-100 text-truncate'
                                  style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}
                                >
                                  {f.name}
                                </a>
                                <p className='mb-0'>
                                  <strong>{f.formattedSize}</strong>
                                </p>
                                <div style={{ position: 'absolute', right: 10, top: '-10px' }}>
                                  <i
                                    className='ri-close-line fs-16 text-danger btn btn-sm p-0 m-0'
                                    onClick={() => (loading !== true ? setFile(null) : '')}
                                  ></i>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      );
                    })}
                </SimpleBar>
              </div>

              {file !== null && (
                <div className='p-3'>
                  <button className='btn btn-primary btn-sm' onClick={() => uploadContent()} disabled={loading}>
                    {loading ? 'Uploading...' : 'Start Upload'}
                  </button>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}
export default FileManager;
