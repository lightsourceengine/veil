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

import { Readable } from 'stream'

class IncomingMessage extends Readable {
  readable = true;
  headers = {};
  complete = false;
  // for request (server)
  url = '';
  method = null;
  httpVersion = '';
  // for response (client)
  statusCode = null;
  statusMessage = null;
  socket = null

  constructor (socket) {
    super()
    this.socket = socket;
  }

  addHeaders (headers) {
    if (!this.headers) {
      this.headers = {};
    }

    // FIXME: handle headers as array if array C API is done.
    for (var i=0; i<headers.length; i=i+2) {
      this.headers[headers[i]] = headers[i+1];
    }
  }

  setTimeout (ms, cb) {
    if (cb)
      this.once('timeout', cb);
    this.socket.setTimeout(ms, cb);
  }
}

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
