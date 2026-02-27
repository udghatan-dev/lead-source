// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useTranslation } from 'react-i18next';
// import {
//     Nav, NavItem, NavLink, TabContent, TabPane,
//     Button, Input, FormGroup, Label, Alert, Card, CardBody
// } from 'reactstrap';
// import classnames from 'classnames';

// const FlowTableProperties = ({ editor }) => {
//     const { t } = useTranslation();
//     const [activeTab, setActiveTab] = useState('structure');
//     const variables = useSelector(state => state.pdfBuilder?.variables || []);

//     if (!editor || !editor.isActive('table')) return null;

//     const attrs = editor.getAttributes('table');

//     // Update table attributes
//     const updateTable = (key, value) => {
//         editor.chain().focus().updateAttributes('table', { [key]: value }).run();
//     };

//     // Prevent panel interactions from affecting editor focus
//     const handlePanelMouseDown = (e) => {
//         // We want to prevent the editor from losing focus when clicking on the panel
//         // but we still want inputs and selects to work.
//         // If we don't prevent default, clicking the panel might blur the editor depending on browser behavior.
//         // However, forcing blur() is definitely wrong.

//         // If the target is an input or interactive element, we let it handle the focus.
//         // If it's just the background/container, we prevent default to keep focus on editor (optional).

//         // Actually, for Tiptap, often we just want to NOT manually blur it.
//         // The previous code was:
//         /*
//         const isInteractive = e.target.tagName === 'INPUT' ||
//                              e.target.tagName === 'SELECT' ||
//                              e.target.tagName === 'BUTTON';
//         if (!isInteractive && editor?.view?.dom) {
//             editor.view.dom.blur();
//         }
//         */

//         // The robust fix: Do nothing. Let default browser behavior happen. 
//         // Or if we want to keep selection visible:
//         if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT' && e.target.tagName !== 'TEXTAREA') {
//             e.preventDefault();
//         }
//     };

//     // Delete table with confirmation
//     const handleDeleteTable = () => {
//         if (window.confirm(t('Delete this table?'))) {
//             editor.chain().focus().deleteTable().run();
//         }
//     };

//     // Get variable info for dynamic tables
//     const getVariableInfo = (variable) => {
//         if (!variable) return null;

//         let data = variable.fallback;
//         if (typeof data === 'string') {
//             try {
//                 data = JSON.parse(data);
//             } catch (e) {
//                 return { valid: false, reason: 'Invalid JSON' };
//             }
//         }

//         let arrayData = Array.isArray(data) ? data : data?.data;
//         if (!Array.isArray(arrayData) || arrayData.length === 0) {
//             return { valid: false, reason: 'Not a valid array' };
//         }

//         const firstItem = arrayData[0];
//         if (typeof firstItem !== 'object' || firstItem === null) {
//             return { valid: false, reason: 'Items must be objects' };
//         }

//         return {
//             valid: true,
//             columns: Object.keys(firstItem).length,
//             rows: arrayData.length,
//             keys: Object.keys(firstItem)
//         };
//     };

//     // Get valid table variables
//     const validTableVariables = variables
//         .filter(v => v.name)
//         .map(v => ({ ...v, info: getVariableInfo(v) }))
//         .filter(v => v.info?.valid);

//     const selectedVariable = variables.find(v => v.name === attrs.dataSourceVariable);
//     const selectedVariableInfo = getVariableInfo(selectedVariable);
//     const availableKeys = selectedVariableInfo?.valid ? selectedVariableInfo.keys : [];

//     // Handle column key mapping
//     const handleColumnKeyChange = (colIndex, key) => {
//         const newMappings = [...(attrs.columnMappings || [])];
//         while (newMappings.length <= colIndex) newMappings.push({});
//         newMappings[colIndex] = { ...newMappings[colIndex], dataKey: key, header: key };
//         updateTable('columnMappings', newMappings);
//     };

//     // Sync table structure with variable
//     const syncTableStructure = () => {
//         if (!selectedVariable || availableKeys.length === 0) return;
//         if (window.confirm(t('Reset table structure? This will recreate the table.'))) {
//             editor.chain().focus().deleteTable().run();
//             setTimeout(() => {
//                 editor.chain().focus().insertTable({
//                     rows: 3,
//                     cols: availableKeys.length,
//                     withHeaderRow: true
//                 }).run();
//                 setTimeout(() => {
//                     const newMappings = availableKeys.map(key => ({
//                         header: key.charAt(0).toUpperCase() + key.slice(1),
//                         dataKey: key
//                     }));
//                     editor.chain().updateAttributes('table', {
//                         isDynamic: true,
//                         dataSourceVariable: selectedVariable.name,
//                         columnMappings: newMappings
//                     }).run();
//                 }, 100);
//             }, 100);
//         }
//     };

//     return (
//         <Card className="border-0 shadow-sm">
//             <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
//                 <h6 className="mb-0 fw-bold">{t('Table Properties')}</h6>
//                 <Button
//                     color="danger"
//                     size="sm"
//                     onClick={handleDeleteTable}
//                     className="d-flex align-items-center gap-1"
//                 >
//                     <i className="bx bx-trash"></i>
//                     {t('Delete')}
//                 </Button>
//             </div>

//             <CardBody className="p-0" onMouseDown={handlePanelMouseDown}>
//                 <Nav tabs className="nav-tabs-custom">
//                     <NavItem>
//                         <NavLink
//                             className={classnames({ active: activeTab === 'structure' })}
//                             onClick={() => setActiveTab('structure')}
//                             style={{ cursor: 'pointer' }}
//                         >
//                             <i className="bx bx-grid-alt me-1"></i>
//                             {t('Structure')}
//                         </NavLink>
//                     </NavItem>
//                     <NavItem>
//                         <NavLink
//                             className={classnames({ active: activeTab === 'dynamic' })}
//                             onClick={() => setActiveTab('dynamic')}
//                             style={{ cursor: 'pointer' }}
//                         >
//                             <i className="bx bx-data me-1"></i>
//                             {t('Dynamic')}
//                         </NavLink>
//                     </NavItem>
//                     <NavItem>
//                         <NavLink
//                             className={classnames({ active: activeTab === 'style' })}
//                             onClick={() => setActiveTab('style')}
//                             style={{ cursor: 'pointer' }}
//                         >
//                             <i className="bx bx-palette me-1"></i>
//                             {t('Style')}
//                         </NavLink>
//                     </NavItem>
//                 </Nav>

//                 <TabContent activeTab={activeTab}>
//                     {/* STRUCTURE TAB */}
//                     <TabPane tabId="structure">
//                         <div className="p-3">
//                             <h6 className="text-muted text-uppercase mb-3" style={{ fontSize: '11px', fontWeight: '600' }}>
//                                 {t('Rows & Columns')}
//                             </h6>

//                             <div className="row g-2 mb-3">
//                                 <div className="col-6">
//                                     <Button
//                                         color="primary"
//                                         outline
//                                         block
//                                         size="sm"
//                                         onClick={() => editor.chain().focus().addRowBefore().run()}
//                                     >
//                                         <i className="bx bx-up-arrow-alt"></i> Add Row Above
//                                     </Button>
//                                 </div>
//                                 <div className="col-6">
//                                     <Button
//                                         color="primary"
//                                         outline
//                                         block
//                                         size="sm"
//                                         onClick={() => editor.chain().focus().addRowAfter().run()}
//                                     >
//                                         <i className="bx bx-down-arrow-alt"></i> Add Row Below
//                                     </Button>
//                                 </div>
//                                 <div className="col-6">
//                                     <Button
//                                         color="success"
//                                         outline
//                                         block
//                                         size="sm"
//                                         onClick={() => editor.chain().focus().addColumnBefore().run()}
//                                     >
//                                         <i className="bx bx-left-arrow-alt"></i> Add Column Left
//                                     </Button>
//                                 </div>
//                                 <div className="col-6">
//                                     <Button
//                                         color="success"
//                                         outline
//                                         block
//                                         size="sm"
//                                         onClick={() => editor.chain().focus().addColumnAfter().run()}
//                                     >
//                                         <i className="bx bx-right-arrow-alt"></i> Add Column Right
//                                     </Button>
//                                 </div>
//                                 <div className="col-6">
//                                     <Button
//                                         color="danger"
//                                         outline
//                                         block
//                                         size="sm"
//                                         onClick={() => editor.chain().focus().deleteRow().run()}
//                                     >
//                                         <i className="bx bx-trash"></i> Delete Row
//                                     </Button>
//                                 </div>
//                                 <div className="col-6">
//                                     <Button
//                                         color="danger"
//                                         outline
//                                         block
//                                         size="sm"
//                                         onClick={() => editor.chain().focus().deleteColumn().run()}
//                                     >
//                                         <i className="bx bx-trash"></i> Delete Column
//                                     </Button>
//                                 </div>
//                             </div>

//                             <hr />

//                             <h6 className="text-muted text-uppercase mb-3" style={{ fontSize: '11px', fontWeight: '600' }}>
//                                 {t('Cells')}
//                             </h6>

//                             <div className="row g-2 mb-3">
//                                 <div className="col-6">
//                                     <Button
//                                         color="info"
//                                         outline
//                                         block
//                                         size="sm"
//                                         onClick={() => editor.chain().focus().mergeCells().run()}
//                                     >
//                                         <i className="bx bx-merge"></i> Merge Cells
//                                     </Button>
//                                 </div>
//                                 <div className="col-6">
//                                     <Button
//                                         color="info"
//                                         outline
//                                         block
//                                         size="sm"
//                                         onClick={() => editor.chain().focus().splitCell().run()}
//                                     >
//                                         <i className="bx bx-split-vertical"></i> Split Cell
//                                     </Button>
//                                 </div>
//                             </div>

//                             <hr />

//                             <h6 className="text-muted text-uppercase mb-3" style={{ fontSize: '11px', fontWeight: '600' }}>
//                                 {t('Headers')}
//                             </h6>

//                             <div className="row g-2">
//                                 <div className="col-12">
//                                     <Button
//                                         color="secondary"
//                                         outline
//                                         block
//                                         size="sm"
//                                         onClick={() => editor.chain().focus().toggleHeaderRow().run()}
//                                     >
//                                         <i className="bx bx-horizontal-center"></i> Toggle Header Row
//                                     </Button>
//                                 </div>
//                                 <div className="col-12">
//                                     <Button
//                                         color="secondary"
//                                         outline
//                                         block
//                                         size="sm"
//                                         onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
//                                     >
//                                         <i className="bx bx-vertical-center"></i> Toggle Header Column
//                                     </Button>
//                                 </div>
//                                 <div className="col-12">
//                                     <Button
//                                         color="secondary"
//                                         outline
//                                         block
//                                         size="sm"
//                                         onClick={() => editor.chain().focus().toggleHeaderCell().run()}
//                                     >
//                                         <i className="bx bx-square"></i> Toggle Header Cell
//                                     </Button>
//                                 </div>
//                             </div>
//                         </div>
//                     </TabPane>

//                     {/* DYNAMIC TAB */}
//                     <TabPane tabId="dynamic">
//                         <div className="p-3">
//                             <FormGroup className="mb-3">
//                                 <div className="form-check form-switch">
//                                     <Input
//                                         type="checkbox"
//                                         role="switch"
//                                         id="dynamic-mode"
//                                         checked={attrs.isDynamic || false}
//                                         onChange={(e) => updateTable('isDynamic', e.target.checked)}
//                                         className="form-check-input"
//                                     />
//                                     <Label for="dynamic-mode" className="form-check-label fw-semibold">
//                                         {t('Enable Dynamic Mode')}
//                                     </Label>
//                                 </div>
//                             </FormGroup>

//                             {attrs.isDynamic && (
//                                 <>
//                                     <FormGroup className="mb-3">
//                                         <Label className="fw-semibold mb-2">{t('Data Source Variable')}</Label>

//                                         {validTableVariables.length === 0 ? (
//                                             <Alert color="warning" className="mb-0">
//                                                 <i className="bx bx-info-circle me-1"></i>
//                                                 {t('No valid array variables found.')}
//                                             </Alert>
//                                         ) : (
//                                             <div className="d-flex flex-column gap-2">
//                                                 {validTableVariables.map((variable, idx) => {
//                                                     const isSelected = attrs.dataSourceVariable === variable.name;
//                                                     return (
//                                                         <div
//                                                             key={idx}
//                                                             className={`border rounded p-2 ${isSelected ? 'border-primary bg-primary bg-opacity-10' : ''
//                                                                 }`}
//                                                             onClick={() => updateTable('dataSourceVariable', variable.name)}
//                                                             style={{ cursor: 'pointer' }}
//                                                         >
//                                                             <div className="d-flex align-items-center gap-2 mb-1">
//                                                                 <Input
//                                                                     type="radio"
//                                                                     checked={isSelected}
//                                                                     onChange={() => { }}
//                                                                     style={{ cursor: 'pointer' }}
//                                                                 />
//                                                                 <span className="fw-semibold">{variable.name}</span>
//                                                                 {isSelected && (
//                                                                     <span className="badge bg-primary ms-auto" style={{ fontSize: '9px' }}>
//                                                                         Active
//                                                                     </span>
//                                                                 )}
//                                                             </div>
//                                                             <div className="d-flex gap-2 ms-4">
//                                                                 <span className="badge bg-info" style={{ fontSize: '9px' }}>
//                                                                     {variable.info.columns} columns
//                                                                 </span>
//                                                                 <span className="badge bg-secondary" style={{ fontSize: '9px' }}>
//                                                                     {variable.info.rows} rows
//                                                                 </span>
//                                                             </div>
//                                                         </div>
//                                                     );
//                                                 })}
//                                             </div>
//                                         )}
//                                     </FormGroup>

//                                     {selectedVariable && selectedVariableInfo?.valid && (
//                                         <Button
//                                             color="primary"
//                                             outline
//                                             block
//                                             size="sm"
//                                             onClick={syncTableStructure}
//                                             className="mb-3"
//                                         >
//                                             <i className="bx bx-sync me-1"></i>
//                                             {t('Sync with')} {selectedVariable.name}
//                                         </Button>
//                                     )}

//                                     {attrs.dataSourceVariable && availableKeys.length > 0 && (
//                                         <>
//                                             <hr />
//                                             <Label className="fw-semibold mb-2">{t('Column Mappings')}</Label>
//                                             <div className="border rounded p-2 bg-light">
//                                                 {availableKeys.map((_, colIndex) => {
//                                                     const mapping = (attrs.columnMappings || [])[colIndex] || {};
//                                                     return (
//                                                         <div key={colIndex} className="mb-2 pb-2 border-bottom">
//                                                             <div className="d-flex align-items-center gap-2">
//                                                                 <span className="badge bg-secondary" style={{ minWidth: '60px' }}>
//                                                                     Col {colIndex + 1}
//                                                                 </span>
//                                                                 <Input
//                                                                     type="select"
//                                                                     bsSize="sm"
//                                                                     value={mapping.dataKey || ''}
//                                                                     onChange={(e) => handleColumnKeyChange(colIndex, e.target.value)}
//                                                                 >
//                                                                     <option value="">-- Select --</option>
//                                                                     {availableKeys.map(k => (
//                                                                         <option key={k} value={k}>{k}</option>
//                                                                     ))}
//                                                                 </Input>
//                                                             </div>
//                                                         </div>
//                                                     );
//                                                 })}
//                                             </div>
//                                         </>
//                                     )}
//                                 </>
//                             )}
//                         </div>
//                     </TabPane>

//                     {/* STYLE TAB */}
//                     <TabPane tabId="style">
//                         <div className="p-3">
//                             <FormGroup className="mb-3">
//                                 <Label className="fw-semibold mb-2">{t('Header Background')}</Label>
//                                 <div className="d-flex align-items-center gap-2">
//                                     <Input
//                                         type="color"
//                                         value={attrs.headerBackgroundColor || '#f0f0f0'}
//                                         onChange={e => updateTable('headerBackgroundColor', e.target.value)}
//                                         style={{ width: '50px', height: '38px' }}
//                                     />
//                                     <Input
//                                         type="text"
//                                         bsSize="sm"
//                                         value={attrs.headerBackgroundColor || '#f0f0f0'}
//                                         onChange={e => updateTable('headerBackgroundColor', e.target.value)}
//                                     />
//                                 </div>
//                             </FormGroup>

//                             <FormGroup className="mb-3">
//                                 <Label className="fw-semibold mb-2">{t('Header Text Color')}</Label>
//                                 <div className="d-flex align-items-center gap-2">
//                                     <Input
//                                         type="color"
//                                         value={attrs.headerTextColor || '#000000'}
//                                         onChange={e => updateTable('headerTextColor', e.target.value)}
//                                         style={{ width: '50px', height: '38px' }}
//                                     />
//                                     <Input
//                                         type="text"
//                                         bsSize="sm"
//                                         value={attrs.headerTextColor || '#000000'}
//                                         onChange={e => updateTable('headerTextColor', e.target.value)}
//                                     />
//                                 </div>
//                             </FormGroup>

//                             <FormGroup className="mb-0">
//                                 <Label className="fw-semibold mb-2">{t('Border Color')}</Label>
//                                 <div className="d-flex align-items-center gap-2">
//                                     <Input
//                                         type="color"
//                                         value={attrs.borderColor || '#000000'}
//                                         onChange={e => updateTable('borderColor', e.target.value)}
//                                         style={{ width: '50px', height: '38px' }}
//                                     />
//                                     <Input
//                                         type="text"
//                                         bsSize="sm"
//                                         value={attrs.borderColor || '#000000'}
//                                         onChange={e => updateTable('borderColor', e.target.value)}
//                                     />
//                                 </div>
//                             </FormGroup>
//                         </div>
//                     </TabPane>
//                 </TabContent>
//             </CardBody>
//         </Card>
//     );
// };

// export default FlowTableProperties;
