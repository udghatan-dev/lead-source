// PropertyComponents/PropertySelect.js
import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';

const PropertySelect = ({ label, value, onChange, options, ...props }) => (
    <FormGroup className="mb-2">
        <Label className="form-label text-muted mb-1" style={{ fontSize: '11px', fontWeight: '600' }}>
            {label}
        </Label>
        <Input type="select" value={value} onChange={onChange} {...props} bsSize="sm">
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </Input>
    </FormGroup>
);

export default PropertySelect;