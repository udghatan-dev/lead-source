// import Image from '@tiptap/extension-image';
// import { ReactNodeViewRenderer } from '@tiptap/react';
// import ResizableImageComponent from './ResizableImageComponent';

// export default Image.extend({
//   addAttributes() {
//     return {
//       ...this.parent?.(),
//       width: {
//         default: null, // Allow component to handle defaults
//         parseHTML: element => element.style.width,
//         renderHTML: attributes => ({
//           style: `width: ${attributes.width}`,
//         }),
//       },
//       height: {
//         default: null,
//         parseHTML: element => element.style.height,
//         renderHTML: attributes => ({
//           style: `height: ${attributes.height}`,
//         }),
//       },

//       textAlign: {
//         default: 'center',
//         parseHTML: element => element.style.textAlign || element.getAttribute('align'),
//         renderHTML: attributes => ({
//           style: `text-align: ${attributes.textAlign}`,
//           align: attributes.textAlign
//         }),
//       },
//     };
//   },

//   addNodeView() {
//     return ReactNodeViewRenderer(ResizableImageComponent);
//   },
// });