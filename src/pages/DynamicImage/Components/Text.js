import React, { useState } from 'react';
import { Text } from 'react-konva';

const TextBox = ({ shapeProps, content, onMouseDown, onNodeClick }) => {
  const shapeRef = React.useRef();

  return (
    <React.Fragment>
      <Text text={content} ref={shapeRef} {...shapeProps} draggable onMouseDown={onMouseDown} onDragMove={onNodeClick} />
    </React.Fragment>
  );
};

export default TextBox;
