/**
 * Dynamic Table Processing Utilities
 *
 * Handles table data population from variables following Konva editor patterns:
 * - Dynamic mode with data source variables
 * - Column mapping to extract data from JSON arrays
 * - Formula evaluation for calculated columns
 * - Style preservation from template rows
 */

import { evaluateFormula } from './formulaEvaluator';

/**
 * Processes a single dynamic table node
 *
 * @param {Object} tableNode - TipTap table node
 * @param {Array} variables - Array of variable objects
 * @returns {Object} Processed table node with populated data
 */
export const processDynamicTable = (tableNode, variables) => {
  if (!tableNode || tableNode.type !== 'table') return tableNode;

  const attrs = tableNode.attrs || {};

  // Skip if not dynamic or no data source
  if (!attrs.isDynamic || !attrs.dataSourceVariable) {
    return tableNode;
  }

  // 1. Get Variable Data
  const variable = variables.find(v => v.name === attrs.dataSourceVariable);
  if (!variable) {
    console.warn(`Variable "${attrs.dataSourceVariable}" not found`);
    return tableNode;
  }

  // Parse data if it's a string
  let rowData = variable.fallback;
  if (typeof rowData === 'string') {
    try {
      rowData = JSON.parse(rowData);
    } catch (e) {
      console.error('Failed to parse variable data as JSON:', e);
      return tableNode;
    }
  }

  // Validate data is an array
  if (!Array.isArray(rowData)) {
    console.warn('Data source variable is not an array');
    return tableNode;
  }

  // 2. Identify Template Rows for Style Preservation
  const templateHeaderRow = tableNode.content && tableNode.content[0];
  const templateDataRow = tableNode.content && (tableNode.content[1] || tableNode.content[0]);

  const newContent = [];

  // === HELPER: Create a Cell based on a Template ===
  const createCellFromTemplate = (templateCell, newText, type = 'tableCell') => {
    // Deep copy all attributes from template cell to preserve column widths
    const newCell = {
      type: type,
      attrs: templateCell?.attrs ? JSON.parse(JSON.stringify(templateCell.attrs)) : {},
      content: []
    };

    // Extract paragraph attributes and text marks from template
    const templatePara = templateCell?.content?.find(n => n.type === 'paragraph');
    const paraAttrs = templatePara ? { ...templatePara.attrs } : {};

    let textMarks = [];
    if (templatePara && templatePara.content && templatePara.content.length > 0) {
      const textNode = templatePara.content.find(n => n.type === 'text');
      if (textNode && textNode.marks) {
        textMarks = textNode.marks;  // Preserve bold, color, italic, etc.
      }
    }

    // Create new cell content with template styling
    newCell.content = [{
      type: 'paragraph',
      attrs: paraAttrs,
      content: [{
        type: 'text',
        text: String(newText || ''),
        marks: textMarks  // Apply preserved marks
      }]
    }];

    return newCell;
  };

  // === 3. BUILD HEADER ROW ===
  if (templateHeaderRow && attrs.columnMappings && attrs.columnMappings.length > 0) {
    const headerCells = attrs.columnMappings.map((mapping, index) => {
      const templateCell = templateHeaderRow.content && templateHeaderRow.content[index];
      return createCellFromTemplate(templateCell, mapping.header || '', 'tableHeader');
    });

    newContent.push({
      type: 'tableRow',
      content: headerCells
    });
  }

  // === 4. BUILD DATA ROWS ===
  if (attrs.columnMappings && attrs.columnMappings.length > 0) {
    rowData.forEach((item) => {
      const rowCells = attrs.columnMappings.map((mapping, index) => {
        let cellValue = '';

        // Check if this is a formula column
        if (mapping.formula) {
          cellValue = evaluateFormula(mapping.formula, item);
        } else if (mapping.dataKey) {
          // Extract value using dataKey
          cellValue = item[mapping.dataKey] !== undefined ? item[mapping.dataKey] : '';
        }

        const templateCell = templateDataRow?.content && templateDataRow.content[index];
        return createCellFromTemplate(templateCell, cellValue, 'tableCell');
      });

      newContent.push({
        type: 'tableRow',
        content: rowCells
      });
    });
  }

  // === 5. Return Updated Table Node ===
  return {
    ...tableNode,
    content: newContent,
    attrs: {
      ...tableNode.attrs,
      isDynamic: attrs.isDynamic,
      dataSourceVariable: attrs.dataSourceVariable,
      columnMappings: attrs.columnMappings,
      borderColor: attrs.borderColor,
      headerBackgroundColor: attrs.headerBackgroundColor,
      headerTextColor: attrs.headerTextColor
    }
  };
};

/**
 * Recursively processes all dynamic tables in editor content
 *
 * @param {Object} editorJSON - TipTap editor content JSON
 * @param {Array} variables - Array of variable objects
 * @returns {Object} Editor content with processed tables
 */
export const processAllDynamicTables = (editorJSON, variables) => {
  if (!editorJSON) return editorJSON;

  const processNode = (node) => {
    if (!node) return node;

    // Process this node if it's a table
    let processedNode = node;
    if (node.type === 'table') {
      processedNode = processDynamicTable(node, variables);
    }

    // Recursively process child content
    if (processedNode.content && Array.isArray(processedNode.content)) {
      processedNode = {
        ...processedNode,
        content: processedNode.content.map(processNode)
      };
    }

    return processedNode;
  };

  return processNode(editorJSON);
};

/**
 * Full editor content processing pipeline
 * Processes tables, replaces variables, and prepares for preview/PDF generation
 *
 * @param {Object} editorJSON - TipTap editor content JSON
 * @param {Array} variables - Array of variable objects
 * @returns {Object} Fully processed editor content
 */
export const processEditorContent = (editorJSON, variables) => {
  if (!editorJSON) return editorJSON;

  // Step 1: Process all dynamic tables
  let processedContent = processAllDynamicTables(editorJSON, variables);

  // Step 2: Replace variable nodes and text variables
  const replaceVariablesInNode = (node) => {
    if (!node) return node;

    let processedNode = { ...node };

    // Replace variable nodes with their values
    if (node.type === 'variable' && node.attrs?.id) {
      const variable = variables.find(v => v.name === node.attrs.id);
      if (variable) {
        return {
          type: 'text',
          text: String(variable.fallback || '')
        };
      }
    }

    // Replace variables in text nodes
    if (node.type === 'text' && node.text) {
      const replacedText = replaceVariablesInText(node.text, variables);
      if (replacedText !== node.text) {
        processedNode = {
          ...node,
          text: replacedText
        };
      }
    }

    // Replace variables in image URLs
    if (node.type === 'resizablmage' && node.attrs?.src) {
      const replacedSrc = replaceVariablesInText(node.attrs.src, variables);
      if (replacedSrc !== node.attrs.src) {
        processedNode = {
          ...node,
          attrs: {
            ...node.attrs,
            src: replacedSrc
          }
        };
      }
    }

    // Recurse through content
    if (processedNode.content && Array.isArray(processedNode.content)) {
      processedNode = {
        ...processedNode,
        content: processedNode.content.map(replaceVariablesInNode)
      };
    }

    return processedNode;
  };

  processedContent = replaceVariablesInNode(processedContent);

  return processedContent;
};

/**
 * Helper function to replace variables in text
 * @private
 */
const replaceVariablesInText = (text, variables) => {
  if (!text || typeof text !== 'string') return text;

  const variablePattern = /\$\{([^}]+)\}/g;
  return text.replace(variablePattern, (match, variableName) => {
    const trimmedName = variableName.trim();
    const variable = variables.find(v => v.name === trimmedName);

    if (variable) {
      const val = variable.fallback;
      if (typeof val === 'object') return JSON.stringify(val);
      return val !== undefined && val !== null ? String(val) : '';
    }

    return match;
  });
};
