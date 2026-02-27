// utils/variableReplacer.js

/**
 * Helper: Parse value safely
 */
const toString = (val) => (val === null || val === undefined ? '' : String(val));

/**
 * Replace variables in a string with their values
 * Format: ${variable_name} -> actual value
 */
function replaceVariables(text, variables) {
  if (!text || typeof text !== 'string') return text;
  
  let result = text;
  
  // Find all variables in format ${variable_name}
  const variablePattern = /\$\{([^}]+)\}/g;
  
  result = result.replace(variablePattern, (match, variableName) => {
    const trimmedName = variableName.trim();
    
    // Find the variable in the variables array
    const variable = variables.find(v => v.name === trimmedName);
    
    if (variable) {
      // If fallback is an array/object, JSON stringify it, otherwise return string
      const val = variable.fallback;
      if (typeof val === 'object') return JSON.stringify(val);
      return val !== undefined && val !== null ? String(val) : '';
    }
    
    // If variable not found, return the original match
    return match;
  });
  
  return result;
}

/**
 * Replace variables in Static table data (2D array)
 */
function replaceTableVariables(tableData, variables) {
  if (!tableData || !Array.isArray(tableData)) return tableData;
  
  return tableData.map(row => 
    row.map(cell => replaceVariables(cell, variables))
  );
}

/**
 * ✅ NEW: Logic to expand Dynamic Tables based on Data Source
 * Matches Python 'process_dynamic_tables'
 */
function processDynamicTable(element, variables) {
    const dataSourceName = element.dataSourceVariable;
    const variable = variables.find(v => v.name === dataSourceName);
    
    // 1. Validation: Variable must exist and be an array
    if (!variable || !Array.isArray(variable.fallback)) {
        // If invalid, return empty table or headers only
        return { ...element, data: [['No Data Source']], rows: 1, cols: 1 };
    }

    const rowData = variable.fallback; // The array of objects (e.g. items list)
    const mappings = element.columnMappings || [];

    // 2. Build New Data Structure
    const newData = [];

    // A. Add Header Row
    const headerRow = mappings.map(m => m.header || '');
    newData.push(headerRow);

    // B. Add Data Rows
    rowData.forEach(item => {
        const row = mappings.map(m => {
            const key = m.dataKey;
            return item[key] !== undefined ? String(item[key]) : '';
        });
        newData.push(row);
    });

    // 3. Calculate New Dimensions
    const rows = newData.length;
    const cols = mappings.length;
    const height = rows * (element.cellHeight || 30);
    const width = cols * (element.cellWidth || 80); // Approximate width logic

    return {
        ...element,
        data: newData,
        rows: rows,
        cols: cols,
        height: height,
        width: width
    };
}

/**
 * Process a single element and replace all variables
 */
function processElement(element, variables) {
  let processed = { ...element };
  
  switch (element.type) {
    case 'text':
    case 'heading':
    case 'textarea':
      if (processed.text) {
        processed.text = replaceVariables(processed.text, variables);
      }
      break;
      
    case 'table':
      // ✅ Check if Dynamic
      if (processed.isDynamic) {
          processed = processDynamicTable(processed, variables);
      } else {
          // Static Table
          if (processed.data) {
            processed.data = replaceTableVariables(processed.data, variables);
          }
      }
      break;
      
    case 'qr':
      if (processed.qrData) {
        processed.qrData = replaceVariables(processed.qrData, variables);
      }
      break;
      
    case 'image':
      if (processed.imageUrl) {
        processed.imageUrl = replaceVariables(processed.imageUrl, variables);
      }
      break;
      
    default:
      break;
  }
  
  return processed;
}

/**
 * Process all elements in a page
 */
export function processPageElements(elements, variables) {
  if (!elements || !Array.isArray(elements)) return elements;
  if (!variables || !Array.isArray(variables)) return elements;
  
  return elements.map(element => processElement(element, variables));
}

/**
 * Process all pages with variables
 */
export function processAllPages(pages, variables) {
  if (!pages || !Array.isArray(pages)) return pages;
  if (!variables || !Array.isArray(variables)) return pages;
  
  return pages.map(page => ({
    ...page,
    elements: processPageElements(page.elements, variables)
  }));
}

export function extractVariablesFromElement(element) {
  const variables = new Set();
  const variablePattern = /\$\{([^}]+)\}/g;
  
  const extractFromText = (text) => {
    if (!text || typeof text !== 'string') return;
    let match;
    while ((match = variablePattern.exec(text)) !== null) {
      variables.add(match[1].trim());
    }
  };
  
  switch (element.type) {
    case 'text':
    case 'heading':
    case 'textarea':
      extractFromText(element.text);
      break;
      
    case 'table':
      // Extract Data Source Variable if Dynamic
      if (element.isDynamic && element.dataSourceVariable) {
          variables.add(element.dataSourceVariable);
      }
      // Extract static cell vars
      if (element.data && Array.isArray(element.data)) {
        element.data.forEach(row => {
          row.forEach(cell => extractFromText(cell));
        });
      }
      break;
      
    case 'qr':
      extractFromText(element.qrData);
      break;
      
    case 'image':
      extractFromText(element.imageUrl);
      break;
  }
  
  return Array.from(variables);
}

export function extractVariablesFromPage(elements) {
  if (!elements || !Array.isArray(elements)) return [];
  
  const allVariables = new Set();
  
  elements.forEach(element => {
    const elementVars = extractVariablesFromElement(element);
    elementVars.forEach(v => allVariables.add(v));
  });
  
  return Array.from(allVariables);
}

export function validateVariables(elements, variables) {
  const usedVariables = extractVariablesFromPage(elements);
  const definedVariables = variables.map(v => v.name);
  
  const missingVariables = usedVariables.filter(
    used => !definedVariables.includes(used)
  );
  
  return {
    isValid: missingVariables.length === 0,
    missingVariables,
    usedVariables,
    definedVariables
  };
}

export function getVariableValue(variableName, variables) {
  const variable = variables.find(v => v.name === variableName);
  return variable ? variable.fallback : '';
}

export default {
  replaceVariables,
  replaceTableVariables,
  processElement,
  processPageElements,
  processAllPages,
  extractVariablesFromElement,
  extractVariablesFromPage,
  validateVariables,
  getVariableValue
};