import { ToastMe } from './ToastInit';
import { toast } from 'react-toastify';

const CopyToClipBoard = (text) => {
  navigator.clipboard.writeText(text);
  toast.success('Copied !', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  });
};
export { CopyToClipBoard };
