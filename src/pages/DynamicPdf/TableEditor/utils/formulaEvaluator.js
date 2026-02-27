// /**
//  * Formula Evaluation Utility
//  *
//  * Evaluates formulas for calculated table columns
//  * Format: {key} * {otherKey} + 100
//  * Example: {quantity} * {price}
//  */

// /**
//  * Evaluates a formula using data from a row object
//  *
//  * @param {string} formula - Formula string with {key} placeholders
//  * @param {Object} data - Row data object
//  * @returns {string} Evaluated result or 'ERROR' if evaluation fails
//  *
//  * @example
//  * evaluateFormula('{qty} * {price}', {qty: 5, price: 10.50})
//  * // Returns: "52.50"
//  */
// export const evaluateFormula = (formula, data) => {
//   if (!formula || !data) return '';

//   try {
//     let expression = formula;

//     // Find all {key} patterns in the formula
//     const matches = formula.match(/\{([^}]+)\}/g);
//     if (!matches) {
//       // No placeholders found, try to evaluate as-is
//       return formula;
//     }

//     // Replace each {key} with its numeric value
//     matches.forEach(match => {
//       const key = match.slice(1, -1); // Remove { }
//       const value = data[key];

//       if (value !== undefined) {
//         // Convert to number, default to 0 if NaN
//         const numValue = isNaN(value) ? 0 : Number(value);
//         expression = expression.replace(match, numValue);
//       } else {
//         // Key not found in data, use 0
//         expression = expression.replace(match, 0);
//       }
//     });

//     // Evaluate the mathematical expression safely
//     // Using Function constructor for safe evaluation (limited scope)
//     const result = new Function('return ' + expression)();

//     // Format the result
//     if (typeof result === 'number') {
//       // If integer, return as-is, otherwise format to 2 decimals
//       return Number.isInteger(result) ? String(result) : result.toFixed(2);
//     }

//     return String(result);

//   } catch (error) {
//     console.error('Formula evaluation error:', error);
//     return 'ERROR';
//   }
// };

// /**
//  * Validates if a formula is syntactically correct
//  *
//  * @param {string} formula - Formula string to validate
//  * @returns {Object} Validation result {isValid, error}
//  */
// export const validateFormula = (formula) => {
//   if (!formula || typeof formula !== 'string') {
//     return { isValid: false, error: 'Formula is empty' };
//   }

//   try {
//     // Extract all {key} placeholders
//     const matches = formula.match(/\{([^}]+)\}/g);
//     let testExpression = formula;

//     // Replace all placeholders with a test number
//     if (matches) {
//       matches.forEach(match => {
//         testExpression = testExpression.replace(match, '1');
//       });
//     }

//     // Try to evaluate the test expression
//     new Function('return ' + testExpression)();

//     return { isValid: true, error: null };

//   } catch (error) {
//     return {
//       isValid: false,
//       error: error.message || 'Invalid formula syntax'
//     };
//   }
// };

// /**
//  * Extracts all keys referenced in a formula
//  *
//  * @param {string} formula - Formula string
//  * @returns {Array<string>} Array of key names used in formula
//  */
// export const extractFormulaKeys = (formula) => {
//   if (!formula || typeof formula !== 'string') return [];

//   const matches = formula.match(/\{([^}]+)\}/g);
//   if (!matches) return [];

//   return matches.map(match => match.slice(1, -1)); // Remove { }
// };


/**
 * Formula Evaluation Utility
 *
 * Evaluates formulas for calculated table columns
 * Format: {key} * {otherKey} + 100
 * Example: {quantity} * {price}
 */

/**
 * Evaluates a formula using data from a row object
 *
 * @param {string} formula - Formula string with {key} placeholders
 * @param {Object} data - Row data object
 * @returns {string} Evaluated result or 'ERROR' if evaluation fails
 *
 * @example
 * evaluateFormula('{qty} * {price}', {qty: 5, price: 10.50})
 * // Returns: "52.50"
 */
/**
 * Formula Evaluation Utility
 *
 * Evaluates formulas for calculated table columns
 * Format: {key} * {otherKey} + 100
 * Example: {quantity} * {price}
 */

export const evaluateFormula = (formula, data) => {
  // Basic safety checks
  if (!formula || typeof formula !== 'string') return '';
  if (!data) return '';

  try {
    let expression = formula;

    // 1. Replace variables {key} with actual numeric values
    expression = expression.replace(/\{([^}]+)\}/g, (match, key) => {
      const value = data[key];
      let numValue = parseFloat(value);
      if (isNaN(numValue)) numValue = 0;
      return numValue;
    });

    // 2. PERCENTAGE FIX: Convert "number%" to "(number/100)"
    // Matches: 10%, 5.5%, .5% (Must be immediately after the number)
    expression = expression.replace(/(\d+(\.\d+)?|(\.\d+))%/g, '($1/100)');

    // 3. Security / Sanitation
    // Allow digits, math operators, parenthesis, and % (for modulo usage if spaces exist)
    const sanitized = expression.replace(/[^-()\d/*+.\s%]/g, '');

    if (!sanitized.trim()) return '';

    // 4. Evaluate
    // eslint-disable-next-line no-new-func
    const result = new Function('return ' + sanitized)();

    // 5. Format
    if (!isFinite(result) || isNaN(result)) return '0';
    return Number.isInteger(result) ? String(result) : result.toFixed(2);

  } catch (error) {
    return 'ERROR';
  }
};

export const validateFormula = (formula) => {
  if (!formula || typeof formula !== 'string') return { isValid: false, error: 'Empty' };

  try {
    let testExpression = formula;
    // Replace variables with 1
    testExpression = testExpression.replace(/\{([^}]+)\}/g, '1');
    // Replace percentages
    testExpression = testExpression.replace(/(\d+(\.\d+)?|(\.\d+))%/g, '($1/100)');
    
    const sanitized = testExpression.replace(/[^-()\d/*+.\s%]/g, '');
    
    if (!sanitized.trim()) return { isValid: false, error: 'Invalid chars' };

    new Function('return ' + sanitized)();
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: 'Syntax Error' };
  }
};

export const extractFormulaKeys = (formula) => {
  if (!formula || typeof formula !== 'string') return [];
  const matches = formula.match(/\{([^}]+)\}/g);
  return matches ? matches.map(m => m.slice(1, -1)) : [];
};