// PropertyEditors/TextareaEditor.js - Complete with font preview
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FormGroup, Label, Input } from 'reactstrap';
import PropertyInput from '../PropertyComponents/PropertyInput';
import PropertySelect from '../PropertyComponents/PropertySelect';
import { ButtonGroup, StyleButton } from '../PropertyComponents/ButtonGroup';

const TextareaEditor = ({ element, onUpdate, onFocus, variables }) => {
    const { t } = useTranslation();
    const triggerRef = useRef(null);

    const fontFamilies = [
        'Roboto',
        'Tinos',
        'Montserrat',
        'Arimo',
        'Noto Sans',
        'PT Sans',
        'Playfair Display',
        'Ubuntu',
        'Raleway',
        'Brush Script MT',
        'Pacifico'
    ];

    return (
        <div className="card border shadow-sm mb-2">
            <div className="card-body p-2">
                <h6 className="card-title text-uppercase mb-2" style={{ fontSize: '10px', fontWeight: '700', color: '#495057' }}>
                    {t('Textarea Properties')}
                </h6>

                {/* Text Content with Variable Support */}
                <FormGroup className="mb-2">
                    <Label className="form-label text-muted mb-1 d-flex align-items-center justify-content-between" style={{ fontSize: '11px', fontWeight: '600' }}>
                        {t('Text Content')}
                        {variables.length > 0 && (
                            <i className='bx bx-data text-primary' title={t('Insert Variable')} style={{ cursor: 'pointer' }}></i>
                        )}
                    </Label>
                    <Input
                        type="textarea"
                        value={element.text || ''}
                        onChange={e => onUpdate('text', e.target.value)}
                        onFocus={(e) => {
                            if (onFocus && variables.length > 0) {
                                onFocus(element.id, 'text', e);
                            }
                        }}
                        rows={4}
                        bsSize="sm"
                    />
                </FormGroup>

                {/* ✅ Font Family with Preview */}
                <FormGroup className="mb-2">
                    <Label className="form-label text-muted mb-1" style={{ fontSize: '11px', fontWeight: '600' }}>
                        {t('Font Family')}
                    </Label>
                    <Input
                        type="select"
                        bsSize="sm"
                        value={element.fontFamily || 'Arial'}
                        onChange={e => onUpdate('fontFamily', e.target.value)}
                    >
                        {fontFamilies.map(font => (
                            <option 
                                key={font} 
                                value={font}
                                style={{ fontFamily: font }}
                            >
                                {font}
                            </option>
                        ))}
                    </Input>
                    {/* Font Preview
                    // <div 
                    //     className="mt-1 p-2 border rounded text-center"
                    //     style={{ 
                    //         fontFamily: element.fontFamily || 'Arial',
                    //         fontSize: '12px',
                    //         backgroundColor: '#f8f9fa'
                    //     }}
                    // >
                    //     {element.fontFamily || 'Arial'} - The quick brown fox
                    // </div> */}
                </FormGroup>

                {/* Font Size */}
                <PropertyInput
                    label={t('Font Size')}
                    type="number"
                    value={element.fontSize || 14}
                    onChange={e => onUpdate('fontSize', e.target.value)}
                />

                {/* Text Alignment */}
                <ButtonGroup label={t('Text Alignment')}>
                    <StyleButton
                        onClick={() => onUpdate('align', 'left')}
                        isActive={element.align === 'left' || !element.align}
                    >
                        {t('Left')}
                    </StyleButton>
                    <StyleButton
                        onClick={() => onUpdate('align', 'center')}
                        isActive={element.align === 'center'}
                    >
                        {t('Center')}
                    </StyleButton>
                    <StyleButton
                        onClick={() => onUpdate('align', 'right')}
                        isActive={element.align === 'right'}
                    >
                        {t('Right')}
                    </StyleButton>
                </ButtonGroup>

                {/* Padding */}
                {/* <PropertyInput
                    label={t('Padding')}
                    type="number"
                    min="0"
                    value={element.padding || 8}
                    onChange={e => onUpdate('padding', e.target.value)}
                /> */}

                {/* Background Color */}
                <FormGroup className="mb-2">
                    <Label className="form-label text-muted mb-1" style={{ fontSize: '11px', fontWeight: '600' }}>
                        {t('Background Color')}
                    </Label>
                    <Input
                        type="color"
                        value={element.backgroundColor || '#ffffff'}
                        onChange={e => onUpdate('backgroundColor', e.target.value)}
                        bsSize="sm"
                        style={{ height: '30px' }}
                    />
                </FormGroup>

                {/* Text Color */}
                <FormGroup className="mb-2">
                    <Label className="form-label text-muted mb-1" style={{ fontSize: '11px', fontWeight: '600' }}>
                        {t('Text Color')}
                    </Label>
                    <Input
                        type="color"
                        value={element.fill || '#000000'}
                        onChange={e => onUpdate('fill', e.target.value)}
                        bsSize="sm"
                        style={{ height: '30px' }}
                    />
                </FormGroup>

                {/* Border Color */}
                {/* <FormGroup className="mb-2">
                    <Label className="form-label text-muted mb-1" style={{ fontSize: '11px', fontWeight: '600' }}>
                        {t('Border Color')}
                    </Label>
                    <Input
                        type="color"
                        value={element.stroke || '#000000'}
                        onChange={e => onUpdate('stroke', e.target.value)}
                        bsSize="sm"
                        style={{ height: '30px' }}
                    />
                </FormGroup> */}

                {/* Border Width
                <PropertyInput
                    label={t('Border Width')}
                    type="number"
                    min="0"
                    value={element.strokeWidth || 1}
                    onChange={e => onUpdate('strokeWidth', e.target.value)}
                /> */}

                {/* Opacity */}
                <PropertyInput
                    label={t('Opacity')}
                    type="number"
                    min="0"
                    max="100"
                    value={Math.round((element.opacity || 1) * 100)}
                    onChange={e => onUpdate('opacity', Number(e.target.value) / 100)}
                />
            </div>
        </div>
    );
};

export default TextareaEditor;