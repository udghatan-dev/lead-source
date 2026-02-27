import Preloader from './../../Components/Loaders/Preloader';

const Workspace = () => {
  if (window.location.hostname !== 'localhost') {
    window.location.href = `${window.location.origin}/workspace`;
    return <Preloader />;
  } else {
    return <></>;
  }
};

export default Workspace;
