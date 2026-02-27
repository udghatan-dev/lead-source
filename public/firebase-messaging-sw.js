importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: 'AIzaSyD5LXFRxUL1OB6Ykq7xUPRjs9Sdc-6Oufs',
  authDomain: 'push-notification-com-bot.firebaseapp.com',
  projectId: 'push-notification-com-bot',
  storageBucket: 'push-notification-com-bot.firebasestorage.app',
  messagingSenderId: '906587622360',
  appId: '1:906587622360:web:67f17a2a9531c554bc40ad',
  measurementId: 'G-35QV18H15E',
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
    data: {
      click_action: payload.data?.click_action || 'https://google.com',
    },
  };

  if (localStorage.getItem('authToken')) {
    self.registration.showNotification(notificationTitle, notificationOptions);
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  let clickActionUrl = event.notification.data?.click_action;
  if (!clickActionUrl && event.notification.actions) {
    clickActionUrl = event.notification.actions[0]?.action;
  }
  if (!clickActionUrl) {
    clickActionUrl = 'https://google.com';
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url === clickActionUrl && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(clickActionUrl);
    })
  );
});
