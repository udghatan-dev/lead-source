import md5 from 'md5';
import { staticEncrypt } from '../../security';
import Axios from 'axios';
import { checkMenuAvailability } from './helper';

const siteLocation = window.location.hostname;

function loadNSaveMainStyle() {
  return new Promise((resolve, reject) => {
    let folder = md5(staticEncrypt(siteLocation));
    if (!checkMenuAvailability('style.css')) {
      resolve();
    }
    let url = `https://wlibrary.s3.eu-west-1.wasabisys.com/${folder}/style.css?hash=${new Date().getTime()}`;
    Axios.get(url)
      .then((response) => {
        localStorage.setItem('_ms', response);
        applyMainStyle();
        resolve();
      })
      .catch((error) => {
        resolve();
      });
  });
}

function loadNSaveCustomStyle() {
  return new Promise((resolve, reject) => {
    let folder = md5(staticEncrypt(siteLocation));
    if (!checkMenuAvailability('custom.css')) {
      resolve();
    }
    let url = `https://wlibrary.s3.eu-west-1.wasabisys.com/${folder}/custom.css?hash=${new Date().getTime()}`;
    Axios.get(url)
      .then((response) => {
        localStorage.setItem('_cs', response);
        applyCustomStyle();
        resolve();
      })
      .catch((error) => {
        resolve();
      });
  });
}

function applyMainStyle() {
  let style = localStorage.getItem('_ms');
  if (style === null) {
    loadNSaveMainStyle();
  } else {
    let styleElement = document.createElement('style');
    styleElement.setAttribute('type', 'text/css');
    if ('styleSheet' in styleElement) {
      styleElement.styleSheet.cssText = style;
    } else {
      styleElement.appendChild(document.createTextNode(style));
    }
    document.head.appendChild(styleElement);
  }
}

function applyCustomStyle() {
  let style = localStorage.getItem('_cs');
  if (style === null) {
    loadNSaveCustomStyle();
  } else {
    let styleElement = document.createElement('style');
    styleElement.setAttribute('type', 'text/css');
    if ('styleSheet' in styleElement) {
      styleElement.styleSheet.cssText = style;
    } else {
      styleElement.appendChild(document.createTextNode(style));
    }
    document.head.appendChild(styleElement);
  }
}

export { loadNSaveMainStyle, applyMainStyle, loadNSaveCustomStyle, applyCustomStyle };
