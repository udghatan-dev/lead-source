import { call, put, takeEvery, all, fork } from 'redux-saga/effects';
import { AES, enc } from 'crypto-js';
// User Session Management
import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_WABA_MENU,
  GET_CRM_MENU,
  GET_HOME_MENU,
  GET_AUTOMATION_MENU,
  GET_VN_MENU,
  GET_WORKSPACE_MENU,
  GET_BOT_MENU,
  RESET_PANEL_MENU,
  GET_PROFILE_MENU,
} from './actionType';

const siteLocation = window.location.hostname;
import { panelMenuApiResponseSuccess, panelMenuApiResponseError } from './action';

//Include Both Helper File with needed methods
import { getPanelMenu as getPanelMenuApi } from '../../helpers/backend_helper';
import md5 from 'md5';
import { staticEncrypt } from '../../security';
import { checkMenuAvailability } from '../../helpers/panel/helper';

function* getProfileMenu({ payload: data }) {
  try {
    let product_file_name = md5('MENU$PROFILE');
    let folder = md5(staticEncrypt(siteLocation));

    if (!checkMenuAvailability(`${folder}/${product_file_name}.txt`)) {
      yield put(panelMenuApiResponseSuccess(GET_PROFILE_MENU, []));
    } else {
      const response = yield call(getPanelMenuApi, {
        url: `https://wlibrary.s3.eu-west-1.wasabisys.com/${folder}/${product_file_name}.txt?hash=${new Date().getTime()}`,
      });
      yield put(panelMenuApiResponseSuccess(GET_PROFILE_MENU, response));
    }
  } catch (error) {
    yield put(panelMenuApiResponseError(GET_PROFILE_MENU, error));
  }
}

function* getWabaMenu({ payload: data }) {
  try {
    let product_file_name = md5('MENU$WABA');
    let folder = md5(staticEncrypt(siteLocation));

    if (!checkMenuAvailability(`${folder}/${product_file_name}.txt`)) {
      yield put(panelMenuApiResponseSuccess(GET_WABA_MENU, []));
    } else {
      const response = yield call(getPanelMenuApi, {
        url: `https://wlibrary.s3.eu-west-1.wasabisys.com/${folder}/${product_file_name}.txt?hash=${new Date().getTime()}`,
      });
      yield put(panelMenuApiResponseSuccess(GET_WABA_MENU, response));
    }
  } catch (error) {
    yield put(panelMenuApiResponseError(GET_WABA_MENU, error));
  }
}

function* getCRMMenu({ payload: data }) {
  try {
    let product_file_name = md5('MENU$CRM');
    let folder = md5(staticEncrypt(siteLocation));

    if (!checkMenuAvailability(`${folder}/${product_file_name}.txt`)) {
      yield put(panelMenuApiResponseSuccess(GET_CRM_MENU, []));
    } else {
      const response = yield call(getPanelMenuApi, {
        url: `https://wlibrary.s3.eu-west-1.wasabisys.com/${folder}/${product_file_name}.txt?hash=${new Date().getTime()}`,
      });
      yield put(panelMenuApiResponseSuccess(GET_CRM_MENU, response));
    }
  } catch (error) {
    yield put(panelMenuApiResponseError(GET_CRM_MENU, error));
  }
}

function* getBotMenu({ payload: data }) {
  try {
    let product_file_name = md5('MENU$BOT_BUILDER');
    let folder = md5(staticEncrypt(siteLocation));

    if (!checkMenuAvailability(`${folder}/${product_file_name}.txt`)) {
      yield put(panelMenuApiResponseSuccess(GET_BOT_MENU, []));
    } else {
      const response = yield call(getPanelMenuApi, {
        url: `https://wlibrary.s3.eu-west-1.wasabisys.com/${folder}/${product_file_name}.txt?hash=${new Date().getTime()}`,
      });
      yield put(panelMenuApiResponseSuccess(GET_BOT_MENU, response));
    }
  } catch (error) {
    yield put(panelMenuApiResponseError(GET_BOT_MENU, error));
  }
}

function* getAutomationMenu({ payload: data }) {
  try {
    let product_file_name = md5('MENU$AUTOMATION');
    let folder = md5(staticEncrypt(siteLocation));

    if (!checkMenuAvailability(`${folder}/${product_file_name}.txt`)) {
      yield put(panelMenuApiResponseSuccess(GET_AUTOMATION_MENU, []));
    } else {
      const response = yield call(getPanelMenuApi, {
        url: `https://wlibrary.s3.eu-west-1.wasabisys.com/${folder}/${product_file_name}.txt?hash=${new Date().getTime()}`,
      });
      yield put(panelMenuApiResponseSuccess(GET_AUTOMATION_MENU, response));
    }
  } catch (error) {
    yield put(panelMenuApiResponseError(GET_AUTOMATION_MENU, error));
  }
}

function* getHomeMenu({ payload: data }) {
  try {
    let product_file_name = md5('MENU$HOME');
    let folder = md5(staticEncrypt(siteLocation));

    if (!checkMenuAvailability(`${folder}/${product_file_name}.txt`)) {
      yield put(panelMenuApiResponseSuccess(GET_HOME_MENU, []));
    } else {
      const response = yield call(getPanelMenuApi, {
        url: `https://wlibrary.s3.eu-west-1.wasabisys.com/${folder}/${product_file_name}.txt?hash=${new Date().getTime()}`,
      });
      yield put(panelMenuApiResponseSuccess(GET_HOME_MENU, response));
    }
  } catch (error) {
    yield put(panelMenuApiResponseError(GET_HOME_MENU, error));
  }
}

function* getVNMenu({ payload: data }) {
  try {
    let product_file_name = md5('MENU$VIRTUAL_NUMBER');
    let folder = md5(staticEncrypt(siteLocation));

    if (!checkMenuAvailability(`${folder}/${product_file_name}.txt`)) {
      yield put(panelMenuApiResponseSuccess(GET_VN_MENU, []));
    } else {
      const response = yield call(getPanelMenuApi, {
        url: `https://wlibrary.s3.eu-west-1.wasabisys.com/${folder}/${product_file_name}.txt?hash=${new Date().getTime()}`,
      });
      yield put(panelMenuApiResponseSuccess(GET_VN_MENU, response));
    }
  } catch (error) {
    yield put(panelMenuApiResponseError(GET_VN_MENU, error));
  }
}

function* getWorkspaceMenu({ payload: data }) {
  try {
    let product_file_name = md5('MENU$WORKSPACE');
    let folder = md5(staticEncrypt(siteLocation));

    if (!checkMenuAvailability(`${folder}/${product_file_name}.txt`)) {
      yield put(panelMenuApiResponseSuccess(GET_WORKSPACE_MENU, []));
    } else {
      const response = yield call(getPanelMenuApi, {
        url: `https://wlibrary.s3.eu-west-1.wasabisys.com/${folder}/${product_file_name}.txt?hash=${new Date().getTime()}`,
      });
      yield put(panelMenuApiResponseSuccess(GET_WORKSPACE_MENU, response));
    }
  } catch (error) {
    yield put(panelMenuApiResponseError(GET_WORKSPACE_MENU, error));
  }
}

export function* watchGetProfileMenu() {
  yield takeEvery(GET_PROFILE_MENU, getProfileMenu);
}

export function* watchGetWabaMenu() {
  yield takeEvery(GET_WABA_MENU, getWabaMenu);
}

export function* watchGetCrmMenu() {
  yield takeEvery(GET_CRM_MENU, getCRMMenu);
}

export function* watchGetBotMenu() {
  yield takeEvery(GET_BOT_MENU, getBotMenu);
}

export function* watchGetAutomationMenu() {
  yield takeEvery(GET_AUTOMATION_MENU, getAutomationMenu);
}

export function* watchGetHomeMenu() {
  yield takeEvery(GET_HOME_MENU, getHomeMenu);
}

export function* watchGetVNMenu() {
  yield takeEvery(GET_VN_MENU, getVNMenu);
}

export function* watchGetWorkspaceMenu() {
  yield takeEvery(GET_WORKSPACE_MENU, getWorkspaceMenu);
}

function* PanelMenuSaga() {
  yield all([
    fork(watchGetProfileMenu),
    fork(watchGetWabaMenu),
    fork(watchGetCrmMenu),
    fork(watchGetBotMenu),
    fork(watchGetAutomationMenu),
    fork(watchGetHomeMenu),
    fork(watchGetVNMenu),
    fork(watchGetWorkspaceMenu),
  ]);
}

export default PanelMenuSaga;
