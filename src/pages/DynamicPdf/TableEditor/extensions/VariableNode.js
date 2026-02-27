/**
 * Variable Node Extension
 *
 * Creates inline variable chips that display as ${variable_name}
 * Following Konva editor variable pattern
 */

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import VariableComponent from './VariableComponent';

export const VariableNode = Node.create({
  name: 'variable',

  group: 'inline',

  inline: true,

  selectable: true,

  atom: true,

  addAttributes() {
    return {
      id: {
        default: '',
        parseHTML: element => element.getAttribute('data-variable-id'),
        renderHTML: attributes => {
          return {
            'data-variable-id': attributes.id,
          };
        },
      },
      fallback: {
        default: '',
        parseHTML: element => element.getAttribute('data-fallback'),
        renderHTML: attributes => {
          return {
            'data-fallback': attributes.fallback,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-variable-id]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { class: 'variable-node' }), `\${${HTMLAttributes['data-variable-id']}}`];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VariableComponent);
  },

  addCommands() {
    return {
      insertVariable: (variableName, fallback = '') => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            id: variableName,
            fallback: fallback,
          },
        });
      },
    };
  },
});

export default VariableNode;
