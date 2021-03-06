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

import { format } from 'util'
import { IncomingMessage } from 'http_incoming'
import { OutgoingMessage } from 'http_outgoing'
import { createHTTPParser } from 'http_common'
import HTTPParser from 'http_parser'

// RFC 7231 (http://tools.ietf.org/html/rfc7231#page-49)
const STATUS_CODES = {
  100: 'Continue',
  101: 'Switching Protocols',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Large',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  426: 'Upgrade Required',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Time-out',
  505: 'HTTP Version Not Supported',
};

class ServerResponse extends OutgoingMessage {
  // default status code : 200
  statusCode = 200;
  statusMessage = undefined;
  _hasBody = true

  constructor (req) {
    super()
    // response to HEAD method has no body
    if (req.method === 'HEAD') this._hasBody = false;
  }

  // if user does not set Header before write(..),
  // this function set default header(200).
  _implicitHeader () {
    this.writeHead(this.statusCode, this.statusMessage);
  }

  writeHead (statusCode, reason, obj) {
    if (typeof reason === 'string') {
      this.statusMessage = reason;
    } else {
      this.statusMessage = STATUS_CODES[statusCode] || 'unknown';
      obj = reason;
    }

    var statusLine = format('HTTP/1.1 %s %s\r\n',
      statusCode.toString(),
      this.statusMessage);

    this.statusCode = statusCode;

    // HTTP response without body
    if (statusCode === 204 || statusCode === 304 ||
      (100 <= statusCode && statusCode <= 199)) {
      this._hasBody = false;
    }

    if (obj !== null && typeof obj === 'object') {
      if (!this._headers) {
        this._headers = {};
      }
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          this._headers[key] = obj[key];
        }
      }
    }

    this._storeHeader(statusLine);
  }

  assignSocket (socket) {
    this._connected = true;
    socket._httpMessage = this;
    this.socket = socket;
    socket.on('close', () => socket._httpMessage?.emit('close'));
    this.emit('socket', socket);
  }

  detachSocket () {
    this.socket._httpMessage = null;
    this.socket = null;
    this._connected = false;
  };
}

function initServer(options, requestListener) {
  if (typeof options === 'function') {
    requestListener = options;
  }

  if (typeof options !== 'object') {
    options = {};
  }

  if (typeof requestListener === 'function') {
    this.addListener('request', requestListener);
  }

  this._IncomingMessage = options.IncomingMessage || IncomingMessage;
  this._ServerResponse = options.ServerResponse || ServerResponse;
  this.httpAllowHalfOpen = false;

  this.on('clientError', function(err, conn) {
    conn.destroy(err);
  });

  this.timeout = 2 * 1000 * 60; // default timeout is 2 min
}

function connectionListener(socket) {
  var server = this;

  // cf) In Node.js, freelist returns a new parser.
  // parser initialize
  var parser = createHTTPParser(HTTPParser.REQUEST);
  parser._headers = [];
  parser._url = '';

  parser.onIncoming = parserOnIncoming;
  parser._IncomingMessage = server._IncomingMessage;

  parser.socket = socket;
  parser.incoming = null;
  socket.parser = parser;

  socket.on('data', socketOnData);
  socket.on('end', socketOnEnd);
  socket.on('close', socketOnClose);
  socket.on('timeout', socketOnTimeout);
  socket.on('error', socketOnError);

  if (server.timeout) {
    socket.setTimeout(server.timeout);
  }
}

function socketOnData(data) {
  var socket = this;

  // Begin parsing
  var ret = socket.parser.execute(data);

  if (ret instanceof Error) {
    socket.destroy();
  }
}


function socketOnEnd() {
  var socket = this;
  var server = socket._server;
  var ret = socket.parser.finish();

  if (ret instanceof Error) {
    socket.destroy();
    return;
  }

  socket.parser = null;

  if (!server.httpAllowHalfOpen && socket._socketState.writable) {
    socket.end();
  }
}


function socketOnClose() {
  var socket = this;

  if (socket.parser) {
    socket.parser = null;
  }
}


function socketOnTimeout() {
  var socket = this;
  var server = socket._server;

  var serverTimeout = server.emit('timeout', socket);
  var req = socket.parser && socket.parser.incoming;
  var reqTimeout = req && !req.complete && req.emit('timeout', socket);
  var res = socket._httpMessage;
  var resTimeout = res && res.emit('timeout', socket);

  // if user doesn't provide timeout handler, kill socket.
  // otherwise, user cb must take care of timeouted socket.
  if (!serverTimeout && !reqTimeout && !resTimeout) {
    socket.destroy();
  }
}


function socketOnError(err) {
  var socket = this;
  var server = socket._server;

  server.emit('clientError', err, socket);
}


// This is called by parserOnHeadersComplete after req header is parsed.
// TODO: keepalive support
function parserOnIncoming(req/* , shouldKeepAlive */) {
  var socket = req.socket;
  var server = socket._server;

  var res = new server._ServerResponse(req);
  res.assignSocket(socket);
  res.on('prefinish', resOnFinish);

  server.emit('request', req, res);

  // In server, HTTPParser determines whether body should be parsed or not.
  // It is fine to return false
  return false;
}


// This cb is called when response ended
// (res.end emits 'prefinish' event)
function resOnFinish() {
  var res = this;
  var socket = res.socket;

  res.detachSocket();

  // cf) In Node, ConnectionListener has a list of incoming msgs.
  socket.destroySoon();
}

export {
  connectionListener,
  initServer,
  ServerResponse,
  STATUS_CODES
}

export default {
  connectionListener,
  initServer,
  ServerResponse,
  STATUS_CODES
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
