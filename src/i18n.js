import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import axios from 'axios';

const LANG_KEY = localStorage.getItem('I18N_LANGUAGE') || 'en';

const resourceMap = {
  gr: 'gr.json',
  it: 'it.json',
  rs: 'ru.json',
  sp: 'sp.json',
  en: 'en.json',
  cn: 'ch.json',
  fr: 'fr.json',
  ms: 'ms.json',
  hi: 'hi.json',
  gu: 'gu.json',
  ta: 'ta.json',
  te: 'te.json',
  ro: 'ro.json',
  pt: 'pt.json',
};

function fetchLang(code) {
  return new Promise((resolve, reject) => {
    try {
      fetch(`https://raw.githubusercontent.com/wlsettings/translations/main/translations/${code}.json`)
        .then((response) => response.json())
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          resolve({});
        });
    } catch (err) {
      resolve({});
    }
  });
}

export const init = async () => {
  let resources = {};
  if (resourceMap[LANG_KEY]) {
    resources = await import(`./locales/${resourceMap[LANG_KEY]}`);
  } else {
    resources = await fetchLang(LANG_KEY);
  }

  i18n
    .use(detector)
    .use(initReactI18next)
    .init({
      //resources: { [LANG_KEY]: resources.default },
      resources: {
        en: {
          translation: resources,
        },
      },
      lng: LANG_KEY,
      fallbackLng: 'en', // use en if detected lng is not available

      keySeparator: false, // we do not use keys in form messages.welcome

      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    });
};

export const changeMyLanguage = async (language) => {
  //const resources = await import(`./locales/${resourceMap[language]}`);
  //const resources = await fetchLang(resourceMap[LANG_KEY]);

  let resources = {};
  if (resourceMap[language]) {
    resources = await import(`./locales/${resourceMap[language]}`);
  } else {
    resources = await fetchLang(language);
  }

  i18n
    .use(detector)
    .use(initReactI18next)
    .init({
      //resources: { [LANG_KEY]: resources.default },
      resources: {
        en: {
          translation: resources,
        },
      },
      lng: LANG_KEY,
      fallbackLng: 'en', // use en if detected lng is not available

      keySeparator: false, // we do not use keys in form messages.welcome

      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    });
};

export default i18n;
