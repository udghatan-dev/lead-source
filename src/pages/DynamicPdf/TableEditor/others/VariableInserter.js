// VariableInserter.js - Insert variables into TipTap editor
import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Button, Popover, PopoverBody, Badge } from 'reactstrap';
import { useTranslation } from 'react-i18next';

const VariableInserter = ({ editor }) => {
  const { t } = useTranslation();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const buttonRef = useRef(null);
  const variables = useSelector(state => state.pdfBuilder?.variables || []);

  const togglePopover = () => setPopoverOpen(!popoverOpen);

  const insertVariable = (variableName) => {
    if (editor && variableName) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'variable',
          attrs: { id: variableName }
        })
        .run();

      setPopoverOpen(false);
    }
  };

  if (variables.length === 0) {
    return null;
  }

  return (
    <>
      <Button
        innerRef={buttonRef}
        id="variable-inserter-btn"
        size="sm"
        color="success"
        outline
        onClick={togglePopover}
        className="d-flex align-items-center gap-1"
        disabled={!editor}
      >
        <i className="bx bx-data"></i>
        <span style={{ fontSize: '11px' }}>{t('Insert Variable')}</span>
      </Button>

      <Popover
        placement="bottom-start"
        isOpen={popoverOpen}
        target="variable-inserter-btn"
        toggle={togglePopover}
      >
        <PopoverBody className="p-3">
          <div className="mb-2">
            <small className="text-muted fw-semibold" style={{ fontSize: '11px' }}>
              {t('Click to insert variable')}
            </small>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {variables.map((variable, index) => (
              <Badge
                key={index}
                color="success"
                className="cursor-pointer"
                style={{
                  fontSize: '11px',
                  fontWeight: '500',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => insertVariable(variable.name)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <i className="bx bx-data me-1"></i>
                {variable.name}
              </Badge>
            ))}
          </div>

          {variables.length === 0 && (
            <div className="text-center text-muted py-2" style={{ fontSize: '11px' }}>
              {t('No variables defined')}
            </div>
          )}
        </PopoverBody>
      </Popover>
    </>
  );
};

export default VariableInserter;