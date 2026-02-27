/**
 * Enhanced Table Cell Extension
 *
 * Extends TipTap's TableCell with custom dimensions support
 */

import { TableCell } from '@tiptap/extension-table-cell';

export const EnhancedTableCell = TableCell.extend({
  name: 'tableCell',

  addAttributes() {
    return {
      ...this.parent?.(),

      // Custom cell dimensions
      cellWidth: {
        default: null,
        parseHTML: element => element.getAttribute('data-cell-width'),
        renderHTML: attributes => {
          if (!attributes.cellWidth) return {};
          return {
            'data-cell-width': attributes.cellWidth,
          };
        },
      },

      cellHeight: {
        default: null,
        parseHTML: element => element.getAttribute('data-cell-height'),
        renderHTML: attributes => {
          if (!attributes.cellHeight) return {};
          return {
            'data-cell-height': attributes.cellHeight,
          };
        },
      },

      // Preserve TipTap's colwidth attribute for column resizing
      colwidth: {
        default: null,
        parseHTML: element => {
          const colwidth = element.getAttribute('colwidth');
          const value = colwidth ? colwidth.split(',').map(width => parseInt(width, 10)) : null;
          return value;
        },
        renderHTML: attributes => {
          if (!attributes.colwidth) return {};
          return {
            colwidth: attributes.colwidth.join(','),
          };
        },
      },

      colspan: {
        default: 1,
      },

      rowspan: {
        default: 1,
      },
    };
  },
});

export default EnhancedTableCell;
