import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

const ToastMe = (status, position, message, duration = 2000) => {
  if (status === 'warning') {
    toast(message, {
      position: position,
      autoClose: duration,
      hideProgressBar: true,
      className: 'bg-' + status + ' text-white',
      // toastId: status === "success" ? "success" : "failed_to_load"
    });
  } else if (status === 'danger') {
    toast(message, {
      position: position,
      autoClose: duration,
      hideProgressBar: true,
      className: 'bg-' + status + ' text-white',
      // toastId: status === "success" ? "success" : "failed_to_load"
    });
  } else {
    toast(message, {
      position: position,
      autoClose: duration,
      hideProgressBar: true,
      className: 'bg-' + status + ' text-white',
      // toastId: status === "success" ? "success" : "failed_to_load"
    });
  }
};

const MyToastContainer = () => {
  return (
    <>
      <ToastContainer />
    </>
  );
};
export { MyToastContainer, ToastMe };
