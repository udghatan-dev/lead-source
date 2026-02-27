/**
 * PDF Preview Modal
 *
 * Displays processed editor content with:
 * - Variable replacement
 * - Dynamic table population
 * - Side-by-side view with original
 * - Live updates when variables change
 */

import React, { useMemo } from 'react';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';

import { EnhancedTable } from '../extensions/EnhancedTable';
import { EnhancedTableCell } from '../extensions/EnhancedTableCell';
import { ResizableImage } from '../extensions/ResizableImage';
import { FontFamily } from '../extensions/FontFamily';
import { FontSize } from '../extensions/FontSize';
import { LineHeight } from '../extensions/LineHeight';
import { PageBreak } from '../extensions/PageBreak';
import { processEditorContent } from '../utils/tableProcessor';

const PreviewModal = ({ isOpen, toggle, editorJSON, variables = [] }) => {
  // Process editor content with variable replacement and table population
  const processedContent = useMemo(() => {
    if (!editorJSON) return null;
    return processEditorContent(editorJSON, variables);
  }, [editorJSON, variables]);

  // Create read-only preview editor
  const previewEditor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        history: false, // No undo/redo needed for preview
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      EnhancedTable,
      TableRow,
      TableHeader,
      EnhancedTableCell,
      ResizableImage,
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
    content: processedContent,
    editable: false, // Read-only
    editorProps: {
      attributes: {
        class: 'preview-editor-content',
        spellcheck: 'false',
      },
    },
  });

  // Update preview content when variables change
  React.useEffect(() => {
    if (previewEditor && processedContent) {
      previewEditor.commands.setContent(processedContent);
    }
  }, [previewEditor, processedContent]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl" style={{ maxWidth: '90vw' }}>
      <style>{`
        .preview-modal-button {
          color: #333 !important;
          background-color: white !important;
          border-color: #dee2e6 !important;
          transition: all 0.2s ease;
        }
        .preview-modal-button:hover:not(:disabled) {
          background-color: #f8f9fa !important;
          color: #666 !important;
          border-color: #adb5bd !important;
        }
        .preview-modal-button:disabled {
          opacity: 0.6;
        }
      `}</style>
      <ModalHeader toggle={toggle}>
        <div className="d-flex align-items-center gap-2">
          <i className="bx bx-show" style={{ fontSize: '20px' }}></i>
          <span>PDF Preview</span>
          <span
            className="badge bg-info"
            style={{ fontSize: '11px', fontWeight: '500' }}
          >
            Live Preview
          </span>
        </div>
      </ModalHeader>

      <ModalBody style={{ padding: 0 }}>
        {/* Info Banner */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#e7f3ff',
            borderBottom: '1px solid #b3d9ff',
          }}
        >
          <small style={{ fontSize: '12px', color: '#004085' }}>
            <i className="bx bx-info-circle me-1"></i>
            <strong>Preview Mode:</strong> This shows how your PDF will look with variables replaced and tables populated with data.
            Changes to variables are reflected in real-time.
          </small>
        </div>

        {/* Preview Content */}
        <div
          style={{
            padding: '32px',
            backgroundColor: '#f5f5f5',
            minHeight: '500px',
            maxHeight: '70vh',
            overflowY: 'auto',
          }}
        >
          {/* A4 Paper Container */}
          <div
            className="preview-paper"
            style={{
              width: '210mm',
              minHeight: '297mm',
              margin: '0 auto',
              padding: '20mm',
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: '4px',
            }}
          >
            {previewEditor && <EditorContent editor={previewEditor} />}
          </div>
        </div>

        {/* Action Bar */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid #dee2e6',
            backgroundColor: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '12px', color: '#666' }}>
            <i className="bx bx-data me-1"></i>
            Using {variables.length} variable{variables.length !== 1 ? 's' : ''}
          </div>

          <div className="d-flex gap-2">
            <Button className="preview-modal-button" size="sm" onClick={toggle}>
              Close
            </Button>
            {/* <Button
              className="preview-modal-button"
              size="sm"
              onClick={() => {
                // TODO: Implement actual PDF generation
                alert('PDF generation will be implemented next');
              }}
            >
              <i className="bx bx-download me-1"></i>
              Download PDF
            </Button>*/}
          </div> 
        </div>
      </ModalBody>
    </Modal>
  );
};

export default PreviewModal;
