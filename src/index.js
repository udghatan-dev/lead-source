import React, { lazy } from 'react';
import ReactDOM from 'react-dom';
import Preloader from './Components/Loaders/Preloader';
import ErrorBoundary from './ErrorBoundary';
//import App from "./App";
const App = lazy(() => import('./App'));
import './utils/stringUtils';

import reportWebVitals from './reportWebVitals';
//import * as serviceWorker from './serviceWorker';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { configureStore } from './store';

async function renderApp() {
  const store = await configureStore({});
  // let is_mobile_app = localStorage.getItem('client_type');

  // if (is_mobile_app === 'mobile_app') {
  //   ReactDOM.render(
  //     <ErrorBoundary>
  //       <Provider store={store}>
  //         <React.Suspense fallback={<Preloader />}>
  //           <React.Fragment>
  //             <BrowserRouter basename={process.env.PUBLIC_URL}>
  //               <App />
  //             </BrowserRouter>
  //           </React.Fragment>
  //         </React.Suspense>
  //       </Provider>
  //     </ErrorBoundary>,
  //     document.getElementById('root')
  //   );
  // } else {
  //   ReactDOM.render(
  //     // <ErrorBoundary>
  //     <Provider store={store}>
  //       <React.Suspense fallback={<Preloader />}>
  //         <React.Fragment>
  //           <BrowserRouter basename={process.env.PUBLIC_URL}>
  //             <App />
  //           </BrowserRouter>
  //         </React.Fragment>
  //       </React.Suspense>
  //     </Provider>,
  //     //</ErrorBoundary>,
  //     document.getElementById('root')
  //   );
  // }

  ReactDOM.render(
    // <ErrorBoundary>
    <Provider store={store}>
      <React.Suspense fallback={<Preloader />}>
        <React.Fragment>
          <BrowserRouter basename={process.env.PUBLIC_URL}>
            <App />
          </BrowserRouter>
        </React.Fragment>
      </React.Suspense>
    </Provider>,
    //</ErrorBoundary>,
    document.getElementById('root')
  );
}
renderApp();
//serviceWorker.register();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
