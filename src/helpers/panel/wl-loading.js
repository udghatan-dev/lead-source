import { lazy } from 'react';
import md5 from 'md5';
import { staticEncrypt, staticDecrypt, encrypt, decrypt } from '../../security';
import Axios from 'axios';
import { changeMyLanguage } from './../../i18n';
//const AWSS3 = lazy(() => import('../../Components/Common/AWS'));
function useAWSS3() {
  return new Promise(async (resolve, reject) => {
    try {
      const module = await import('../../Components/Common/AWS');
      resolve(module.default);
    } catch (error) {
      reject(error);
    }
  });
}

function updateConfigMessage(message) {
  try {
    let element = document.getElementById('config_loading_message_update');
    if (element) {
      element.innerText = message;
    }
  } catch (error) {}
}

const siteLocation = window.location.hostname;

function loadStyle(directoryData) {
  return new Promise((resolve, reject) => {
    try {
      let folder = md5(staticEncrypt(siteLocation));
      let fileExist = directoryData.filter((d) => d.Key.includes('style.css'));
      if (fileExist.length > 0) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://wlibrary.s3.eu-west-1.wasabisys.com/${folder}/style.css?hash=${new Date().getTime()}`;
        document.head.appendChild(link);
      }
      fileExist = directoryData.filter((d) => d.Key.includes('custom.css'));
      if (fileExist.length > 0) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://wlibrary.s3.eu-west-1.wasabisys.com/${folder}/custom.css?hash=${new Date().getTime()}`;
        document.head.appendChild(link);
      }
      resolve();
    } catch (error) {
      resolve();
    }
  });
}

function checkMenuAvailability(key) {
  let whiteLabelData = localStorage.getItem('_wlk');
  try {
    whiteLabelData = JSON.parse(decrypt(whiteLabelData));
    if (whiteLabelData.filter((m) => m.includes(key)).length === 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    return false;
  }
}

function checkWebsiteAuth() {
  return new Promise(async (resolve, reject) => {
    try {
      let folder = md5(staticEncrypt(siteLocation));
      let params = {
        Bucket: 'wlibrary',
        Prefix: `${folder}`,
      };
      try {
        try {
          let AWSS3 = await useAWSS3();
          AWSS3.listObjects(params, (err, data) => {
            if (err) {
              resolve({ status: false });
            }
            if (data.Contents.length === 0) {
              resolve({ status: false });
            } else {
              resolve({ status: true, data: data.Contents });
            }
          });
        } catch (error) {
          resolve({ status: false });
        }
      } catch (error) {
        resolve({ status: false });
      }
    } catch (error) {
      resolve({ status: false });
    }
  });
}

function checkIfNewVersionAvailable() {
  return new Promise(async (resolve, reject) => {
    try {
      let folder = md5(staticEncrypt(siteLocation));
      let params = {
        Bucket: 'wlibrary',
        Prefix: `${folder}`,
      };
      try {
        try {
          let AWSS3 = await useAWSS3();
          AWSS3.listObjects(params, (err, data) => {
            if (err) {
              resolve({ status: false });
            }
            if (data.Contents.length === 0) {
              resolve({ status: false });
            } else {
              let directoryData = data.Contents;
              let version_file_name = md5('version');
              let folder = md5(staticEncrypt(siteLocation));
              let fileExist = directoryData.filter((d) => d.Key.includes(version_file_name));
              if (fileExist.length > 0) {
                let url = `https://wlibrary.s3.eu-west-1.wasabisys.com/${folder}/${version_file_name}.txt?hash=${new Date().getTime()}`;
                Axios.get(url)
                  .then((response) => {
                    let version = response;
                    let version_local = localStorage.getItem('_v');
                    let version_latest = localStorage.getItem('_lv');
                    localStorage.setItem('_lv', version);

                    if (version_latest === null || version_local === null) {
                      localStorage.setItem('_v', version);
                      resolve({ status: true, load: true, data: data.Contents });
                    } else {
                      resolve({ status: true, load: false, data: data.Contents });
                    }
                  })
                  .catch((error) => {
                    resolve({ status: true, load: true, data: data.Contents });
                  });
              } else {
                resolve({ status: true, load: true, data: data.Contents });
              }
            }
          });
        } catch (error) {
          resolve({ status: false });
        }
      } catch (error) {
        resolve({ status: false });
      }
    } catch (error) {
      resolve({ status: false });
    }
  });
}

function loadVersion(directoryData) {
  return new Promise((resolve, reject) => {
    try {
      let version_file_name = md5('version');
      let folder = md5(staticEncrypt(siteLocation));
      let fileExist = directoryData.filter((d) => d.Key.includes(version_file_name));
      if (fileExist.length > 0) {
        let url = `https://wlibrary.s3.eu-west-1.wasabisys.com/${folder}/${version_file_name}.txt`;
        Axios.get(url)
          .then((response) => {
            let version = response;
            let version_local = localStorage.getItem('_v');
            if (version_local !== version) {
              sessionStorage.setItem('_v', version);
            }
            resolve();
          })
          .catch((error) => {
            resolve();
          });
      } else {
        resolve();
      }
    } catch (error) {
      resolve();
    }
  });
}

function loadCustomLoadingIcon(directoryData) {
  return new Promise((resolve, reject) => {
    try {
      let version_file_name = md5('loader');
      let folder = md5(staticEncrypt(siteLocation));
      let fileExist = directoryData.filter((d) => d.Key.includes(version_file_name));
      if (fileExist.length > 0) {
        let url = `https://wlibrary.s3.eu-west-1.wasabisys.com/${folder}/${version_file_name}.txt?hash=${new Date().getTime()}`;
        Axios.get(url)
          .then((response) => {
            let loaderConfig = JSON.parse(staticDecrypt(response));
            if (loaderConfig.enable === false) {
              localStorage.removeItem('_lc');
              resolve();
            } else {
              var basicPanelSettings = {
                media: loaderConfig.media,
                theme: loaderConfig.theme ?? 'light',
                title: loaderConfig.title,
                sub_title: loaderConfig.sub_title,
                dimension: loaderConfig.dimension,
                custom_bg: loaderConfig.custom_bg,
              };

              let ciphertext = encrypt(JSON.stringify(basicPanelSettings));
              localStorage.setItem('_lc', ciphertext);
              resolve();
            }
          })
          .catch((error) => {
            resolve();
          });
      } else {
        resolve();
      }
    } catch (error) {
      resolve();
    }
  });
}

function loadLayout(directoryData) {
  return new Promise((resolve, reject) => {
    try {
      let layout_file_name = md5('layout');
      let folder = md5(staticEncrypt(siteLocation));
      let fileExist = directoryData.filter((d) => d.Key.includes(layout_file_name));
      if (fileExist.length > 0) {
        let url = `https://wlibrary.s3.eu-west-1.wasabisys.com/${folder}/${layout_file_name}.txt?timestamp=${new Date().getTime()}`;
        Axios.get(url).then((response) => {
          let layout = response;
          localStorage.setItem('_mu', layout);
          resolve();
        });
      } else {
        resolve();
      }
    } catch (error) {
      resolve();
    }
  });
}

function loadProductVisibility(directoryData) {
  return new Promise((resolve, reject) => {
    try {
      let product_file_name = md5('product');
      let folder = md5(staticEncrypt(siteLocation));
      let fileExist = directoryData.filter((d) => d.Key.includes(product_file_name));
      if (fileExist.length > 0) {
        let url = `https://wlibrary.s3.eu-west-1.wasabisys.com/${folder}/${product_file_name}.txt?v=${new Date().getTime()}`;
        Axios.get(url).then((response) => {
          let product = response;
          localStorage.setItem('_pv', product);
          resolve();
        });
      } else {
        resolve();
      }
    } catch (error) {
      resolve();
    }
  });
}

function loadURLManager(directoryData) {
  return new Promise((resolve, reject) => {
    try {
      let product_file_name = md5('url_manager');
      let folder = md5(staticEncrypt(siteLocation));
      let fileExist = directoryData.filter((d) => d.Key.includes(product_file_name));
      if (fileExist.length > 0) {
        let url = `https://wlibrary.s3.eu-west-1.wasabisys.com/${folder}/${product_file_name}.txt?v=${new Date().getTime()}`;
        Axios.get(url).then((response) => {
          let product = JSON.parse(staticDecrypt(response));
          var apiUrlSettings = {
            waba: product.WABA_API ?? 'https://waba.wa.team',
            inbox: product.INBOX_API ?? 'https://inboxapi.wa.team',
            livechat: product.LIVE_CHAT_PANEL ?? 'https://inbox.wa.team',
            automation: product.AUTOMATION ?? 'https://app2.com.bot',
            ecommerce: product.ECOM ?? 'https://ecom.1automations.com',
            reward: product.REWARD ?? 'https://rewardz.1automations.com',
            calendar: product.CALENDAR ?? 'https://app.calendarsbot.com',
            mediabot: product.MEDIABOT ?? 'https://mediabot.1automations.com',
          };
          let apiHash = encrypt(JSON.stringify(apiUrlSettings));
          localStorage.setItem('_u', apiHash);
          resolve();
        });
      } else {
        resolve();
      }
    } catch (error) {
      resolve();
    }
  });
}

function loadPageMeta(directoryData) {
  return new Promise((resolve, reject) => {
    try {
      let product_file_name = md5('page');
      let folder = md5(staticEncrypt(siteLocation));
      let fileExist = directoryData.filter((d) => d.Key.includes(product_file_name));
      if (fileExist.length > 0) {
        let url = `https://wlibrary.s3.eu-west-1.wasabisys.com/${folder}/${product_file_name}.txt?v=${new Date().getTime()}`;

        Axios.get(url).then((response) => {
          let pages = JSON.parse(staticDecrypt(response));
          var pageSetting = {
            auth: pages.auth,
            landing: pages.landing ?? 'DEFAULT',
            authVariables: pages.authVariables,
          };

          let pageHash = encrypt(JSON.stringify(pageSetting));
          localStorage.setItem('_p', pageHash);
          resolve();
        });
      } else {
        resolve();
      }
    } catch (error) {
      resolve();
    }
  });
}

function loadBrandConfig(directoryData) {
  return new Promise((resolve, reject) => {
    try {
      let product_file_name = md5('brand_config');
      let folder = md5(staticEncrypt(siteLocation));
      let fileExist = directoryData.filter((d) => d.Key.includes(product_file_name));
      if (fileExist.length > 0) {
        let url = `https://wlibrary.s3.eu-west-1.wasabisys.com/${folder}/${product_file_name}.txt?v=${new Date().getTime()}`;

        Axios.get(url).then((response) => {
          let product = JSON.parse(staticDecrypt(response));
          var basicPanelSettings = {
            title: product.TITLE,
            description: product.TITLE,
            language: product.LANGUAGE,
          };

          let ciphertext = encrypt(JSON.stringify(basicPanelSettings));

          localStorage.setItem('_basic', ciphertext);
          if (product.LANGUAGE !== undefined) {
            localStorage.setItem('panelLanguage', product.LANGUAGE);
            if (localStorage.getItem('I18N_LANGUAGE') !== null) {
              changeMyLanguage(localStorage.getItem('I18N_LANGUAGE'));
            } else if (localStorage.getItem('userLanguage') !== null) {
              changeMyLanguage(localStorage.getItem('userLanguage'));
            } else {
              changeMyLanguage(localStorage.getItem('panelLanguage'));
            }
          } else {
            if (localStorage.getItem('I18N_LANGUAGE') !== null) {
              changeMyLanguage(localStorage.getItem('I18N_LANGUAGE'));
            } else if (localStorage.getItem('userLanguage') !== null) {
              changeMyLanguage(localStorage.getItem('userLanguage'));
            } else {
              changeMyLanguage('en');
            }
          }

          var json = {
            mainLogoLight: product.LOGO_LIGHT,
            mainLogoDark: product.LOGO_DARK,
            iconLogo: product.LOGO_ICON,
            favicon: product.FAVICON,
            signup: product.SIGNUP,
            privacy: product.PRIVACY,
            terms: product.TERMS,
            greeting: product.GREETING,
            redeem: product.REDEEM,
          };

          let wlHash = encrypt(JSON.stringify(json));
          localStorage.setItem('_w', wlHash);
          localStorage.setItem('_gs_key', product.GSITEKEY);

          document.getElementById('favicon').setAttribute('href', json.favicon);
          document.getElementsByName('description')[0].setAttribute('content', product.TITLE);
          resolve();
        });
      } else {
        resolve();
      }
    } catch (error) {
      resolve();
    }
  });
}

export {
  checkWebsiteAuth,
  loadCustomLoadingIcon,
  loadStyle,
  loadVersion,
  loadLayout,
  loadProductVisibility,
  loadURLManager,
  loadPageMeta,
  checkMenuAvailability,
  loadBrandConfig,
  checkIfNewVersionAvailable,
  updateConfigMessage,
};
