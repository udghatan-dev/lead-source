import ComingSoonImage from './../assets/images/landing/coming-soon.jpg';

function CommingSoon() {
  return (
    <>
      <div className='position-relative'>
        <img
          src={ComingSoonImage}
          style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, width: '100vw', height: '100vh' }}
        />
      </div>
    </>
  );
}

export default CommingSoon;
