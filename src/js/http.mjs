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
import { ClientRequest } from 'http_client'
import { IncomingMessage } from 'http_incoming'
import HTTPParser from 'http_parser'
import HTTPServer, { ServerResponse } from 'http_server'

const request = (options, cb) => {
  // Create socket.
  var socket = new net.Socket();
  options.port = options.port || 80;

  return new ClientRequest(options, cb, socket);
};

class Server extends net.Server {
  constructor (options, requestListener) {
    super({allowHalfOpen: true}, HTTPServer.connectionListener)

    HTTPServer.initServer.call(this, options, requestListener);
  }

  setTimeout (ms, cb) {
    this.timeout = ms;
    cb && this.on('timeout', cb);
  }
}

const createServer = (options, requestListener) => {
  return new Server(options, requestListener);
};

const METHODS = HTTPParser.methods;

const get = (options, cb) => {
  var req = request(options, cb);
  req.end();
  return req;
};

export {
  get,
  METHODS,
  createServer,
  Server,
  request,
  ClientRequest,
  IncomingMessage,
  ServerResponse
}

export default {
  get,
  METHODS,
  createServer,
  Server,
  request,
  ClientRequest,
  IncomingMessage,
  ServerResponse
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
