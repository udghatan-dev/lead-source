// TableDataProcessor.js - Process dynamic tables with variable data
// Similar to Konva's VariableReplacer logic for tables

/**
 * Process a dynamic table by populating it with data from variables
 * @param {Object} tableNode - The TipTap table node from editor.getJSON()
 * @param {Array} variables - Array of variables from Redux store
 * @returns {Object} - Processed table node with data rows
 */


// TableDataProcessor.js
/**
 * Process a dynamic table by populating it with data from variables
 * Preserves Styles (Bold, Align, Colors) from the Master Template
 */
export const processDynamicTable = (tableNode, variables) => {
  if (!tableNode || tableNode.type !== 'table') return tableNode;

  const attrs = tableNode.attrs || {};
  if (!attrs.isDynamic || !attrs.dataSourceVariable) return tableNode;

  // 1. Get Variable Data
  const variable = variables.find(v => v.name === attrs.dataSourceVariable);
  if (!variable) return tableNode;

  let rowData = variable.fallback;
  if (typeof rowData === 'string') {
    try { rowData = JSON.parse(rowData); } catch (e) { return tableNode; }
  }
  if (!Array.isArray(rowData)) return tableNode;

  // 2. Identify Template Rows (Header vs Data)
  // Row 0 is the visual header in the editor
  // Row 1 is the visual data row (if it exists), otherwise we use Row 0 styles
  const templateHeaderRow = tableNode.content[0];
  const templateDataRow = tableNode.content[1] || tableNode.content[0];

  // DEBUG: Log template cell colwidths
  console.log('🔍 Processing Dynamic Table:', {
    headerCellWidths: templateHeaderRow?.content?.map(c => c.attrs?.colwidth),
    dataCellWidths: templateDataRow?.content?.map(c => c.attrs?.colwidth),
  });

  const newContent = [];

  // === HELPER: Create a Cell based on a Template ===
  const createCellFromTemplate = (templateCell, newText, type = 'tableCell') => {
    // 1. Basic Cell Structure with FULL attribute preservation
    // Deep copy all attributes from template cell to preserve column widths
    const newCell = {
      type: type,
      attrs: templateCell?.attrs ? JSON.parse(JSON.stringify(templateCell.attrs)) : {},
      content: []
    };

    const templatePara = templateCell?.content?.find(n => n.type === 'paragraph');
    const paraAttrs = templatePara ? { ...templatePara.attrs } : {};

    let textMarks = [];
    if (templatePara && templatePara.content && templatePara.content.length > 0) {
      const textNode = templatePara.content.find(n => n.type === 'text');
      if (textNode && textNode.marks) {
        textMarks = textNode.marks;
      }
    }

    // 4. Assemble
    newCell.content = [{
      type: 'paragraph',
      attrs: paraAttrs,
      content: [{
        type: 'text',
        text: String(newText || ''), // Ensure it's a string
        marks: textMarks // Apply the stolen bold/color/italic
      }]
    }];

    return newCell;
  };

  // === 3. BUILD HEADER ROW ===
  if (templateHeaderRow) {
    const headerCells = attrs.columnMappings.map((mapping, index) => {
      const templateCell = templateHeaderRow.content[index];
      // Force "tableHeader" type for the first row
      const cell = createCellFromTemplate(templateCell, mapping.header, 'tableHeader');
      console.log(`📊 Header Cell ${index}:`, { colwidth: cell.attrs?.colwidth, attrs: cell.attrs });
      return cell;
    });

    newContent.push({
      type: 'tableRow',
      content: headerCells
    });
  }

  // === 4. BUILD DATA ROWS ===
  rowData.forEach((item) => {
    const rowCells = attrs.columnMappings.map((mapping, index) => {
      // Calculate Value
      let cellValue = '';
      if (mapping.formula) {
        cellValue = evaluateFormula(mapping.formula, item);
      } else if (mapping.dataKey) {
        cellValue = item[mapping.dataKey] !== undefined ? item[mapping.dataKey] : '';
      }

      // Use the "Data Row" template (Row 1) for styling these cells
      const templateCell = templateDataRow.content[index];
      return createCellFromTemplate(templateCell, cellValue, 'tableCell');
    });

    newContent.push({
      type: 'tableRow',
      content: rowCells
    });
  });

  // Return the processed table with preserved attributes
  return {
    ...tableNode,
    content: newContent,
    // Preserve table-level attributes (styles, colors, etc.)
    attrs: {
      ...tableNode.attrs,
      // Ensure dynamic table attributes are preserved
      isDynamic: attrs.isDynamic,
      dataSourceVariable: attrs.dataSourceVariable,
      columnMappings: attrs.columnMappings,
      borderColor: attrs.borderColor,
      headerBackgroundColor: attrs.headerBackgroundColor,
      headerTextColor: attrs.headerTextColor,
    }
  };
};

/**
 * Evaluate formula with data context
 * Formulas use {key} syntax, e.g., "{qty} * {price}"
 * @param {string} formula - Formula string
 * @param {Object} data - Data object for current row
 * @returns {string} - Evaluated result
 */
export const evaluateFormula = (formula, data) => {
  if (!formula || !data) return '';

  try {
    // Replace {key} with actual values from data
    let expression = formula;

    // Find all {key} patterns
    const matches = formula.match(/\{([^}]+)\}/g);
    if (!matches) return formula; // No variables, return as-is

    matches.forEach(match => {
      const key = match.slice(1, -1); // Remove { }
      const value = data[key];

      if (value !== undefined) {
        // Replace with numeric value or 0 if not a number
        const numValue = isNaN(value) ? 0 : Number(value);
        expression = expression.replace(match, numValue);
      } else {
        // If key not found, replace with 0
        expression = expression.replace(match, 0);
      }
    });

    // Evaluate the mathematical expression safely
    // Using Function constructor with strict evaluation
    const result = new Function('return ' + expression)();

    // Format result (round to 2 decimal places if float)
    return typeof result === 'number'
      ? (Number.isInteger(result) ? String(result) : result.toFixed(2))
      : String(result);

  } catch (error) {
    console.error('Formula evaluation error:', error);
    return 'ERROR';
  }
};

/**
 * Process all dynamic tables in editor content
 * @param {Object} editorJSON - Full editor content from editor.getJSON()
 * @param {Array} variables - Array of variables
 * @returns {Object} - Processed content with all dynamic tables populated
 */
export const processAllDynamicTables = (editorJSON, variables) => {
  if (!editorJSON || !editorJSON.content) return editorJSON;

  const processNode = (node) => {
    // If it's a table, process it
    if (node.type === 'table' && node.attrs?.isDynamic) {
      return processDynamicTable(node, variables);
    }

    // If node has content, recursively process children
    if (node.content && Array.isArray(node.content)) {
      return {
        ...node,
        content: node.content.map(processNode)
      };
    }

    return node;
  };

  return {
    ...editorJSON,
    content: editorJSON.content.map(processNode)
  };
};

/**
 * Replace variables in text content (for ${variable_name} patterns)
 * @param {string} text - Text containing ${var} patterns
 * @param {Array} variables - Array of variables
 * @returns {string} - Text with variables replaced
 */
export const replaceVariables = (text, variables) => {
  if (!text || typeof text !== 'string') return text;

  let result = text;
  const matches = text.match(/\$\{([^}]+)\}/g);

  if (matches) {
    matches.forEach(match => {
      const varName = match.slice(2, -1); // Remove ${ }
      const variable = variables.find(v => v.name === varName);

      if (variable) {
        const value = typeof variable.fallback === 'object'
          ? JSON.stringify(variable.fallback)
          : String(variable.fallback);
        result = result.replace(match, value);
      }
    });
  }

  return result;
};

/**
 * Process entire editor content: replace variables and populate dynamic tables
 * @param {Object} editorJSON - Editor content
 * @param {Array} variables - Variables array
 * @returns {Object} - Fully processed content
 */
export const processEditorContent = (editorJSON, variables) => {
  if (!editorJSON) return editorJSON;

  const processNode = (node) => {
    // Process dynamic tables
    if (node.type === 'table' && node.attrs?.isDynamic) {
      return processDynamicTable(node, variables);
    }

    // Replace variables in text nodes
    if (node.type === 'text' && node.text) {
      return {
        ...node,
        text: replaceVariables(node.text, variables)
      };
    }

    // Process image URLs with variables
    if (node.type === 'resizableImage' && node.attrs?.src) {
      return {
        ...node,
        attrs: {
          ...node.attrs,
          src: replaceVariables(node.attrs.src, variables)
        }
      };
    }

    // Process variable nodes (replace with actual values)
    if (node.type === 'variable' && node.attrs?.id) {
      const variable = variables.find(v => v.name === node.attrs.id);
      if (variable) {
        const value = typeof variable.fallback === 'object'
          ? JSON.stringify(variable.fallback)
          : String(variable.fallback);

        // Convert variable node to text node with value
        return {
          type: 'text',
          text: value
        };
      }
    }

    // Recursively process children
    if (node.content && Array.isArray(node.content)) {
      return {
        ...node,
        content: node.content.map(processNode)
      };
    }

    return node;
  };

  return {
    ...editorJSON,
    content: editorJSON.content.map(processNode)
  };
};
