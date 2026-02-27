import React from 'react';

function OAuthCOCallback(props) {
  React.useEffect(() => {
    var query = props.location.search;
    if (window.opener !== null) {
      // Send the authorization code back to the parent window.
      window.opener.postMessage(query, window.location.origin);
      // Close the child tab.
      window.close();
    } else {
      window.location.href = window.location.origin;
    }
  });

  return (
    <>
      <div>Redirecting...</div>
    </>
  );
}

export default OAuthCOCallback;
