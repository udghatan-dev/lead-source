import loadAllMenu from './menu-loading';
import { applyCustomStyle, applyMainStyle } from './style-loading';

const ALL_COOKIES = [
  '_cs',
  '_ms',
  '_lc',
  '_mu',
  '_pv',
  '_u',
  '_p',
  '_gs_key',
  '_w',
  '_v',
  '_lv',
  '_wlk',
  '_mnp',
  '_mnw',
  '_mnc',
  '_mnb',
  '_mna',
  '_mnh',
  '_mnv',
  '_mnwr',
];

const MENU_COOKIE = ['_mnp', '_mnw', '_mnc', '_mnb', '_mna', '_mnh', '_mnv', '_mnwr'];
const STYLE_COOKIE = ['_cs', '_ms'];

function listenLogout() {
  window.location.href = '/login';
}

function listenLogin() {
  window.location.href = '/products';
}

function listenMenuChange() {
  loadAllMenu();
}

function listenStyleChanges(cookie) {
  if (cookie === '_cs') {
    applyCustomStyle();
  }
  if (cookie === '_ms') {
    applyMainStyle();
  }
}

function handleStorageChange(data) {
  if (data.key === 'authToken' && data.newValue === null) {
    listenLogout();
  }
  if (data.key === 'authToken' && data.newValue !== null && data.oldValue === null) {
    listenLogin();
  }
  if (MENU_COOKIE.indexOf(data.key) !== -1 && data.newValue === null && data.oldValue !== null) {
    listenMenuChange();
  }
  if (STYLE_COOKIE.indexOf(data.key) !== -1 && data.newValue === null && data.oldValue !== null) {
    listenStyleChanges(data.key);
  }
}

function guestListner() {
  window.addEventListener('storage', handleStorageChange);
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}

export default guestListner;
