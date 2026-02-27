// PropertyEditors/LineEditor.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormGroup, Label, Input } from 'reactstrap';
import PropertyInput from '../PropertyComponents/PropertyInput';

const LineEditor = ({ element, onUpdate }) => {
    const { t } = useTranslation();

    return (
        <div className="card border shadow-sm mb-2">
            <div className="card-body p-2">
                <h6 className="card-title text-uppercase mb-2" style={{ fontSize: '10px', fontWeight: '700', color: '#495057' }}>
                    {t('Line Properties')}
                </h6>

                {/* REMOVED: Length field (it's in Position & Size) */}

                <PropertyInput
                    label={t('Thickness')}
                    type="number"
                    min="1"
                    max="20"
                    value={element.strokeWidth || 2}
                    onChange={e => onUpdate('strokeWidth', e.target.value)}
                />

                <FormGroup className="mb-2">
                    <Label className="form-label text-muted mb-1" style={{ fontSize: '11px', fontWeight: '600' }}>
                        {t('Line Color')}
                    </Label>
                    <Input
                        type="color"
                        value={element.stroke || '#000000'}
                        onChange={e => onUpdate('stroke', e.target.value)}
                        bsSize="sm"
                        style={{ height: '30px' }}
                    />
                </FormGroup>

                {/* Optional: Line Style */}
                <FormGroup className="mb-0">
                    <Label className="form-label text-muted mb-1" style={{ fontSize: '11px', fontWeight: '600' }}>
                        {t('Line Style')}
                    </Label>
                    <Input
                        type="select"
                        value={element.dash ? 'dashed' : 'solid'}
                        onChange={e => onUpdate('dash', e.target.value === 'dashed' ? [10, 5] : undefined)}
                        bsSize="sm"
                    >
                        <option value="solid">{t('Solid')}</option>
                        <option value="dashed">{t('Dashed')}</option>
                    </Input>
                </FormGroup>
            </div>
        </div>
    );
};

export default LineEditor;