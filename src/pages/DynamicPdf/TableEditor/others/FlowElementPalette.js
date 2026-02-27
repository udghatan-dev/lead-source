// // FlowElementPalette.js - Component palette for Flow Editor
// import React from 'react';
// import { Card, CardBody, CardHeader, Row, Col } from 'reactstrap';

// const FLOW_COMPONENTS = [
//   {
//     title: 'Heading',
//     help: 'Add Heading (H1-H6)',
//     icon: 'bx bx-heading',
//     type: 'heading',
//     level: 2, // Default to H2
//   },
//   {
//     title: 'Paragraph',
//     help: 'Add Paragraph Text',
//     icon: 'bx bx-text',
//     type: 'paragraph',
//   },
//   {
//     title: 'Image',
//     help: 'Insert Image',
//     icon: 'bx bx-image',
//     type: 'image',
//   },
//   {
//     title: 'Table',
//     help: 'Insert Table',
//     icon: 'bx bx-table',
//     type: 'table',
//   },
//   {
//     title: 'Bullet List',
//     help: 'Add Bullet List',
//     icon: 'bx bx-list-ul',
//     type: 'bulletList',
//   },
//   {
//     title: 'Numbered List',
//     help: 'Add Numbered List',
//     icon: 'bx bx-list-ol',
//     type: 'orderedList',
//   },
//   {
//     title: 'Variable',
//     help: 'Insert Variable',
//     icon: 'bx bx-data',
//     type: 'variable',
//   },
//   {
//     title: 'Horizontal Line',
//     help: 'Add Horizontal Rule',
//     icon: 'bx bx-minus',
//     type: 'horizontalRule',
//   },
//   {
//     title: 'QR Code',
//     help: 'Insert QR Code',
//     icon: 'bx bx-qr',
//     type: 'qrcode',
//   },
//   // {
//   //   title: 'Barcode',
//   //   help: 'Insert Barcode',
//   //   icon: 'bx bx-barcode',
//   //   type: 'barcode',
//   // },
//   {
//     title: 'Signature',
//     help: 'Add Signature Line',
//     icon: 'bx bx-edit-alt',
//     type: 'signature',
//   },
//   // {
//   //   title: 'Page Break',
//   //   help: 'Insert Page Break',
//   //   icon: 'bx bx-file',
//   //   type: 'pageBreak',
//   // },
// ];

// const FlowElementPalette = ({ editor, onInsertVariable, variables = [] }) => {
//   const handleAddElement = (component) => {
//     if (!editor) return;

//     switch (component.type) {
//       case 'heading':
//         editor.chain().focus().toggleHeading({ level: component.level }).run();
//         editor.chain().focus().insertContent(' ').run();
//         break;
//       case 'paragraph':
//         editor.chain().focus().setParagraph().run();
//         editor.chain().focus().insertContent(' ').run();
//         break;
//       case 'image':
//         const url = window.prompt('Enter image URL:');
//         if (url) {
//           editor.chain().focus().setImage({ src: url }).run();
//         }
//         break;
//       case 'table':
//         editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
//         break;
//       case 'bulletList':
//         editor.chain().focus().toggleBulletList().run();
//         editor.chain().focus().insertContent(' ').run();
//         break;
//       case 'orderedList':
//         editor.chain().focus().toggleOrderedList().run();
//         editor.chain().focus().insertContent(' ').run();
//         break;
//       case 'variable':
//         if (variables.length > 0) {
//           // If multiple variables, show selection
//           if (variables.length > 1) {
//             const varNames = variables.map(v => v.name).join(', ');
//             const selectedVar = window.prompt(`Select variable (${varNames}):`, variables[0].name);
//             if (selectedVar) {
//               editor.chain().focus().insertContent({
//                 type: 'variable',
//                 attrs: { id: selectedVar }
//               }).run();
//             }
//           } else {
//             // Single variable, insert directly
//             editor.chain().focus().insertContent({
//               type: 'variable',
//               attrs: { id: variables[0].name }
//             }).run();
//           }
//         } else if (onInsertVariable) {
//           onInsertVariable();
//         }
//         break;
//       case 'horizontalRule':
//         editor.chain().focus().setHorizontalRule().run();
//         break;
//       case 'qrcode':
//         editor.chain().focus().insertContent({
//           type: 'qrcode',
//           attrs: { value: '', size: 150 }
//         }).run();
//         break;
//       // case 'barcode':
//       //   editor.chain().focus().insertContent({
//       //     type: 'barcode',
//       //     attrs: { value: '', width: 200, height: 80, format: 'CODE128' }
//       //   }).run();
//       //   break;
//       // case 'signature':
//       //   editor.chain().focus().insertContent({
//       //     type: 'signature',
//       //     attrs: { label: 'Signature', width: 300 }
//       //   }).run();
//       //   break;
//       case 'pageBreak':
//         editor.chain().focus().insertContent({
//           type: 'pageBreak'
//         }).run();
//         break;
//       default:
//         break;
//     }
//   };

//   return (
//     <Card className="border shadow-sm">
//       <CardBody className="p-2">
//         <h6 className="fw-bold text-uppercase small text-muted mb-3">Components</h6>
//         <Row className="g-2">
//           {FLOW_COMPONENTS.map((component, index) => (
//             <Col xs={6} key={index}>
//               <Card
//                 className="card-animate mb-0"
//                 style={{ cursor: 'pointer' }}
//                 title={component.help}
//                 onClick={() => handleAddElement(component)}
//               >
//                 <CardHeader className="border-0 p-2 d-flex align-items-center justify-content-center bg-light">
//                   <i className={`${component.icon} text-muted`} style={{ fontSize: '24px' }}></i>
//                 </CardHeader>
//                 <CardBody className="d-flex align-items-center justify-content-center p-1">
//                   <small className="text-center">{component.title}</small>
//                 </CardBody>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </CardBody>
//     </Card>
//   );
// };

// export default FlowElementPalette;
