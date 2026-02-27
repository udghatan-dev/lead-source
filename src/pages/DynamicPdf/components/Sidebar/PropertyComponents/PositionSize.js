// PropertyComponents/PositionSize.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropertyInput from './PropertyInput';

const PositionSize = ({ element, onUpdate }) => {
    const { t } = useTranslation();
    
    // Special handling for line elements
    const isLine = element.type === 'line';

    return (
        <div className="card border shadow-sm mb-2">
            <div className="card-body p-2">
                <h6 className="card-title text-uppercase mb-2" style={{ fontSize: '10px', fontWeight: '700', color: '#495057' }}>
                    {t('Position & Size')}
                </h6>
                <div className="row g-2">
                    {/* X and Y Position - Always visible */}
                    <div className="col-6">
                        <PropertyInput 
                            label={t('X')} 
                            value={element.x || 0} 
                            onChange={e => onUpdate('x', e.target.value)} 
                            type="number" 
                        />
                    </div>
                    <div className="col-6">
                        <PropertyInput 
                            label={t('Y')} 
                            value={element.y || 0} 
                            onChange={e => onUpdate('y', e.target.value)} 
                            type="number" 
                        />
                    </div>
                    
                    {/* For lines: Show Length and Rotation */}
                    {isLine ? (
                        <>
                            <div className="col-6">
                                <PropertyInput 
                                    label={t('Length')} 
                                    value={element.width || 0} 
                                    onChange={e => onUpdate('width', e.target.value)} 
                                    type="number"
                                    min="20"
                                />
                            </div>
                            <div className="col-6">
                                <PropertyInput 
                                    label={t('Rotation')} 
                                    value={element.rotation || 0} 
                                    onChange={e => onUpdate('rotation', e.target.value)} 
                                    type="number"
                                    min="0"
                                    max="360"
                                />
                            </div>
                        </>
                    ) : (
                        /* For all other elements: Show Width and Height */
                        <>
                            <div className="col-6">
                                <PropertyInput 
                                    label={t('Width')} 
                                    value={element.width || 100} 
                                    onChange={e => onUpdate('width', e.target.value)} 
                                    type="number" 
                                />
                            </div>
                            <div className="col-6">
                                <PropertyInput 
                                    label={t('Height')} 
                                    value={element.height || 50} 
                                    onChange={e => onUpdate('height', e.target.value)} 
                                    type="number" 
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PositionSize;