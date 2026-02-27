// import React, { useState, useEffect } from 'react';
// import { NodeViewWrapper } from '@tiptap/react';
// import { Resizable } from 're-resizable';

// const ResizableImageComponent = (props) => {
//   const { src, alt, title, width, height, textAlign } = props.node.attrs;

//   // 1. Detect if this is a variable (e.g., "${user_name}")
//   const isVariable = src?.startsWith('${');

//   // 2. Generate a Placeholder for variables so they are visible and resizable
//   // This SVG displays the variable name inside a grey box
//   const placeholderSrc = `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect fill='%23eee' width='150' height='150'/%3E%3Ctext fill='%23555' font-family='sans-serif' font-size='14' dy='5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3E${isVariable ? 'VARIABLE' : 'IMAGE'}%3C/text%3E%3C/svg%3E`;

//   // Use the real source if it's a normal image, otherwise use the placeholder
//   const displaySrc = isVariable ? placeholderSrc : src;

//   // 3. Define Alignment Mapping
//   const alignmentMap = {
//     left: 'flex-start',
//     center: 'center',
//     right: 'flex-end',
//     justify: 'stretch'
//   };
//   const justifyContent = alignmentMap[textAlign] || 'center'; // Default to center if undefined

//   // Local state for smooth resizing
//   const [currentSize, setCurrentSize] = useState({
//     width: width || (isVariable ? '150px' : '100%'), // Default variables to 150px
//     height: height || 'auto'
//   });

//   useEffect(() => {
//     setCurrentSize({
//       width: width || (isVariable ? '150px' : '100%'),
//       height: height || 'auto'
//     });
//   }, [width, height, isVariable]);

//   return (
//     <NodeViewWrapper 
//       className="image-resizer" 
//       style={{ 
//         display: 'flex', 
//         justifyContent: justifyContent, // <--- Applies the alignment
//         margin: '10px 0'
//       }}
//     >
//       <Resizable
//         size={{ width: currentSize.width, height: currentSize.height }}
//         lockAspectRatio={!isVariable} // Optional: Unlock aspect ratio for placeholder variables?
//         maxWidth="100%"
//         onResize={(e, direction, ref) => {
//           setCurrentSize({
//             width: ref.style.width,
//             height: ref.style.height,
//           });
//         }}
//         onResizeStop={(e, direction, ref) => {
//           props.updateAttributes({
//             width: ref.style.width,
//             height: ref.style.height,
//           });
//         }}
//         enable={{
//           top:false, right:true, bottom:true, left:true,
//           topRight:true, bottomRight:true, bottomLeft:true, topLeft:true
//         }}
//         style={{
//              display: 'flex',
//              position: 'relative',
//              border: props.selected ? '2px solid #0ab39c' : '2px solid transparent',
//              lineHeight: 0
//         }}
//       >
//         <img
//           src={displaySrc}
//           alt={alt}
//           title={title}
//           style={{ 
//             width: '100%', 
//             height: '100%', 
//             display: 'block',
//             pointerEvents: 'none',
//             opacity: isVariable ? 0.8 : 1 // Slight fade for variables to distinguish them
//           }}
//         />
//         {isVariable && (
//             <span style={{
//                 position: 'absolute', bottom: 0, left: 0, right: 0, 
//                 background: 'rgba(0,0,0,0.6)', color: '#fff', 
//                 fontSize: '10px', padding: '2px', textAlign: 'center',
//                 pointerEvents: 'none'
//             }}>
//                 {src}
//             </span>
//         )}
//       </Resizable>
//     </NodeViewWrapper>
//   );
// };

// export default ResizableImageComponent;