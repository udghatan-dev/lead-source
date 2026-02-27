import React, { useEffect, useState } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';

const ImageBox = ({ shapeProps, content, onMouseDown, onNodeClick }) => {
  const shapeRef = React.useRef();
  let [image] = useImage(content);

  return (
    <React.Fragment>
      <Image image={image} ref={shapeRef} {...shapeProps} draggable onMouseDown={onMouseDown} onDragMove={onNodeClick} />
    </React.Fragment>
  );
};

export default ImageBox;
