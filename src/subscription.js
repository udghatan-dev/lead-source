import axios from 'axios';
import UserAgent from 'user-agents';
import CustomNotification from './Components/Common/CustomNotification';

const Agent = new UserAgent();
const BASE_URL = `https://mapi.1automations.com/api/v2/crm`;
//const BASE_URL = `http://localhost:9010/api/v2/crm`;

function sendSubscription(subscription) {
  return new Promise((resolve, reject) => {
    var deviceAgent = JSON.parse(JSON.stringify(Agent.data, null, 2));
    axios({
      url: `${BASE_URL}/notification`,
      method: 'POST',
      data: JSON.stringify({
        subscription: subscription,
        device: deviceAgent,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
}

function sendUnSubscription(auth) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${BASE_URL}/notification`,
      method: 'DELETE',
      data: JSON.stringify({
        token: auth,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
}

function checkDeviceSubscription(auth) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${BASE_URL}/notification/${auth}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
}

export function subscribeUser() {
  return new Promise((resolve, reject) => {
    try {
      CustomNotification.success('Processing Your Request...');
      sendSubscription({
        token: window.notificationToken,
        channel: 'fcm',
      })
        .then((response) => {
          CustomNotification.success('Push Notification Enabled Successfully');
          resolve();
        })
        .catch((error) => {
          CustomNotification.error(error);
          reject();
        });
    } catch (error) {
      reject();
    }
  });
}

export function unsubscribeUser() {
  return new Promise((resolve, reject) => {
    sendUnSubscription(window.notificationToken)
      .then((response) => {
        CustomNotification.success('Push notification disabled for this device');
        resolve();
      })
      .catch((error) => {
        CustomNotification.error(error);
        reject();
      });
  });
}

export function checkSubscription() {
  return new Promise(async (resolve, reject) => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'denied') {
        reject();
      } else {
        checkDeviceSubscription(window.notificationToken)
          .then((response) => {
            if (response.success) {
              resolve();
            } else {
              reject();
            }
          })
          .catch((error) => {
            reject();
          });
      }
    } else {
      reject();
    }
  });
}
