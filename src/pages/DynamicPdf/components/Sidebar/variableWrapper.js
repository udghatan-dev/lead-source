// Section/Variable.js - Variable management component with JSON support
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'reactstrap';
import { addVariable, updateVariable, deleteVariable } from '../../store/actions';

const VariableItem = ({ index, variable, handleVariables, deleteVariable }) => {
  const { t } = useTranslation();
  
  const [isJsonMode, setIsJsonMode] = useState(
    typeof variable.fallback === 'object' || 
    (typeof variable.fallback === 'string' && (
      variable.fallback.trim().startsWith('[') || 
      variable.fallback.trim().startsWith('{')
    ))
  );
  const [jsonError, setJsonError] = useState('');

  const handleFallbackChange = (value) => {
    if (isJsonMode) {
      try {
        const parsed = JSON.parse(value);
        handleVariables(index, 'fallback', parsed);
        setJsonError('');
      } catch (e) {
        setJsonError('Invalid JSON format');
        handleVariables(index, 'fallback', value);
      }
    } else {
      handleVariables(index, 'fallback', value);
      setJsonError('');
    }
  };

  const toggleJsonMode = (checked) => {
    setIsJsonMode(checked);
    setJsonError('');
    
    if (!checked && typeof variable.fallback === 'object') {
      handleVariables(index, 'fallback', JSON.stringify(variable.fallback));
    }
  };

  return (
    <div className='card card-body mb-3'>
      <Col lg={12} className='mx-2'>
        {/* Variable Name */}
        <div className='mb-3'>
          <label className='d-flex align-items-center justify-content-between form-label'>
            {`${t('Variable')} #${index + 1} ${t('Name')}`}
          </label>
          <input
            type='text'
            className='form-control'
            placeholder={t('Variable Name')}
            value={variable.name}
            onChange={(e) => {
              handleVariables(index, 'name', e.target.value);
            }}
            onBlur={(e) => {
              const formattedName = e.target.value
                .toLowerCase()
                .replace(/\_/gi, ' ')
                .trim()
                .replace(/\ /gi, '_')
                .replace(/[^0-9a-z\_]/gi, '');
              handleVariables(index, 'name', formattedName);
            }}
          />
          <small className='text-muted d-block mt-1'>
            {t('Use as')}: <code className='bg-light px-1 rounded'>{`\${${variable.name || 'variable_name'}}`}</code>
          </small>
        </div>

        {/* Fallback Value */}
        <div className='mb-2'>
          <label className='d-flex align-items-center justify-content-between form-label'>
            {`${t('Variable')} #${index + 1} ${t('Fallback')}`}
          </label>

          {/* JSON Mode Toggle */}
          {/* <div className='alert alert-info p-2 mb-2'>
            <div className='form-check'>
              <input
                type='checkbox'
                className='form-check-input'
                id={`json-mode-${index}`}
                checked={isJsonMode}
                onChange={(e) => toggleJsonMode(e.target.checked)}
              />
              <label
                className='form-check-label fw-semibold'
                htmlFor={`json-mode-${index}`}
                style={{ fontSize: '11px' }}
              >
                {t('Enable JSON Mode (for dynamic tables)')}
              </label>
            </div>
          </div> */}

          {/* Input Field */}
          {isJsonMode ? (
            <>
              <textarea
                className='form-control font-monospace'
                value={typeof variable.fallback === 'string' 
                  ? variable.fallback 
                  : JSON.stringify(variable.fallback, null, 2)}
                onChange={(e) => handleFallbackChange(e.target.value)}
                placeholder='[{"key": "value"}]'
                rows={6}
                style={{ fontSize: '0.85rem' }}
              />
              
              {/* Validation Status */}
              {jsonError ? (
                <small className='text-danger d-block mt-1 fw-semibold'>
                  ❌ {jsonError}
                </small>
              ) : (
                <small className='text-success d-block mt-1 fw-semibold'>
                  ✓ {t('Valid JSON')}
                </small>
              )}
              
              {/* JSON Help */}
              <div className='mt-2 p-2 bg-light border rounded'>
                <small className='text-muted d-block mb-1 fw-semibold'>
                  📘 {t('Example')}:
                </small>
                <code className='d-block bg-white p-2 rounded' style={{ fontSize: '0.75rem' }}>
                  {`[\n  {"item": "TV", "price": "100"},\n  {"item": "Phone", "price": "50"}\n]`}
                </code>
              </div>
            </>
          ) : (
            <div className='d-flex align-items-center gap-2'>
              <input
                type='text'
                className='form-control'
                placeholder={t('Variable Fallback')}
                value={typeof variable.fallback === 'object' 
                  ? JSON.stringify(variable.fallback) 
                  : variable.fallback}
                onChange={(e) => handleFallbackChange(e.target.value)}
              />
              <i 
                className='bx bxs-trash fs-16 btn btn-ghost-danger btn-sm' 
                onClick={() => deleteVariable(index)}
                style={{ cursor: 'pointer' }}
              ></i>
            </div>
          )}

          {/* Delete Button for JSON Mode */}
          {isJsonMode && (
            <button
              className='btn btn-sm btn-danger w-100 mt-2'
              onClick={() => deleteVariable(index)}
            >
              <i className='bx bxs-trash me-1'></i>
              {t('Delete Variable')}
            </button>
          )}
        </div>
      </Col>
    </div>
  );
};

const Variable = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const variables = useSelector(state => state.pdfBuilder?.variables || []);

  function addNewVariable() {
    const newVariable = {
      name: '',
      fallback: '',
    };
    dispatch(addVariable(newVariable));
  }

  function handleVariableChange(index, key, value) {
    if (key === 'name') {
      value = value.replace(/[\ ]/gi, '_').replace(/[^0-9a-z\_]/gi, '');
    }
    const updates = { [key]: value };
    dispatch(updateVariable(index, updates));
  }

  function handleVariableDelete(index) {
    dispatch(deleteVariable(index));
  }

  return (
    <div className='w-100 px-1'>
      <Row>
        {variables.map((variable, index) => (
          <VariableItem
            key={index}
            variable={variable}
            index={index}
            handleVariables={handleVariableChange}
            deleteVariable={handleVariableDelete}
          />
        ))}
      </Row>

      {variables.length === 0 && (
        <div className='d-flex flex-column gap-3 align-items-center justify-content-center py-5'>
          <span className='text-muted'>{t('No Variable Found')}</span>
        </div>
      )}

      <div className='d-flex gap-3 align-items-center justify-content-center mt-3'>
        <span 
          className='btn btn-sm btn-soft-dark d-flex align-items-center justify-content-center' 
          onClick={addNewVariable}
          style={{ cursor: 'pointer' }}
        >
          <i className='bx bx-plus me-1'></i>
          {t('Add Variable')}
        </span>
      </div>
    </div>
  );
};

export default Variable;