import React, { useState } from 'react';
import { Image } from 'react-konva';

import useImage from 'use-image';

const BgImageBox = ({ shapeProps, content, onClick }) => {
  const [image] = useImage(content);

  return (
    <React.Fragment>
      <Image image={image} {...shapeProps} onClick={onClick} />
    </React.Fragment>
  );
};

export default BgImageBox;
