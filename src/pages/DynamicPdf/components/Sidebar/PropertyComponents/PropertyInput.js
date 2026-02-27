// PropertyComponents/PropertyInput.js
import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';

const PropertyInput = ({ label, ...props }) => (
    <FormGroup className="mb-2">
        <Label className="form-label text-muted mb-1" style={{ fontSize: '11px', fontWeight: '600' }}>
            {label}
        </Label>
        <Input {...props} bsSize="sm" />
    </FormGroup>
);

export default PropertyInput;