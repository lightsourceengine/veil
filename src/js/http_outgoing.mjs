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

import { Writable } from 'stream'

class OutgoingMessage extends Writable {
  writable = true;
  _hasBody = true;
  finished = false;
  _sentHeader = false;
  _connected = false;
  // storage for chunks when there is no connection established
  _chunks = [];
  socket = null;
  // response header string : same 'content' as this._headers
  _header = null;
  // response header obj : (key, value) pairs
  _headers = {};

  end (data, encoding, callback) {
    if (typeof data === 'function') {
      callback = data;
      data = null;
    } else if (typeof encoding === 'function') {
      callback = encoding;
      encoding = null;
    }

    if (this.finished) {
      return false;
    }

    // flush header
    if (!this._header) {
      this._implicitHeader();
    }

    if (data) {
      this.write(data, encoding);
    }

    // Register finish event handler.
    if (typeof callback === 'function') {
      this.once('finish', callback);
    }

    // Force flush buffered data.
    // After all data was sent, emit 'finish' event meaning segment of header and
    // body were all sent finished. This means different from 'finish' event
    // emitted by net which indicate there will be no more data to be sent through
    // the connection. On the other hand emitting 'finish' event from http does
    // not neccessarily imply end of data transmission since there might be
    // another segment of data when connection is 'Keep-Alive'.
    this._send('', () => this.emit('finish'));


    this.finished = true;

    this.emit('prefinish');

    return true;
  }


  // This sends chunk directly into socket
  _send (chunk, encoding, callback) {
    if (typeof encoding === 'function') {
      callback = encoding;
    }

    if (!this._sentHeader) {
      this._chunks.push(this._header + '\r\n');
      this._sentHeader = true;
    }

    if (!this._connected) {
      this._chunks.push(chunk);
      return false;
    } else {
      while (this._chunks.length) {
        this.socket.write(this._chunks.shift(), encoding, callback);
      }
    }

    if (this.socket) {
      return this.socket.write(chunk, encoding, callback);
    }

    return false;
  }

  write (chunk, encoding, callback) {
    if (!this._header) {
      this._implicitHeader();
    }

    if (!this._hasBody) {
      return true;
    }

    return this._send(chunk, encoding, callback);
  }


  // Stringfy header fields of _headers into _header
  _storeHeader (statusLine) {
    let headerStr = '';

    if (this._headers) {
      for (const key of Object.keys(this._headers)) {
        headerStr += key + ': ' + this._headers[key] + '\r\n';
      }
    }

    this._header = statusLine + headerStr;
  }

  setHeader (name, value) {
    if (typeof name !== 'string') {
      throw new TypeError('Name must be string.');
    }

    if (value === null || value === undefined) {
      throw new Error('value required in setHeader(' + name + ', value)');
    }

    if (this._headers === null) {
      this._headers = {};
    }

    this._headers[name.toLowerCase()] = value;
  }

  removeHeader (name) {
    if (this._headers !== null) {
      delete this._headers[name];
    }
  }

  getHeader (name) {
    return this._headers[name];
  }

  setTimeout (ms, cb) {
    if (cb) {
      this.once('timeout', cb);
    }

    if (!this.socket) {
      this.once('socket', (socket) => socket.setTimeout(ms));
    } else {
      this.socket.setTimeout(ms);
    }
  }
}

export { OutgoingMessage }
export default OutgoingMessage

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
