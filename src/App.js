import React, { useEffect } from 'react';

import './assets/css/style.css';
import './custom.css';
import './App.css';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-image-lightbox/style.css';

import { useSelector, useDispatch } from 'react-redux';

//import ThemeSelector from "./themes/ThemeSelector";
import Preloader from './Components/Loaders/Preloader';
//imoprt Route
import Route from './Routes';
//i18
import { init } from './i18n';

// Fake Backend
import { getUserRNP, getUserWallet } from './store/actions';
import { encrypt } from './security';
import {
  loadProductVisibility,
  loadURLManager,
  loadBrandConfig,
  loadPageMeta,
  loadLayout,
  checkIfNewVersionAvailable,
  loadCustomLoadingIcon,
  updateConfigMessage,
} from './helpers/panel/helper';
import { useHistory } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { applyCustomStyle, applyMainStyle, loadNSaveCustomStyle, loadNSaveMainStyle } from './helpers/panel/style-loading';
import guestListner from './helpers/panel/cookie';

import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './firebase/firebaseConfig';
import CustomNotification from './Components/Common/CustomNotification';
import { openIndexedDatabase } from './helpers/chat-db';

function App() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);
  const [loadingWL, setLoadingWL] = React.useState(true);

  const { userRNP, error } = useSelector((state) => ({
    userRNP: state.UserSession.userRNP,
    error: state.Login.error,
  }));

  async function requestPermission() {
    if ('Notification' in window) {
      //requesting permission using Notification API
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: process.env.REACT_APP_VAPID_KEY,
        });
        window.notificationToken = token;
      } else if (permission === 'denied') {
        //notifications are blocked
      }
    } else {
    }
  }

  onMessage(messaging, (payload) => {
    // const audio = new Audio('/notification.wav');
    // audio.play();
    CustomNotification.push({ title: payload?.notification?.title ?? '', body: payload?.notification?.body ?? '' });
  });

  useEffect(async () => {
    requestPermission();
    try {
      await openIndexedDatabase();
    } catch (error) {}
  }, []);

  React.useEffect(async () => {
    if (window.location.pathname === '/automation/oauth2/co_callback') {
      return setLoading(false);
    }
    if (window.location.pathname === '/embedded_commerce_manager') {
      return setLoading(false);
    }
    if (window.location.pathname.includes('/alliance/')) {
      return setLoading(false);
    }
    if (window.location.pathname === '/alliance_redirect') {
      return setLoading(false);
    }
    if (window.location.pathname.indexOf('/oauth_channel_signup') === 0) {
      return setLoading(false);
    }
    if (window.location.pathname === '/embedded_waba_signup') {
      return setLoading(false);
    }
    await init();
    localStorage.removeItem('websiteLogos');
    localStorage.removeItem('productVisibility');
    localStorage.removeItem('basicPanelSettings');
    localStorage.removeItem('menuLayout');
    localStorage.removeItem('apiUrlSetting');
    updateConfigMessage('Checking for updates...');
    checkIfNewVersionAvailable().then(async (resp) => {
      if (resp.status) {
        let keys = resp.data.map((d) => d.Key);
        localStorage.setItem('_wlk', encrypt(JSON.stringify(keys)));
        if (resp.load) {
          updateConfigMessage('Loading configurations...');

          const isMobileApp = localStorage.getItem('client_type') === 'mobile_app';
          const configData = resp.data;

          await Promise.all([
            !isMobileApp ? loadCustomLoadingIcon(configData) : Promise.resolve(),
            !isMobileApp ? loadLayout(configData) : Promise.resolve(),
            !isMobileApp ? loadURLManager(configData) : Promise.resolve(),
            loadProductVisibility(configData),
            !isMobileApp ? loadPageMeta(configData) : Promise.resolve(),
            loadBrandConfig(configData),
            loadNSaveMainStyle(),
            loadNSaveCustomStyle(),
          ]);

          updateConfigMessage('Finished loading all configurations.');
          setLoadingWL(false);
        } else {
          applyMainStyle();
          applyCustomStyle();
          setLoadingWL(false);
        }
      } else {
        setLoadingWL(false);
      }
    });

    guestListner();
  }, []);

  React.useEffect(() => {
    let token = localStorage.getItem('authToken');
    if (token && !loadingWL) {
      dispatch(getUserRNP());
      dispatch(getUserWallet());
    } else if (token === null) {
      setLoading(false);
    }
  }, [dispatch, loadingWL]);

  React.useEffect(() => {
    if (userRNP !== undefined && userRNP?.subscription !== undefined) {
      setLoading(false);
    }
  }, [userRNP]);

  if (loading) {
    return (
      <>
        <Preloader />
      </>
    );
  } else {
    return (
      <React.Suspense fallback={<Preloader />}>
        <React.Fragment>
          <Route />
          <ToastContainer />
        </React.Fragment>
      </React.Suspense>
    );
  }
}

export default App;
