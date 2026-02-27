import md5 from 'md5';
import { staticEncrypt } from '../../security';

const siteLocation = window.location.hostname;
import { checkMenuAvailability } from './helper';
import Axios from 'axios';

const MENU_COOKIE = {
  PROFILE: '_mnp',
  WABA: '_mnw',
  CRM: '_mnc',
  BOT_BUILDER: '_mnb',
  AUTOMATION: '_mna',
  HOME: '_mnh',
  VIRTUAL_NUMBER: '_mnv',
  WORKSPACE: '_mnwr',
};

function getPanelMenu(url) {
  return new Promise((resolve, reject) => {
    Axios.get(url)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function savePanelMenu(cookie_name, product_file_name) {
  let folder = md5(staticEncrypt(siteLocation));
  if (!checkMenuAvailability(`${folder}/${product_file_name}.txt`)) {
    //
  } else {
    let url = `https://wlibrary.s3.eu-west-1.wasabisys.com/${folder}/${product_file_name}.txt?hash=${new Date().getTime()}`;
    getPanelMenu(url)
      .then((data) => {
        localStorage.setItem(cookie_name, data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function getProfileMenu() {
  try {
    let product_file_name = md5(`MENU$PROFILE`);
    savePanelMenu(MENU_COOKIE['PROFILE'], product_file_name);
  } catch (error) {}
}

function getWabaMenu() {
  try {
    let product_file_name = md5('MENU$WABA');
    savePanelMenu(MENU_COOKIE['WABA'], product_file_name);
  } catch (error) {}
}

function getCRMMenu() {
  try {
    let product_file_name = md5('MENU$CRM');
    savePanelMenu(MENU_COOKIE['CRM'], product_file_name);
  } catch (error) {}
}

function getBotMenu() {
  try {
    let product_file_name = md5('MENU$BOT_BUILDER');
    savePanelMenu(MENU_COOKIE['BOT_BUILDER'], product_file_name);
  } catch (error) {}
}

function getAutomationMenu() {
  try {
    let product_file_name = md5('MENU$AUTOMATION');
    savePanelMenu(MENU_COOKIE['AUTOMATION'], product_file_name);
  } catch (error) {}
}

function getHomeMenu() {
  try {
    let product_file_name = md5('MENU$HOME');
    savePanelMenu(MENU_COOKIE['HOME'], product_file_name);
  } catch (error) {}
}

function getVNMenu() {
  try {
    let product_file_name = md5('MENU$VIRTUAL_NUMBER');
    savePanelMenu(MENU_COOKIE['VIRTUAL_NUMBER'], product_file_name);
  } catch (error) {}
}

function getWorkspaceMenu() {
  try {
    let product_file_name = md5('MENU$WORKSPACE');
    savePanelMenu(MENU_COOKIE['WORKSPACE'], product_file_name);
  } catch (error) {}
}

function loadAllMenu() {
  getProfileMenu();
  getWabaMenu();
  getCRMMenu();
  getBotMenu();
  getAutomationMenu();
  getHomeMenu();
  getVNMenu();
  getWorkspaceMenu();
}

export default loadAllMenu;
