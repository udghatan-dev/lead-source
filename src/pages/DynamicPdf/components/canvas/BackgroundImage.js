import React from 'react';
import { Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';

const BackgroundImage = ({ imageUrl, width, height }) => {
  const [image] = useImage(imageUrl, 'Anonymous');

  if (!image) return null;

  return (
    <KonvaImage
      image={image}
      x={0}
      y={0}
      width={width}
      height={height}
      listening={false}
      draggable={false}
    />
  );
};

export default BackgroundImage;
