import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'reactstrap';

const Variable = ({ index, variable, handleVariables, deleteVariable }) => {
  const { t } = useTranslation();
  return (
    <div className='card card-body'>
      <Col lg={12} className={'mx-2'}>
        <div className='mb-3'>
          <label className='d-flex align-items-center justify-content-between'>{`${t('Variable')} #${index + 1} ${t('Name')}`}</label>
          <input
            type='text'
            className='form-control'
            placeholder={t('Variable Name')}
            value={variable.name}
            onChange={(e) => {
              handleVariables(index, 'name', e.target.value);
            }}
            onBlur={(e) => {
              handleVariables(index, 'name', e.target.value.toLowerCase().replace(/\_/gi, ' ').trim().replace(/\ /gi, '_'));
            }}
          />
        </div>
        <div className='mb-2'>
          <label className='d-flex align-items-center justify-content-between'>{`${t('Variable')} #${index + 1} ${t('Fallback')}`}</label>
          <div className='d-flex align-items-center gap-2'>
            <input
              type='text'
              className='form-control'
              placeholder={t('Variable Fallback')}
              value={variable.fallback}
              onChange={(e) => {
                handleVariables(index, 'fallback', e.target.value);
              }}
            />
            <i className='bx bxs-trash fs-16 btn btn-ghost-danger btn-sm' onClick={() => deleteVariable(index)}></i>
          </div>
        </div>
      </Col>
    </div>
  );
};

const VariableWrapper = ({ variables, setVariables }) => {
  const { t } = useTranslation();
  function addNewVariable() {
    let variable = {
      name: '',
      fallback: '',
    };
    setVariables(variables.concat([variable]));
  }

  function handleVariableChange(index, key, value) {
    setVariables((prev) => {
      return prev.map((variable, i) => {
        if (i == index) {
          if (key === 'name') {
            variable['name'] = value.replace(/[\ ]/gi, '_').replace(/[^0-9A-Z\_]/gi, '');
          } else {
            variable[key] = value;
          }
        }
        return variable;
      });
    });
  }

  function handleVariableDelete(index) {
    setVariables((prev) => {
      return prev.filter((variable, i) => {
        if (i !== index) {
          return variable;
        }
      });
    });
  }

  return (
    <div className='w-100 px-1'>
      <Row>
        {variables.map((variable, index) => {
          return (
            <Variable variable={variable} index={index} handleVariables={handleVariableChange} deleteVariable={handleVariableDelete} />
          );
        })}
      </Row>

      {variables.length === 0 && (
        <div className='d-flex flex-column gap-3 align-items-center justify-content-center'>
          <span>{t('No Variable Found')}</span>
        </div>
      )}

      <div className='d-flex gap-3 align-items-center justify-content-center mt-3'>
        <span className='btn btn-sm btn-soft-dark d-flex align-items-center justify-content-center' onClick={() => addNewVariable()}>
          <i class='bx bx-plus me-1'></i>
          {t('Add Variable')}
        </span>
      </div>
    </div>
  );
};

export default VariableWrapper;
