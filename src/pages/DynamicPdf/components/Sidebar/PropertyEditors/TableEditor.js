// PropertyEditors/TableEditor.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Nav, NavItem, NavLink, TabContent, TabPane, Button, Input, Badge, FormGroup, Label, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import PropertyInput from '../PropertyComponents/PropertyInput';
import PropertySelect from '../PropertyComponents/PropertySelect';
import { ButtonGroup, StyleButton } from '../PropertyComponents/ButtonGroup';
import {
    updateTableCell,
    addTableRow,
    deleteTableRow,
    addTableColumn,
    deleteTableColumn,
    toggleTableDynamicMode,
    setTableDataSource,
    addTableColumnMapping,
    updateTableColumnMapping,
    deleteTableColumnMapping
} from '../../../store/actions';

const TableEditor = ({ element, onUpdate }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [activeTableTab, setActiveTableTab] = useState('content');

    const variables = useSelector(state => state.pdfBuilder?.variables || []);
    const fontFamilies = ['Arial', 'Verdana', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'Palatino', 'Roboto'];

    const handleTableCellUpdate = (rowIndex, colIndex, value) => {
        dispatch(updateTableCell(element.id, rowIndex, colIndex, value));
    };

    // --- HELPERS FOR DIMENSION SYNC ---
    const handleTotalWidthChange = (newTotalWidth) => {
        const width = parseFloat(newTotalWidth);
        if (!isNaN(width) && element.cols > 0) {
            const newCellWidth = width / element.cols;
            onUpdate('width', width);
            onUpdate('cellWidth', newCellWidth);
        }
    };

    const handleTotalHeightChange = (newTotalHeight) => {
        const height = parseFloat(newTotalHeight);
        if (!isNaN(height) && element.rows > 0) {
            const newCellHeight = height / element.rows;
            onUpdate('height', height);
            onUpdate('cellHeight', newCellHeight);
        }
    };

    const totalWidth = (element.cellWidth || 0) * (element.cols || 0);
    const totalHeight = (element.cellHeight || 0) * (element.rows || 0);

    return (
        <div className="card border shadow-sm mb-2">
            <div className="card-body p-0">
                {/* Tab Navigation */}
                <Nav tabs className="border-bottom">
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTableTab === 'content' }, 'cursor-pointer')}
                            onClick={() => setActiveTableTab('content')}
                            style={{ fontSize: '10px', padding: '8px 12px' }}
                        >
                            {t('Static')}
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTableTab === 'dynamic' }, 'cursor-pointer')}
                            onClick={() => setActiveTableTab('dynamic')}
                            style={{ fontSize: '10px', padding: '8px 12px' }}
                        >
                            {t('Dynamic')}
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTableTab === 'style' }, 'cursor-pointer')}
                            onClick={() => setActiveTableTab('style')}
                            style={{ fontSize: '10px', padding: '8px 12px' }}
                        >
                            {t('Style')}
                        </NavLink>
                    </NavItem>
                </Nav>

                <TabContent activeTab={activeTableTab} className="p-2">
                    {/* ===== STATIC TABLE TAB ===== */}
                    <TabPane tabId="content">
                        <h6 className="text-uppercase mb-2" style={{ fontSize: '10px', fontWeight: '700', color: '#6c757d' }}>
                            {t('Table Content')}
                        </h6>

                        {/* Table Editor Preview */}
                        <div className="border rounded mb-2" style={{ maxHeight: '300px', overflow: 'auto' }}>
                            <table className="table table-sm table-bordered mb-0" style={{ fontSize: '10px' }}>
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: '30px' }}></th>
                                        {element.data && element.data[0]?.map((_, colIndex) => (
                                            <th key={colIndex} className="text-center p-1">
                                                <Button
                                                    color="danger"
                                                    outline
                                                    size="sm"
                                                    onClick={() => dispatch(deleteTableColumn(element.id, colIndex))}
                                                    disabled={element.cols <= 1}
                                                    className="p-0"
                                                    style={{ width: '18px', height: '18px', fontSize: '9px' }}
                                                >
                                                    x
                                                </Button>
                                            </th>
                                        ))}
                                        <th style={{ width: '30px' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {element.data?.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            <td className="bg-light text-center" style={{ fontSize: '9px' }}>
                                                {rowIndex + 1}
                                            </td>
                                            {row.map((cell, colIndex) => (
                                                <td key={colIndex} className="p-0">
                                                    <Input
                                                        type="text"
                                                        value={cell}
                                                        onChange={(e) => handleTableCellUpdate(rowIndex, colIndex, e.target.value)}
                                                        className="border-0"
                                                        style={{ fontSize: '10px', minWidth: '70px', padding: '4px' }}
                                                        placeholder={`R${rowIndex + 1}C${colIndex + 1}`}
                                                    />
                                                </td>
                                            ))}
                                            <td className="text-center p-1">
                                                <Button
                                                    color="danger"
                                                    outline
                                                    size="sm"
                                                    onClick={() => dispatch(deleteTableRow(element.id, rowIndex))}
                                                    disabled={element.rows <= 1}
                                                    className="p-0"
                                                    style={{ width: '18px', height: '18px', fontSize: '9px' }}
                                                >
                                                    x
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Row/Column Controls */}
                        <div className="row g-2">
                            <div className="col-6">
                                <Button
                                    color="success"
                                    size="sm"
                                    block
                                    onClick={() => dispatch(addTableRow(element.id, 'end'))}
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ fontSize: '10px' }}
                                >
                                    <i className='bx bx-plus me-1'></i> {t('Add Row')}
                                </Button>
                            </div>
                            <div className="col-6">
                                <Button
                                    color="primary"
                                    size="sm"
                                    block
                                    onClick={() => dispatch(addTableColumn(element.id, 'end'))}
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ fontSize: '10px' }}
                                >
                                    <i className='bx bx-plus me-1'></i> {t('Add Column')}
                                </Button>
                            </div>
                        </div>
                    </TabPane>

                    {/* ===== DYNAMIC TABLE TAB ===== */}
                    <TabPane tabId="dynamic">
                        <h6 className="text-uppercase mb-2" style={{ fontSize: '10px', fontWeight: '700', color: '#6c757d' }}>
                            {t('Dynamic Configuration')}
                        </h6>

                        {/* Toggle Dynamic Mode */}
                        <div className="alert alert-info p-2 mb-2">
                            <div className="form-check">
                                <Input
                                    type="checkbox"
                                    id="dynamic-mode"
                                    checked={element.isDynamic || false}
                                    onChange={(e) => dispatch(toggleTableDynamicMode(element.id, e.target.checked))}
                                    className="form-check-input"
                                />
                                <Label for="dynamic-mode" className="form-check-label fw-semibold" style={{ fontSize: '11px' }}>
                                    {t('Enable Dynamic Mode')}
                                </Label>
                            </div>
                        </div>

                        {element.isDynamic && (
                            <>
                                <FormGroup className="mb-2">
                                    <Label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                                        {t('Data Source Variable')}
                                    </Label>
                                    <Input
                                        type="select"
                                        value={element.dataSourceVariable || ''}
                                        onChange={(e) => dispatch(setTableDataSource(element.id, e.target.value))}
                                        style={{ fontSize: '11px' }}
                                    >
                                        <option value="">{t('-- Select Variable --')}</option>
                                        {variables
                                            .filter(v => v.name)
                                            .map((v, idx) => (
                                                <option key={idx} value={v.name}>
                                                    {v.name} {Array.isArray(v.fallback) ? `(${v.fallback.length} items)` : ''}
                                                </option>
                                            ))}
                                    </Input>
                                </FormGroup>
                                <small className="text-muted d-block mb-2" style={{ fontSize: '10px' }}>
                                    {t('Choose which variable contains the array of data objects')}
                                </small>

                                {/* Column Mappings */}
                                <div className="border rounded p-2 mb-2" style={{ maxHeight: '280px', overflow: 'auto' }}>
                                    <h6 className="mb-2" style={{ fontSize: '10px', fontWeight: '700' }}>
                                        {t('Column Mappings')}
                                    </h6>

                                    {(element.columnMappings || []).map((mapping, index) => {
                                        const getAvailableKeys = () => {
                                            const dataSourceVar = element.dataSourceVariable;
                                            if (!dataSourceVar) return [];
                                            const variable = variables.find(v => v.name === dataSourceVar);
                                            if (!variable || !variable.fallback) return [];
                                            if (Array.isArray(variable.fallback) && variable.fallback.length > 0) {
                                                const firstItem = variable.fallback[0];
                                                if (typeof firstItem === 'object' && firstItem !== null) {
                                                    const allKeys = Object.keys(firstItem);
                                                    return allKeys; 
                                                }
                                            }
                                            return [];
                                        };
                                        const availableKeys = getAvailableKeys();

                                        return (
                                            <div key={index} className="card mb-2 border">
                                                <div className="card-body p-2">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <Badge color="secondary" style={{ fontSize: '9px' }}>
                                                            {t('Column')} {index + 1}
                                                        </Badge>
                                                        <Button
                                                            color="danger"
                                                            size="sm"
                                                            outline
                                                            onClick={() => dispatch(deleteTableColumnMapping(element.id, index))}
                                                            className="p-0"
                                                            style={{ width: '18px', height: '18px', fontSize: '9px' }}
                                                        >
                                                            ×
                                                        </Button>
                                                    </div>

                                                    <PropertyInput
                                                        label={t('Header Name')}
                                                        value={mapping.header || ''}
                                                        onChange={(e) => {
                                                            const newHeader = e.target.value;
                                                            dispatch(updateTableColumnMapping(element.id, index, 'header', newHeader));
                                                            if (element.data && element.data.length > 0) {
                                                                dispatch(updateTableCell(element.id, 0, index, newHeader));
                                                            }
                                                        }}
                                                        placeholder="e.g. Product Name"
                                                    />
                                                    
                                                    {availableKeys.length > 0 ? (
                                                        <>
                                                            <PropertySelect
                                                                label={t('Data Key')}
                                                                value={mapping.dataKey || ''}
                                                                onChange={(e) => dispatch(updateTableColumnMapping(element.id, index, 'dataKey', e.target.value))}
                                                                options={['', ...availableKeys]}
                                                            />
                                                            <small className="text-success d-block" style={{ fontSize: '9px' }}>
                                                                ✓ {availableKeys.length} {t('keys available')}
                                                            </small>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <PropertyInput
                                                                label={t('Data Key')}
                                                                value={mapping.dataKey || ''}
                                                                onChange={(e) => dispatch(updateTableColumnMapping(element.id, index, 'dataKey', e.target.value))}
                                                                placeholder="e.g. productName"
                                                            />
                                                            <small className="text-warning d-block" style={{ fontSize: '9px' }}>
                                                                ⚠️ {t('Select data source first')}
                                                            </small>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <Button
                                    color="success"
                                    size="sm"
                                    block
                                    onClick={() => dispatch(addTableColumnMapping(element.id))}
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ fontSize: '10px' }}
                                >
                                    <i className='bx bx-plus me-1'></i> {t('Add Column Mapping')}
                                </Button>
                            </>
                        )}
                    </TabPane>

                    {/* ===== STYLE TAB ===== */}
                    <TabPane tabId="style">
                        <h6 className="text-uppercase mb-2" style={{ fontSize: '10px', fontWeight: '700', color: '#6c757d' }}>
                            {t('Dimensions')}
                        </h6>

                        {/* Total Size Controls */}
                        <div className="row g-2 mb-2">
                            <div className="col-6">
                                <PropertyInput
                                    label={t('Total Width')}
                                    type="number"
                                    value={Math.round(totalWidth)}
                                    onChange={e => handleTotalWidthChange(e.target.value)}
                                />
                            </div>
                            <div className="col-6">
                                <PropertyInput
                                    label={t('Total Height')}
                                    type="number"
                                    value={Math.round(totalHeight)}
                                    onChange={e => handleTotalHeightChange(e.target.value)}
                                />
                            </div>
                        </div>

                        <hr className="my-2"/>

                        <h6 className="text-uppercase mb-2" style={{ fontSize: '10px', fontWeight: '700', color: '#6c757d' }}>
                            {t('Cell Dimensions')}
                        </h6>

                        <div className="row g-2 mb-2">
                            <div className="col-6">
                                <PropertyInput
                                    label={t('Cell Width')}
                                    type="number"
                                    value={Math.round(element.cellWidth || 80)}
                                    onChange={e => {
                                        const newCw = parseFloat(e.target.value);
                                        onUpdate('cellWidth', newCw);
                                        onUpdate('width', newCw * element.cols);
                                    }}
                                />
                            </div>
                            <div className="col-6">
                                <PropertyInput
                                    label={t('Cell Height')}
                                    type="number"
                                    value={Math.round(element.cellHeight || 40)}
                                    onChange={e => {
                                        const newCh = parseFloat(e.target.value);
                                        onUpdate('cellHeight', newCh);
                                        onUpdate('height', newCh * element.rows);
                                    }}
                                />
                            </div>
                        </div>

                        <hr className="my-2"/>

                        {/* 🆕 NEW: Header Styling Section */}
                        <h6 className="text-uppercase mb-2" style={{ fontSize: '10px', fontWeight: '700', color: '#6c757d' }}>
                            {t('Header Styling')}
                        </h6>
                        
                        <div className="form-check mb-2">
                            <Input
                                type="checkbox"
                                id="show-header"
                                checked={element.hasHeader !== false}
                                onChange={e => onUpdate('hasHeader', e.target.checked)}
                                className="form-check-input"
                            />
                            <Label for="show-header" className="form-check-label" style={{ fontSize: '11px' }}>
                                {t('Show Header Row')}
                            </Label>
                        </div>

                        <div className="row g-2 mb-2">
                            <div className="col-6">
                                <FormGroup>
                                    <Label style={{ fontSize: '11px', fontWeight: '600' }}>{t('Bg Color')}</Label>
                                    <div className="d-flex align-items-center">
                                        <Input
                                            type="color"
                                            value={element.headerBackgroundColor || '#f0f0f0'}
                                            onChange={e => onUpdate('headerBackgroundColor', e.target.value)}
                                            style={{ width: '30px', height: '30px', padding: 0, marginRight: '5px' }}
                                        />
                                        <Input
                                            type="text"
                                            value={element.headerBackgroundColor || '#f0f0f0'}
                                            onChange={e => onUpdate('headerBackgroundColor', e.target.value)}
                                            style={{ fontSize: '10px', padding: '4px' }}
                                        />
                                    </div>
                                </FormGroup>
                            </div>
                            <div className="col-6">
                                <FormGroup>
                                    <Label style={{ fontSize: '11px', fontWeight: '600' }}>{t('Text Color')}</Label>
                                    <div className="d-flex align-items-center">
                                        <Input
                                            type="color"
                                            value={element.headerTextColor || '#000000'}
                                            onChange={e => onUpdate('headerTextColor', e.target.value)}
                                            style={{ width: '30px', height: '30px', padding: 0, marginRight: '5px' }}
                                        />
                                        <Input
                                            type="text"
                                            value={element.headerTextColor || '#000000'}
                                            onChange={e => onUpdate('headerTextColor', e.target.value)}
                                            style={{ fontSize: '10px', padding: '4px' }}
                                        />
                                    </div>
                                </FormGroup>
                            </div>
                        </div>

                        <hr className="my-2"/>

                        <h6 className="text-uppercase mb-2" style={{ fontSize: '10px', fontWeight: '700', color: '#6c757d' }}>
                            {t('Typography')}
                        </h6>

                        <FormGroup>
                            <Label style={{ fontSize: '11px', fontWeight: '600' }}>
                                {t('Font Family')}
                            </Label>
                            <Input
                                type="select"
                                value={element.fontFamily || 'Arial'}
                                onChange={e => onUpdate('fontFamily', e.target.value)}
                                style={{ fontSize: '11px' }}
                            >
                                {fontFamilies.map(font => (
                                    <option key={font} value={font}>{font}</option>
                                ))}
                            </Input>
                        </FormGroup>

                        <PropertyInput
                            label={t('Font Size')}
                            type="number"
                            value={element.fontSize || 12}
                            onChange={e => onUpdate('fontSize', e.target.value)}
                        />

                        <ButtonGroup label={t('Text Alignment')}>
                            <StyleButton
                                onClick={() => onUpdate('textAlign', 'left')}
                                isActive={element.textAlign === 'left' || !element.textAlign}
                            >
                                {t('Left')}
                            </StyleButton>
                            <StyleButton
                                onClick={() => onUpdate('textAlign', 'center')}
                                isActive={element.textAlign === 'center'}
                            >
                                {t('Center')}
                            </StyleButton>
                            <StyleButton
                                onClick={() => onUpdate('textAlign', 'right')}
                                isActive={element.textAlign === 'right'}
                            >
                                {t('Right')}
                            </StyleButton>
                        </ButtonGroup>
                    </TabPane>
                </TabContent>
            </div>
        </div>
    );
};

export default TableEditor;