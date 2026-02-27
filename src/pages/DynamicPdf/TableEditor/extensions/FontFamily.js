/**
 * Font Family Extension
 *
 * Adds font family support to text nodes
 */

import { Extension } from '@tiptap/core';

export const FontFamily = Extension.create({
  name: 'fontFamily',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: element => element.style.fontFamily?.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontFamily) {
                return {};
              }

              return {
                style: `font-family: ${attributes.fontFamily}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontFamily: (fontFamily) => ({ commands }) => {
        return commands.setMark('textStyle', { fontFamily });
      },
      unsetFontFamily: () => ({ commands }) => {
        return commands.unsetMark('textStyle');
      },
    };
  },
});

export default FontFamily;
