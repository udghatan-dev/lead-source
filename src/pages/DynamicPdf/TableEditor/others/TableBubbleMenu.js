// TableBubbleMenu.js - Floating properties menu for tables (Industry Standard)
import React, { useState } from 'react';
import { BubbleMenu } from '@tiptap/extension-bubble-menu';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, Input, FormGroup, Label, Button, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';

const TableBubbleMenu = ({ editor }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('operations');
  const variables = useSelector(state => state.pdfBuilder?.variables || []);

  if (!editor) return null;

  // Check if table or cell is selected
  const isTableActive = editor.isActive('table');
  const isCellActive = editor.isActive('tableCell') || editor.isActive('tableHeader');

  if (!isTableActive) return null;

  const tableAttrs = editor.getAttributes('table');
  const cellAttrs = isCellActive ? editor.getAttributes('tableCell') : {};

  // Update functions
  const updateTable = (key, value) => {
    editor.chain().updateAttributes('table', { [key]: value }).run();
  };

  const updateCell = (key, value) => {
    if (isCellActive) {
      editor.chain().updateAttributes('tableCell', { [key]: value }).run();
    }
  };

  // Get available keys from selected variable
  const getAvailableKeys = () => {
    const varName = tableAttrs.dataSourceVariable;
    if (!varName) return [];
    const variable = variables.find(v => v.name === varName);
    if (!variable || !variable.fallback) return [];
    let data = variable.fallback;
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch(e) { return []; }
    }
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
      return Object.keys(data[0]);
    }
    return [];
  };

  const availableKeys = getAvailableKeys();
  const selectedVariable = variables.find(v => v.name === tableAttrs.dataSourceVariable);

  const handleColumnKeyChange = (colIndex, key) => {
    const newMappings = [...(tableAttrs.columnMappings || [])];
    while (newMappings.length <= colIndex) {
      newMappings.push({ header: '', dataKey: '', formula: '' });
    }
    newMappings[colIndex] = { ...newMappings[colIndex], dataKey: key, header: key };
    updateTable('columnMappings', newMappings);
  };

  const handleFormulaChange = (colIndex, formula) => {
    const newMappings = [...(tableAttrs.columnMappings || [])];
    if (newMappings[colIndex]) {
      newMappings[colIndex] = { ...newMappings[colIndex], formula };
      updateTable('columnMappings', newMappings);
    }
  };

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        duration: 100,
        placement: 'top',
        maxWidth: '500px',
        interactive: true,
        appendTo: () => document.body,
      }}
      shouldShow={({ editor }) => editor.isActive('table')}
    >
      <Card className="shadow-lg border-0" style={{ minWidth: '450px', maxHeight: '500px', overflowY: 'auto' }}>
        <CardBody className="p-3">
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="mb-0 fw-bold">
              <i className="bx bx-table me-2 text-primary"></i>
              {isCellActive ? t('Cell Properties') : t('Table Properties')}
            </h6>
            <Button
              size="sm"
              color="danger"
              outline
              onClick={() => {
                if (window.confirm('Delete table?')) {
                  editor.chain().focus().deleteTable().run();
                }
              }}
            >
              <i className="bx bx-trash"></i>
            </Button>
          </div>

          {/* Tabs */}
          <Nav tabs className="nav-tabs-custom mb-3" style={{ fontSize: '11px' }}>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 'size' })}
                onClick={() => setActiveTab('size')}
                style={{ cursor: 'pointer', padding: '6px 12px' }}
              >
                <i className="bx bx-ruler me-1"></i>
                {t('Size')}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 'operations' })}
                onClick={() => setActiveTab('operations')}
                style={{ cursor: 'pointer', padding: '6px 12px' }}
              >
                <i className="bx bx-grid-alt me-1"></i>
                {t('Operations')}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 'data' })}
                onClick={() => setActiveTab('data')}
                style={{ cursor: 'pointer', padding: '6px 12px' }}
              >
                <i className="bx bx-data me-1"></i>
                {t('Data')}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === 'style' })}
                onClick={() => setActiveTab('style')}
                style={{ cursor: 'pointer', padding: '6px 12px' }}
              >
                <i className="bx bx-palette me-1"></i>
                {t('Style')}
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            {/* SIZE TAB */}
            <TabPane tabId="size">
              {/* Cell-specific controls */}
              {isCellActive && (
                <div className="mb-3 p-2 bg-success-subtle rounded-2">
                  <small className="text-success fw-semibold d-block mb-2">
                    <i className="bx bx-check-circle me-1"></i>
                    {t('Cell Selected')}
                  </small>
                  <div className="row g-2">
                    <div className="col-6">
                      <Label style={{ fontSize: '10px' }}>{t('Width (px)')}</Label>
                      <Input
                        type="number"
                        bsSize="sm"
                        value={cellAttrs.cellWidth || ''}
                        onChange={e => updateCell('cellWidth', e.target.value)}
                        placeholder="Auto"
                      />
                    </div>
                    <div className="col-6">
                      <Label style={{ fontSize: '10px' }}>{t('Height (px)')}</Label>
                      <Input
                        type="number"
                        bsSize="sm"
                        value={cellAttrs.cellHeight || ''}
                        onChange={e => updateCell('cellHeight', e.target.value)}
                        placeholder="Auto"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Table-wide controls */}
              <div className="row g-2">
                <div className="col-6">
                  <Label style={{ fontSize: '10px' }}>{t('Table Width (px)')}</Label>
                  <Input
                    type="number"
                    bsSize="sm"
                    value={tableAttrs.tableWidth || ''}
                    onChange={e => updateTable('tableWidth', e.target.value)}
                    placeholder="Auto"
                  />
                </div>
                <div className="col-6">
                  <Label style={{ fontSize: '10px' }}>{t('Row Height (px)')}</Label>
                  <Input
                    type="number"
                    bsSize="sm"
                    value={tableAttrs.rowHeight || ''}
                    onChange={e => updateTable('rowHeight', e.target.value)}
                    placeholder="Auto"
                  />
                </div>
                <div className="col-6">
                  <Label style={{ fontSize: '10px' }}>{t('Cell Padding')}</Label>
                  <Input
                    type="number"
                    bsSize="sm"
                    value={tableAttrs.cellPadding || '8'}
                    onChange={e => updateTable('cellPadding', e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <Label style={{ fontSize: '10px' }}>{t('Min Cell Height')}</Label>
                  <Input
                    type="number"
                    bsSize="sm"
                    value={tableAttrs.cellMinHeight || ''}
                    onChange={e => updateTable('cellMinHeight', e.target.value)}
                    placeholder="30"
                  />
                </div>
              </div>
            </TabPane>

            {/* OPERATIONS TAB */}
            <TabPane tabId="operations">
              <div className="p-2">
                <h6 className="text-muted text-uppercase mb-3" style={{ fontSize: '11px', fontWeight: '600' }}>
                  {t('Rows & Columns')}
                </h6>

                <div className="d-flex flex-column gap-2 mb-3">
                  <div className="d-flex gap-2">
                    <Button
                      color="success"
                      outline
                      block
                      size="sm"
                      onClick={() => editor.chain().focus().addRowBefore().run()}
                      style={{ fontSize: '11px' }}
                    >
                      <i className="bx bx-up-arrow-alt me-1"></i> {t('Add Row Above')}
                    </Button>
                    <Button
                      color="success"
                      outline
                      block
                      size="sm"
                      onClick={() => editor.chain().focus().addRowAfter().run()}
                      style={{ fontSize: '11px' }}
                    >
                      <i className="bx bx-down-arrow-alt me-1"></i> {t('Add Row Below')}
                    </Button>
                  </div>

                  <div className="d-flex gap-2">
                    <Button
                      color="primary"
                      outline
                      block
                      size="sm"
                      onClick={() => editor.chain().focus().addColumnBefore().run()}
                      style={{ fontSize: '11px' }}
                    >
                      <i className="bx bx-left-arrow-alt me-1"></i> {t('Add Column Left')}
                    </Button>
                    <Button
                      color="primary"
                      outline
                      block
                      size="sm"
                      onClick={() => editor.chain().focus().addColumnAfter().run()}
                      style={{ fontSize: '11px' }}
                    >
                      <i className="bx bx-right-arrow-alt me-1"></i> {t('Add Column Right')}
                    </Button>
                  </div>

                  <div className="d-flex gap-2">
                    <Button
                      color="danger"
                      outline
                      block
                      size="sm"
                      onClick={() => editor.chain().focus().deleteRow().run()}
                      disabled={!editor.can().deleteRow()}
                      style={{ fontSize: '11px' }}
                    >
                      <i className="bx bx-trash me-1"></i> {t('Delete Row')}
                    </Button>
                    <Button
                      color="danger"
                      outline
                      block
                      size="sm"
                      onClick={() => editor.chain().focus().deleteColumn().run()}
                      disabled={!editor.can().deleteColumn()}
                      style={{ fontSize: '11px' }}
                    >
                      <i className="bx bx-trash me-1"></i> {t('Delete Column')}
                    </Button>
                  </div>
                </div>

                <hr />

                <h6 className="text-muted text-uppercase mb-3" style={{ fontSize: '11px', fontWeight: '600' }}>
                  {t('Cells')}
                </h6>

                <div className="d-flex flex-column gap-2 mb-3">
                  <Button
                    color="info"
                    outline
                    block
                    size="sm"
                    onClick={() => editor.chain().focus().mergeCells().run()}
                    disabled={!editor.can().mergeCells()}
                    style={{ fontSize: '11px' }}
                  >
                    <i className="bx bx-merge me-1"></i> {t('Merge Cells')}
                  </Button>
                  <Button
                    color="info"
                    outline
                    block
                    size="sm"
                    onClick={() => editor.chain().focus().splitCell().run()}
                    disabled={!editor.can().splitCell()}
                    style={{ fontSize: '11px' }}
                  >
                    <i className="bx bx-split-vertical me-1"></i> {t('Split Cell')}
                  </Button>
                </div>

                <hr />

                <h6 className="text-muted text-uppercase mb-3" style={{ fontSize: '11px', fontWeight: '600' }}>
                  {t('Headers')}
                </h6>

                <div className="d-flex flex-column gap-2">
                  <Button
                    color="secondary"
                    outline
                    block
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                    style={{ fontSize: '11px' }}
                  >
                    <i className="bx bx-horizontal-center me-1"></i> {t('Toggle Header Row')}
                  </Button>
                  <Button
                    color="secondary"
                    outline
                    block
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
                    style={{ fontSize: '11px' }}
                  >
                    <i className="bx bx-vertical-center me-1"></i> {t('Toggle Header Column')}
                  </Button>
                  <Button
                    color="secondary"
                    outline
                    block
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeaderCell().run()}
                    style={{ fontSize: '11px' }}
                  >
                    <i className="bx bx-square me-1"></i> {t('Toggle Header Cell')}
                  </Button>
                </div>
              </div>
            </TabPane>

            {/* DATA TAB */}
            <TabPane tabId="data">
              <div className="form-check form-switch mb-3">
                <Input
                  type="checkbox"
                  role="switch"
                  id="dynamic-switch"
                  checked={tableAttrs.isDynamic || false}
                  onChange={(e) => updateTable('isDynamic', e.target.checked)}
                />
                <Label className="form-check-label" htmlFor="dynamic-switch" style={{ fontSize: '11px', fontWeight: '600' }}>
                  {t('Enable Dynamic Mode')}
                </Label>
              </div>

              {tableAttrs.isDynamic && (
                <>
                  <FormGroup>
                    <Label style={{ fontSize: '10px', fontWeight: '600' }}>{t('Data Variable')}</Label>
                    <Input
                      type="select"
                      bsSize="sm"
                      value={tableAttrs.dataSourceVariable || ''}
                      onChange={(e) => updateTable('dataSourceVariable', e.target.value)}
                    >
                      <option value="">{t('-- Select --')}</option>
                      {variables
                        .filter(v => v.name && Array.isArray(v.fallback))
                        .map((v, idx) => (
                          <option key={idx} value={v.name}>
                            {v.name} ({v.fallback.length} items)
                          </option>
                        ))}
                    </Input>
                  </FormGroup>

                  {selectedVariable && availableKeys.length > 0 && (
                    <div className="mt-2">
                      <Label style={{ fontSize: '10px', fontWeight: '600' }}>{t('Column Mapping')}</Label>
                      {[0, 1, 2].map((colIndex) => {
                        const mapping = (tableAttrs.columnMappings || [])[colIndex] || {};
                        return (
                          <div key={colIndex} className="mb-2 p-2 bg-light rounded">
                            <small className="text-muted" style={{ fontSize: '9px' }}>Column {colIndex + 1}</small>
                            <Input
                              type="select"
                              bsSize="sm"
                              value={mapping.dataKey || ''}
                              onChange={(e) => handleColumnKeyChange(colIndex, e.target.value)}
                              className="mt-1"
                            >
                              <option value="">None</option>
                              {availableKeys.map(k => (
                                <option key={k} value={k}>{k}</option>
                              ))}
                            </Input>
                            {mapping.dataKey && (
                              <Input
                                type="text"
                                bsSize="sm"
                                value={mapping.formula || ''}
                                onChange={(e) => handleFormulaChange(colIndex, e.target.value)}
                                placeholder="Formula: {qty} * {price}"
                                className="mt-1"
                                style={{ fontSize: '10px' }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </TabPane>

            {/* STYLE TAB */}
            <TabPane tabId="style">
              <div className="d-flex flex-column gap-3">
                <div>
                  <Label style={{ fontSize: '10px', fontWeight: '600' }}>{t('Border Color')}</Label>
                  <div className="d-flex align-items-center gap-2">
                    <Input
                      type="color"
                      value={tableAttrs.borderColor || '#000000'}
                      onChange={e => updateTable('borderColor', e.target.value)}
                      style={{ width: '50px', height: '32px', cursor: 'pointer' }}
                    />
                    <Input
                      type="text"
                      bsSize="sm"
                      value={tableAttrs.borderColor || '#000000'}
                      onChange={e => updateTable('borderColor', e.target.value)}
                      placeholder="#000000"
                      style={{ fontFamily: 'monospace', fontSize: '11px' }}
                    />
                  </div>
                </div>
                <div>
                  <Label style={{ fontSize: '10px', fontWeight: '600' }}>{t('Header BG')}</Label>
                  <div className="d-flex align-items-center gap-2">
                    <Input
                      type="color"
                      value={tableAttrs.headerBackgroundColor || '#f0f0f0'}
                      onChange={e => updateTable('headerBackgroundColor', e.target.value)}
                      style={{ width: '50px', height: '32px', cursor: 'pointer' }}
                    />
                    <Input
                      type="text"
                      bsSize="sm"
                      value={tableAttrs.headerBackgroundColor || '#f0f0f0'}
                      onChange={e => updateTable('headerBackgroundColor', e.target.value)}
                      placeholder="#f0f0f0"
                      style={{ fontFamily: 'monospace', fontSize: '11px' }}
                    />
                  </div>
                </div>
                <div>
                  <Label style={{ fontSize: '10px', fontWeight: '600' }}>{t('Header Text')}</Label>
                  <div className="d-flex align-items-center gap-2">
                    <Input
                      type="color"
                      value={tableAttrs.headerTextColor || '#000000'}
                      onChange={e => updateTable('headerTextColor', e.target.value)}
                      style={{ width: '50px', height: '32px', cursor: 'pointer' }}
                    />
                    <Input
                      type="text"
                      bsSize="sm"
                      value={tableAttrs.headerTextColor || '#000000'}
                      onChange={e => updateTable('headerTextColor', e.target.value)}
                      placeholder="#000000"
                      style={{ fontFamily: 'monospace', fontSize: '11px' }}
                    />
                  </div>
                </div>
              </div>
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </BubbleMenu>
  );
};

export default TableBubbleMenu;
