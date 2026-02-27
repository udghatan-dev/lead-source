/**
 * Resizable Image Extension
 *
 * Image extension with:
 * - Drag-to-resize functionality
 * - Variable support in image URLs (${variable_name})
 * - Text alignment support
 */

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ResizableImageComponent from './ResizableImageComponent';

export const ResizableImage = Node.create({
  name: 'resizableImage',

  group: 'block',

  atom: true,

  draggable: true,

  selectable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: element => element.getAttribute('src'),
        renderHTML: attributes => {
          if (!attributes.src) return {};
          return {
            src: attributes.src,
          };
        },
      },

      width: {
        default: 300,
        parseHTML: element => {
          const width = element.getAttribute('data-width');
          return width ? parseInt(width, 10) : 300;
        },
        renderHTML: attributes => {
          return {
            'data-width': attributes.width,
          };
        },
      },

      height: {
        default: 200,
        parseHTML: element => {
          const height = element.getAttribute('data-height');
          return height ? parseInt(height, 10) : 200;
        },
        renderHTML: attributes => {
          return {
            'data-height': attributes.height,
          };
        },
      },

      textAlign: {
        default: 'left',
        parseHTML: element => element.getAttribute('data-text-align'),
        renderHTML: attributes => {
          if (!attributes.textAlign) return {};
          return {
            'data-text-align': attributes.textAlign,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },

  addCommands() {
    return {
      insertImage: (src, width = 300, height = 200, textAlign = 'left') => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            src,
            width,
            height,
            textAlign,
          },
        });
      },

      updateImageSize: (width, height) => ({ tr, dispatch, state }) => {
        const { selection } = state;
        const node = selection.node;

        if (node && node.type.name === this.name) {
          if (dispatch) {
            tr.setNodeMarkup(selection.from, null, {
              ...node.attrs,
              width,
              height,
            });
          }
          return true;
        }

        return false;
      },
    };
  },
});

export default ResizableImage;
