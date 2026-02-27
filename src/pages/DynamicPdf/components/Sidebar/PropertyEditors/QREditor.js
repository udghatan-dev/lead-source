// PropertyEditors/QREditor.js
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FormGroup, Label, Input } from 'reactstrap';

const QREditor = ({ element, onUpdate, onFocus, variables }) => {
    const { t } = useTranslation();
    const triggerRef = useRef(null);

    return (
        <div className="card border shadow-sm mb-2">
            <div className="card-body p-2">
                <h6 className="card-title text-uppercase mb-2" style={{ fontSize: '10px', fontWeight: '700', color: '#495057' }}>
                    {t('QR Code Properties')}
                </h6>
                
                <FormGroup className="mb-2">
                    <Label className="form-label text-muted mb-1 d-flex align-items-center justify-content-between" style={{ fontSize: '11px', fontWeight: '600' }}>
                        {t('QR Data')}
                        {variables.length > 0 && (
                            <i className='bx bx-data text-primary' title={t('Insert Variable')} style={{ cursor: 'pointer' }}></i>
                        )}
                    </Label>
                    <Input
                        bsSize="sm"
                        value={element.qrData || ''}
                        onChange={e => onUpdate('qrData', e.target.value)}
                        onFocus={(e) => {
                            // triggerRef.current = e.target;
                            if (onFocus && variables.length > 0) {
                                onFocus(element.id, 'qrData', e);
                            }
                        }}
                        placeholder="https://example.com or ${variable}"
                        // ref={triggerRef}
                    />
                </FormGroup>

                <small className="text-muted d-block mb-2" style={{ fontSize: '10px' }}>
                    💡 {t('Use')} <code>{'${variable}'}</code> {t('for dynamic QR codes')}
                </small>

                <FormGroup className="mb-2">
                    <div className="form-check">
                        <Input
                            type="checkbox"
                            id="qr-transparent"
                            checked={element.qrTransparentBg !== false}
                            onChange={(e) => onUpdate('qrTransparentBg', e.target.checked)}
                            className="form-check-input"
                        />
                        <Label for="qr-transparent" className="form-check-label" style={{ fontSize: '11px' }}>
                            {t('Transparent Background')}
                        </Label>
                    </div>
                </FormGroup>

                {element.qrTransparentBg === false && (
                    <FormGroup className="mb-0">
                        <Label className="form-label text-muted mb-1" style={{ fontSize: '11px', fontWeight: '600' }}>
                            {t('Background Color')}
                        </Label>
                        <Input
                            type="color"
                            value={element.qrBackgroundColor || '#ffffff'}
                            onChange={(e) => onUpdate('qrBackgroundColor', e.target.value)}
                            bsSize="sm"
                            style={{ height: '30px' }}
                        />
                    </FormGroup>
                )}
            </div>
        </div>
    );
};

export default QREditor;