import { useEffect, useState, useRef } from 'react';
import { useSession } from '../Hooks/UserHooks';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartmentStatus, resetDepartment } from '../../store/actions';

const STATUS_PING_INTERVAL = 60000;
const IDLE_TIMEOUT = 300000;
const STATUS_UPDATE_URL = 'https://tracker.1automations.com/api/track';

const UserStatusTracker = () => {
  const { userSession } = useSession();
  const dispatch = useDispatch();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isFocused, setIsFocused] = useState(document.hasFocus());
  const [isIdle, setIsIdle] = useState(false);
  const [visible, setVisible] = useState(true);
  const [departmentEnabled, setDepartmentEnabled] = useState(false);

  const lastActivityRef = useRef(Date.now());
  const idleTimeoutRef = useRef(null);

  const { isDepartmentStatusFetched, userRNP, apiResponse } = useSelector((store) => ({
    isDepartmentStatusFetched: store.Department.isDepartmentStatusFetched,
    userRNP: store.UserSession.userRNP,
    apiResponse: store.Department.apiResponse,
  }));

  useEffect(() => {
    if (userRNP?.permissions?.some((c) => c.indexOf('department.') === 0)) {
      dispatch(fetchDepartmentStatus());
    }
  }, [userRNP]);

  useEffect(() => {
    if (isDepartmentStatusFetched) {
      setDepartmentEnabled(apiResponse.success);
      dispatch(resetDepartment('isDepartmentStatusFetched', false));
      dispatch(resetDepartment('apiResponse', {}));
    }
  }, [isDepartmentStatusFetched]);

  useEffect(() => {
    if (!userSession) {
      return;
    }
    const handleOnline = () => {
      setIsOnline(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!userSession) {
      return;
    }
    const updateVisibility = () => {
      setVisible(document.visibilityState === 'visible');
    };

    const updateFocus = () => {
      //const focused = document.visibilityState === 'visible' && document.hasFocus();
      const focused = document.hasFocus();
      setIsFocused(focused);
    };

    document.addEventListener('visibilitychange', updateVisibility);
    window.addEventListener('focus', updateFocus);
    window.addEventListener('blur', updateFocus);

    updateFocus();

    return () => {
      document.removeEventListener('visibilitychange', updateVisibility);
      window.removeEventListener('focus', updateFocus);
      window.removeEventListener('blur', updateFocus);
    };
  }, []);

  useEffect(() => {
    if (!userSession) {
      return;
    }
    const resetIdleTimer = () => {
      lastActivityRef.current = Date.now();
      if (isIdle) setIsIdle(false);
    };

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetIdleTimer));

    idleTimeoutRef.current = setInterval(() => {
      if (Date.now() - lastActivityRef.current > IDLE_TIMEOUT) {
        setIsIdle(true);
      }
    }, 1000);

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetIdleTimer));
      clearInterval(idleTimeoutRef.current);
    };
  }, [isIdle]);

  useEffect(() => {
    if (!userSession) {
      return;
    }

    const sendStatus = () => {
      if (userRNP?.permissions?.some((c) => c.indexOf('department.') === 0 && departmentEnabled)) {
        axios({
          url: STATUS_UPDATE_URL,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify({
            online: isOnline,
            focused: isFocused,
            idle: isIdle,
            visible: visible,
          }),
        }).catch(console.error);
      }
    };

    const interval = setInterval(sendStatus, STATUS_PING_INTERVAL);
    sendStatus();

    return () => clearInterval(interval);
  }, [isOnline, isFocused, isIdle, visible]);

  return null;
};

export default UserStatusTracker;
