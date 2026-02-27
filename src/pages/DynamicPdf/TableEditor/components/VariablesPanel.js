/**
 * Variables Panel Component
 *
 * Manages variables with support for:
 * - String fallbacks
 * - JSON array fallbacks (for dynamic tables)
 * - Variable name validation
 * - Add/Edit/Delete operations
 */

import React, { useState } from 'react';
import { Button, Input, Label, Badge } from 'reactstrap';
import { formatVariableName, isValidJSON, isJSONMode } from '../utils/variableReplacer';

const VariableItem = ({ variable, index, onUpdate, onDelete, onInsert }) => {
  const [isJsonMode, setIsJsonMode] = useState(isJSONMode(variable.fallback));
  const [jsonError, setJsonError] = useState('');

  const handleNameChange = (e) => {
    onUpdate(index, 'name', e.target.value);
  };

  const handleNameBlur = (e) => {
    const formattedName = formatVariableName(e.target.value);
    onUpdate(index, 'name', formattedName);
  };

  const handleFallbackChange = (value) => {
    if (isJsonMode) {
      // Validate JSON
      if (isValidJSON(value)) {
        try {
          const parsed = JSON.parse(value);
          onUpdate(index, 'fallback', parsed);
          setJsonError('');
        } catch (e) {
          setJsonError('Invalid JSON format');
          onUpdate(index, 'fallback', value);
        }
      } else {
        setJsonError('Invalid JSON format');
        onUpdate(index, 'fallback', value);
      }
    } else {
      onUpdate(index, 'fallback', value);
      setJsonError('');
    }
  };

  const toggleJsonMode = (checked) => {
    setIsJsonMode(checked);
    setJsonError('');

    if (!checked && typeof variable.fallback === 'object') {
      // Convert object to string when switching out of JSON mode
      onUpdate(index, 'fallback', JSON.stringify(variable.fallback));
    } else if (checked && typeof variable.fallback === 'string') {
      // Try to parse string as JSON when switching to JSON mode
      if (isValidJSON(variable.fallback)) {
        try {
          const parsed = JSON.parse(variable.fallback);
          onUpdate(index, 'fallback', parsed);
        } catch (e) {
          // Keep as string if parsing fails
        }
      }
    }
  };

  const getFallbackDisplayValue = () => {
    if (typeof variable.fallback === 'object') {
      return JSON.stringify(variable.fallback, null, 2);
    }
    return variable.fallback || '';
  };

  return (
    <div
      className="card card-body mb-3"
      style={{
        backgroundColor: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      {/* Variable Name Input */}
      <div className="mb-2">
        <Label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>
          Variable Name
        </Label>
        <Input
          type="text"
          value={variable.name}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          placeholder="variable_name"
          style={{
            fontSize: '13px',
            fontFamily: 'monospace',
          }}
        />
        <small className="text-muted d-block mt-1" style={{ fontSize: '12px' }}>
          Use as: <code style={{ fontSize: '13px' ,color:''}}>{`\${${variable.name || 'variable_name'}}`}</code>
        </small>
      </div>

      {/* JSON Mode Toggle */}
      <div className="mb-2 d-flex align-items-center gap-2">
        <input
          type="checkbox"
          id={`json-mode-${index}`}
          checked={isJsonMode}
          onChange={(e) => toggleJsonMode(e.target.checked)}
          style={{ cursor: 'pointer' }}
        />
        <Label
          for={`json-mode-${index}`}
          className="mb-0"
          style={{ fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}
        >
          JSON Mode (for dynamic tables)
        </Label>
      </div>

      {/* Fallback Value Input */}
      <div className="mb-2">
        <Label style={{ fontSize: '12px', fontWeight: '600', color: '#555' }}>
          Fallback Value
        </Label>
        {isJsonMode ? (
          <>
            <textarea
              className="form-control font-monospace"
              value={getFallbackDisplayValue()}
              onChange={(e) => handleFallbackChange(e.target.value)}
              placeholder='[{"key": "value"}]'
              rows={6}
              style={{
                fontSize: '12px',
                backgroundColor: '#f8f9fa',
              }}
            />
            {jsonError && (
              <small className="text-danger d-block mt-1" style={{ fontSize: '11px' }}>
                ❌ {jsonError}
              </small>
            )}
          </>
        ) : (
          <Input
            type="text"
            value={getFallbackDisplayValue()}
            onChange={(e) => handleFallbackChange(e.target.value)}
            placeholder="Default value"
            style={{ fontSize: '13px' }}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="d-flex gap-2 mt-2">
        <Button
          className="variables-panel-button"
          size="sm"
          onClick={() => onInsert(variable.name)}
          style={{ flex: 1, fontSize: '12px' }}
        >
          <i className="bx bx-plus"></i> Insert
        </Button>
        <Button
          className="variables-panel-button"
          size="sm"
          onClick={() => onDelete(index)}
          style={{ fontSize: '12px' }}
        >
          <i className="bx bx-trash"></i>
        </Button>
      </div>
    </div>
  );
};

const VariablesPanel = ({ variables = [], onVariablesChange, editor }) => {
  const handleAddVariable = () => {
    const newVariables = [
      ...variables,
      { name: '', fallback: '' },
    ];
    onVariablesChange(newVariables);
  };

  const handleUpdateVariable = (index, field, value) => {
    const newVariables = [...variables];
    newVariables[index] = {
      ...newVariables[index],
      [field]: value,
    };
    onVariablesChange(newVariables);
  };

  const handleDeleteVariable = (index) => {
    const newVariables = variables.filter((_, i) => i !== index);
    onVariablesChange(newVariables);
  };

  const handleInsertVariable = (variableName) => {
    if (editor && variableName) {
      editor.chain().focus().insertVariable(variableName).run();
    }
  };

  return (
    <div className="variables-panel" style={{ padding: '16px' }}>
      <style>{`
        .variables-panel-button {
          color: #333 !important;
          background-color: white !important;
          border-color: #dee2e6 !important;
          transition: all 0.2s ease;
        }
        .variables-panel-button:hover:not(:disabled) {
          background-color: #f8f9fa !important;
          color: #666 !important;
          border-color: #adb5bd !important;
        }
        .variables-panel-button:disabled {
          opacity: 0.6;
        }
      `}</style>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: '600' }}>
          Variables ({variables.length})
        </h6>
        <Button
          className="variables-panel-button"
          size="sm"
          onClick={handleAddVariable}
          style={{ fontSize: '12px', padding: '4px 12px' }}
        >
          <i className="bx bx-plus"></i> Add
        </Button>
      </div>

      {/* Variables List */}
      <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
        {variables.length === 0 ? (
          <div
            className="text-center text-muted py-5"
            style={{ fontSize: '13px' }}
          >
            <i className="bx bx-data" style={{ fontSize: '48px', opacity: 0.3 }}></i>
            <p className="mt-2">No variables defined</p>
            <p style={{ fontSize: '11px' }}>
              Click "Add" to create your first variable
            </p>
          </div>
        ) : (
          variables.map((variable, index) => (
            <VariableItem
              key={index}
              variable={variable}
              index={index}
              onUpdate={handleUpdateVariable}
              onDelete={handleDeleteVariable}
              onInsert={handleInsertVariable}
            />
          ))
        )}
      </div>

      {/* Info Section */}
      {variables.length > 0 && (
        <div
          className="mt-3 p-2"
          style={{
            backgroundColor: '#e7f3ff',
            borderRadius: '6px',
            border: '1px solid #b3d9ff',
          }}
        >
          <small style={{ fontSize: '11px', color: '#004085' }}>
            <strong>💡 Tip:</strong> Use JSON mode for dynamic table data sources.
            Format: <code style={{ fontSize: '10px' }}>[{`{"key": "value"}`}]</code>
          </small>
        </div>
      )}
    </div>
  );
};

export default VariablesPanel;
