import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyD5LXFRxUL1OB6Ykq7xUPRjs9Sdc-6Oufs',
  authDomain: 'push-notification-com-bot.firebaseapp.com',
  projectId: 'push-notification-com-bot',
  storageBucket: 'push-notification-com-bot.firebasestorage.app',
  messagingSenderId: '906587622360',
  appId: '1:906587622360:web:67f17a2a9531c554bc40ad',
  measurementId: 'G-35QV18H15E',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Messaging service
export const messaging = getMessaging(app);
