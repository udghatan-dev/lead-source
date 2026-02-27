import React, { useState } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';
import QRCode from 'qrcode';

const QRBox = ({ shapeProps, content, onMouseDown, onNodeClick }) => {
  const shapeRef = React.useRef();
  let image;

  let opts = {
    errorCorrectionLevel: shapeProps.ecl,
    quality: shapeProps.quality,
    margin: shapeProps.margin,
    color: {
      dark: shapeProps.fgColor,
      light: shapeProps.bgColor,
    },
  };

  QRCode.toDataURL(content, opts, function (err, url) {
    [image] = useImage(url);
  });

  return (
    <React.Fragment>
      <Image image={image} ref={shapeRef} {...shapeProps} draggable onMouseDown={onMouseDown} onDragMove={onNodeClick} />
    </React.Fragment>
  );
};

export default QRBox;
