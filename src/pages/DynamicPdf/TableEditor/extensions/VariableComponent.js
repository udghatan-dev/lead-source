/**
 * Variable Component
 *
 * React component for rendering variable nodes as chips
 */

import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Badge } from 'reactstrap';

const VariableComponent = ({ node, deleteNode }) => {
  const variableName = node.attrs.id;

  return (
    <NodeViewWrapper className="variable-chip-wrapper" style={{ display: 'inline' }}>
      <Badge
        color="success"
        className="variable-chip-view"
        style={{
          fontSize: '12px',
          fontWeight: '500',
          padding: '4px 8px',
          margin: '0 2px',
          borderRadius: '4px',
          cursor: 'default',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontFamily: 'monospace'
        }}
      >
        <i className="bx bx-data" style={{ fontSize: '14px' }}></i>
        <span>{variableName}</span>
        <i
          className="bx bx-x"
          style={{
            fontSize: '16px',
            cursor: 'pointer',
            marginLeft: '2px'
          }}
          onClick={deleteNode}
          title="Remove variable"
        ></i>
      </Badge>
    </NodeViewWrapper>
  );
};

export default VariableComponent;
