// PropertyComponents/VariableSelector.js - BADGE VERSION
import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Badge } from 'reactstrap';

const VariableSelector = ({ show, target, variables, onSelect, onClose }) => {
    const overlayRef = useRef(null);
    const { t } = useTranslation();
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const updatePosition = () => {
            if (!target.current || !show) return;
            
            const rect = target.current.getBoundingClientRect();
            setPosition({
                top: rect.top + window.scrollY,
                left: rect.right + 10 + window.scrollX
            });
        };

        if (show) {
            updatePosition();
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition, true);
        }

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [show, target]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (overlayRef.current && !overlayRef.current.contains(e.target) && 
                target.current && !target.current.contains(e.target)) {
                onClose();
            }
        };
        
        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show, onClose, target]);

    if (!show || !variables || variables.length === 0) {
        return null;
    }

    return ReactDOM.createPortal(
        <div
            ref={overlayRef}
            className="bg-white border rounded shadow-sm p-3"
            style={{
                position: 'fixed',
                top: `${position.top}px`,
                left: `${position.left}px`,
                zIndex: 999999,
                minWidth: '200px',
                maxWidth: '280px'
            }}
        >
            <div className="text-muted fw-semibold mb-2" style={{ fontSize: '13px' }}>
                {t('Variables')}
            </div>
            
            <div className="d-flex flex-wrap gap-2">
                {variables.map((variable, index) => (
                    <Badge
                        key={index}
                        color="success"
                        className="cursor-pointer"
                        style={{ 
                            fontSize: '13px',
                            fontWeight: '500',
                            padding: '6px 12px',
                            cursor: 'pointer'
                        }}
                        onClick={() => onSelect(variable.name)}
                    >
                        {variable.name}
                    </Badge>
                ))}
            </div>
        </div>,
        document.body
    );
};

export default VariableSelector;