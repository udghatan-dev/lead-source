// // ImageInserter.js - Insert images with variable support
// import React, { useState, useRef } from 'react';
// import { useSelector } from 'react-redux';
// import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, Badge } from 'reactstrap';
// import { useTranslation } from 'react-i18next';

// const ImageInserter = ({ editor, isOpen, toggle }) => {
//   const { t } = useTranslation();
//   const [imageUrl, setImageUrl] = useState('');
//   const [cursorPosition, setCursorPosition] = useState(0);
//   const inputRef = useRef(null);
//   const variables = useSelector(state => state.pdfBuilder?.variables || []);

//   const insertVariable = (variableName) => {
//     const input = inputRef.current;
//     if (!input) return;

//     const start = input.selectionStart;
//     const end = input.selectionEnd;
//     const before = imageUrl.substring(0, start);
//     const after = imageUrl.substring(end);
//     const newValue = before + `\${${variableName}}` + after;

//     setImageUrl(newValue);

//     // Set cursor position after the inserted variable
//     setTimeout(() => {
//       const newPos = start + `\${${variableName}}`.length;
//       input.setSelectionRange(newPos, newPos);
//       input.focus();
//     }, 0);
//   };

//   const handleInsert = () => {
//     if (imageUrl.trim() && editor) {
//       editor.chain().focus().setImage({ src: imageUrl }).run();
//       setImageUrl('');
//       toggle();
//     }
//   };

//   const handleUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImageUrl(e.target.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} toggle={toggle} centered size="md">
//       <ModalHeader toggle={toggle}>
//         <i className="bx bx-image me-2"></i>
//         {t('Insert Image')}
//       </ModalHeader>
//       <ModalBody>
//         <FormGroup>
//           <Label style={{ fontSize: '11px', fontWeight: '600' }}>
//             {t('Image URL')}
//             {variables.length > 0 && (
//               <small className="text-muted ms-2">
//                 ({t('Click badge below to insert variable')})
//               </small>
//             )}
//           </Label>
//           <Input
//             innerRef={inputRef}
//             type="text"
//             bsSize="sm"
//             value={imageUrl}
//             onChange={(e) => setImageUrl(e.target.value)}
//             onSelect={(e) => setCursorPosition(e.target.selectionStart)}
//             placeholder="https://example.com/image.jpg or ${variable_name}"
//           />
//         </FormGroup>

//         {/* Variable Selector */}
//         {variables.length > 0 && (
//           <div className="mb-3">
//             <Label style={{ fontSize: '10px', fontWeight: '600', color: '#666' }}>
//               {t('Available Variables')}:
//             </Label>
//             <div className="d-flex flex-wrap gap-2">
//               {variables.map((variable, index) => (
//                 <Badge
//                   key={index}
//                   color="success"
//                   className="cursor-pointer"
//                   style={{
//                     fontSize: '10px',
//                     fontWeight: '500',
//                     padding: '4px 8px',
//                     cursor: 'pointer',
//                     transition: 'all 0.2s'
//                   }}
//                   onClick={() => insertVariable(variable.name)}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = 'scale(1.05)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = 'scale(1)';
//                   }}
//                 >
//                   <i className="bx bx-data me-1"></i>
//                   {variable.name}
//                 </Badge>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Upload Option */}
//         <div className="text-center">
//           <div className="mb-2 text-muted" style={{ fontSize: '11px' }}>
//             {t('OR')}
//           </div>
//           <label className="btn btn-outline-primary btn-sm">
//             <i className="bx bx-upload me-1"></i>
//             {t('Upload Image')}
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleUpload}
//               style={{ display: 'none' }}
//             />
//           </label>
//         </div>

//         {/* Preview */}
//         {imageUrl && !imageUrl.includes('${') && (
//           <div className="mt-3 text-center">
//             <Label style={{ fontSize: '10px', fontWeight: '600', color: '#666' }}>
//               {t('Preview')}:
//             </Label>
//             <div className="border rounded p-2 bg-light">
//               <img
//                 src={imageUrl}
//                 alt="Preview"
//                 style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
//                 onError={(e) => {
//                   e.target.style.display = 'none';
//                 }}
//               />
//             </div>
//           </div>
//         )}

//         {imageUrl && imageUrl.includes('${') && (
//           <div className="mt-3 p-2 bg-info-subtle rounded">
//             <small className="text-info">
//               <i className="bx bx-info-circle me-1"></i>
//               {t('Image URL contains variables. Preview will be available after variable replacement.')}
//             </small>
//           </div>
//         )}
//       </ModalBody>
//       <ModalFooter>
//         <Button color="secondary" size="sm" onClick={toggle}>
//           {t('Cancel')}
//         </Button>
//         <Button
//           color="primary"
//           size="sm"
//           onClick={handleInsert}
//           disabled={!imageUrl.trim()}
//         >
//           <i className="bx bx-check me-1"></i>
//           {t('Insert')}
//         </Button>
//       </ModalFooter>
//     </Modal>
//   );
// };

// export default ImageInserter;
