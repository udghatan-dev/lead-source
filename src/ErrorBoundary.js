import React, { lazy } from 'react';
import './error.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    let message = error?.message ?? '';
    if (message.indexOf('Maximum update depth exceeded') === 0) {
      return { hasError: true };
    } else {
      return { hasError: false };
    }
  }

  clearCache() {
    try {
      let authToken = localStorage.getItem('authToken');
      let clientType = localStorage.getItem('client_type');
      localStorage.clear();
      if (authToken !== null) {
        localStorage.setItem('authToken', authToken);
      }
      if (clientType !== null) {
        localStorage.setItem('client_type', clientType);
      }

      if ('caches' in window) {
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              return caches.delete(cacheName);
            })
          );
        });
      }
      window.location.reload(true);
    } catch (error) {}
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='error-boundary-centered-div'>
          <h1>An error occurred. Please refresh the page by clicking on "Clear Cache".</h1>
          <button onClick={() => this.clearCache()}>Clear Cache</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
