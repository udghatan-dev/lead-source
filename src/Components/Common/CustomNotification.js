import { toast } from 'react-toastify';
import { IoChatbubbles } from 'react-icons/io5';
import { IoMdClose } from 'react-icons/io';

const CustomToast = ({ closeToast, title, body }) => {
  return (
    <div>
      <div className='d-flex align-items-center gap-1'>
        <div className='flex-shrink-0 d-flex align-items-center justify-content-center'>
          <div className='rounded-2 avatar-xs bg-light d-flex align-items-center justify-content-center'>
            <IoChatbubbles className='text-muted' style={{ fontSize: '24px' }} />
          </div>
        </div>
        <div className='flex-grow-1 d-flex flex-column'>
          <span className='fs-13 fw-bold'>{title ?? '!! New Notification Received !!'}</span>
          <span className='fs-11 text-muted'>{body ?? ''}</span>
        </div>
      </div>
      {/* <div className='d-flex align-items-center gap-2 mt-1'>
        <button className='btn btn-dark btn-sm d-flex align-items-center gap-1'>
          <IoChatbubbleEllipsesSharp />
          <span>Open Chat</span>
        </button>
        <button className='btn btn-light btn-sm d-flex align-items-center gap-1' onClick={closeToast}>
          <IoMdClose />
          <span>Close</span>
        </button>
      </div> */}
      <div style={{ position: 'absolute', right: 5, top: 5 }}>
        <IoMdClose style={{ fontSize: '22px' }} onClick={closeToast} />
      </div>
    </div>
  );
};

const PushNotification = ({ title, body }) => {
  toast(<CustomToast title={title} body={body} />, {
    position: 'top-right',
    hideProgressBar: true,
  });
};

const SuccessNotification = (msg) => {
  toast.success(msg, {
    position: 'top-center',
    hideProgressBar: true,
  });
};

const ErrorNotification = (msg) => {
  toast.error(msg, {
    position: 'top-center',
    hideProgressBar: true,
  });
};

const InfoNotification = (msg) => {
  toast.info(msg, {
    position: 'top-center',
    hideProgressBar: true,
  });
};

export default {
  success: SuccessNotification,
  error: ErrorNotification,
  info: InfoNotification,
  push: PushNotification,
};
