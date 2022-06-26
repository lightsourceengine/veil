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

import util from 'util'
import stream from 'stream'

function IncomingMessage(socket) {
  stream.Readable.call(this);

  this.socket = socket;

  this.readable = true;

  this.headers = {};

  this.complete = false;

  // for request (server)
  this.url = '';
  this.method = null;
  this.httpVersion = '';

  // for response (client)
  this.statusCode = null;
  this.statusMessage = null;

}

util.inherits(IncomingMessage, stream.Readable);


IncomingMessage.prototype.read = function(n) {
  this.read = stream.Readable.prototype.read;
  return this.read(n);
};


IncomingMessage.prototype.addHeaders = function(headers) {
  if (!this.headers) {
    this.headers = {};
  }

  // FIXME: handle headers as array if array C API is done.
  for (var i=0; i<headers.length; i=i+2) {
    this.headers[headers[i]] = headers[i+1];
  }
};


IncomingMessage.prototype.setTimeout = function(ms, cb) {
  if (cb)
    this.once('timeout', cb);
  this.socket.setTimeout(ms, cb);
};

export { IncomingMessage }
export default IncomingMessage

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
