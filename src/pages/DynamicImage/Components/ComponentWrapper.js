import React, { useRef } from 'react';
import { Group, Image } from 'react-konva';
import useImage from 'use-image';
import { Html } from 'react-konva-utils';

const GroupBox = ({ shapeProps, content, onMouseDown }) => {
  const shapeRef = useRef();
  const [image] = useImage(content);

  return (
    <Group {...shapeProps} draggable onMouseDown={onMouseDown} ref={shapeRef}>
      <Html
        divProps={{
          style: {
            position: 'absolute',
            top: -20,
            left: 0,
          },
        }}
      >
        <i className='bx bxs-trash text-danger fs-18'></i>
      </Html>
      <Image image={image} width={shapeProps.width} height={shapeProps.height} />
    </Group>
  );
};

export default GroupBox;
