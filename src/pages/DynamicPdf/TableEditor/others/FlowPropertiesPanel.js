// // FlowPropertiesPanel.js
// import React from 'react';
// import { useTranslation } from 'react-i18next';
// import { Button, FormGroup, Label, Input, Row, Col } from 'reactstrap';

// const FlowPropertiesPanel = ({ editor }) => {
//   const { t } = useTranslation();

//   if (!editor) return null;

//   // Detect active node type
//   const isHeading = editor.isActive('heading');
//   const isParagraph = editor.isActive('paragraph');
//   const isImage = editor.isActive('image');
//   const isList = editor.isActive('bulletList') || editor.isActive('orderedList');
  
//   // Nothing selected?
//   const isIdle = !isHeading && !isParagraph && !isImage && !isList;

//   // Handlers
//   const handleDelete = () => {
//     if (window.confirm(t('Delete this element?'))) {
//       editor.chain().focus().deleteSelection().run();
//     }
//   };

//   // Reusable Alignment Component to reduce code duplication
//   const AlignmentControls = () => (
//     <div className="btn-group w-100" role="group">
//       {['left', 'center', 'right', 'justify'].map((align) => (
//         <button
//           key={align}
//           type="button"
//           className={`btn btn-sm ${editor.isActive({ textAlign: align }) ? 'btn-primary' : 'btn-light border'}`}
//           onClick={() => editor.chain().focus().setTextAlign(align).run()}
//           title={align.charAt(0).toUpperCase() + align.slice(1)}
//         >
//           <i className={`bx bx-align-${align === 'justify' ? 'justify' : align === 'center' ? 'middle' : align}`}></i>
//         </button>
//       ))}
//     </div>
//   );

//   return (
//     <div className="h-100 d-flex flex-column bg-white border-start">
//       {/* Header */}
//       <div className="p-3 border-bottom bg-light">
//         <h6 className="mb-0 fw-bold text-uppercase small text-muted">
//           <i className="bx bx-slider-alt me-2"></i>
//           {t('Properties')}
//         </h6>
//       </div>

//       <div className="p-3 flex-grow-1 overflow-auto">
        
//         {/* --- IDLE STATE --- */}
//         {isIdle && (
//           <div className="text-center mt-5 text-muted">
//             <div className="mb-3 bg-light rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '64px', height: '64px'}}>
//                <i className="bx bx-pointer fs-1 text-secondary opacity-50"></i>
//             </div>
//             <p className="small mb-0">{t('Select an element on the canvas to edit its properties.')}</p>
//           </div>
//         )}

//         {/* --- HEADING PROPERTIES --- */}
//         {isHeading && (
//           <div className="animation-fade-in">
//             <div className="d-flex align-items-center mb-3 text-primary">
//                 <i className="bx bx-heading fs-4 me-2"></i>
//                 <span className="fw-bold">{t('Heading Settings')}</span>
//             </div>

//             <FormGroup className="mb-4">
//               <Label className="small fw-bold text-muted text-uppercase mb-2">{t('Level')}</Label>
//               <div className="d-flex gap-1 flex-wrap">
//                 {[1, 2, 3, 4, 5, 6].map(level => (
//                   <button
//                     key={level}
//                     type="button"
//                     className={`btn btn-sm flex-grow-1 ${editor.getAttributes('heading').level === level ? 'btn-primary' : 'btn-outline-light text-dark border'}`}
//                     onClick={() => editor.chain().focus().setHeading({ level }).run()}
//                   >
//                     H{level}
//                   </button>
//                 ))}
//               </div>
//             </FormGroup>

//             <FormGroup className="mb-4">
//               <Label className="small fw-bold text-muted text-uppercase mb-2">{t('Alignment')}</Label>
//               <AlignmentControls />
//             </FormGroup>

//             <FormGroup className="mb-4">
//               <Label className="small fw-bold text-muted text-uppercase mb-2">{t('Color')}</Label>
//               <div className="d-flex align-items-center border rounded p-1">
//                   <Input
//                     type="color"
//                     className="border-0 p-0"
//                     style={{width: '30px', height: '30px', cursor: 'pointer'}}
//                     onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
//                     value={editor.getAttributes('textStyle').color || '#000000'}
//                   />
//                   <span className="ms-2 small text-muted font-monospace">
//                       {editor.getAttributes('textStyle').color || '#000000'}
//                   </span>
//               </div>
//             </FormGroup>
//           </div>
//         )}

//         {/* --- PARAGRAPH PROPERTIES --- */}
//         {isParagraph && (
//           <div className="animation-fade-in">
//              <div className="d-flex align-items-center mb-3 text-primary">
//                 <i className="bx bx-paragraph fs-4 me-2"></i>
//                 <span className="fw-bold">{t('Paragraph Settings')}</span>
//             </div>

//             <FormGroup className="mb-4">
//               <Label className="small fw-bold text-muted text-uppercase mb-2">{t('Alignment')}</Label>
//               <AlignmentControls />
//             </FormGroup>

//             <FormGroup className="mb-4">
//               <Label className="small fw-bold text-muted text-uppercase mb-2">{t('Color')}</Label>
//               <div className="d-flex align-items-center border rounded p-1">
//                   <Input
//                     type="color"
//                     className="border-0 p-0"
//                     style={{width: '30px', height: '30px', cursor: 'pointer'}}
//                     onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
//                     value={editor.getAttributes('textStyle').color || '#000000'}
//                   />
//                   <span className="ms-2 small text-muted font-monospace">
//                       {editor.getAttributes('textStyle').color || '#000000'}
//                   </span>
//               </div>
//             </FormGroup>
//           </div>
//         )}

//         {/* --- IMAGE PROPERTIES --- */}
//         {isImage && (
//           <div className="animation-fade-in">
//             <div className="d-flex align-items-center mb-3 text-primary">
//                 <i className="bx bx-image fs-4 me-2"></i>
//                 <span className="fw-bold">{t('Image Settings')}</span>
//             </div>

//             <FormGroup className="mb-3">
//               <Label className="small fw-bold text-muted text-uppercase mb-1">{t('Source URL')}</Label>
//               <Input
//                 bsSize="sm"
//                 type="text"
//                 value={editor.getAttributes('image').src || ''}
//                 onChange={(e) => editor.chain().focus().updateAttributes('image', { src: e.target.value }).run()}
//                 placeholder="https://..."
//                 className="bg-light"
//               />
//             </FormGroup>

//             <Row className="g-2 mb-3">
//               <Col xs={6}>
//                 <FormGroup>
//                   <Label className="small fw-bold text-muted text-uppercase mb-1">{t('Width')}</Label>
//                   <Input
//                     bsSize="sm"
//                     type="text"
//                     value={editor.getAttributes('image').width || ''}
//                     onChange={(e) => editor.chain().focus().updateAttributes('image', { width: e.target.value }).run()}
//                     placeholder="Auto"
//                   />
//                 </FormGroup>
//               </Col>
//               <Col xs={6}>
//                 <FormGroup>
//                   <Label className="small fw-bold text-muted text-uppercase mb-1">{t('Height')}</Label>
//                   <Input
//                     bsSize="sm"
//                     type="text"
//                     value={editor.getAttributes('image').height || ''}
//                     onChange={(e) => editor.chain().focus().updateAttributes('image', { height: e.target.value }).run()}
//                     placeholder="Auto"
//                   />
//                 </FormGroup>
//               </Col>
//             </Row>

//             <FormGroup className="mb-4">
//               <Label className="small fw-bold text-muted text-uppercase mb-2">{t('Alignment')}</Label>
//               <AlignmentControls />
//             </FormGroup>

//             <Button 
//                 outline 
//                 color="secondary" 
//                 size="sm" 
//                 block 
//                 className="mb-3"
//                 onClick={() => editor.chain().focus().updateAttributes('image', { width: null, height: null }).run()}
//             >
//                 <i className="bx bx-reset me-1"></i> {t('Reset Size')}
//             </Button>
//           </div>
//         )}

//         {/* --- LIST PROPERTIES --- */}
//         {isList && (
//           <div className="animation-fade-in">
//              <div className="d-flex align-items-center mb-3 text-primary">
//                 <i className="bx bx-list-ul fs-4 me-2"></i>
//                 <span className="fw-bold">{t('List Settings')}</span>
//             </div>

//             <FormGroup className="mb-4">
//               <Label className="small fw-bold text-muted text-uppercase mb-2">{t('List Style')}</Label>
//               <div className="btn-group w-100">
//                 <button
//                   type="button"
//                   className={`btn btn-sm ${editor.isActive('bulletList') ? 'btn-primary' : 'btn-light border'}`}
//                   onClick={() => editor.chain().focus().toggleBulletList().run()}
//                 >
//                   <i className="bx bx-list-ul me-2"></i> Bullet
//                 </button>
//                 <button
//                   type="button"
//                   className={`btn btn-sm ${editor.isActive('orderedList') ? 'btn-primary' : 'btn-light border'}`}
//                   onClick={() => editor.chain().focus().toggleOrderedList().run()}
//                 >
//                   <i className="bx bx-list-ol me-2"></i> Numbered
//                 </button>
//               </div>
//             </FormGroup>

//             <FormGroup className="mb-4">
//               <Label className="small fw-bold text-muted text-uppercase mb-2">{t('Color')}</Label>
//               <div className="d-flex align-items-center border rounded p-1">
//                   <Input
//                     type="color"
//                     className="border-0 p-0"
//                     style={{width: '30px', height: '30px', cursor: 'pointer'}}
//                     onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
//                     value={editor.getAttributes('textStyle').color || '#000000'}
//                   />
//               </div>
//             </FormGroup>
//           </div>
//         )}

//       </div>

//       {/* Footer Actions */}
//       {!isIdle && (
//         <div className="p-3 border-top bg-light">
//           <Button color="danger" outline size="sm" block onClick={handleDelete}>
//             <i className="bx bx-trash me-2"></i>
//             {t('Delete Element')}
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FlowPropertiesPanel;