import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Heading from '@tiptap/extension-heading';

// Layout Components
import { Container, Row, Col, Button, Input, Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import MetaTag from '../../Components/Common/Meta';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import Preloader from '../../Components/Loaders/Preloader';
import CheckFeatureAccess from '../../common/utils/CheckFeatureAccess';
import CustomNotification from '../../Components/Common/CustomNotification';

// New Modular Components
import Toolbar from './TableEditor/components/Toolbar';
import VariablesPanel from './TableEditor/components/VariablesPanel';
import TableColumnMapper from './TableEditor/components/TableColumnMapper';
import ImageInserter from './TableEditor/components/ImageInserter';
import ImageSettings from './TableEditor/components/ImageSettings';
import PreviewModal from './TableEditor/components/PreviewModal';

// New Extensions
import { EnhancedTable } from './TableEditor/extensions/EnhancedTable';
import { EnhancedTableCell } from './TableEditor/extensions/EnhancedTableCell';
import { ResizableImage } from './TableEditor/extensions/ResizableImage';
import { VariableNode } from './TableEditor/extensions/VariableNode';
import { FontFamily } from './TableEditor/extensions/FontFamily';
import { FontSize } from './TableEditor/extensions/FontSize';
import { LineHeight } from './TableEditor/extensions/LineHeight';
import { PageBreak } from './TableEditor/extensions/PageBreak';

// Redux Actions
import {
  findPdfExp,
  createPdfExp,
  updatePdfExp,
  resetPdfExp
} from '../../store/actions';

const TipTapEditor = () => {
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // === LOCAL STATE ===
  const [loading, setLoading] = useState(false);
  const [templateName, setTemplateName] = useState('Untitled Document');
  const [variables, setVariables] = useState([]);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('1'); // 1: Variables, 2: Insert, 3: Table, 4: Image

  // === REDUX STATE ===
  const { pdfExpApiResponse, isPdfExpFound, isPdfExpCreated, isPdfExpUpdated, userRNP } = useSelector(state => ({
    pdfExpApiResponse: state.PdfExp.apiResponse,
    isPdfExpFound: state.PdfExp.isPdfExpFound,
    isPdfExpCreated: state.PdfExp.isPdfExpCreated,
    isPdfExpUpdated: state.PdfExp.isPdfExpUpdated,
    userRNP: state.UserSession.userRNP,
  }));

  // Check if in "New" mode
  const isNew = id === "new" || location.pathname.endsWith('/new');

  // === TIPTAP EDITOR CONFIGURATION ===
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        history: { depth: 100 }, // Undo/redo depth
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      EnhancedTable.configure({
        resizable: true,
        handleWidth: 5,
        cellMinWidth: 50,
        lastColumnResizable: true,
        allowTableNodeSelection: true, // Enable table node selection for merge/split
      }),
      TableRow,
      TableHeader,
      EnhancedTableCell,
      ResizableImage,
      VariableNode,
      PageBreak,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      FontFamily,
      FontSize,
      LineHeight,
      Color,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content',
        spellcheck: 'false',
      },
    },
  });

  // === PERMISSION & DATA LOADING ===
  useEffect(() => {
    if (!isNew) {
      // Edit mode - check UPDATE permission
      if (!CheckFeatureAccess(userRNP, 'dig.img_exp.UPDATE')) {
        history.push('/pdf');
        return;
      }

      if (id && id !== 'new') {
        setLoading(true);
        dispatch(findPdfExp({ pdf: id }));
      }
    } else {
      // New mode - check CREATE permission
      if (!CheckFeatureAccess(userRNP, 'dig.img_exp.CREATE')) {
        history.push('/pdf');
        return;
      }
      if (editor) editor.commands.setContent('');
    }
  }, [id, isNew, dispatch, userRNP, history, editor]);

  // === HANDLE API LOAD RESPONSE ===
  useEffect(() => {
    if (isPdfExpFound && pdfExpApiResponse.success) {
      const data = pdfExpApiResponse.data || {};

      // Load template name
      if (data.name) setTemplateName(data.name);

      // Load variables
      if (data.variable) {
        setVariables(data.variable);
      }

      // Load editor content
      if (editor && data.contentJSON) {
        try {
          editor.commands.setContent(data.contentJSON);
        } catch (err) {
          CustomNotification.error(t('Failed to load content'));
        }
      }

      setLoading(false);
      dispatch(resetPdfExp('isPdfExpFound', false));
    }
  }, [isPdfExpFound, pdfExpApiResponse, editor, dispatch, t]);

  // === SAVE HANDLER ===
  const handleSave = useCallback(() => {
    if (!editor) return;

    setLoading(true);

    const editorJSON = editor.getJSON();
    const templateData = {
      name: templateName,
      type: 'dyTableEditor',
      contentJSON: editorJSON,
      variable: variables,
      page_size: 'A4',
    };


    if (isNew) {
      dispatch(createPdfExp(templateData));
    } else {
      dispatch(updatePdfExp({
        pdf: id,
        update: templateData
      }));
    }
  }, [editor, templateName, variables, isNew, id, dispatch]);

  // === HANDLE SAVE SUCCESS ===
  useEffect(() => {
    if (isPdfExpCreated || isPdfExpUpdated) {
      setLoading(false);
      if (pdfExpApiResponse.success) {
        CustomNotification.success(t('Document Saved Successfully'));
        // Redirect back to PDF list page after successful save
        history.push('/pdf');
      } else {
        CustomNotification.error(t('Save Failed'));
      }
      dispatch(resetPdfExp(isPdfExpCreated ? 'isPdfExpCreated' : 'isPdfExpUpdated', false));
    }
  }, [isPdfExpCreated, isPdfExpUpdated, history, isNew, pdfExpApiResponse, dispatch, t]);

  // === HANDLER FUNCTIONS ===
  const handleVariablesChange = useCallback((newVariables) => {
    setVariables(newVariables);
  }, []);

  const toggleImageModal = useCallback(() => {
    setImageModalOpen(prev => !prev);
  }, []);

  const handleOpenPreview = useCallback(() => {
    setPreviewModalOpen(true);
  }, []);

  const togglePreviewModal = useCallback(() => {
    setPreviewModalOpen(prev => !prev);
  }, []);

  // Memoize editor JSON for preview (only recalculate when needed)
  const editorJSON = useMemo(() => {
    return editor ? editor.getJSON() : null;
  }, [editor?.state.doc]); // Only update when document changes

  return (
    <div className="page-content">
      <MetaTag pageTitle={`${templateName}`} />

      {/* === CRITICAL STYLES === */}
      <style>{`
        /* Multi-Page Container - MS Word Style */
        .editor-pages-wrapper {
          position: relative;
        }

        /* Page visual separators - shown behind content */
        .page-separator {
          background: white;
          width: 210mm;
          height: 297mm;
          margin: 0 auto 20px auto;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
          border: 1px solid #d0d0d0;
          position: relative;
          pointer-events: none;
        }

        /* Page number badge */
        .page-number-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          z-index: 10;
        }

        /* Editor content container */
        .editor-paper {
          background: white;
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          padding: 20mm;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
          border: 1px solid #d0d0d0;
          position: relative;
          /* Add page boundary lines every 297mm */
          background-image: repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent calc(257mm - 1px),
            #e0e0e0 calc(257mm - 1px),
            #e0e0e0 257mm,
            transparent 257mm,
            transparent calc(257mm + 20mm),
            white calc(257mm + 20mm),
            white calc(257mm + 20mm + 1px),
            transparent calc(257mm + 20mm + 1px),
            transparent 297mm
          );
          background-size: 100% 297mm;
          background-position: 0 0;
        }

        .tiptap-editor-content {
          outline: none;
          font-family: 'Helvetica', 'Arial', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #000;
          position: relative;
          z-index: 1;
        }

        /* Preview Editor Styles */
        .preview-editor-content {
          outline: none;
          font-family: 'Helvetica', 'Arial', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #000;
        }

        /* Table Styling */
        .ProseMirror table {
          border-collapse: collapse;
          margin: 1rem 0;
          overflow: hidden;
          table-layout: fixed;
          width: 100%;
        }

        .ProseMirror table td,
        .ProseMirror table th {
          border: 1px solid var(--border-color, #000);
          padding: 8px 12px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
          min-width: 50px;
        }

        /* Table Header Styling */
        .ProseMirror table th {
          background-color: var(--header-bg, #f0f0f0);
          color: var(--header-text, #000);
          font-weight: 700;
          text-align: left;
        }

        /* Selected Cell Highlight */
        .ProseMirror .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0; right: 0; top: 0; bottom: 0;
          background: rgba(14, 165, 233, 0.15);
          pointer-events: none;
        }

        /* Column Resize Handle */
        .ProseMirror .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: #0ea5e9;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .ProseMirror .column-resize-handle:hover {
          opacity: 1;
        }

        .ProseMirror.resize-cursor {
          cursor: col-resize;
        }

        /* Headings */
        .ProseMirror h1 { font-size: 2em; margin: 0.67em 0; font-weight: 700; }
        .ProseMirror h2 { font-size: 1.5em; margin: 0.75em 0; font-weight: 700; }
        .ProseMirror h3 { font-size: 1.17em; margin: 0.83em 0; font-weight: 700; }
        .ProseMirror h4 { font-size: 1em; margin: 1em 0; font-weight: 700; }
        .ProseMirror h5 { font-size: 0.83em; margin: 1.17em 0; font-weight: 700; }
        .ProseMirror h6 { font-size: 0.67em; margin: 1.33em 0; font-weight: 700; }

        /* Paragraphs */
        .ProseMirror p {
          margin: 0.5em 0;
        }

        /* Images */
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          display: block;
        }

        /* Variable Chips */
        .variable-chip-wrapper {
          display: inline;
        }

        .variable-chip-view {
          user-select: none;
        }

        /* Page Break Styling */
        .ProseMirror .page-break {
          page-break-after: always;
          break-after: page;
          margin: 20mm 0;
          padding: 0;
          position: relative;
          height: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          user-select: none;
        }

        .ProseMirror .page-break:hover {
          background-color: rgba(14, 165, 233, 0.05);
        }

        .ProseMirror .page-break-line {
          width: 100%;
          height: 2px;
          background: repeating-linear-gradient(
            to right,
            #0ea5e9 0px,
            #0ea5e9 10px,
            transparent 10px,
            transparent 20px
          );
          margin-bottom: 8px;
        }

        .ProseMirror .page-break-text {
          font-size: 12px;
          color: #0ea5e9;
          font-weight: 600;
          background-color: white;
          padding: 4px 12px;
          border-radius: 12px;
          border: 1px solid #0ea5e9;
        }

        /* Page Break for PDF - Forces new page */
        @media print {
          .page-break {
            page-break-after: always;
            break-after: page;
            height: 0;
            margin: 0;
            padding: 0;
            border: none;
            visibility: hidden;
          }

          .page-break-line,
          .page-break-text {
            display: none;
          }
        }

        /* Sidebar Styles */
        .sidebar-card {
          height: calc(100vh - 160px);
          overflow-y: auto;
        }

        /* Custom Scrollbar */
        .sidebar-card::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-card::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .sidebar-card::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }

        .sidebar-card::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>

      <Container fluid className="p-3">
        <BreadCrumb title={t("PDF Document Editor")} pageTitle={t("PDF Editor")} />

        <Row className="g-3">
          {/* === LEFT SIDEBAR === */}
          <Col lg={3}>
            <Card className="shadow-sm sidebar-card">
              <CardBody className="p-0">
                {/* Tabs */}
                <Nav tabs className="border-bottom">
                  <NavItem style={{ flex: 1 }}>
                    <NavLink
                      className={activeTab === '1' ? 'active' : ''}
                      onClick={() => setActiveTab('1')}
                      style={{
                        cursor: 'pointer',
                        fontSize: '13px',
                        textAlign: 'center',
                        padding: '10px 8px'
                      }}
                    >
                      <i className="bx bx-data"></i>
                      <div style={{ fontSize: '11px', marginTop: '2px' }}>Variables</div>
                    </NavLink>
                  </NavItem>
                  <NavItem style={{ flex: 1 }}>
                    <NavLink
                      className={activeTab === '2' ? 'active' : ''}
                      onClick={() => setActiveTab('2')}
                      style={{
                        cursor: 'pointer',
                        fontSize: '13px',
                        textAlign: 'center',
                        padding: '10px 8px'
                      }}
                    >
                      <i className="bx bx-plus-circle"></i>
                      <div style={{ fontSize: '11px', marginTop: '2px' }}>Add Component</div>
                    </NavLink>
                  </NavItem>
                  <NavItem style={{ flex: 1 }}>
                    <NavLink
                      className={activeTab === '3' ? 'active' : ''}
                      onClick={() => setActiveTab('3')}
                      style={{
                        cursor: 'pointer',
                        fontSize: '13px',
                        textAlign: 'center',
                        padding: '10px 8px'
                      }}
                    >
                      <i className="bx bx-table"></i>
                      <div style={{ fontSize: '11px', marginTop: '2px' }}>Table</div>
                    </NavLink>
                  </NavItem>
                  <NavItem style={{ flex: 1 }}>
                    <NavLink
                      className={activeTab === '4' ? 'active' : ''}
                      onClick={() => setActiveTab('4')}
                      style={{
                        cursor: 'pointer',
                        fontSize: '13px',
                        textAlign: 'center',
                        padding: '10px 8px'
                      }}
                    >
                      <i className="bx bx-image"></i>
                      <div style={{ fontSize: '11px', marginTop: '2px' }}>Image</div>
                    </NavLink>
                  </NavItem>
                </Nav>

                {/* Tab Content */}
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <VariablesPanel
                      variables={variables}
                      onVariablesChange={handleVariablesChange}
                      editor={editor}
                    />
                  </TabPane>
                  <TabPane tabId="2">
                    <div className="p-3">
                      <h6 className="mb-3" style={{ fontSize: '14px', fontWeight: 600 }}>
                        <i className="bx bx-plus-circle me-2"></i>
                        Insert Elements
                      </h6>

                      <style>{`
                        .insert-button {
                          padding: 12px 16px;
                          text-align: left;
                          display: flex;
                          align-items: center;
                          gap: 12px;
                          font-size: 13px;
                          color: #333 !important;
                          border-color: #dee2e6 !important;
                          background-color: white !important;
                          transition: all 0.2s ease;
                        }
                        .insert-button:hover:not(:disabled) {
                          background-color: #f8f9fa !important;
                          color: #666 !important;
                          border-color: #adb5bd !important;
                        }
                        .insert-button:disabled {
                          opacity: 0.6;
                        }
                      `}</style>
                      <div className="d-grid gap-2">
                        <Button
                          className="insert-button"
                          onClick={() => {
                            editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                          }}
                          disabled={!editor}
                        >
                          <i className="bx bx-table" style={{ fontSize: '20px' }}></i>
                          <div>
                            <div style={{ fontWeight: 600 }}>Insert Table</div>
                            <small className="text-muted" style={{ fontSize: '11px' }}>
                              Add a table to your document
                            </small>
                          </div>
                        </Button>

                        <Button
                          className="insert-button"
                          onClick={toggleImageModal}
                          disabled={!editor}
                        >
                          <i className="bx bx-image" style={{ fontSize: '20px' }}></i>
                          <div>
                            <div style={{ fontWeight: 600 }}>Insert Image</div>
                            <small className="text-muted" style={{ fontSize: '11px' }}>
                              Add an image or dynamic image variable
                            </small>
                          </div>
                        </Button>

                        <Button
                          className="insert-button"
                          onClick={() => {
                            editor?.chain().focus().setPageBreak().run();
                          }}
                          disabled={!editor}
                        >
                          <i className="bx bx-file" style={{ fontSize: '20px' }}></i>
                          <div>
                            <div style={{ fontWeight: 600 }}>Page Break</div>
                            <small className="text-muted" style={{ fontSize: '11px' }}>
                              Force content to start on a new A4 page
                            </small>
                          </div>
                        </Button>
                      </div>

                      {/* <div className="mt-4 p-3 bg-light rounded" style={{ fontSize: '11px', color: '#666' }}>
                        <div className="mb-2">
                          <i className="bx bx-info-circle me-1"></i>
                          <strong>Tips:</strong>
                        </div>
                        <ul className="mb-0 ps-3" style={{ lineHeight: '1.6' }}>
                          <li>Click on inserted elements to edit them</li>
                          <li><strong>Red line + "Page End"</strong> badges show where each A4 page ends (257mm)</li>
                          <li>Use <strong>Page Break</strong> to force content (like T&C) to start on a new page</li>
                          <li>Dynamic tables will automatically populate with variable data in preview</li>
                        </ul>
                      </div> */}
                    </div>
                  </TabPane>
                  <TabPane tabId="3">
                    <TableColumnMapper
                      editor={editor}
                      variables={variables}
                    />
                  </TabPane>
                  <TabPane tabId="4">
                    <ImageSettings
                      editor={editor}
                    />
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>

          {/* === MAIN EDITOR === */}
          <Col lg={9}>
            {/* Header Card */}
            <Card className="shadow-sm mb-3">
              <CardBody className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Input
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="border-0 fw-bold fs-5"
                    placeholder={t("Document Name")}
                    style={{ maxWidth: '400px' }}
                  />
                  <div className="d-flex gap-2">
                    <Button
                      color="light"
                      size="sm"
                      onClick={() => history.push('/pdf')}
                      className="border"
                      style={{ fontSize: '12px' }}
                    >
                      <i className="bx bx-arrow-back me-1"></i>
                      {t('Back')}
                    </Button>
                    <Button
                      color="info"
                      size="sm"
                      onClick={handleOpenPreview}
                      disabled={!editor}
                      style={{ fontSize: '12px' }}
                    >
                      <i className="bx bx-show me-1"></i>
                      {t('Preview')}
                    </Button>
                    <Button
                      color="success"
                      size="sm"
                      onClick={handleSave}
                      disabled={!editor}
                      style={{ fontSize: '12px' }}
                    >
                      <i className="bx bx-save me-1"></i>
                      {t('Save')}
                    </Button>
                  </div>
                </div>

                {/* Toolbar */}
                <Toolbar editor={editor} />
              </CardBody>
            </Card>

            {/* Editor Canvas - Continuous Document with Page Indicators */}
            <div
              className="editor-container"
              style={{
                height: 'calc(100vh - 220px)',
                overflowY: 'auto',
                background: 'linear-gradient(to bottom, #f5f5f5 0%, #e8e8e8 100%)',
                padding: '32px 16px',
                borderRadius: '8px',
              }}
            >
              <div className="editor-pages-wrapper">
                <div className="editor-paper" onClick={() => editor?.chain().focus().run()}>
                  {/* Page number indicator - fixed at top */}
                  {/* <div className="page-number-badge">
                    Page 1
                  </div> */}

                  {editor && <EditorContent editor={editor} />}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* === MODALS === */}

      {/* Image Inserter Modal */}
      <ImageInserter
        isOpen={imageModalOpen}
        toggle={toggleImageModal}
        editor={editor}
        variables={variables}
      />

      {/* Preview Modal */}
      <PreviewModal
        isOpen={previewModalOpen}
        toggle={togglePreviewModal}
        editorJSON={editorJSON}
        variables={variables}
      />

      {/* Loading Overlay */}
      {loading && <Preloader />}
    </div>
  );
};

export default TipTapEditor;
