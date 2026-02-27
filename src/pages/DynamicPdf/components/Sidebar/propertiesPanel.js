import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Badge, Button } from 'reactstrap';
import { Overlay } from 'react-overlays';
import { updateElement, deleteElement } from '../../store/actions';

import PositionSize from './PropertyComponents/PositionSize';
import VariableSelector from './PropertyComponents/VariableSelector';

import MediaUploadHandler from '../../../DynamicImage/MediaUploadHandler';

import TextEditor from './PropertyEditors/TextEditor';
import HeadingEditor from './PropertyEditors/HeadingEditor';
import TextareaEditor from './PropertyEditors/TextareaEditor';
import ImageEditor from './PropertyEditors/ImageEditor';
import QREditor from './PropertyEditors/QREditor';
import TableEditor from './PropertyEditors/TableEditor';
import LineEditor from './PropertyEditors/LineEditor';
import BoxEditor from './PropertyEditors/BoxEditor';

const PropertiesPanel = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const triggerRef = useRef(null);
    const containerRef = useRef(null);
    const fileManagerRef = useRef(null);

    const [showVariable, setShowVariable] = useState({ status: false, elementId: null, propName: null });
    const [showFileManager, setShowFileManager] = useState({ status: false, target: '', module: {} });

    const pdfState = useSelector(state => state.pdfBuilder || { pages: [], currentPageId: null, selectedElementId: null });
    const variables = pdfState.variables || [];

    const currentPage = pdfState.pages.find(p => p.id === pdfState.currentPageId);
    const selectedElement = currentPage && pdfState.selectedElementId
        ? currentPage.elements.find(el => el.id === pdfState.selectedElementId)
        : null;

    if (!selectedElement) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
                <i className='bx bx-info-circle text-muted mb-2' style={{ fontSize: '48px' }}></i>
                <span className="text-muted" style={{ fontSize: '13px' }}>
                    {t('Select an element to edit properties')}
                </span>
            </div>
        );
    }

    const handleUpdate = (prop, value) => {
        const isNumeric = ['x', 'y', 'width', 'height', 'fontSize', 'strokeWidth', 'cellWidth', 'cellHeight', 'cellPadding', 'borderWidth'].includes(prop);
        const parsedValue = isNumeric ? parseFloat(value) || 0 : value;
        dispatch(updateElement(selectedElement.id, { [prop]: parsedValue }));
    };

    const handleDeleteElement = () => {
        dispatch(deleteElement(selectedElement.id));
    };

    const handleVariableFocus = (elementId, propName, event) => {
        triggerRef.current = event.target;
        setShowVariable({ status: true, elementId, propName });
    };

    const handleVariableSelect = (variableName) => {
        const { propName } = showVariable;
        const currentValue = selectedElement[propName] || '';
        const newValue = currentValue + `\${${variableName}}`;
        handleUpdate(propName, newValue);
        setShowVariable({ status: false, elementId: null, propName: null });
    };

    const handleVariableClose = () => {
        setShowVariable({ status: false, elementId: null, propName: null });
    };

    const handleFileManagerOpen = (config) => {
        setShowFileManager(config);
    };

    const handleFileManagerCallback = (data) => {
        const targetId = data[0][0];
        const url = data[0][1];

        const parts = targetId.split('#');
        const elementId = parts[1];
        const propName = parts[2];

        handleUpdate(propName, url);

        setShowFileManager({ status: false, target: '', module: {} });
    };

    const renderElementEditor = () => {
        const commonProps = {
            element: selectedElement,
            onUpdate: handleUpdate,
            onFocus: handleVariableFocus,
            variables: variables,
            onFileManagerOpen: handleFileManagerOpen,
            fileManagerRef: fileManagerRef
        };

        switch (selectedElement.type) {
            case 'text':
                return <TextEditor {...commonProps} />;
            case 'heading':
                return <HeadingEditor {...commonProps} />;
            case 'textarea':
                return <TextareaEditor {...commonProps} />;
            case 'image':
                return <ImageEditor {...commonProps} />;
            case 'qr':
                return <QREditor {...commonProps} />;
            case 'table':
                return <TableEditor {...commonProps} />;
            case 'line':
                return <LineEditor element={selectedElement} onUpdate={handleUpdate} />;
            case 'box':
                return <BoxEditor element={selectedElement} onUpdate={handleUpdate} />;
            default:
                return (
                    <div className="alert alert-warning p-2" style={{ fontSize: '11px' }}>
                        <i className='bx bx-error me-1'></i>
                        {t('No editor available for this element type')}: {selectedElement.type}
                    </div>
                );
        }
    };

    return (
        <>
            <div className="h-100 d-flex flex-column" ref={containerRef}>
                <div className="p-2 border-bottom bg-light d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: '11px', color: '#6c757d', fontWeight: '600' }}>
                            {t('Properties')}:
                        </span>
                        <Badge color="primary" style={{ fontSize: '10px' }}>
                            {selectedElement.type}
                        </Badge>
                    </div>
                    <Button
                        color="danger"
                        size="sm"
                        onClick={handleDeleteElement}
                        className="d-flex align-items-center"
                        style={{ fontSize: '10px', padding: '4px 8px' }}
                        title={t('Delete Element')}
                    >
                        <i className='bx bx-trash me-1'></i>
                        {t('Delete')}
                    </Button>
                </div>

                <div className="flex-1 overflow-auto p-2">
                    <PositionSize element={selectedElement} onUpdate={handleUpdate} />
                    {renderElementEditor()}
                </div>
            </div>

            {showVariable.status && variables.length > 0 && (
                <VariableSelector
                    show={showVariable.status}
                    target={triggerRef}
                    variables={variables}
                    onSelect={handleVariableSelect}
                    onClose={handleVariableClose}
                    containerRef={containerRef}
                />
            )}

            {showFileManager.status && (
                <Overlay
                    show={showFileManager.status}
                    rootClose
                    offset={[50, 10]}
                    onHide={() => setShowFileManager({ status: false, target: '', module: {} })}
                    placement='right'
                    container={document.body}
                    target={fileManagerRef}
                    flip={true}
                >
                    {({ props, placement }) => {
                        const updatedProps = {
                            ...props,
                            style: { ...props.style, zIndex: 999999 }
                        };
                        return (
                            <div {...updatedProps} placement={placement}>
                                <div style={{ width: '450px' }}>
                                    <MediaUploadHandler
                                        closePopup={() => setShowFileManager({ status: false, target: '', module: {} })}
                                        data={{
                                            ...showFileManager.module,
                                            identifier: showFileManager.target || showFileManager.module.identifier
                                        }}
                                        successCallback={handleFileManagerCallback}
                                    />
                                </div>
                            </div>
                        );
                    }}
                </Overlay>
            )}
        </>
    );
};

export default PropertiesPanel;
