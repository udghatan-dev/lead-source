import React from 'react';
import './custom.css';

const Action = ({ menuPosition, handleAction }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: menuPosition.y,
        left: menuPosition.x - 50,
      }}
      className='bg-dark rounded-3 d-flex flex-column'
    >
      <i className='bx text-white fs-16 bxs-edit btn btn-sm dig-action-button' title='Edit' onClick={() => handleAction('edit')}></i>
      <i className='bx text-white fs-16 bx-copy-alt btn btn-sm dig-action-button' title='Clone' onClick={() => handleAction('clone')}></i>
      <i
        className='bx text-white fs-16 bx-layer-plus btn btn-sm dig-action-button'
        title='Take 1 Step Forward'
        onClick={() => handleAction('forward')}
      ></i>
      <i
        className='bx text-white fs-16 bx-layer-minus btn btn-sm dig-action-button'
        title='Take 1 Step Backward'
        onClick={() => handleAction('backward')}
      ></i>
      <i
        className='bx text-white fs-16 bx-layer btn btn-sm dig-action-button'
        title='Manage Layers'
        onClick={() => handleAction('layer')}
      ></i>
      <i className='bx text-white fs-16 bx-trash btn btn-sm dig-action-button' title='Delete' onClick={() => handleAction('delete')}></i>
    </div>
  );
};

export default Action;
