// PropertyEditors/ImageEditor.js - WITH FILE UPLOAD
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormGroup, Label, Input } from 'reactstrap';

const ImageEditor = ({ element, onUpdate, onFocus, variables, onFileManagerOpen, fileManagerRef }) => {
    const { t } = useTranslation();

    return (
        <div className="card border shadow-sm mb-2">
            <div className="card-body p-2">
                <h6 className="card-title text-uppercase mb-2" style={{ fontSize: '10px', fontWeight: '700', color: '#495057' }}>
                    {t('Image Properties')}
                </h6>
                
                <FormGroup className="mb-0">
                    <Label className="form-label text-muted mb-1 d-flex align-items-center justify-content-between" style={{ fontSize: '11px', fontWeight: '600' }}>
                        {t('Image URL')}
                        <div className="d-flex gap-1">
                            {variables.length > 0 && (
                                <i className='bx bx-data text-primary' title={t('Click input to insert variable')} style={{ cursor: 'help' }}></i>
                            )}
                            {/* Upload Button */}
                            <i
                                className='bx bx-cloud-upload text-primary'
                                title={t('Upload Image')}
                                style={{ cursor: 'pointer', fontSize: '16px' }}
                                ref={fileManagerRef}
                                onClick={() => {
                                    if (onFileManagerOpen) {
                                        onFileManagerOpen({
                                            status: true,
                                            target: `image_url#${element.id}#imageUrl`,
                                            module: {
                                                target: `image_url#${element.id}#imageUrl`,
                                                type: 'image',
                                                multi: false,
                                                limit: 5000000  // 5MB
                                            }
                                        });
                                    }
                                }}
                            ></i>
                        </div>
                    </Label>
                    <Input
                        bsSize="sm"
                        value={element.imageUrl || ''}
                        onChange={e => onUpdate('imageUrl', e.target.value)}
                        onFocus={(e) => {
                            if (onFocus && variables.length > 0) {
                                onFocus(element.id, 'imageUrl', e);
                            }
                        }}
                        placeholder="https://example.com/image.jpg"
                        id={`image_url#${element.id}#imageUrl`}
                    />
                </FormGroup>
            </div>
        </div>
    );
};

export default ImageEditor;