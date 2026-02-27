import axios from 'axios';
import io from 'socket.io-client';
import { EventEmitter } from 'events';
import { AGENT_TRACKING_SOCKET_TOKEN } from './url_helpers';

class Socket {
  constructor() {
    this.token;
    this.socket;
    this.eventEmitter = new EventEmitter();
    this.socketConnected = false;
    this.generateLoginToken();
  }

  static getInstance() {
    if (!Socket.instance) {
      Socket.instance = new Socket();
    }
    return Socket.instance;
  }

  generateLoginToken() {
    if (this.socket) {
      return this.socket;
    } else {
      axios
        .get(AGENT_TRACKING_SOCKET_TOKEN)
        .then((response) => {
          if (response.success) {
            this.token = response.data;
            this.connect();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  connect() {
    this.socket = io('https://dept-wsocket.1automations.com', {
      //this.socket = io('http://localhost:9014', {
      extraHeaders: {
        Authorization: this.token,
      },
    });

    this.socket.on('connect', () => {
      this.socketConnected = true;
      this.eventEmitter.emit('connected');
    });
  }
}

export default Socket;
