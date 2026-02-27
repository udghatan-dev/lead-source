/**
 * Enhanced Table Extension
 *
 * Extends TipTap's Table with:
 * - Dynamic data binding from variables
 * - Column mapping support
 * - Custom styling (border, header colors)
 * - Column width preservation
 */

import { Table } from '@tiptap/extension-table';

export const EnhancedTable = Table.extend({
  name: 'table',

  addAttributes() {
    return {
      ...this.parent?.(),

      // Dynamic table attributes
      isDynamic: {
        default: false,
        parseHTML: element => element.getAttribute('data-is-dynamic') === 'true',
        renderHTML: attributes => {
          if (!attributes.isDynamic) return {};
          return {
            'data-is-dynamic': 'true',
          };
        },
      },

      dataSourceVariable: {
        default: '',
        parseHTML: element => element.getAttribute('data-source-variable'),
        renderHTML: attributes => {
          if (!attributes.dataSourceVariable) return {};
          return {
            'data-source-variable': attributes.dataSourceVariable,
          };
        },
      },

      columnMappings: {
        default: [],
        parseHTML: element => {
          const mapping = element.getAttribute('data-column-mappings');
          return mapping ? JSON.parse(mapping) : [];
        },
        renderHTML: attributes => {
          if (!attributes.columnMappings || attributes.columnMappings.length === 0) return {};
          return {
            'data-column-mappings': JSON.stringify(attributes.columnMappings),
          };
        },
      },

      // Styling attributes
      borderColor: {
        default: '#000000',
        parseHTML: element => element.getAttribute('data-border-color'),
        renderHTML: attributes => {
          if (!attributes.borderColor) return {};
          return {
            'data-border-color': attributes.borderColor,
          };
        },
      },

      headerBackgroundColor: {
        default: '#f0f0f0',
        parseHTML: element => element.getAttribute('data-header-bg'),
        renderHTML: attributes => {
          if (!attributes.headerBackgroundColor) return {};
          return {
            'data-header-bg': attributes.headerBackgroundColor,
          };
        },
      },

      headerTextColor: {
        default: '#000000',
        parseHTML: element => element.getAttribute('data-header-text'),
        renderHTML: attributes => {
          if (!attributes.headerTextColor) return {};
          return {
            'data-header-text': attributes.headerTextColor,
          };
        },
      },
    };
  },

  // Override renderHTML to add CSS variables for styling
  renderHTML({ node, HTMLAttributes }) {
    const borderColor = node.attrs.borderColor || '#000000';
    const headerBg = node.attrs.headerBackgroundColor || '#f0f0f0';
    const headerText = node.attrs.headerTextColor || '#000000';

    const styleString = `--border-color: ${borderColor}; --header-bg: ${headerBg}; --header-text: ${headerText};`;

    return [
      'table',
      {
        ...HTMLAttributes,
        style: styleString,
      },
      ['tbody', 0],
    ];
  },

  addCommands() {
    return {
      ...this.parent?.(),

      // Helper function to find table node
      findTableNode: () => ({ state }) => {
        const { selection } = state;
        const currentDepth = selection.$anchor.depth;

        for (let i = currentDepth; i >= 0; i--) {
          try {
            const node = selection.$anchor.node(i);
            if (node && node.type.name === 'table') {
              return { node, depth: i };
            }
          } catch (e) {
            continue;
          }
        }
        return null;
      },

      // Set table as dynamic
      setTableDynamic: (isDynamic) => ({ tr, dispatch, state }) => {
        const { selection } = state;
        const currentDepth = selection.$anchor.depth;

        for (let i = currentDepth; i >= 0; i--) {
          try {
            const node = selection.$anchor.node(i);
            if (node && node.type.name === 'table') {
              const pos = selection.$anchor.before(i);

              if (dispatch) {
                tr.setNodeMarkup(pos, null, {
                  ...node.attrs,
                  isDynamic,
                });
              }

              return true;
            }
          } catch (e) {
            continue;
          }
        }

        return false;
      },

      // Set data source variable
      setTableDataSource: (dataSourceVariable) => ({ tr, dispatch, state }) => {
        const { selection } = state;
        const currentDepth = selection.$anchor.depth;

        for (let i = currentDepth; i >= 0; i--) {
          try {
            const node = selection.$anchor.node(i);
            if (node && node.type.name === 'table') {
              const pos = selection.$anchor.before(i);

              if (dispatch) {
                tr.setNodeMarkup(pos, null, {
                  ...node.attrs,
                  dataSourceVariable,
                });
              }

              return true;
            }
          } catch (e) {
            continue;
          }
        }

        return false;
      },

      // Update column mappings
      setTableColumnMappings: (columnMappings) => ({ tr, dispatch, state }) => {
        const { selection } = state;
        const currentDepth = selection.$anchor.depth;

        for (let i = currentDepth; i >= 0; i--) {
          try {
            const node = selection.$anchor.node(i);
            if (node && node.type.name === 'table') {
              const pos = selection.$anchor.before(i);

              if (dispatch) {
                tr.setNodeMarkup(pos, null, {
                  ...node.attrs,
                  columnMappings,
                });
              }

              return true;
            }
          } catch (e) {
            continue;
          }
        }

        return false;
      },

      // Update table styling
      setTableStyle: (styleAttrs) => ({ tr, dispatch, state }) => {
        const { selection } = state;
        const currentDepth = selection.$anchor.depth;

        for (let i = currentDepth; i >= 0; i--) {
          try {
            const node = selection.$anchor.node(i);
            if (node && node.type.name === 'table') {
              const pos = selection.$anchor.before(i);

              if (dispatch) {
                tr.setNodeMarkup(pos, null, {
                  ...node.attrs,
                  ...styleAttrs,
                });
              }

              return true;
            }
          } catch (e) {
            continue;
          }
        }

        return false;
      },
    };
  },
});

export default EnhancedTable;
