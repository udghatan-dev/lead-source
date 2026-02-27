import React from 'react';

function OAuthRedirect(props) {
  function launchFB() {
    window.open('https://app.automationsbuilder.com/meta_messaging_authorization?type=&config=1642303436231478&cb=test', '_blank');
  }
  return (
    <>
      <button onClick={() => launchFB()}>Get Access Token</button>
    </>
  );
}

export default OAuthRedirect;
