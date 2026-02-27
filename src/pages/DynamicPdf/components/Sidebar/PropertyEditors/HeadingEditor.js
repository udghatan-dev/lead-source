import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FormGroup, Label, Input } from 'reactstrap';
import PropertyInput from '../PropertyComponents/PropertyInput';
import PropertySelect from '../PropertyComponents/PropertySelect';
import { ButtonGroup, StyleButton } from '../PropertyComponents/ButtonGroup';

const HeadingEditor = ({ element, onUpdate, onFocus, variables }) => {
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
                    {t('Heading Properties')}
                </h6>
                {/* Font Family with Preview in Dropdown */}
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
                                style={{ fontFamily: font }} //  Show font in dropdown
                            >
                                {font}
                            </option>
                        ))}
                    </Input>
                    {/* Font Preview */}
                    {/* <div 
                        className="mt-1 p-2 border rounded text-center"
                        style={{ 
                            fontFamily: element.fontFamily || 'Arial',
                            fontSize: '14px',
                            backgroundColor: '#f8f9fa'
                        }}
                    >
                        {element.fontFamily || 'Arial'} - The quick brown fox
                    </div> */}
                </FormGroup>

                <PropertySelect
                    label={t('Heading Level')}
                    value={element.headingLevel || 'h1'}
                    onChange={e => {
                        const level = e.target.value;
                        const sizeMap = { h1: 32, h2: 28, h3: 24, h4: 20, h5: 18, h6: 16 };
                        onUpdate('headingLevel', level);
                        onUpdate('fontSize', sizeMap[level]);
                    }}
                    options={['h1', 'h2', 'h3', 'h4', 'h5', 'h6']}
                />

                {/* Heading Text with Variable Support */}
                <FormGroup className="mb-2">
                    <Label className="form-label text-muted mb-1 d-flex align-items-center justify-content-between" style={{ fontSize: '11px', fontWeight: '600' }}>
                        {t('Heading Text')}
                        {variables.length > 0 && (
                            <i className='bx bx-data text-primary' title={t('Insert Variable')} style={{ cursor: 'pointer' }}></i>
                        )}
                    </Label>
                    <Input
                        bsSize="sm"
                        value={element.text || ''}
                        onChange={e => onUpdate('text', e.target.value)}
                        onFocus={(e) => {
                            if (onFocus && variables.length > 0) {
                                onFocus(element.id, 'text', e);
                            }
                        }}
                    />
                </FormGroup>

                <PropertyInput
                    label={t('Font Size')}
                    type="number"
                    value={element.fontSize || 32}
                    onChange={e => onUpdate('fontSize', e.target.value)}
                />

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

                <FormGroup className="mb-0">
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
            </div>
        </div>
    );
};

export default HeadingEditor;