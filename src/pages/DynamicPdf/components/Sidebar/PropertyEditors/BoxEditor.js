// PropertyEditors/BoxEditor.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormGroup, Label, Input, Button } from 'reactstrap';

const BoxEditor = ({ element, onUpdate }) => {
    const { t } = useTranslation();

    return (
        <div className="card border shadow-sm mb-2">
            <div className="card-body p-2">
                <h6 className="card-title text-uppercase mb-3" style={{ fontSize: '11px', fontWeight: '700', color: '#495057' }}>
                    {t('Border Style')}
                </h6>

                {/* Border Thickness with Slider */}
                <FormGroup className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <Label className="form-label text-muted mb-0" style={{ fontSize: '11px', fontWeight: '600' }}>
                            {t('Border Thickness')}
                        </Label>
                        <span className="badge bg-secondary" style={{ fontSize: '10px' }}>
                            {element.strokeWidth || 2}px
                        </span>
                    </div>
                    <Input
                        type="range"
                        min="0"
                        max="20"
                        step="1"
                        value={element.strokeWidth || 2}
                        onChange={e => onUpdate('strokeWidth', parseFloat(e.target.value))}
                        className="form-range"
                    />
                    <div className="d-flex justify-content-between mt-1" style={{ fontSize: '9px', color: '#999' }}>
                        <span>{t('No Border')}</span>
                        <span>{t('Thick')}</span>
                    </div>
                </FormGroup>

                {/* Border Color */}
                <FormGroup className="mb-3">
                    <Label className="form-label text-muted mb-2" style={{ fontSize: '11px', fontWeight: '600' }}>
                        {t('Border Color')}
                    </Label>
                    <div className="d-flex align-items-center gap-2">
                        <Input
                            type="color"
                            value={element.stroke || '#000000'}
                            onChange={e => onUpdate('stroke', e.target.value)}
                            style={{ width: '50px', height: '38px', cursor: 'pointer', padding: '2px' }}
                        />
                        <Input
                            type="text"
                            value={element.stroke || '#000000'}
                            onChange={e => onUpdate('stroke', e.target.value)}
                            placeholder="#000000"
                            bsSize="sm"
                            style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase' }}
                        />
                    </div>
                </FormGroup>

                {/* Fill Color with Transparent Toggle */}
                <FormGroup className="mb-0">
                    <Label className="form-label text-muted mb-2" style={{ fontSize: '11px', fontWeight: '600' }}>
                        {t('Fill Color')}
                    </Label>
                    
                    {element.fill !== 'transparent' && (
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <Input
                                type="color"
                                value={element.fill || '#ffffff'}
                                onChange={e => onUpdate('fill', e.target.value)}
                                style={{ width: '50px', height: '38px', cursor: 'pointer', padding: '2px' }}
                            />
                            <Input
                                type="text"
                                value={element.fill || '#ffffff'}
                                onChange={e => onUpdate('fill', e.target.value)}
                                placeholder="#ffffff"
                                bsSize="sm"
                                style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase' }}
                            />
                        </div>
                    )}
                    
                    <Button
                        color={element.fill === 'transparent' ? 'primary' : 'outline-secondary'}
                        size="sm"
                        onClick={() => onUpdate('fill', element.fill === 'transparent' ? '#ffffff' : 'transparent')}
                        className="w-100"
                        style={{ fontSize: '11px' }}
                    >
                        <i className={`bx ${element.fill === 'transparent' ? 'bxs-color-fill' : 'bx-eraser'} me-1`}></i>
                        {element.fill === 'transparent' ? t('Add Fill') : t('Transparent Fill')}
                    </Button>
                </FormGroup>
            </div>
        </div>
    );
};

export default BoxEditor;