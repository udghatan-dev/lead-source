import React, { useRef, useEffect } from 'react';
import { Row, Col, CardBody, CardHeader, Card, ButtonGroup, Button } from 'reactstrap';
import classnames from 'classnames';
import SimpleBar from 'simplebar-react';
import { Overlay } from 'react-overlays';
import MediaUploadHandler from './..//MediaUploadHandler';
import { useTranslation } from 'react-i18next';

const ImageEditor = ({
  element,
  handlePropsEditCallback,
  handleVariableOpener,
  showVariable,
  triggerRef,
  setShowFileManager,
  fileManagerRef,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <Row>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='d-flex mb-0 align-items-center'>
              {t('URL')}
              <i
                className='bx bx-cloud-upload ms-1 fs-18 btn btn-sm btn-ghost-primary btn-icon text-primary ms-auto'
                ref={fileManagerRef}
                onClick={() => {
                  setShowFileManager({
                    status: true,
                    target: `image_url#${element.id}#content`,
                    module: {
                      target: `image_url#${element.id}#content`,
                      type: 'image',
                      multi: false,
                      limit: 500000,
                    },
                  });
                }}
              ></i>
            </label>
            <input
              type='text'
              className='form-control'
              value={element.props.content}
              onChange={(e) => {
                handlePropsEditCallback(element.id, 'content', e.target.value);
              }}
              id={`image_url#${element.id}#content`}
              onFocus={() => {
                handleVariableOpener('open', `image_url#${element.id}#content`);
              }}
              ref={showVariable.target === `image_url#${element.id}#content` ? triggerRef : null}
            />
          </div>
        </Col>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='fs-12 text-muted'>{t('Opacity')}</label>
            <input
              type='number'
              min={0}
              max={100}
              className='form-control'
              value={parseFloat(element.props.opacity).toFixed(2) * 100}
              onChange={(e) => {
                handlePropsEditCallback(element.id, 'opacity', Number(e.target.value) / 100);
              }}
            />
          </div>
        </Col>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='fs-12 text-muted'>{t('Width')}</label>
            <input
              type='number'
              className='form-control'
              value={element.props.width}
              onChange={(e) => {
                handlePropsEditCallback(element.id, 'width', Number(e.target.value));
              }}
            />
          </div>
        </Col>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='fs-12 text-muted'>{t('Height')}</label>
            <input
              type='number'
              className='form-control'
              value={element.props.height}
              onChange={(e) => {
                handlePropsEditCallback(element.id, 'height', Number(e.target.value));
              }}
            />
          </div>
        </Col>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='fs-12 text-muted'>{t('Border Color')}</label>
            <input
              type='color'
              className='form-control'
              value={element.props.stroke}
              onChange={(e) => {
                handlePropsEditCallback(element.id, 'stroke', e.target.value);
              }}
            />
          </div>
        </Col>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='fs-12 text-muted'>{t('Border Width')}</label>
            <input
              type='number'
              className='form-control'
              value={element.props.strokeWidth}
              onChange={(e) => {
                handlePropsEditCallback(element.id, 'strokeWidth', Number(e.target.value));
              }}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

const TextEditor = ({ element, handlePropsEditCallback, handleVariableOpener, showVariable, triggerRef }) => {
  const { t } = useTranslation();
  return (
    <>
      <Row>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='text-muted fs-12'>{t('Content')}</label>
            <input
              className='form-control'
              type='text'
              value={element.props.content}
              onChange={(e) => {
                handlePropsEditCallback(element.id, 'content', e.target.value);
              }}
              id={`text_content#${element.id}#content`}
              onFocus={() => {
                handleVariableOpener('open', `text_content#${element.id}#content`);
              }}
              ref={showVariable.target === `text_content#${element.id}#content` ? triggerRef : null}
            />
          </div>
        </Col>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='text-muted fs-12'>{t('Font Color')}</label>
            <input
              className='form-control'
              type='color'
              value={element.props.fill}
              onChange={(e) => {
                handlePropsEditCallback(element.id, 'fill', e.target.value);
              }}
            />
          </div>
        </Col>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='text-muted fs-12'>{t('Font Family')}</label>
            <input
              className='form-control'
              type='text'
              value={element.props.fontFamily}
              onChange={(e) => {
                handlePropsEditCallback(element.id, 'fontFamily', e.target.value);
              }}
            />
          </div>
        </Col>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='text-muted fs-12'>{t('Font Size')}</label>
            <input
              className='form-control'
              type='text'
              value={element.props.fontSize}
              onChange={(e) => {
                handlePropsEditCallback(element.id, 'fontSize', e.target.value);
              }}
            />
          </div>
        </Col>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='text-muted fs-12 d-flex'>{t('Font Style')}</label>
            <ButtonGroup className='mt-4 mt-sm-0 gap-1'>
              <Button
                color='light'
                className={classnames('btn-icon btn-sm material-shadow-none', {
                  'bg-dark text-white': element.props.fontStyle.indexOf('bold') !== -1,
                })}
                onClick={(e) => {
                  if (element.props.fontStyle.indexOf('bold') !== -1) {
                    handlePropsEditCallback(element.id, 'fontStyle', element.props.fontStyle.replace('bold', ''));
                  } else {
                    handlePropsEditCallback(element.id, 'fontStyle', (element.props.fontStyle + ' bold').trim());
                  }
                }}
              >
                <i className='ri-bold' />
              </Button>
              <Button
                color='light'
                className={classnames('btn-icon btn-sm material-shadow-none', {
                  'bg-dark text-white': element.props.fontStyle.indexOf('italic') !== -1,
                })}
                onClick={(e) => {
                  if (element.props.fontStyle.indexOf('italic') !== -1) {
                    handlePropsEditCallback(element.id, 'fontStyle', element.props.fontStyle.replace('italic', ''));
                  } else {
                    handlePropsEditCallback(element.id, 'fontStyle', (element.props.fontStyle + ' italic').trim());
                  }
                }}
              >
                <i className='ri-italic' />
              </Button>
            </ButtonGroup>
          </div>
        </Col>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='text-muted fs-12 d-flex'>{t('Font Align')}</label>
            <ButtonGroup className='mt-4 mt-sm-0'>
              <Button
                color='light'
                className={classnames('btn-icon btn-sm material-shadow-none', {
                  'bg-dark text-white': element.props.align === 'left',
                })}
                onClick={(e) => {
                  handlePropsEditCallback(element.id, 'align', 'left');
                }}
              >
                <i className='ri-align-right' />
              </Button>
              <Button
                color='light'
                className={classnames('btn-icon btn-sm material-shadow-none', {
                  'bg-dark text-white': element.props.align === 'center',
                })}
                onClick={(e) => {
                  handlePropsEditCallback(element.id, 'align', 'center');
                }}
              >
                <i className='ri-align-center' />
              </Button>
              <Button
                color='light'
                className={classnames('btn-icon btn-sm material-shadow-none', {
                  'bg-dark text-white': element.props.align === 'right',
                })}
                onClick={(e) => {
                  handlePropsEditCallback(element.id, 'align', 'right');
                }}
              >
                <i className='ri-align-left' />
              </Button>
            </ButtonGroup>
          </div>
        </Col>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='text-muted fs-12 d-flex'>{t('Vertical Align')}</label>
            <ButtonGroup className='mt-4 mt-sm-0'>
              <Button
                color='light'
                className={classnames('btn-icon btn-sm material-shadow-none', {
                  'bg-dark text-white': element.props.verticalAlign === 'top',
                })}
                onClick={(e) => {
                  handlePropsEditCallback(element.id, 'verticalAlign', 'top');
                }}
              >
                <i className='ri-align-top' />
              </Button>
              <Button
                color='light'
                className={classnames('btn-icon btn-sm material-shadow-none', {
                  'bg-dark text-white': element.props.verticalAlign === 'middle',
                })}
                onClick={(e) => {
                  handlePropsEditCallback(element.id, 'verticalAlign', 'middle');
                }}
              >
                <i className='ri-align-vertically' />
              </Button>
              <Button
                color='light'
                className={classnames('btn-icon btn-sm material-shadow-none', {
                  'bg-dark text-white': element.props.verticalAlign === 'bottom',
                })}
                onClick={(e) => {
                  handlePropsEditCallback(element.id, 'verticalAlign', 'bottom');
                }}
              >
                <i className='ri-align-bottom' />
              </Button>
            </ButtonGroup>
          </div>
        </Col>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='text-muted fs-12'>{t('Width')}</label>
            <input
              className='form-control'
              type='number'
              value={element.props.width}
              onChange={(e) => {
                handlePropsEditCallback(element.id, 'width', Number(e.target.value));
              }}
            />
          </div>
        </Col>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='text-muted fs-12'>{t('Height')}</label>
            <input
              className='form-control'
              type='number'
              value={element.props.height}
              onChange={(e) => {
                handlePropsEditCallback(element.id, 'height', Number(e.target.value));
              }}
            />
          </div>
        </Col>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='text-muted fs-12'>{t('Border Color')}</label>
            <input
              className='form-control'
              type='color'
              value={element.props.stroke}
              onChange={(e) => {
                handlePropsEditCallback(element.id, 'stroke', e.target.value);
              }}
            />
          </div>
        </Col>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='text-muted fs-12'>{t('Border Width')}</label>
            <input
              className='form-control'
              type='number'
              value={element.props.strokeWidth}
              onChange={(e) => {
                handlePropsEditCallback(element.id, 'strokeWidth', Number(e.target.value));
              }}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

const QREditor = ({ element, handlePropsEditCallback, handleVariableOpener, showVariable, triggerRef }) => {
  const { t } = useTranslation();
  return (
    <>
      <Row>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='text-muted fs-12'>{t('QR Content')}</label>
            <input
              type='text'
              className='form-control'
              value={element.props.content}
              onChange={(e) => {
                handlePropsEditCallback(element.id, 'content', e.target.value);
              }}
              id={`qr_content#${element.id}#content`}
              onFocus={() => {
                handleVariableOpener('open', `qr_content#${element.id}#content`);
              }}
              ref={showVariable.target === `qr_content#${element.id}#content` ? triggerRef : null}
            />
          </div>
        </Col>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='text-muted fs-12'>{t('QR Code Color')}</label>
            <input
              type='color'
              className='form-control'
              value={element.props.fgColor}
              onChange={(e) => {
                handlePropsEditCallback(element.id, 'fgColor', e.target.value);
              }}
            />
          </div>
        </Col>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='text-muted fs-12'>{t('QR Background Color')}</label>
            <input
              type='color'
              className='form-control'
              value={element.props.bgColor}
              onChange={(e) => {
                handlePropsEditCallback(element.id, 'bgColor', e.target.value);
              }}
            />
          </div>
        </Col>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='text-muted fs-12'>{t('Margin')}</label>
            <input
              type='number'
              className='form-control'
              value={element.props.margin}
              onChange={(e) => {
                handlePropsEditCallback(element.id, 'margin', Number(e.target.value));
              }}
            />
          </div>
        </Col>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='text-muted fs-12'>{t('Width')}</label>
            <input
              type='number'
              className='form-control'
              value={element.props.width}
              onChange={(e) => {
                handlePropsEditCallback(element.id, 'width', Number(e.target.value));
              }}
            />
          </div>
        </Col>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='text-muted fs-12'>{t('Height')}</label>
            <input
              type='number'
              className='form-control'
              value={element.props.height}
              onChange={(e) => {
                handlePropsEditCallback(element.id, 'height', Number(e.target.value));
              }}
            />
          </div>
        </Col>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='text-muted fs-12'>{t('Border Color')}</label>
            <input
              type='color'
              className='form-control'
              value={element.props.stroke}
              onChange={(e) => {
                handlePropsEditCallback(element.id, 'stroke', Number(e.target.value));
              }}
            />
          </div>
        </Col>
        <Col lg={12}>
          <div className='mb-2'>
            <label className='text-muted fs-12'>{t('Border Width')}</label>
            <input
              type='number'
              className='form-control'
              value={element.props.strokeWidth}
              onChange={(e) => {
                handlePropsEditCallback(element.id, 'strokeWidth', Number(e.target.value));
              }}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

const ElementEditor = ({
  element,
  handleVariableOpener,
  handlePropsEditCallback,
  triggerRef,
  showVariable,
  setShowFileManager,
  fileManagerRef,
}) => {
  if (element.type === 'image') {
    return (
      <ImageEditor
        element={element}
        handlePropsEditCallback={handlePropsEditCallback}
        handleVariableOpener={handleVariableOpener}
        triggerRef={triggerRef}
        showVariable={showVariable}
        setShowFileManager={setShowFileManager}
        fileManagerRef={fileManagerRef}
      />
    );
  }
  if (element.type === 'qr') {
    return (
      <QREditor
        element={element}
        handlePropsEditCallback={handlePropsEditCallback}
        handleVariableOpener={handleVariableOpener}
        triggerRef={triggerRef}
        showVariable={showVariable}
      />
    );
  }
  if (element.type === 'text') {
    return (
      <TextEditor
        element={element}
        handlePropsEditCallback={handlePropsEditCallback}
        handleVariableOpener={handleVariableOpener}
        triggerRef={triggerRef}
        showVariable={showVariable}
      />
    );
  }
};

const ElementEditorWraper = ({ element, handlePropsEditCallback, selectionCallback, containerRef, variables }) => {
  const { t } = useTranslation();
  const triggerRef = useRef(null);
  const overlayRef = useRef(null);
  const fileManagerRef = useRef(null);

  const [showVariable, setShowVariable] = React.useState({ status: false, target: '' });
  const [showFileManager, setShowFileManager] = React.useState({ status: false, target: '' });

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target) && triggerRef.current && !triggerRef.current.contains(e.target)) {
        setShowVariable({ status: false });
      }
    };
    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, []);

  function handleVariableOpener(action, id) {
    if (action === 'open') {
      setShowVariable({ status: true, target: id });
    } else {
      setShowVariable({ status: false });
    }
  }

  function handleVariable(variable) {
    let target = showVariable.target.split('#');
    let id = target[1];
    let key = target[2];
    let newValue = element.props[key] + '${' + variable + '}';
    handlePropsEditCallback(id, key, newValue);
    setShowVariable({ status: false });
  }

  function fileManagerCallback(data) {
    let targetId = data[0][0];
    let url = data[0][1];
    let target = targetId.split('#');
    let id = target[1];
    let key = target[2];
    let newValue = url;
    handlePropsEditCallback(id, key, newValue);
    setShowFileManager({ status: false });
  }

  return (
    <div ref={containerRef}>
      <CardBody>
        <div className='d-flex justify-content-center mb-3 w-100'>
          <div className='d-flex align-items-center bg-light rounded-3 py-1 px-2 mt-n2 w-100' role='group'>
            <label
              className={classnames(
                'btn btn-sm rounded-3 shadow-none mb-0 me-3 border-0 d-flex align-items-center justify-content-center btn-soft-dark w-25'
              )}
              onClick={() => {
                selectionCallback(null);
              }}
            >
              <i className={classnames('me-1 fs-16 bx bx-arrow-back')}></i>
              {t('Back')}
            </label>
            <label className='mb-0 d-flex align-items-center justify-content-center' ref={triggerRef}>
              {t('Element Editor')}
            </label>
          </div>
        </div>
        <SimpleBar
          autoHide={true}
          className='py-2 px-1 pe-3'
          style={{
            height: '550px',
            width: '105%',
            overflowX: 'hidden',
          }}
        >
          <ElementEditor
            element={element}
            handlePropsEditCallback={handlePropsEditCallback}
            handleVariableOpener={handleVariableOpener}
            triggerRef={triggerRef}
            showVariable={showVariable}
            setShowFileManager={setShowFileManager}
            fileManagerRef={fileManagerRef}
          />
        </SimpleBar>
      </CardBody>

      {showVariable.status && variables.length > 0 && (
        <Overlay
          show={showVariable.status}
          rootClose
          offset={[10, 10]}
          onHide={() => {
            //
          }}
          placement={'right'}
          container={containerRef}
          target={triggerRef}
          flip={true}
        >
          {({ props: propsOverlay, arrowProps, placement }) => {
            propsOverlay = { ...propsOverlay, style: { ...propsOverlay.style, zIndex: 9 } };
            return (
              <div {...propsOverlay} placement={placement} className='col-12'>
                <div className={'map arrow arrow-' + placement}></div>
                <div className='col-12' ref={overlayRef} style={{ maxWidth: '350px' }}>
                  <Card style={{ maxWidth: '250px' }}>
                    <CardHeader className={'py-1'}>Variables</CardHeader>
                    <CardBody>
                      <div className='d-flex flex-column'>
                        {variables.map((variable) => {
                          return (
                            <span
                              className='badge mb-1 btn btn-sm btn-success'
                              style={{ width: 'fit-content' }}
                              onClick={() => {
                                handleVariable(variable.name);
                              }}
                            >
                              {variable.name}
                            </span>
                          );
                        })}
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </div>
            );
          }}
        </Overlay>
      )}

      {showFileManager.status && (
        <Overlay
          show={showFileManager.status}
          rootClose
          offset={[50, 10]}
          onHide={() => {
            //
          }}
          zIndex={9}
          placement={'right'}
          container={containerRef}
          target={fileManagerRef}
          flip={true}
        >
          {({ props, arrowProps, placement }) => {
            props = { ...props, style: { ...props.style, zIndex: 9 } };
            return (
              <div {...props} placement={placement} className='col-12'>
                <div className={'arrow arrow-' + placement}></div>
                <div className='col-12' style={{ width: '450px' }}>
                  <MediaUploadHandler
                    closePopup={setShowFileManager}
                    data={{
                      ...showFileManager.module,
                      identifier: showFileManager.target !== undefined ? showFileManager.target : showFileManager.module.identifier,
                    }}
                    successCallback={fileManagerCallback}
                  />
                </div>
              </div>
            );
          }}
        </Overlay>
      )}
    </div>
  );
};

export default ElementEditorWraper;
