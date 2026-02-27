// PropertyComponents/ButtonGroup.js
import React from 'react';
import { FormGroup, Label } from 'reactstrap';

export const ButtonGroup = ({ label, children }) => (
    <FormGroup className="mb-2">
        {label && <Label className="form-label text-muted mb-1" style={{ fontSize: '11px', fontWeight: '600' }}>{label}</Label>}
        <div className="btn-group w-100" role="group">
            {children}
        </div>
    </FormGroup>
);

export const StyleButton = ({ onClick, isActive, children }) => (
    <button
        type="button"
        onClick={onClick}
        className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-secondary'}`}
        style={{ fontSize: '10px', padding: '4px 8px' }}
    >
        {children}
    </button>
);