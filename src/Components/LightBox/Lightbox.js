import React from 'react';
import LightboxContainer from 'react-image-lightbox';

const Lightbox = ({ image, handleClose }) => {
  return (
    <>
      <div style={{ zIndex: 999999, position: 'fixed' }}>
        <LightboxContainer mainSrc={image} onCloseRequest={handleClose} imagePadding={100} />
      </div>
    </>
  );
};

export default Lightbox;
