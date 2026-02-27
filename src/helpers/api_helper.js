import axios from 'axios';
import config from '../config';
import FetchDeviceInfo from './fingerprint';
import { deleteIndexedDatabase } from './chat-db';

// default
axios.defaults.baseURL = config.API_URL;
// content type
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['Client-Type'] = localStorage.getItem('client_type') ?? 'webapp';
axios.defaults.headers.common['FCM-Token'] = localStorage.getItem('fcm_token') ?? '';
// axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";
// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    if (error.response.status === 401) {
      deleteIndexedDatabase()
        .then((_) => {})
        .catch((_) => {});
      localStorage.removeItem('authToken');
      window.location.href = '/login?expired=1';
      return;
    }
    switch (error.response.status) {
      case 500:
        message = 'Internal Server Error';
        break;
      case 401:
        message = 'Invalid credentials';
        break;
      case 404:
        message = 'Sorry! the data you are looking or could not be found';
        break;
      default:
        message = error;
    }
    return Promise.reject(message);
  }
);

/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = async (token) => {
  let device_info = await FetchDeviceInfo();
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  // axios.defaults.headers.common['env'] = 'dev';

  axios.defaults.headers.common['Request-Metadata'] = JSON.stringify({ did: device_info, addr: window.clientADR });
  axios.defaults.headers.common['Client-Type'] = localStorage.getItem('client_type') ?? 'webapp';
  axios.defaults.headers.common['FCM-Token'] = localStorage.getItem('fcm_token') ?? '';
};

const setRequestMeta = async () => {
  let device_info = await FetchDeviceInfo();
  axios.defaults.headers.common['Request-Metadata'] = JSON.stringify({ did: device_info, addr: window.clientADR });
  axios.defaults.headers.common['Client-Type'] = localStorage.getItem('client_type') ?? 'webapp';
  axios.defaults.headers.common['FCM-Token'] = localStorage.getItem('fcm_token') ?? '';
};

class APIClient {
  /**
   * Fetches data from given url
   */

  //  get = (url, params) => {
  //   return axios.get(url, params);
  // };
  get = (url, params) => {
    let response;

    let paramKeys = [];

    if (params) {
      Object.keys(params).map((key) => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      });

      const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : '';
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }

    return response;
  };
  /**
   * post given data to url
   */
  create = (url, data) => {
    axios.defaults.headers.common['Client-Type'] = localStorage.getItem('client_type') ?? 'webapp';
    return axios.post(url, data);
  };
  /**
   * Updates data
   */
  update = (url, data) => {
    return axios.put(url, data);
  };
  /**
   * Delete
   */
  delete = (url, config) => {
    return axios.delete(url, { ...config });
  };
}
const getLoggedinUser = () => {
  var user = localStorage.getItem('authToken');
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

const getUserToken = () => {
  var token = localStorage.getItem('authToken');
  if (!token) {
    return null;
  } else {
    return token;
  }
};

const getLoggedUser = () => {
  var userToken = localStorage.getItem('authToken');
  if (!userToken) {
    return null;
  } else {
    return userToken;
  }
};

const isTeamMember = () => {
  const teamMember = localStorage.getItem('teamMember');
  if (!teamMember) {
    return false;
  } else {
    return JSON.parse(teamMember);
  }
};

const userPermission = () => {
  const authPermission = localStorage.getItem('authPermission');
  if (!authPermission) {
    return null;
  } else {
    return JSON.parse(authPermission);
  }
};

export { APIClient, setAuthorization, setRequestMeta, getLoggedinUser, isTeamMember, userPermission, getLoggedUser, getUserToken };
