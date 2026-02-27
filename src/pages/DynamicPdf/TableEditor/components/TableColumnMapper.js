// /**
//  * Table Column Mapper Component
//  *
//  * Advanced table configuration with:
//  * - Dynamic mode toggle
//  * - Data source variable selection
//  * - Column mapping editor (header, dataKey, formula)
//  * - Live preview of table data population
//  * - Table styling (colors, borders)
//  */

// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   Button,
//   Input,
//   Label,
//   UncontrolledDropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem,
//   Badge,
//   Table,
//   Row, // Added
//   Col  // Added
// } from 'reactstrap';
// // You can keep using your utils, or use the local helper below for the new dropdown logic
// import { evaluateFormula } from '../utils/formulaEvaluator'; 

// // --- NEW: Local Evaluator for Dropdown-based Formulas ---
// const evaluateRowLogic = (mapping, row) => {
//   if (mapping.type === 'data' || !mapping.type) {
//     // Default to data mapping
//     return row[mapping.dataKey] !== undefined ? row[mapping.dataKey] : '';
//   } else if (mapping.type === 'formula') {
//     // Calculate based on operands
//     const valA = parseFloat(row[mapping.operandA] || 0);
//     const valB = parseFloat(row[mapping.operandB] || 0);
    
//     let result = 0;
//     switch (mapping.operator) {
//       case '*': result = valA * valB; break;
//       case '+': result = valA + valB; break;
//       case '-': result = valA - valB; break;
//       case '/': result = valB !== 0 ? valA / valB : 0; break;
//       default: result = 0;
//     }
//     // Simple formatting to avoid long decimals
//     return Number.isInteger(result) ? result : result.toFixed(2);
//   }
//   return '';
// };

// const TableColumnMapper = ({ editor, variables = [] }) => {
//   const [tableAttrs, setTableAttrs] = useState(null);
//   const [columnMappings, setColumnMappings] = useState([]);
//   const [isDynamic, setIsDynamic] = useState(false);
//   const [dataSourceVariable, setDataSourceVariable] = useState('');
//   const [borderColor, setBorderColor] = useState('#000000');
//   const [headerBgColor, setHeaderBgColor] = useState('#f0f0f0');
//   const [headerTextColor, setHeaderTextColor] = useState('#000000');

//   // Extract table attributes from current selection
//   useEffect(() => {
//     if (!editor) return;

//     const updateTableAttrs = () => {
//       const { selection } = editor.state;

//       // Find table node by checking parent nodes at different depths
//       let table = null;
//       let depth = 0;

//       // First, try to get the table from the current selection depth
//       const currentDepth = selection.$anchor.depth;

//       // Check from current position up to root (depth 0)
//       for (let i = currentDepth; i >= 0; i--) {
//         try {
//           const node = selection.$anchor.node(i);
//           if (node && node.type.name === 'table') {
//             table = node;
//             depth = i;
//             // console.log('Table found at depth', depth, 'with attrs:', node.attrs);
//             break;
//           }
//         } catch (e) {
//           // Continue if this depth doesn't exist
//           continue;
//         }
//       }

//       if (table) {
//         const attrs = table.attrs || {};
//         setTableAttrs(attrs);
//         setIsDynamic(attrs.isDynamic || false);
//         setDataSourceVariable(attrs.dataSourceVariable || '');
//         setColumnMappings(attrs.columnMappings || []);
//         setBorderColor(attrs.borderColor || '#000000');
//         setHeaderBgColor(attrs.headerBackgroundColor || '#f0f0f0');
//         setHeaderTextColor(attrs.headerTextColor || '#000000');
//       } else {
//         console.log('No table found in selection');
//         setTableAttrs(null);
//       }
//     };

//     updateTableAttrs();

//     // Listen for selection changes and transactions
//     editor.on('selectionUpdate', updateTableAttrs);
//     editor.on('update', updateTableAttrs);

//     return () => {
//       editor.off('selectionUpdate', updateTableAttrs);
//       editor.off('update', updateTableAttrs);
//     };
//   }, [editor]);

//   // Get data source variable data for preview
//   const dataSourceData = useMemo(() => {
//     if (!dataSourceVariable) return [];

//     const variable = variables.find(v => v.name === dataSourceVariable);
//     if (!variable) return [];

//     let data = variable.fallback;
//     if (typeof data === 'string') {
//       try {
//         data = JSON.parse(data);
//       } catch (e) {
//         return [];
//       }
//     }

//     return Array.isArray(data) ? data : [];
//   }, [dataSourceVariable, variables]);

//   // --- UPDATED: Live preview data using new Evaluator ---
//   const previewData = useMemo(() => {
//     if (!isDynamic || dataSourceData.length === 0 || columnMappings.length === 0) {
//       return null;
//     }

//     return dataSourceData.map(rowItem => {
//       return columnMappings.map(mapping => {
//         // Use the new logic that handles both Data and Formula types
//         return evaluateRowLogic(mapping, rowItem);
//       });
//     });
//   }, [isDynamic, dataSourceData, columnMappings]);

//   // --- NEW: Calculate Footer Aggregations ---
//   const footerData = useMemo(() => {
//     if (!isDynamic || dataSourceData.length === 0 || columnMappings.length === 0) return [];

//     return columnMappings.map(mapping => {
//       if (!mapping.footerAggregation || mapping.footerAggregation === 'none') return '';

//       // Calculate values for this column based on all rows
//       // We reuse the evaluateRowLogic to get the computed value for every row, then aggregate
//       const values = dataSourceData.map(row => {
//         const val = parseFloat(evaluateRowLogic(mapping, row));
//         return isNaN(val) ? 0 : val;
//       });
      
//       const total = values.reduce((a, b) => a + b, 0);

//       switch (mapping.footerAggregation) {
//         case 'sum': 
//             return Number.isInteger(total) ? total : total.toFixed(2);
//         case 'avg': 
//             const avg = total / values.length;
//             return avg.toFixed(2);
//         case 'count': 
//             return values.length;
//         case 'min': 
//             return Math.min(...values);
//         case 'max': 
//             return Math.max(...values);
//         default: return '';
//       }
//     });
//   }, [isDynamic, dataSourceData, columnMappings]);

//   const handleToggleDynamic = (checked) => {
//     setIsDynamic(checked);
//     editor?.chain().focus().updateAttributes('table', { isDynamic: checked }).run();

//     if (!checked) {
//       // Clear data source when disabling dynamic mode
//       setDataSourceVariable('');
//       setColumnMappings([]);
//       editor?.chain().focus().updateAttributes('table', { dataSourceVariable: '', columnMappings: [] }).run();
//     }
//   };

//   const handleDataSourceChange = (variableName) => {
//     setDataSourceVariable(variableName);
//     // Note: In newer Tiptap versions, standard command is updateAttributes
//     editor?.chain().focus().updateAttributes('table', { dataSourceVariable: variableName }).run();

//     // Auto-generate column mappings from data structure
//     const variable = variables.find(v => v.name === variableName);
//     if (variable && Array.isArray(variable.fallback) && variable.fallback.length > 0) {
//       const firstItem = variable.fallback[0];
//       const keys = Object.keys(firstItem);
//       const fieldCount = keys.length; 

//       // --- UPDATED: Initialize with new properties ---
//       const autoMappings = keys.map(key => ({
//         header: key.charAt(0).toUpperCase() + key.slice(1),
//         type: 'data', // Default to data
//         dataKey: key,
//         footerAggregation: 'none',
//         operandA: '',
//         operator: '*',
//         operandB: ''
//       }));

//       setColumnMappings(autoMappings);
//       editor?.chain().focus().updateAttributes('table', { columnMappings: autoMappings }).run();

//       // Update table column count to match field count
//       updateTableColumnCount(fieldCount);
//     }
//   };

//   const updateTableColumnCount = (targetColumnCount) => {
//     if (!editor) return;

//     const { selection } = editor.state;
//     const currentDepth = selection.$anchor.depth;

//     // Find the table
//     let tableNode = null;
//     for (let i = currentDepth; i >= 0; i--) {
//       try {
//         const node = selection.$anchor.node(i);
//         if (node && node.type.name === 'table') {
//           tableNode = node;
//           break;
//         }
//       } catch (e) {
//         continue;
//       }
//     }

//     if (!tableNode) return;

//     // Get current column count from first row
//     const firstRow = tableNode.child(0);
//     const currentColumnCount = firstRow.childCount;

//     if (currentColumnCount === targetColumnCount) {
//       return; // Already correct
//     }

//     // Add or remove columns
//     if (currentColumnCount < targetColumnCount) {
//       // Add columns
//       const columnsToAdd = targetColumnCount - currentColumnCount;
//       for (let i = 0; i < columnsToAdd; i++) {
//         editor.chain().focus().addColumnAfter().run();
//       }
//     } else if (currentColumnCount > targetColumnCount) {
//       // Remove columns from the end
//       const columnsToRemove = currentColumnCount - targetColumnCount;
//       for (let i = 0; i < columnsToRemove; i++) {
//         // Move to the last column and delete it
//         editor.chain().focus().goToNextCell().deleteColumn().run();
//       }
//     }
//   };

//   const handleAddColumn = () => {
//     // --- UPDATED: Default new column structure ---
//     const newMappings = [...columnMappings, { 
//         header: 'New Column', 
//         type: 'data', 
//         dataKey: '', 
//         footerAggregation: 'none', 
//         formula: '',
//         operandA: '', operator: '*', operandB: ''
//     }];
//     setColumnMappings(newMappings);
//     editor?.chain().focus().updateAttributes('table', { columnMappings: newMappings }).run();
//   };

//   const handleUpdateColumn = (index, field, value) => {
//     const newMappings = [...columnMappings];
//     newMappings[index] = {
//       ...newMappings[index],
//       [field]: value,
//     };
//     setColumnMappings(newMappings);
//     editor?.chain().focus().updateAttributes('table', { columnMappings: newMappings }).run();
//   };

//   const handleDeleteColumn = (index) => {
//     const newMappings = columnMappings.filter((_, i) => i !== index);
//     setColumnMappings(newMappings);
//     editor?.chain().focus().updateAttributes('table', { columnMappings: newMappings }).run();
//   };

//   const handleStyleChange = () => {
//     // Note: Assuming setTableStyle is a custom command you registered, 
//     // otherwise use updateAttributes
//     editor?.chain().focus().updateAttributes('table', {
//       borderColor,
//       headerBackgroundColor: headerBgColor,
//       headerTextColor: headerTextColor,
//     }).run();
//   };

//   // Helper to get available keys for dropdowns
//   const getAvailableKeys = () => {
//     if (!dataSourceVariable) return [];
//     const variable = variables.find(v => v.name === dataSourceVariable);
//     if (!variable || !Array.isArray(variable.fallback) || variable.fallback.length === 0) return [];
//     const firstItem = variable.fallback[0];
//     if (typeof firstItem === 'object' && firstItem !== null) {
//         return Object.keys(firstItem);
//     }
//     return [];
//   };

//   const availableKeys = getAvailableKeys();
//   const arrayVariables = variables.filter(v => Array.isArray(v.fallback));

//   if (!tableAttrs) {
//     return (
//       <div className="text-center text-muted py-5" style={{ fontSize: '13px' }}>
//         <i className="bx bx-table" style={{ fontSize: '48px', opacity: 0.3 }}></i>
//         <p className="mt-2">Select a table to configure</p>
//       </div>
//     );
//   }

//   return (
//     <div className="table-column-mapper" style={{ padding: '16px' }}>
//       {/* Header */}
//       <h6 className="mb-3" style={{ fontSize: '14px', fontWeight: '600' }}>
//         Table Configuration
//       </h6>

//       {/* Dynamic Mode Toggle */}
//       <div className="mb-3 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
//         <div className="d-flex align-items-center gap-2 mb-2">
//           <input
//             type="checkbox"
//             id="table-dynamic-mode"
//             checked={isDynamic}
//             onChange={(e) => handleToggleDynamic(e.target.checked)}
//             style={{ cursor: 'pointer' }}
//           />
//           <Label for="table-dynamic-mode" className="mb-0" style={{ fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
//             Dynamic Table Mode
//           </Label>
//         </div>
//         <small style={{ fontSize: '11px', color: '#666' }}>
//           Populate table data from a variable array
//         </small>
//       </div>

//       {/* Data Source Selection */}
//       {isDynamic && (
//         <div className="mb-3">
//           <Label style={{ fontSize: '12px', fontWeight: '600' }}>Data Source Variable</Label>
//           {arrayVariables.length > 0 ? (
//             <UncontrolledDropdown>
//               <DropdownToggle caret size="sm" color="light" block>
//                 {dataSourceVariable || 'Select Variable'}
//               </DropdownToggle>
//               <DropdownMenu>
//                 {arrayVariables.map((variable, index) => (
//                   <DropdownItem
//                     key={index}
//                     onClick={() => handleDataSourceChange(variable.name)}
//                     active={dataSourceVariable === variable.name}
//                   >
//                     <Badge color="success" className="me-2">{variable.name}</Badge>
//                     <small className="text-muted">
//                       ({Array.isArray(variable.fallback) ? variable.fallback.length : 0} rows)
//                     </small>
//                   </DropdownItem>
//                 ))}
//               </DropdownMenu>
//             </UncontrolledDropdown>
//           ) : (
//             <div className="alert alert-warning mb-0" style={{ fontSize: '11px', padding: '8px' }}>
//               No array variables available. Create a JSON array variable first.
//             </div>
//           )}
//         </div>
//       )}

//       {/* Column Mappings - REDESIGNED */}
//       {isDynamic && dataSourceVariable && (
//         <div className="mb-3">
//           <div className="d-flex justify-content-between align-items-center mb-2">
//             <Label className="mb-0" style={{ fontSize: '12px', fontWeight: '600' }}>
//               Columns & Logic
//             </Label>
//             <Button size="sm" color="primary" outline onClick={handleAddColumn} style={{ fontSize: '11px', padding: '2px 8px' }}>
//               <i className="bx bx-plus"></i> Add
//             </Button>
//           </div>

//           {columnMappings.map((mapping, index) => {
//             return (
//               <div
//                 key={index}
//                 className="card mb-2 p-2"
//                 style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0' }}
//               >
//                 {/* Header & Delete Row */}
//                 <Row className="g-2 mb-2 align-items-center">
//                     <Col xs={1}>
//                         <Badge color="secondary" style={{ fontSize: '9px' }}>{index + 1}</Badge>
//                     </Col>
//                     <Col xs={6}>
//                         <Input
//                             type="text"
//                             value={mapping.header}
//                             onChange={(e) => handleUpdateColumn(index, 'header', e.target.value)}
//                             placeholder="Header Name"
//                             size="sm"
//                             style={{ fontSize: '12px' }}
//                         />
//                     </Col>
//                     <Col xs={3}>
//                         <Input 
//                             type="select" 
//                             bsSize="sm" 
//                             style={{ fontSize: '11px' }}
//                             value={mapping.type || 'data'}
//                             onChange={(e) => handleUpdateColumn(index, 'type', e.target.value)}
//                         >
//                             <option value="data">Data</option>
//                             <option value="formula">Math</option>
//                         </Input>
//                     </Col>
//                     <Col xs={2} className="text-end">
//                         <Button
//                             size="sm" color="danger" outline
//                             onClick={() => handleDeleteColumn(index)}
//                             style={{ fontSize: '10px', padding: '2px 6px' }}
//                         >
//                             <i className="bx bx-trash"></i>
//                         </Button>
//                     </Col>
//                 </Row>

//                 {/* LOGIC SECTION: Switches based on Type */}
//                 <div className="bg-light p-2 rounded mb-2">
//                     {(!mapping.type || mapping.type === 'data') ? (
//                         // --- DATA MAPPING UI ---
//                         <Input
//                             type="select"
//                             value={mapping.dataKey}
//                             onChange={(e) => handleUpdateColumn(index, 'dataKey', e.target.value)}
//                             size="sm"
//                             style={{ fontSize: '12px', fontFamily: 'monospace' }}
//                         >
//                             <option value="">-- Map to Field --</option>
//                             {availableKeys.map(key => (
//                                 <option key={key} value={key}>{key}</option>
//                             ))}
//                         </Input>
//                     ) : (
//                         // --- FORMULA BUILDER UI ---
//                         <div className="d-flex gap-1 align-items-center">
//                             <Input
//                                 type="select" bsSize="sm"
//                                 style={{ fontSize: '11px' }}
//                                 value={mapping.operandA}
//                                 onChange={(e) => handleUpdateColumn(index, 'operandA', e.target.value)}
//                             >
//                                 <option value="">Val A</option>
//                                 {availableKeys.map(k => <option key={k} value={k}>{k}</option>)}
//                             </Input>

//                             <Input
//                                 type="select" bsSize="sm"
//                                 style={{ width: '50px', textAlign: 'center', fontSize: '12px' }}
//                                 value={mapping.operator}
//                                 onChange={(e) => handleUpdateColumn(index, 'operator', e.target.value)}
//                             >
//                                 <option value="*">×</option>
//                                 <option value="+">+</option>
//                                 <option value="-">-</option>
//                                 <option value="/">÷</option>
//                             </Input>

//                             <Input
//                                 type="select" bsSize="sm"
//                                 style={{ fontSize: '11px' }}
//                                 value={mapping.operandB}
//                                 onChange={(e) => handleUpdateColumn(index, 'operandB', e.target.value)}
//                             >
//                                 <option value="">Val B</option>
//                                 {availableKeys.map(k => <option key={k} value={k}>{k}</option>)}
//                             </Input>
//                         </div>
//                     )}
//                 </div>

//                 {/* FOOTER AGGREGATION */}
//                 <div className="d-flex align-items-center gap-2">
//                     <Label className="mb-0 text-muted" style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>
//                         Footer Total:
//                     </Label>
//                     <Input
//                         type="select"
//                         bsSize="sm"
//                         style={{ fontSize: '11px' }}
//                         value={mapping.footerAggregation || 'none'}
//                         onChange={(e) => handleUpdateColumn(index, 'footerAggregation', e.target.value)}
//                     >
//                         <option value="none">None</option>
//                         <option value="sum">Sum (Total)</option>
//                         <option value="avg">Average</option>
//                         <option value="count">Count</option>
//                         <option value="min">Min</option>
//                         <option value="max">Max</option>
//                     </Input>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Live Preview - UPDATED WITH FOOTER */}
//       {previewData && previewData.length > 0 && (
//         <div className="mb-3">
//           <Label style={{ fontSize: '12px', fontWeight: '600' }}>Live Preview</Label>
//           <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '4px' }}>
//             <Table size="sm" className="mb-0 text-center" style={{ fontSize: '11px' }}>
//               <thead style={{ backgroundColor: headerBgColor, color: headerTextColor, position: 'sticky', top: 0 }}>
//                 <tr>
//                   {columnMappings.map((mapping, index) => (
//                     <th key={index} style={{ padding: '6px' }}>{mapping.header}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {previewData.slice(0, 5).map((row, rowIndex) => (
//                   <tr key={rowIndex}>
//                     {row.map((cell, cellIndex) => (
//                       <td key={cellIndex} style={{ padding: '6px' }}>{cell}</td>
//                     ))}
//                   </tr>
//                 ))}
//                 {/* FOOTER ROW PREVIEW */}
//                 <tr className="fw-bold" style={{ backgroundColor: '#f8f9fa', borderTop: '2px solid #dee2e6' }}>
//                     {columnMappings.map((mapping, i) => (
//                         <td key={i} style={{ padding: '6px' }}>
//                             {footerData[i] ? (
//                                 <span className="text-primary">{footerData[i]}</span>
//                             ) : '-'}
//                         </td>
//                     ))}
//                 </tr>
//               </tbody>
//             </Table>
//             <div className="p-1 text-center text-muted fst-italic" style={{fontSize: '9px'}}>
//                 Preview showing first 5 rows
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Table Styling */}
//       <div className="mb-3">
//         <Label style={{ fontSize: '12px', fontWeight: '600' }}>Table Styling</Label>
//         <div className="d-flex flex-column gap-2">
//           <div className="d-flex align-items-center gap-2">
//             <Label className="mb-0" style={{ fontSize: '11px', minWidth: '100px' }}>Border Color</Label>
//             <input
//               type="color"
//               value={borderColor}
//               onChange={(e) => setBorderColor(e.target.value)}
//               onBlur={handleStyleChange}
//               style={{ width: '40px', height: '28px', cursor: 'pointer' }}
//             />
//             <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>{borderColor}</span>
//           </div>

//           <div className="d-flex align-items-center gap-2">
//             <Label className="mb-0" style={{ fontSize: '11px', minWidth: '100px' }}>Header BG</Label>
//             <input
//               type="color"
//               value={headerBgColor}
//               onChange={(e) => setHeaderBgColor(e.target.value)}
//               onBlur={handleStyleChange}
//               style={{ width: '40px', height: '28px', cursor: 'pointer' }}
//             />
//             <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>{headerBgColor}</span>
//           </div>

//           <div className="d-flex align-items-center gap-2">
//             <Label className="mb-0" style={{ fontSize: '11px', minWidth: '100px' }}>Header Text</Label>
//             <input
//               type="color"
//               value={headerTextColor}
//               onChange={(e) => setHeaderTextColor(e.target.value)}
//               onBlur={handleStyleChange}
//               style={{ width: '40px', height: '28px', cursor: 'pointer' }}
//             />
//             <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>{headerTextColor}</span>
//           </div>
//         </div>
//       </div>

//       {/* Cell Operations */}
//       <div className="mb-3">
//         <Label style={{ fontSize: '12px', fontWeight: '600' }}>Cell Operations</Label>
//         <div className="alert alert-info mb-2 p-2" style={{ fontSize: '10px' }}>
//           <strong>Tip:</strong> To merge cells, click and drag to select multiple cells, then click "Merge Cells"
//         </div>
//         <div className="d-grid gap-2">
//           {/* Merge Cells */}
//           <Button
//             size="sm"
//             color="primary"
//             outline
//             onClick={() => editor?.chain().focus().mergeCells().run()}
//             disabled={!editor?.can().mergeCells()}
//             style={{ fontSize: '12px', textAlign: 'left' }}
//           >
//             <i className="bx bx-merge me-2"></i>
//             Merge Cells {!editor?.can().mergeCells() && <small className="text-muted">(select 2+ cells)</small>}
//           </Button>

//           {/* Split Cell */}
//           <Button
//             size="sm"
//             color="primary"
//             outline
//             onClick={() => editor?.chain().focus().splitCell().run()}
//             disabled={!editor?.can().splitCell()}
//             style={{ fontSize: '12px', textAlign: 'left' }}
//           >
//             <i className="bx bx-split-horizontal me-2"></i>
//             Split Cell
//           </Button>

//           {/* Add/Remove Row */}
//           <div className="d-flex gap-2">
//             <Button
//               size="sm"
//               color="success"
//               outline
//               onClick={() => editor?.chain().focus().addRowAfter().run()}
//               disabled={!editor}
//               style={{ fontSize: '12px', flex: 1 }}
//             >
//               <i className="bx bx-plus me-1"></i>
//               Row
//             </Button>
//             <Button
//               size="sm"
//               color="danger"
//               outline
//               onClick={() => editor?.chain().focus().deleteRow().run()}
//               disabled={!editor}
//               style={{ fontSize: '12px', flex: 1 }}
//             >
//               <i className="bx bx-minus me-1"></i>
//               Row
//             </Button>
//           </div>

//           {/* Add/Remove Column */}
//           <div className="d-flex gap-2">
//             <Button
//               size="sm"
//               color="success"
//               outline
//               onClick={() => editor?.chain().focus().addColumnAfter().run()}
//               disabled={!editor}
//               style={{ fontSize: '12px', flex: 1 }}
//             >
//               <i className="bx bx-plus me-1"></i>
//               Col
//             </Button>
//             <Button
//               size="sm"
//               color="danger"
//               outline
//               onClick={() => editor?.chain().focus().deleteColumn().run()}
//               disabled={!editor}
//               style={{ fontSize: '12px', flex: 1 }}
//             >
//               <i className="bx bx-minus me-1"></i>
//               Col
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TableColumnMapper;


/**
 * Table Column Mapper Component
 *
 * Advanced table configuration with:
 * - Dynamic mode toggle
 * - Data source variable selection
 * - Column mapping editor (header, dataKey, formula)
 * - Live preview of table data population
 * - Table styling (colors, borders)
 */
/**
 * Table Column Mapper Component
 *
 * Advanced table configuration with:
 * - Dynamic mode toggle
 * - Data source variable selection
 * - Column mapping editor (header, dataKey, formula)
 * - Live preview of table data population
 * - Table styling (colors, borders)
 */

/**
 * Table Column Mapper Component
 *
 * Fixed: Removed .focus() calls to prevent cursor jumping.
 * Fixed: Text inputs sync onBlur to prevent typing interruptions.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Button,
  Input,
  Label,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
  Table,
  Row,
  Col
} from 'reactstrap';
import { evaluateFormula } from '../utils/formulaEvaluator';

const TableColumnMapper = ({ editor, variables = [] }) => {
  const [tableAttrs, setTableAttrs] = useState(null);
  const [columnMappings, setColumnMappings] = useState([]);
  const [isDynamic, setIsDynamic] = useState(false);
  const [dataSourceVariable, setDataSourceVariable] = useState('');
  const [borderColor, setBorderColor] = useState('#000000');
  const [headerBgColor, setHeaderBgColor] = useState('#f0f0f0');
  const [headerTextColor, setHeaderTextColor] = useState('#000000');

  // Extract table attributes from current selection
  useEffect(() => {
    if (!editor) return;

    const updateTableAttrs = () => {
      const { selection } = editor.state;
      let table = null;
      const currentDepth = selection.$anchor.depth;

      for (let i = currentDepth; i >= 0; i--) {
        try {
          const node = selection.$anchor.node(i);
          if (node && node.type.name === 'table') {
            table = node;
            break;
          }
        } catch (e) { continue; }
      }

      if (table) {
        const attrs = table.attrs || {};
        setTableAttrs(attrs);
        setIsDynamic(attrs.isDynamic || false);
        setDataSourceVariable(attrs.dataSourceVariable || '');
        setColumnMappings(attrs.columnMappings || []);
        setBorderColor(attrs.borderColor || '#000000');
        setHeaderBgColor(attrs.headerBackgroundColor || '#f0f0f0');
        setHeaderTextColor(attrs.headerTextColor || '#000000');
      } else {
        setTableAttrs(null);
      }
    };

    updateTableAttrs();
    editor.on('selectionUpdate', updateTableAttrs);
    editor.on('update', updateTableAttrs);

    return () => {
      editor.off('selectionUpdate', updateTableAttrs);
      editor.off('update', updateTableAttrs);
    };
  }, [editor]);

  // Data Source Data
  const dataSourceData = useMemo(() => {
    if (!dataSourceVariable) return [];
    const variable = variables.find(v => v.name === dataSourceVariable);
    if (!variable) return [];
    let data = variable.fallback;
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch (e) { return []; }
    }
    return Array.isArray(data) ? data : [];
  }, [dataSourceVariable, variables]);

  // --- LIVE PREVIEW CALCULATION ---
  const previewData = useMemo(() => {
    if (!isDynamic || dataSourceData.length === 0 || columnMappings.length === 0) {
      return null;
    }

    return dataSourceData.map(rowItem => {
      return columnMappings.map(mapping => {
        // FORMULA LOGIC: Uses the updated utility that handles %
        if (mapping.type === 'formula') {
            return evaluateFormula(mapping.formula, rowItem);
        }
        // DATA LOGIC
        return rowItem[mapping.dataKey] !== undefined ? rowItem[mapping.dataKey] : '';
      });
    });
  }, [isDynamic, dataSourceData, columnMappings]);

  // --- FOOTER LOGIC IS HERE ---
  const footerData = useMemo(() => {
    if (!previewData || previewData.length === 0) return [];

    return columnMappings.map((mapping, colIndex) => {
      // 1. Check if user selected a footer action
      if (!mapping.footerAggregation || mapping.footerAggregation === 'none') return '';

      // 2. Grab values from the calculated Preview Data
      const values = previewData.map(row => {
        const val = parseFloat(row[colIndex]);
        return isNaN(val) ? 0 : val;
      });

      // 3. Perform Aggregation
      const total = values.reduce((a, b) => a + b, 0);

      switch (mapping.footerAggregation) {
        case 'sum': return Number.isInteger(total) ? total : total.toFixed(2);
        case 'avg': return (total / values.length).toFixed(2);
        case 'count': return values.length;
        case 'min': return Math.min(...values);
        case 'max': return Math.max(...values);
        default: return '';
      }
    });
  }, [previewData, columnMappings]);

  // --- HANDLERS ---
  const handleToggleDynamic = (checked) => {
    setIsDynamic(checked);
    editor?.chain().updateAttributes('table', { isDynamic: checked }).run();
    if (!checked) {
      setDataSourceVariable('');
      setColumnMappings([]);
      editor?.chain().updateAttributes('table', { dataSourceVariable: '', columnMappings: [] }).run();
    }
  };

  const handleDataSourceChange = (variableName) => {
    setDataSourceVariable(variableName);
    editor?.chain().updateAttributes('table', { dataSourceVariable: variableName }).run();

    const variable = variables.find(v => v.name === variableName);
    if (variable && Array.isArray(variable.fallback) && variable.fallback.length > 0) {
      const firstItem = variable.fallback[0];
      const keys = Object.keys(firstItem);
      const fieldCount = keys.length; 

      const autoMappings = keys.map(key => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        type: 'data',
        dataKey: key,
        formula: '',
        footerAggregation: 'none'
      }));

      setColumnMappings(autoMappings);
      editor?.chain().updateAttributes('table', { columnMappings: autoMappings }).run();
      
      // Update columns structure
      updateTableColumnCount(fieldCount);
    }
  };

  const updateTableColumnCount = (targetColumnCount) => {
    if (!editor) return;
    const { selection } = editor.state;
    // ... Find table logic ...
    let tableNode = null;
    for (let i = selection.$anchor.depth; i >= 0; i--) {
        try { if (selection.$anchor.node(i).type.name === 'table') { tableNode = selection.$anchor.node(i); break; } } catch(e){}
    }
    if (!tableNode) return;

    const firstRow = tableNode.child(0);
    const currentColumnCount = firstRow.childCount;

    if (currentColumnCount === targetColumnCount) return;

    if (currentColumnCount < targetColumnCount) {
      const columnsToAdd = targetColumnCount - currentColumnCount;
      for (let i = 0; i < columnsToAdd; i++) editor.chain().addColumnAfter().run();
    } else if (currentColumnCount > targetColumnCount) {
      const columnsToRemove = currentColumnCount - targetColumnCount;
      for (let i = 0; i < columnsToRemove; i++) editor.chain().goToNextCell().deleteColumn().run();
    }
  };

  // --- COLUMN UPDATES (Using onBlur/Immediate pattern) ---
  
  const handleAddColumn = () => {
    const newMappings = [...columnMappings, { header: 'New', type: 'data', dataKey: '', formula: '', footerAggregation: 'none' }];
    setColumnMappings(newMappings);
    editor?.chain().updateAttributes('table', { columnMappings: newMappings }).run();
    editor?.chain().addColumnAfter().run();
  };

  const handleDeleteColumn = (index) => {
    const newMappings = columnMappings.filter((_, i) => i !== index);
    setColumnMappings(newMappings);
    editor?.chain().updateAttributes('table', { columnMappings: newMappings }).run();
  };

  // Update Local State Only (For Typing)
  const handleLocalUpdate = (index, field, value) => {
    const newMappings = [...columnMappings];
    newMappings[index] = { ...newMappings[index], [field]: value };
    setColumnMappings(newMappings);
  };

  // Sync to Editor (On Blur)
  const handleBlurUpdate = () => {
    editor?.chain().updateAttributes('table', { columnMappings }).run();
  };

  // Immediate Sync (For Dropdowns)
  const handleImmediateUpdate = (index, field, value) => {
    const newMappings = [...columnMappings];
    newMappings[index] = { ...newMappings[index], [field]: value };
    setColumnMappings(newMappings);
    editor?.chain().updateAttributes('table', { columnMappings: newMappings }).run();
  };

  const insertVariableIntoFormula = (index, key) => {
    const currentFormula = columnMappings[index].formula || '';
    const newFormula = currentFormula + `{${key}}`;
    handleImmediateUpdate(index, 'formula', newFormula);
  };

  const handleStyleChange = () => {
    editor?.chain().updateAttributes('table', {
      borderColor,
      headerBackgroundColor: headerBgColor,
      headerTextColor: headerTextColor,
    }).run();
  };

  const handleDeleteTable = () => {
    if (!editor) return;
    editor.chain().focus().deleteTable().run();
  };

  // Helpers
  const getAvailableKeys = () => {
    if (!dataSourceVariable) return [];
    const variable = variables.find(v => v.name === dataSourceVariable);
    if (!variable || !Array.isArray(variable.fallback) || variable.fallback.length === 0) return [];
    const firstItem = variable.fallback[0];
    return typeof firstItem === 'object' && firstItem !== null ? Object.keys(firstItem) : [];
  };

  const availableKeys = getAvailableKeys();
  const arrayVariables = variables.filter(v => Array.isArray(v.fallback));

  if (!tableAttrs) return <div className="p-4 text-center text-muted">Select a table</div>;

  return (
    <div className="table-column-mapper" style={{ padding: '16px' }}>
      <style>{`
        .table-mapper-button {
          color: #333 !important;
          background-color: white !important;
          border-color: #dee2e6 !important;
          transition: all 0.2s ease;
        }
        .table-mapper-button:hover:not(:disabled) {
          background-color: #f8f9fa !important;
          color: #666 !important;
          border-color: #adb5bd !important;
        }
        .table-mapper-button:disabled {
          opacity: 0.6;
        }
      `}</style>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: '600' }}>Table Configuration</h6>
        <Button
          className="table-mapper-button"
          size="sm"
          onClick={handleDeleteTable}
          style={{ fontSize: '11px', padding: '4px 8px', color: '#dc3545 !important' }}
          title="Delete Table"
        >
          <i className="bx bx-trash"></i>
        </Button>
      </div>

      {/* Dynamic Mode & Data Source */}
      <div className="mb-3 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
        <div className="d-flex align-items-center gap-2 mb-2">
          <input type="checkbox" checked={isDynamic} onChange={(e) => handleToggleDynamic(e.target.checked)} style={{ cursor: 'pointer' }} />
          <Label className="mb-0 fw-bold" style={{ fontSize: '13px', cursor: 'pointer' }}>Dynamic Table Mode</Label>
        </div>
        {isDynamic && (
            <div className="mt-2">
                {arrayVariables.length > 0 ? (
                    <UncontrolledDropdown>
                    <DropdownToggle caret size="sm" color="light" block>{dataSourceVariable || 'Select Data Source'}</DropdownToggle>
                    <DropdownMenu>
                        {arrayVariables.map((v, i) => (
                        <DropdownItem key={i} onClick={() => handleDataSourceChange(v.name)} active={dataSourceVariable === v.name}>
                            <Badge color="success" className="me-2">{v.name}</Badge>
                        </DropdownItem>
                        ))}
                    </DropdownMenu>
                    </UncontrolledDropdown>
                ) : <div className="text-danger small">No array variables found.</div>}
            </div>
        )}
      </div>

      {/* Mappings */}
      {isDynamic && dataSourceVariable && (
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Label className="mb-0 fw-bold" style={{ fontSize: '12px' }}>Columns & Logic</Label>
            <Button className="table-mapper-button" size="sm" onClick={handleAddColumn} style={{ fontSize: '11px', padding: '2px 8px' }}><i className="bx bx-plus"></i> Add</Button>
          </div>

          {columnMappings.map((mapping, index) => (
            <div key={index} className="card mb-2 p-2" style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0' }}>
              <Row className="g-2 mb-2 align-items-center">
                <Col xs={1}><Badge color="secondary" style={{ fontSize: '9px' }}>{index + 1}</Badge></Col>
                <Col xs={6}>
                    <Input 
                        type="text" 
                        value={mapping.header} 
                        onChange={(e) => handleLocalUpdate(index, 'header', e.target.value)}
                        onBlur={handleBlurUpdate}
                        placeholder="Header" size="sm" style={{ fontSize: '12px' }} 
                    />
                </Col>
                <Col xs={3}>
                    <Input type="select" bsSize="sm" style={{ fontSize: '11px' }} value={mapping.type || 'data'} onChange={(e) => handleImmediateUpdate(index, 'type', e.target.value)}>
                        <option value="data">Data</option>
                        <option value="formula">Math</option>
                    </Input>
                </Col>
                <Col xs={2} className="text-end">
                    <Button className="table-mapper-button" size="sm" onClick={() => handleDeleteColumn(index)} style={{ fontSize: '10px', padding: '2px 6px' }}><i className="bx bx-trash"></i></Button>
                </Col>
              </Row>

              <div className="bg-light p-2 rounded mb-2">
                {(!mapping.type || mapping.type === 'data') ? (
                    <Input type="select" value={mapping.dataKey} onChange={(e) => handleImmediateUpdate(index, 'dataKey', e.target.value)} size="sm" style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                        <option value="">-- Map to Field --</option>
                        {availableKeys.map(k => <option key={k} value={k}>{k}</option>)}
                    </Input>
                ) : (
                    <div>
                        <div className="d-flex flex-wrap gap-1 mb-2">
                            {availableKeys.map(k => (
                                <Badge key={k} color="info" className="cursor-pointer" onClick={() => insertVariableIntoFormula(index, k)} title={`Insert {${k}}`} style={{ fontSize: '10px' }}>{k}</Badge>
                            ))}
                        </div>
                        <Input 
                            type="text" 
                            bsSize="sm" 
                            placeholder="{qty} * {price}" 
                            value={mapping.formula || ''}
                            onChange={(e) => handleLocalUpdate(index, 'formula', e.target.value)}
                            onBlur={handleBlurUpdate}
                            style={{ fontFamily: 'monospace', fontSize: '12px' }}
                        />
                        <small className="text-muted d-block mt-1" style={{fontSize: '9px'}}>
                            Use +, -, *, /, ( ) e.g. <code>{`{price}`} + 10%</code>
                        </small>
                    </div>
                )}
              </div>

              {/* Footer Selection */}
              <div className="d-flex align-items-center gap-2">
                <Label className="mb-0 small text-muted text-nowrap">Footer:</Label>
                <Input type="select" bsSize="sm" style={{ fontSize: '11px' }} value={mapping.footerAggregation || 'none'} onChange={(e) => handleImmediateUpdate(index, 'footerAggregation', e.target.value)}>
                    <option value="none">None</option>
                    <option value="sum">Sum</option>
                    <option value="avg">Avg</option>
                    <option value="min">Min</option>
                    <option value="max">Max</option>
                    <option value="count">Count</option>
                </Input>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Live Preview */}
      {previewData && previewData.length > 0 && (
        <div className="mb-3">
          <Label style={{ fontSize: '12px', fontWeight: '600' }}>Live Preview</Label>
          <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '4px' }}>
            <Table size="sm" className="mb-0 text-center" style={{ fontSize: '11px' }}>
              <thead style={{ backgroundColor: headerBgColor, color: headerTextColor, position: 'sticky', top: 0 }}>
                <tr>{columnMappings.map((m, i) => <th key={i} style={{ padding: '6px' }}>{m.header}</th>)}</tr>
              </thead>
              <tbody>
                {previewData.slice(0, 5).map((row, i) => (
                  <tr key={i}>{row.map((cell, j) => <td key={j} style={{ padding: '6px' }}>{cell}</td>)}</tr>
                ))}
                {/* FOOTER ROW PREVIEW */}
                <tr className="fw-bold bg-light">
                  {footerData.map((val, i) => <td key={i} className="p-1 text-primary">{val !== '' ? val : '-'}</td>)}
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      )}

      {/* Styles & Ops (Unchanged) */}
      <div className="mb-3">
        <Label style={{ fontSize: '12px', fontWeight: '600' }}>Table Styling</Label>
        <div className="d-flex flex-column gap-2">
            <div className="d-flex align-items-center gap-2">
                <Label className="mb-0 small text-muted" style={{minWidth:'80px'}}>Border</Label>
                <input type="color" value={borderColor} onChange={e=>setBorderColor(e.target.value)} onBlur={handleStyleChange} style={{ width: '50px', height: '32px', cursor: 'pointer' }} />
                <Input
                  type="text"
                  value={borderColor}
                  onChange={e=>setBorderColor(e.target.value)}
                  onBlur={handleStyleChange}
                  size="sm"
                  placeholder="#000000"
                  style={{ fontSize: '11px', fontFamily: 'monospace', flex: 1 }}
                />
            </div>
            <div className="d-flex align-items-center gap-2">
                <Label className="mb-0 small text-muted" style={{minWidth:'80px'}}>Header BG</Label>
                <input type="color" value={headerBgColor} onChange={e=>setHeaderBgColor(e.target.value)} onBlur={handleStyleChange} style={{ width: '50px', height: '32px', cursor: 'pointer' }} />
                <Input
                  type="text"
                  value={headerBgColor}
                  onChange={e=>setHeaderBgColor(e.target.value)}
                  onBlur={handleStyleChange}
                  size="sm"
                  placeholder="#f0f0f0"
                  style={{ fontSize: '11px', fontFamily: 'monospace', flex: 1 }}
                />
            </div>
            <div className="d-flex align-items-center gap-2">
                <Label className="mb-0 small text-muted" style={{minWidth:'80px'}}>Header Text</Label>
                <input type="color" value={headerTextColor} onChange={e=>setHeaderTextColor(e.target.value)} onBlur={handleStyleChange} style={{ width: '50px', height: '32px', cursor: 'pointer' }} />
                <Input
                  type="text"
                  value={headerTextColor}
                  onChange={e=>setHeaderTextColor(e.target.value)}
                  onBlur={handleStyleChange}
                  size="sm"
                  placeholder="#000000"
                  style={{ fontSize: '11px', fontFamily: 'monospace', flex: 1 }}
                />
            </div>
        </div>
      </div>

      <div className="mb-3">
        <Label style={{ fontSize: '12px', fontWeight: '600' }}>Row & Column Operations</Label>
        <div className="d-flex flex-column gap-2">
          <div className="d-flex gap-2">
            <Button
              className="table-mapper-button"
              size="sm"
              onClick={() => editor?.chain().focus().addRowAfter().run()}
              style={{ flex: 1, fontSize: '11px' }}
            >
              <i className="bx bx-plus"></i> Row
            </Button>
            <Button
              className="table-mapper-button"
              size="sm"
              onClick={() => editor?.chain().focus().deleteRow().run()}
              disabled={!editor?.can().deleteRow()}
              style={{ flex: 1, fontSize: '11px' }}
            >
              <i className="bx bx-minus"></i> Row
            </Button>
          </div>
          <div className="d-flex gap-2">
            <Button
              className="table-mapper-button"
              size="sm"
              onClick={() => editor?.chain().focus().addColumnAfter().run()}
              style={{ flex: 1, fontSize: '11px' }}
            >
              <i className="bx bx-plus"></i> Column
            </Button>
            <Button
              className="table-mapper-button"
              size="sm"
              onClick={() => editor?.chain().focus().deleteColumn().run()}
              disabled={!editor?.can().deleteColumn()}
              style={{ flex: 1, fontSize: '11px' }}
            >
              <i className="bx bx-minus"></i> Column
            </Button>
          </div>
        </div>
      </div>

      {/* <div className="mb-3">
        <Label style={{ fontSize: '12px', fontWeight: '600' }}>Cell Operations</Label>
        <div className="d-grid gap-2">
            <Button className="table-mapper-button" size="sm" onClick={() => editor?.chain().mergeCells().run()} disabled={!editor?.can().mergeCells()}>Merge Cells</Button>
            <Button className="table-mapper-button" size="sm" onClick={() => editor?.chain().splitCell().run()} disabled={!editor?.can().splitCell()}>Split Cell</Button>
        </div>
      </div> */}
    </div>
  );
};

export default TableColumnMapper;