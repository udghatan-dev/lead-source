// DynamicPdf/Editor.js
import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, useHistory, useParams, useLocation } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Col, Container, Row, Input, Button, Card, CardBody, Badge } from 'reactstrap';

import Sidebar from './components/Sidebar/sideBar';
import PdfCanvas from './components/canvas/pdfCanvas';
import PageNavigation from './components/Layout/PageNavigation';
import Preloader from '../../Components/Loaders/Preloader';
import MetaTag from '../../Components/Common/Meta';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import CustomNotification from '../../Components/Common/CustomNotification';
import CheckFeatureAccess from '../../common/utils/CheckFeatureAccess';
// Add this line with your other imports
import {
  findPdfExp,
  resetPdfExp,
} from '../../store/actions';

import { loadPdfTemplate, savePdfRequest, resetPdfTemplate } from './store/actions';

const PdfEditor = (props) => {
  const stageRef = useRef();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { id, mode } = useParams();

  //  Define Mode Flags clearly
  const isNew = id === 'new' || location.pathname.endsWith('/pdf/new');
  const isEdit = mode === 'edit';
  const isClone = mode === 'clone';

  const [loading, setLoading] = useState(false);
  const [templateName, setTemplateName] = useState('Untitled Template');

  const {
    isPdfExpCreated,
    isPdfExpUpdated,
    isPdfExpFound,
    pdfExpApiResponse,
    userRNP,
    pages,
    variables
  } = useSelector((state) => ({
    isPdfExpCreated: state.PdfExp.isPdfExpCreated,
    isPdfExpUpdated: state.PdfExp.isPdfExpUpdated,
    isPdfExpFound: state.PdfExp.isPdfExpFound,
    pdfExpApiResponse: state.PdfExp.apiResponse,
    userRNP: state.UserSession.userRNP,
    pages: state.pdfBuilder?.pages || [],
    variables: state.pdfBuilder?.variables || []
  }));

  const transformLayerToElements = (layer) => {
    if (!layer || !Array.isArray(layer)) return [];

    return layer.map(item => {
      const { x, y } = item.pos || { x: 0, y: 0 };
      const props = item.props || {};

      let specificProps = {};

      switch (item.type) {
        case 'text':
        case 'heading':
        case 'textarea':
          specificProps = {
            text: props.content,
            fontFamily: props.fontFamily,
            fontSize: props.fontSize,
            fontStyle: props.fontStyle,
            align: props.align,
            fill: props.fill,
            textDecoration: props.textDecoration,
            padding: props.padding,
            backgroundColor: props.backgroundColor,
            stroke: props.stroke,
            strokeWidth: props.strokeWidth,
            headingLevel: props.headingLevel
          };
          break;
        case 'image':
          specificProps = { imageUrl: props.content };
          break;
        case 'qr':
          specificProps = {
            qrData: props.content,
            qrBackgroundColor: props.bgColor,
            qrTransparentBg: props.bgColor === 'transparent'
          };
          break;
        case 'table':
          specificProps = {
            ...props,
            data: props.data || [['Header 1', 'Header 2'], ['Cell 1', 'Cell 2']],
            isDynamic: props.isDynamic || false,
            columnMappings: props.columnMappings || []
          };
          break;
        default:
          specificProps = { ...props };
      }

      return {
        id: item.id,
        type: item.type,
        x: x,
        y: y,
        width: props.width,
        height: props.height,
        opacity: props.opacity,
        rotation: props.rotation,
        ...specificProps
      };
    });
  };

  // 1. Check Permissions & Load/Reset
  useEffect(() => {
    if (!isNew && mode !== undefined) {
      // Edit or Clone
      if (!CheckFeatureAccess(userRNP, 'dig.img_exp.UPDATE')) {
        return history.push('/pdf');
      }
      if (!isEdit && !isClone) {
        return history.push('/pdf');
      }
      setLoading(true);
      dispatch(findPdfExp({ pdf: id }));
    } else {
      // New
      if (!CheckFeatureAccess(userRNP, 'dig.img_exp.CREATE')) {
        return history.push('/pdf');
      }
      //  Reset State for New Template
      dispatch(resetPdfTemplate());
      setTemplateName("Untitled Template");
    }
  }, [id, mode, isNew, isEdit, isClone, dispatch, userRNP, history]);

  // 2.  FIXED: Handle Template Loaded (Multi-Page Support)
  useEffect(() => {
    if (isPdfExpFound) {
      setLoading(false);
      if (pdfExpApiResponse.success) {
        const template = pdfExpApiResponse.data;

        setTemplateName(isClone ? `${template.name} (Copy)` : template.name);

        let loadedPages = [];
        let loadedVariables = [];

        //  PRIORITY 1: Handle multi-page format (new backend structure)
        if (template.pages && Array.isArray(template.pages) && template.pages.length > 0) {
          loadedPages = template.pages.map((pageData, index) => {
            // Handle both old format (array of elements) and new format (object with width/height/elements)
            const isNewFormat = pageData && typeof pageData === 'object' && !Array.isArray(pageData) && pageData.elements;

            if (isNewFormat) {
              return {
                id: `page-${index + 1}`,
                width: pageData.width,
                height: pageData.height,
                elements: transformLayerToElements(pageData.elements)
              };
            } else {
              // Old format: pageData is directly the elements array
              return {
                id: `page-${index + 1}`,
                elements: transformLayerToElements(pageData)
              };
            }
          });
          loadedVariables = template.variable || [];
        }
        //  PRIORITY 2: Handle single-page format (backward compatibility)
        else if (template.layer && Array.isArray(template.layer)) {
          loadedPages = [{
            id: 'page-1',
            elements: transformLayerToElements(template.layer)
          }];
          loadedVariables = template.variable || [];
        }
        //  FALLBACK: Empty template
        else {
          loadedPages = [{ id: 'page-1', elements: [] }];
          loadedVariables = [];
        }

        dispatch(loadPdfTemplate({
          name: isClone ? `${template.name} (Copy)` : template.name,
          pages: loadedPages,
          variables: loadedVariables
        }));

        CustomNotification.success(props.t('Template loaded successfully'));
      } else {
        CustomNotification.error(props.t(pdfExpApiResponse.data));
      }

      dispatch(resetPdfExp('apiResponse', {}));
      dispatch(resetPdfExp('isPdfExpFound', false));

      if (!pdfExpApiResponse.success) {
        setTimeout(() => history.push('/pdf'), 500);
      }
    }
  }, [isPdfExpFound, pdfExpApiResponse, isClone, history, dispatch, props]);

  // 3. Handle Created
  useEffect(() => {
    if (isPdfExpCreated) {
      setLoading(false);
      if (pdfExpApiResponse.success) {
        CustomNotification.success(props.t('PDF Template Created'));
      } else {
        CustomNotification.error(props.t(pdfExpApiResponse.data));
      }
      dispatch(resetPdfExp('apiResponse', {}));
      dispatch(resetPdfExp('isPdfExpCreated', false));
      if (pdfExpApiResponse.success) {
        setTimeout(() => history.push('/pdf'), 500);
      }
    }
  }, [isPdfExpCreated, pdfExpApiResponse, dispatch, history, props]);

  // 4. Handle Updated
  useEffect(() => {
    if (isPdfExpUpdated) {
      setLoading(false);
      if (pdfExpApiResponse.success) {
        CustomNotification.success(props.t('PDF Template Updated'));
      } else {
        CustomNotification.error(props.t(pdfExpApiResponse.data));
      }
      dispatch(resetPdfExp('apiResponse', {}));
      dispatch(resetPdfExp('isPdfExpUpdated', false));
      if (pdfExpApiResponse.success) {
        setTimeout(() => history.push('/pdf'), 500);
      }
    }
  }, [isPdfExpUpdated, pdfExpApiResponse, dispatch, history, props]);

  const savePdfTemplate = () => {
    if (templateName.trim().length === 0) return CustomNotification.error(props.t('Template name is required'));
    if (pages.length === 0) return CustomNotification.error(props.t('Add at least one page'));

    for (let index = 0; index < variables.length; index++) {
      const variable = variables[index];
      if (variable.name.trim().length === 0) return CustomNotification.error(props.t(`Variable #${index + 1} name is missing`));
      if (variable.fallback === undefined || variable.fallback === null || variable.fallback === '') return CustomNotification.error(props.t(`Variable #${index + 1} fallback is missing`));
    }

    setLoading(true);

    const templateId = isEdit ? id : null;

    dispatch(savePdfRequest({
      id: templateId,
      name: templateName
    }));
  };

  return (
    <React.Fragment>
      <div className='page-content'>
        <MetaTag pageTitle={`${templateName} | PDF Editor`} />
        <Container fluid className="p-2">
          <BreadCrumb title='Editor' pageTitle={props.t('Dynamic PDF Editor')} />
          <Row className="g-2">
            <Col lg={3}>
              <Sidebar />
              <PageNavigation style={{ marginTop: '-20px' }} />
            </Col>
            <Col lg={9}>

              <Card className="border shadow-sm">
                <CardBody className="p-2">
                  <div className="d-flex align-items-center justify-content-between gap-3">

                    {/* 1. INPUT NAME */}
                    <div className="flex-grow-1" style={{ maxWidth: '400px' }}>
                      <Input
                        type="text"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder={props.t('Template Name')}
                        bsSize="sm"
                        style={{ fontSize: '14px', fontWeight: '500' }}
                      />
                    </div>

                    {/* 2. INFO / STATS */}
                    <div className="d-flex gap-3 text-muted" style={{ fontSize: '12px' }}>
                      <div className="d-flex align-items-center gap-1">
                        <i className='bx bx-file'></i>
                        <span>{pages?.length || 0} {props.t('Pages')}</span>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <i className='bx bx-data'></i>
                        <span>{variables?.length || 0} {props.t('Variables')}</span>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        {/*  Mode Badges */}
                        {isNew && <Badge color="success" pill className="px-3 py-1">{props.t('New Template')}</Badge>}
                        {isEdit && <Badge color="warning" pill className="px-3 py-1">{props.t('Editing')}</Badge>}
                        {isClone && <Badge color="info" pill className="px-3 py-1">{props.t('Cloning')}</Badge>}
                      </div>
                    </div>

                    {/* 3. BUTTONS (BACK & SAVE) */}
                    <div className="d-flex gap-2">
                      {/*  Back Button (Beside Save) */}
                      <Button
                        color="light"
                        size="sm"
                        onClick={() => history.push('/pdf')}
                        className="d-flex align-items-center border"
                        style={{ fontSize: '12px' }}
                        title={props.t('Back to List')}
                      >
                        <i className='bx bx-arrow-back me-1'></i>
                        {props.t('Back')}
                      </Button>

                      {/* Save Button */}
                      <Button
                        color="success"
                        size="sm"
                        onClick={savePdfTemplate}
                        className="d-flex align-items-center"
                        style={{ fontSize: '12px' }}
                      >
                        <i className='bx bx-save me-1'></i>
                        {props.t('Save')}
                      </Button>
                    </div>

                  </div>
                </CardBody>
              </Card>

              <div style={{ marginTop: '-15px' }}>
                <PdfCanvas ref={stageRef} />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      {loading && <Preloader />}
    </React.Fragment>
  );
};

PdfEditor.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(PdfEditor));