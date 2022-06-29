/*
 * Copyright (c) 2022 Light Source Software, LLC. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

import net from 'net'
import { Duplex } from 'stream'

const { native } = import.meta

class TLSSocket extends Duplex {
  _native_read = native.read;
  _native_write = native.write;
  _native_connect = native.connect;

  constructor (socket, options) {
    super()

    if ('_tlsSocket' in socket) {
      throw Error('Socket already bound');
    }

    this._socket = socket;
    socket._tlsSocket = this;

    this.authorized = false;

    this._socket.on('connect', this.onconnect);
    this._socket.on('data', this.ondata);
    this._socket.on('error', this.onerror);
    this._socket.on('close', this.onclose);
    if (this._socket instanceof net.Socket) {
      this._socket.on('finish', this.onfinish);
    } else {
      this._socket.on('finish', this.onend);
    }
    this._socket.on('end', this.onend);

    // Native handle
    var secureContext = options.secureContext;
    if (!secureContext) {
      secureContext = createSecureContext(options);
    }

    native.TlsInit(this, options, secureContext);
    this._socketState = socket._socketState;

    const self = this;
    if (socket._writableState.ready && !options.isServer) {
      process.nextTick(() => {
        self._native_connect(options.servername || options.host || 'localhost');
        self._native_read(null);
      });
    }
  }

  connect (options, callback) {
    this._native_connect(options.servername || options.host || 'localhost');

    if (typeof callback === 'function') {
      this.on('secureConnect', callback);
    }

    this._socket.connect(options);
  }

  _write (chunk, callback, onwrite) {
    chunk = this._native_write(chunk);
    this._socket.write(chunk, callback);
    onwrite();
  }

  end (data, callback) {
    super.end(data, callback);
    this._socket.end();
  }

  destroy () {
    this._socket.destroy();
  }

  destroySoon () {
    this._socket.destroySoon();
  }

  onconnect () {
    this._tlsSocket._native_read(null);
  }

  encrypted () {
    return true;
  }

  address () {
    return this._socket.address();
  }

  localAddress () {
    return this._socket.address().address;
  }

  setTimeout (msecs, callback) {
    return this._socket.setTimeout(msecs, callback);
  }

  ondata (data) {
    this._tlsSocket._native_read(data);
  };

  onerror (error) {
    this._tlsSocket.emit('error', error);
  }

  onclose () {
    this._tlsSocket.emit('close');
  }

  onfinish () {
    this._tlsSocket.emit('finish');
  }

  onend () {
    this._tlsSocket.emit('end');
  }

  onwrite (data) {
    return this._socket.write(data);
  }

  onread (chunk) {
    this.emit('data', chunk);
  }

  onhandshakedone (error, authorized) {
    this.authorized = authorized;

    var server = this._server;

    if (error) {
      error = Error('handshake failed');

      if (server) {
        server.emit('tlsClientError', error, this);
      } else {
        this.emit('error', error);
      }
      this.end();
      return;
    }

    this._readyToWrite();

    if (server) {
      server.emit('secureConnection', this);
    } else {
      this.emit('secureConnect');
    }
  }
}

function tlsConnectionListener(rawSocket) {
  var tlsSocket = new TLSSocket(rawSocket, {
    isServer: true,
    secureContext: this._secureContext,
  });

  tlsSocket._server = this;
}

class Server extends net.Server {
  constructor (options, listener) {
    super(options, tlsConnectionListener)
    this._secureContext = createSecureContext(options);

    if (listener) {
      this.on('secureConnection', listener);
    }
  }
}

function createSecureContext(options) {
  return new native.TlsContext(options);
}

function createServer(options, secureConnectionListener) {
  return new Server(options, secureConnectionListener);
}

function connect(arg0, arg1, arg2, callback) {
  var options = {};
  if (typeof arg0 == 'object') {
    options = Object.create(arg0, {
      isServer: { value: false, enumerable: true },
    });
    options.host = options.host || 'localhost';
    options.port = options.port || 443;
    options.rejectUnauthorized = options.rejectUnauthorized || false;
    callback = arg1;
  } else if (typeof arg0 == 'number') {
    if (typeof arg1 == 'string') {
      if (typeof arg2 == 'object') {
        options = Object.create(arg2, {
          isServer: { value: false, enumerable: true },
        });
        options.port = arg0;
        options.host = arg1;
        options.rejectUnauthorized = options.rejectUnauthorized || false;
      } else {
        options = {
          isServer: false,
          rejectUnauthorized: false,
          port: arg0,
          host: arg1,
        };
        callback = arg2;
      }
    } else if (typeof arg1 == 'object') {
      options = Object.create(arg1, {
        isServer: { value: false, enumerable: true },
      });
      options.port = arg0;
      options.host = options.host || 'localhost';
      options.rejectUnauthorized = options.rejectUnauthorized || false;
      callback = arg2;
    } else {
      options = {
        isServer: false,
        rejectUnauthorized: false,
        host: 'localhost',
        port: arg0,
      };
      callback = arg1;
    }
  }

  var tlsSocket = new TLSSocket(options.socket || new net.Socket(), options);
  if (tlsSocket._socket instanceof net.Socket) {
    tlsSocket.connect(options, callback);
  } else if (typeof callback === 'function') {
    tlsSocket.on('secureConnect', callback);
  }

  return tlsSocket;
}

export {
  TLSSocket,
  Server,
  createSecureContext,
  createServer,
  connect,
}

export default {
  TLSSocket,
  Server,
  createSecureContext,
  createServer,
  connect,
}

/*
 * Contains code from the following projects:
 *
 * https://github.com/jerryscript-project/iotjs
 * Copyright 2015-present Samsung Electronics Co., Ltd. and other contributors
 *
 * https://github.com/nodejs/node
 * Copyright Node.js contributors. All rights reserved.
 * Copyright Joyent, Inc. and other Node contributors.
 *
 * See the veil LICENSE file for more information.
 */

