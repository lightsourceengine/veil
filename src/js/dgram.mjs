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

import EventEmitter from 'events'
import { errnoException, exceptionWithHostPort } from 'util'
import Udp from 'udp'
import dns from 'dns'

var BIND_STATE_UNBOUND = 0;
var BIND_STATE_BINDING = 1;
var BIND_STATE_BOUND = 2;

function lookup(address, family, callback) {
  return dns.lookup(address, family, callback);
}


function lookup4(address, callback) {
  return lookup(address || '0.0.0.0', 4, callback);
}


function newHandle(type) {
  if (type === 'udp4') {
    var handle = new Udp();
    handle.lookup = lookup4;
    return handle;
  }

  throw new Error('Bad socket type specified. Valid types are: udp4');
}

class Socket extends EventEmitter {
  constructor (type, listener) {
    super()

    let options;

    if (type !== null && typeof type === 'object') {
      options = type;
      type = options.type;
    }

    const handle = newHandle(type);
    handle.owner = this;

    this._handle = handle;
    this._receiving = false;
    this._bindState = BIND_STATE_UNBOUND;
    this.type = type;
    this.fd = null; // compatibility hack

    // If true - UV_UDP_REUSEADDR flag will be set
    this._reuseAddr = options?.reuseAddr;

    if (typeof listener === 'function')
      this.on('message', listener);
  }

  bind (port, address, callback) {
    this._healthCheck();

    if (this._bindState !== BIND_STATE_UNBOUND)
      throw new Error('Socket is already bound');

    this._bindState = BIND_STATE_BINDING;

    if (typeof port === 'function') {
      callback = port;
      port = 0;
      address = '';
    } else if (port !== null && typeof port === 'object') {
      callback = address;
      address = port.address || '';
      port = port.port;
    } else if (typeof address === 'function') {
      callback = address;
      address = '';
    }

    if (typeof callback === 'function')
      this.once('listening', callback);

    // defaulting address for bind to all interfaces
    if (!address && this._handle.lookup === lookup4) {
      address = '0.0.0.0';
    }

    // resolve address first
    this._handle.lookup(address, (err, ip) => {
      if (err) {
        this._bindState = BIND_STATE_UNBOUND;
        this.emit('error', err);
        return;
      }

      if (!this._handle)
        return; // handle has been closed in the mean time

      this._handle._reuseAddr = this._reuseAddr;

      err = this._handle.bind(ip, port | 0);
      if (err) {
        const ex = exceptionWithHostPort(err, 'bind', ip, port);
        this.emit('error', ex);
        this._bindState = BIND_STATE_UNBOUND;
        // Todo: close?
        return;
      }

      startListening(this);
    });

    return this;
  }


  // thin wrapper around `send`, here for compatibility with dgram_legacy.js
  sendto (buffer, offset, length, port, address,
                                     callback) {
    if (typeof offset !== 'number' || typeof length !== 'number')
      throw new Error('send takes offset and length as args 2 and 3');

    if (typeof address !== 'string')
      throw new Error(this.type + ' sockets must send to port, address');

    this.send(buffer, offset, length, port, address, callback);
  }

  // valid combinations
  // send(buffer, offset, length, port, address, callback)
  // send(buffer, offset, length, port, address)
  // send(buffer, offset, length, port)
  // send(bufferOrList, port, address, callback)
  // send(bufferOrList, port, address)
  // send(bufferOrList, port)
  send (buffer, offset, length, port, address, callback) {
    const self = this;
    let list;

    if (address || (port && typeof port !== 'function')) {
      buffer = sliceBuffer(buffer, offset, length);
    } else {
      callback = port;
      port = offset;
      address = length;
    }

    if (!Array.isArray(buffer)) {
      if (typeof buffer === 'string') {
        list = [new Buffer(buffer)];
      } else if (!Buffer.isBuffer(buffer)) {
        throw new TypeError('First argument must be a buffer or a string');
      } else {
        list = [buffer];
      }
    } else if (!(list = fixBufferList(buffer))) {
      throw new TypeError('Buffer list arguments must be buffers or strings');
    }

    port = port | 0;

    if (port === 0 || port > 65535)
      throw new RangeError('Port should be > 0 and < 65536');

    // Normalize callback so it's either a function or undefined but not anything
    // else.
    if (typeof callback !== 'function')
      callback = undefined;

    self._healthCheck();

    if (self._bindState === BIND_STATE_UNBOUND)
      self.bind(0, null);

    if (list.length === 0)
      list.push(new Buffer(0));

    // If the socket hasn't been bound yet, push the outbound packet onto the
    // send queue and send after binding is complete.
    if (self._bindState !== BIND_STATE_BOUND) {
      enqueue(self, self.send.bind(self, list, port, address, callback));
      return;
    }

    self._handle.lookup(address, (ex, ip) => doSend(ex, self, ip, list, address, port, callback));
  }

  close (callback) {
    if (typeof callback === 'function')
      this.on('close', callback);

    if (this._queue) {
      this._queue.push(this.close.bind(this));
      return this;
    }

    this._healthCheck();
    this._stopReceiving();
    this._handle.close();
    this._handle = null;
    process.nextTick(() => this.emit('close'));

    return this;
  }


  address () {
    this._healthCheck();

    const out = {};
    const err = this._handle.getsockname(out);

    if (err) {
      throw errnoException(err, 'getsockname');
    }

    return out;
  }

  setBroadcast (arg) {
    const err = this._handle.configure(configTypes.BROADCAST, arg ? 1 : 0);
    if (err) {
      throw errnoException(err, 'setBroadcast');
    }
  }

  setTTL (arg) {
    if (typeof arg !== 'number') {
      throw new TypeError('Argument must be a number');
    }

    const err = this._handle.configure(configTypes.TTL, arg);
    if (err) {
      throw errnoException(err, 'setTTL');
    }

    return arg;
  }

  setMulticastTTL = function(arg) {
    if (typeof arg !== 'number') {
      throw new TypeError('Argument must be a number');
    }

    const err = this._handle.configure(configTypes.MULTICASTTTL, arg);
    if (err) {
      throw errnoException(err, 'setMulticastTTL');
    }

    return arg;
  }

  setMulticastLoopback (arg) {
    const err = this._handle.configure(configTypes.MULTICASTLOOPBACK,
                                     arg ? 1 : 0);
    if (err) {
      throw errnoException(err, 'setMulticastLoopback');
    }

    return arg; // 0.4 compatibility
  }


  addMembership (multicastAddress, interfaceAddress) {
    this._healthCheck();

    if (!multicastAddress) {
      throw new Error('multicast address must be specified');
    }

    const err = this._handle.addMembership(multicastAddress, interfaceAddress);
    if (err) {
      throw errnoException(err, 'addMembership');
    }
  }

  dropMembership (multicastAddress, interfaceAddress) {
    this._healthCheck();

    if (!multicastAddress) {
      throw new Error('multicast address must be specified');
    }

    const err = this._handle.dropMembership(multicastAddress, interfaceAddress);
    if (err) {
      throw errnoException(err, 'dropMembership');
    }
  }

  _healthCheck () {
    if (!this._handle)
      throw new Error('Not running'); // error message from dgram_legacy.js
  }

  _stopReceiving () {
    if (!this._receiving)
      return;

    this._handle.recvStop();
    this._receiving = false;
    this.fd = null; // compatibility hack
  }
}

const createSocket = (type, listener) => {
  return new Socket(type, listener);
};


function startListening(socket) {
  socket._handle.onmessage = onMessage;
  // Todo: handle errors
  socket._handle.recvStart();
  socket._receiving = true;
  socket._bindState = BIND_STATE_BOUND;
  socket.fd = -42; // compatibility hack

  socket.emit('listening');
}


function sliceBuffer(buffer, offset, length) {
  if (typeof buffer === 'string')
    buffer = new Buffer(buffer);
  else if (!Buffer.isBuffer(buffer))
    throw new TypeError('First argument must be a buffer or string');

  offset = offset | 0;
  length = length | 0;

  return buffer.slice(offset, offset + length);
}


function fixBufferList(list) {
  const { length } = list
  const newlist = new Array(length);

  for (let i = 0, l = length; i < l; i++) {
    const buf = list[i];
    if (typeof buf === 'string')
      newlist[i] = new Buffer(buf);
    else if (!Buffer.isBuffer(buf))
      return null;
    else
      newlist[i] = buf;
  }

  return newlist;
}


function enqueue(self, toEnqueue) {
  // If the send queue hasn't been initialized yet, do it, and install an
  // event handler that flushes the send queue after binding is done.
  if (!self._queue) {
    self._queue = [];
    self.once('listening', clearQueue);
  }
  self._queue.push(toEnqueue);
}


function clearQueue() {
  const queue = this._queue;
  this._queue = undefined;

  // Flush the send queue.
  for (let i = 0; i < queue.length; i++)
    queue[i]();
}


function doSend(ex, self, ip, list, address, port, callback) {
  if (ex) {
    if (typeof callback === 'function') {
      callback(ex);
      return;
    }

    self.emit('error', ex);
    return;
  } else if (!self._handle) {
    return;
  }

  var buf = Buffer.concat(list);

  var err = self._handle.send(buf, port, ip, function(err, length) {
    if (err) {
      err = exceptionWithHostPort(err, 'send', address, port);
    } else {
      err = null;
    }

    if (typeof callback === 'function') {
      callback(err, length);
    }
  });

  if (err && callback) {
    // don't emit as error, dgram_legacy.js compatibility
    ex = exceptionWithHostPort(err, 'send', address, port);
    process.nextTick(callback, ex);
  }
}


// These object represents the different config types that
// this._handle.configure can do.
// The order of these must match the order in the udp C module.
var configTypes = {
  BROADCAST: 0,
  TTL: 1,
  MULTICASTTTL: 2,
  MULTICASTLOOPBACK: 3,
};


function onMessage(nread, handle, buf, rinfo) {
  var self = handle.owner;
  if (nread < 0) {
    return self.emit('error', errnoException(nread, 'recvmsg'));
  }

  rinfo.size = buf.length; // compatibility
  self.emit('message', buf, rinfo);
}


/*
TODO: Implement Socket.prototype.ref.

Socket.prototype.ref = function() {
  if (this._handle)
    this._handle.ref();

  return this;
};
*/


/*
TODO: Implement Socket.prototype.unref.

Socket.prototype.unref = function() {
  if (this._handle)
    this._handle.unref();

  return this;
};
*/

export {
  Socket,
  createSocket
}

export default {
  Socket,
  createSocket
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
