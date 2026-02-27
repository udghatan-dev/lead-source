/**
 * Variable Replacement Utilities
 *
 * Handles variable replacement logic following Konva editor patterns:
 * - Format: ${variable_name}
 * - Name validation: lowercase, underscores only
 * - Support for both string and JSON array fallbacks
 */

/**
 * Replaces ${variable_name} patterns in text with actual values
 *
 * @param {string} text - Text containing variable placeholders
 * @param {Array} variables - Array of variable objects {name, fallback}
 * @returns {string} Text with variables replaced
 */
export const replaceVariables = (text, variables = []) => {
  if (!text || typeof text !== 'string') return text;

  const variablePattern = /\$\{([^}]+)\}/g;

  return text.replace(variablePattern, (match, variableName) => {
    const trimmedName = variableName.trim();
    const variable = variables.find(v => v.name === trimmedName);

    if (variable) {
      const val = variable.fallback;
      // Handle objects by JSON stringifying them
      if (typeof val === 'object') return JSON.stringify(val);
      return val !== undefined && val !== null ? String(val) : '';
    }

    // If variable not found, return the original match
    return match;
  });
};

/**
 * Formats variable name according to Konva editor rules:
 * - Lowercase only
 * - Spaces converted to underscores
 * - Only alphanumeric and underscores allowed
 *
 * @param {string} name - Raw variable name
 * @returns {string} Formatted variable name
 */
export const formatVariableName = (name) => {
  if (!name) return '';

  return name
    .toLowerCase()
    .replace(/\_/gi, ' ')           // Replace underscores with spaces first
    .trim()                         // Trim whitespace
    .replace(/\ /gi, '_')          // Replace spaces with underscores
    .replace(/[^0-9a-z\_]/gi, ''); // Remove non-alphanumeric except underscore
};

/**
 * Extracts all variable names from text
 *
 * @param {string} text - Text to extract variables from
 * @returns {Array<string>} Array of unique variable names
 */
export const extractVariablesFromText = (text) => {
  if (!text || typeof text !== 'string') return [];

  const variablePattern = /\$\{([^}]+)\}/g;
  const variables = new Set();

  let match;
  while ((match = variablePattern.exec(text)) !== null) {
    variables.add(match[1].trim());
  }

  return Array.from(variables);
};

/**
 * Validates if all variables in content are defined
 *
 * @param {Array<string>} usedVariables - Variables found in content
 * @param {Array} definedVariables - Array of variable objects
 * @returns {Object} Validation result {isValid, missingVariables}
 */
export const validateVariables = (usedVariables, definedVariables) => {
  const definedNames = definedVariables.map(v => v.name);
  const missing = usedVariables.filter(used => !definedNames.includes(used));

  return {
    isValid: missing.length === 0,
    missingVariables: missing,
    usedVariables,
    definedVariables: definedNames
  };
};

/**
 * Checks if a string is valid JSON
 *
 * @param {string} str - String to validate
 * @returns {boolean} True if valid JSON
 */
export const isValidJSON = (str) => {
  if (typeof str !== 'string') return false;

  try {
    const parsed = JSON.parse(str);
    return parsed !== null;
  } catch (e) {
    return false;
  }
};

/**
 * Detects if a value should be treated as JSON
 *
 * @param {*} value - Value to check
 * @returns {boolean} True if value is or appears to be JSON
 */
export const isJSONMode = (value) => {
  if (typeof value === 'object') return true;
  if (typeof value !== 'string') return false;

  const trimmed = value.trim();
  return trimmed.startsWith('[') || trimmed.startsWith('{');
};

/**
 * Extracts all variables from TipTap editor JSON content
 *
 * @param {Object} editorJSON - TipTap editor content JSON
 * @returns {Array<string>} Array of unique variable names
 */
export const extractVariablesFromEditorContent = (editorJSON) => {
  const variables = new Set();

  const traverse = (node) => {
    if (!node) return;

    // Extract from text nodes
    if (node.type === 'text' && node.text) {
      const vars = extractVariablesFromText(node.text);
      vars.forEach(v => variables.add(v));
    }

    // Extract from variable nodes
    if (node.type === 'variable' && node.attrs?.id) {
      variables.add(node.attrs.id);
    }

    // Extract from table data sources
    if (node.type === 'table' && node.attrs?.dataSourceVariable) {
      variables.add(node.attrs.dataSourceVariable);
    }

    // Extract from image URLs
    if (node.type === 'resizableImage' && node.attrs?.src) {
      const vars = extractVariablesFromText(node.attrs.src);
      vars.forEach(v => variables.add(v));
    }

    // Recurse through content
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(traverse);
    }
  };

  traverse(editorJSON);
  return Array.from(variables);
};
