/**
 * Page Break Extension
 *
 * Forces content to start on a new A4 page (210mm x 297mm)
 * Perfect for invoices where T&C must appear on a separate page
 */

import { Node, mergeAttributes } from '@tiptap/core';

export const PageBreak = Node.create({
  name: 'pageBreak',

  group: 'block',

  atom: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="page-break"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'page-break',
        class: 'page-break',
      }),
      [
        'div',
        { class: 'page-break-line' },
      ],
      [
        'div',
        { class: 'page-break-text' },
        '📄 New Page Starts Here',
      ],
    ];
  },

  addCommands() {
    return {
      setPageBreak: () => ({ commands }) => {
        return commands.insertContent({ type: this.name });
      },
    };
  },
});

export default PageBreak;
