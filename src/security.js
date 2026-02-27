import CryptoJS from 'crypto-js';
import { AES, enc } from 'crypto-js';
import md5 from 'md5';

export const ReCAPTCHA_SITE_KEY = () => {
  if (localStorage.getItem('_gs_key')) {
    return localStorage.getItem('_gs_key');
  } else {
    return '';
  }
};

export const decrypt = (hash) => {
  let s_k = window.location.origin;
  try {
    let bytes = AES.decrypt(hash, s_k);
    let finalString = bytes.toString(enc.Utf8);
    return finalString;
  } catch (error) {
    localStorage.removeItem('_mu');
    localStorage.removeItem('_pv');
    localStorage.removeItem('_u');
    localStorage.removeItem('_basic');
    localStorage.removeItem('_w');
    localStorage.removeItem('_p');
    window.location.href = '';
  }
};

export const decryptSpecific = (hash) => {
  let s_k = window.location.origin;
  try {
    let bytes = AES.decrypt(hash, s_k);
    let finalString = bytes.toString(enc.Utf8);
    return finalString;
  } catch (error) {
    return null;
  }
};

export const encrypt = (string) => {
  let s_k = window.location.origin;
  let ciphertext = CryptoJS.AES.encrypt(string, s_k).toString();
  return ciphertext;
};

export function staticEncrypt(msg) {
  const key = md5(window.location.hostname);
  const keyutf = CryptoJS.enc.Utf8.parse(key);
  const iv = CryptoJS.enc.Utf8.parse('678025308de70905');
  const enc = CryptoJS.AES.encrypt(msg, keyutf, { iv: iv });
  const encStr = enc.toString();
  return encStr;
}

export function staticDecrypt(transitmessage, refreshOnError = true) {
  let pass = md5(window.location.hostname);
  try {
    const keyutf = CryptoJS.enc.Utf8.parse(pass);
    const iv = CryptoJS.enc.Utf8.parse('678025308de70905');
    const dec = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Base64.parse(transitmessage) }, keyutf, {
      iv: iv,
    });
    const decStr = CryptoJS.enc.Utf8.stringify(dec);
    return decStr;
  } catch (error) {
    if (refreshOnError) {
      localStorage.removeItem('_mu');
      localStorage.removeItem('_pv');
      localStorage.removeItem('_u');
      localStorage.removeItem('_basic');
      localStorage.removeItem('_w');
      localStorage.removeItem('_p');
      window.location.href = '';
    }
  }
}

export function hostname(url) {
  try {
    return new URL(url).hostname;
  } catch (error) {
    return url;
  }
}
