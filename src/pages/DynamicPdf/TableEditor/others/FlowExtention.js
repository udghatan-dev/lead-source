// // src/pages/DynamicPdf/Flow/FlowExtensions.js
// import React from 'react';
// import { Node, mergeAttributes } from '@tiptap/core';
// import { Table } from '@tiptap/extension-table';
// import { TableCell } from '@tiptap/extension-table-cell';
// import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
// import { Badge } from 'reactstrap';

// // React Component for Variable Display
// const VariableComponent = ({ node }) => {
//   return (
//     <NodeViewWrapper as="span" className="variable-chip-view badge bg-light text-dark border fw-bold mx-1" style={{ fontSize: '0.85em', verticalAlign: 'middle' }}>
//       <i className="bx bx-data me-1 text-primary"></i>
//       {`\${${node.attrs.id}}`}
//     </NodeViewWrapper>
//   );
// };

// // React Component for QR Code Display
// const QRCodeComponent = ({ node }) => {
//   return (
//     <NodeViewWrapper className="qr-code-wrapper" style={{ display: 'inline-block', padding: '10px', border: '2px dashed #ccc', margin: '5px' }}>
//       <div style={{ textAlign: 'center' }}>
//         <div style={{ width: node.attrs.size || 150, height: node.attrs.size || 150, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ddd' }}>
//           <i className="bx bx-qr" style={{ fontSize: '48px', color: '#666' }}></i>
//         </div>
//         <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
//           {node.attrs.value ? `QR: ${node.attrs.value.substring(0, 20)}...` : 'QR Code'}
//         </small>
//       </div>
//     </NodeViewWrapper>
//   );
// };

// // React Component for Barcode Display
// // const BarcodeComponent = ({ node }) => {
// //   return (
// //     <NodeViewWrapper className="barcode-wrapper" style={{ display: 'inline-block', padding: '10px', border: '2px dashed #ccc', margin: '5px' }}>
// //       <div style={{ textAlign: 'center' }}>
// //         <div style={{ width: node.attrs.width || 200, height: node.attrs.height || 80, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ddd' }}>
// //           <div style={{ fontFamily: 'monospace', fontSize: '24px', letterSpacing: '2px', color: '#000' }}>
// //             |||||||||||
// //           </div>
// //         </div>
// //         <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
// //           {node.attrs.value || 'Barcode'}
// //         </small>
// //       </div>
// //     </NodeViewWrapper>
// //   );
// // };

// // React Component for Signature Line Display
// const SignatureComponent = ({ node }) => {
//   return (
//     <NodeViewWrapper className="signature-wrapper" style={{ display: 'block', padding: '10px', margin: '10px 0' }}>
//       <div style={{ borderBottom: '2px solid #000', width: node.attrs.width || 300, margin: '40px 0 5px 0' }}></div>
//       <small style={{ color: '#666' }}>{node.attrs.label || 'Signature'}</small>
//     </NodeViewWrapper>
//   );
// };

// // --- 1. Variable Node (The "Chip") ---
// export const VariableNode = Node.create({
//   name: 'variable',
//   group: 'inline',
//   inline: true,
//   atom: true, // Treated as a single unit (cannot type inside)

//   addAttributes() {
//     return {
//       id: {
//         default: null,
//         parseHTML: element => element.getAttribute('data-id'),
//         renderHTML: attributes => ({
//           'data-id': attributes.id,
//         }),
//       },
//       fallback: { default: '' }
//     }
//   },

//   parseHTML() {
//     return [{ tag: 'span[data-type="variable"]' }]
//   },

//   renderHTML({ HTMLAttributes }) {
//     return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'variable', class: 'variable-chip' })]
//   },

//   // Visual React Component for the Editor
//   addNodeView() {
//     return ReactNodeViewRenderer(VariableComponent);
//   },
// });

// // --- 2. QR Code Node ---
// export const QRCodeNode = Node.create({
//   name: 'qrcode',
//   group: 'block',
//   atom: true,

//   addAttributes() {
//     return {
//       value: { default: '' },
//       size: { default: 150 },
//     }
//   },

//   parseHTML() {
//     return [{ tag: 'div[data-type="qrcode"]' }]
//   },

//   renderHTML({ HTMLAttributes }) {
//     return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'qrcode' })]
//   },

//   addNodeView() {
//     return ReactNodeViewRenderer(QRCodeComponent);
//   },
// });

// // --- 4. Signature Line Node ---
// export const SignatureNode = Node.create({
//   name: 'signature',
//   group: 'block',
//   atom: true,

//   addAttributes() {
//     return {
//       label: { default: 'Signature' },
//       width: { default: 300 },
//     }
//   },

//   parseHTML() {
//     return [{ tag: 'div[data-type="signature"]' }]
//   },

//   renderHTML({ HTMLAttributes }) {
//     return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'signature' })]
//   },

//   addNodeView() {
//     return ReactNodeViewRenderer(SignatureComponent);
//   },
// });

// // React Component for Page Break Display
// const PageBreakComponent = () => {
//   return (
//     <NodeViewWrapper className="page-break-wrapper" contentEditable={false}>
//       <div style={{
//         margin: '20px 0',
//         padding: '10px',
//         textAlign: 'center',
//         borderTop: '2px dashed #999',
//         borderBottom: '2px dashed #999',
//         background: '#f8f9fa',
//         color: '#666',
//         fontSize: '12px',
//         fontWeight: '600',
//         userSelect: 'none'
//       }}>
//         <i className="bx bx-file me-2"></i>
//         PAGE BREAK
//         <i className="bx bx-file ms-2"></i>
//       </div>
//     </NodeViewWrapper>
//   );
// };

// // --- 5. Enhanced Table Cell with Custom Dimensions ---
// export const EnhancedTableCell = TableCell.extend({
//   addAttributes() {
//     return {
//       ...this.parent?.(),
//       // Keep custom attributes for backward compatibility
//       cellWidth: {
//         default: null,
//         parseHTML: element => element.getAttribute('data-cell-width'),
//         renderHTML: attributes => {
//           if (!attributes.cellWidth) return {};
//           return { 'data-cell-width': attributes.cellWidth };
//         },
//       },
//       cellHeight: {
//         default: null,
//         parseHTML: element => element.getAttribute('data-cell-height'),
//         renderHTML: attributes => {
//           if (!attributes.cellHeight) return {};
//           return { 'data-cell-height': attributes.cellHeight };
//         },
//       },
//     };
//   },

//   renderHTML({ HTMLAttributes, node }) {
//     const attrs = node.attrs;
//     const styles = [];

//     // Tiptap's column resizing uses colwidth attribute (array of widths)
//     // We strictly use this as the source of truth for display
//     if (attrs.colwidth) {
//       // If it has colwidth, it's likely RESIZED manually or by default
//       const width = attrs.colwidth ? (Array.isArray(attrs.colwidth) ? attrs.colwidth[0] : attrs.colwidth) : null;
//       if (width) {
//         styles.push(`width: ${width}px`);
//       }
//     }
//     // Fallback to custom cellWidth ONLY if colwidth is missing (backward compat)
//     else if (attrs.cellWidth) {
//       styles.push(`width: ${attrs.cellWidth}px`);
//     }

//     if (attrs.cellHeight) {
//       styles.push(`height: ${attrs.cellHeight}px`);
//     }

//     return [
//       'td',
//       {
//         ...HTMLAttributes,
//         style: styles.length > 0 ? styles.join('; ') : undefined,
//       },
//       0,
//     ];
//   },
// });

// // --- 6. Page Break Node ---
// export const PageBreakNode = Node.create({
//   name: 'pageBreak',
//   group: 'block',
//   atom: true,
//   selectable: true,
//   draggable: false,

//   parseHTML() {
//     return [{ tag: 'div[data-type="page-break"]' }]
//   },

//   renderHTML({ HTMLAttributes }) {
//     return ['div', mergeAttributes(HTMLAttributes, {
//       'data-type': 'page-break',
//       class: 'page-break'
//     })]
//   },

//   addNodeView() {
//     return ReactNodeViewRenderer(PageBreakComponent);
//   },

//   addKeyboardShortcuts() {
//     return {
//       'Mod-Enter': () => this.editor.commands.insertContent({ type: this.name }),
//     }
//   },
// });

// // src/pages/DynamicPdf/Flow/TableEditor/FlowExtensions.js

// // ... (Keep your imports and other nodes like VariableNode, QRCodeNode etc.)

// // --- 5. Enhanced Table for ReportLab ---
// export const ReportLabTable = Table.extend({
//   addAttributes() {
//     return {
//       // Inherit existing attributes
//       ...this.parent?.(),

//       // Dynamic Data
//       isDynamic: { default: false },
//       dataSourceVariable: { default: null },
//       columnMappings: { default: [] },

//       // Visual Styles
//       borderColor: { default: '#000000' },
//       headerBackgroundColor: { default: '#f0f0f0' },
//       headerTextColor: { default: '#000000' },
//     }
//   },

//   // OPTIMIZATION: Removed expensive onUpdate DOM query. 
//   // Styles are now fully handled in renderHTML via CSS variables.

//   renderHTML({ HTMLAttributes, node }) {
//     const attrs = node.attrs;

//     // Build CSS Variables for styling
//     // We inject these directly into the style attribute
//     const styleString = `
//       --border-color: ${attrs.borderColor};
//       --header-bg: ${attrs.headerBackgroundColor};
//       --header-text: ${attrs.headerTextColor};
//       table-layout: fixed;
//     `.replace(/\s+/g, ' ');
//     // REMOVED fixed "width: 100%" to allow Tiptap's resizing (which sets style="min-width: ...px") to work.

//     return [
//       'table',
//       mergeAttributes(HTMLAttributes, {
//         style: styleString,
//         'data-is-dynamic': attrs.isDynamic,
//         // We can keep these data-attrs for debugging or external CSS hooks if needed
//         'data-border-color': attrs.borderColor,
//         'data-header-bg': attrs.headerBackgroundColor,
//         'data-header-text': attrs.headerTextColor,
//       }),
//       ['tbody', 0],
//     ];
//   },
// });