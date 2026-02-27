import React from 'react';

function OAuthCallback(props) {
  React.useEffect(() => {
    var query = props.location.search;
    var cb = window.sessionStorage.getItem('cb');
    if (cb !== null) {
      var url = window.atob(cb);
      window.location.href = url + query;
    }
  });

  return (
    <>
      <div>Redirecting...</div>
    </>
  );
}

export default OAuthCallback;
