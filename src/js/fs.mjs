/* Copyright 2015-present Samsung Electronics Co., Ltd. and other contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import util, { promisify } from 'util'
import constants from 'constants'
import stream from 'stream'

const fsBuiltin = import.meta.native;

const exists = (path, callback) =>  {
  if (!(util.isString(path)) && !(util.isBuffer(path))) {
    throw new TypeError('Path should be a string or a buffer');
  }
  if (!path || !path.length) {
    process.nextTick(function() {
      if (callback) callback(false);
    });
    return;
  }

  var cb = function(err/* , stat */) {
    if (callback) callback(err ? false : true);
  };

  fsBuiltin.stat(checkArgString(path, 'path'),
                 checkArgFunction(cb, 'callback'));
};


const existsSync = (path) =>  {
  if (!path || !path.length) {
    return false;
  }

  try {
    fsBuiltin.stat(checkArgString(path, 'path'));
    return true;
  } catch (e) {
    return false;
  }
};


const stat = (path, callback) =>  {
  fsBuiltin.stat(checkArgString(path, 'path'),
                 checkArgFunction(callback, 'callback'));
};


const statSync = (path) =>  {
  return fsBuiltin.stat(checkArgString(path, 'path'));
};


const fstat = (fd, callback) =>  {
  fsBuiltin.fstat(checkArgNumber(fd, 'fd'),
                  checkArgFunction(callback, 'callback'));
};


const fstatSync = (fd) =>  {
  return fsBuiltin.fstat(checkArgNumber(fd, 'fd'));
};


const close = (fd, callback) =>  {
  fsBuiltin.close(checkArgNumber(fd, 'fd'),
                  checkArgFunction(callback, 'callback'));
};


const closeSync = (fd) =>  {
  fsBuiltin.close(checkArgNumber(fd, 'fd'));
};


const open = (...args) =>  {
  // TODO: arg parsing does not seem correct!
  const [path, flags, mode/*, callback*/] = args

  fsBuiltin.open(checkArgString(path, 'path'),
                 convertFlags(flags),
                 convertMode(mode, 438),
                 checkArgFunction(args[args.length - 1]), 'callback');
};


const openSync = (path, flags, mode) =>  {
  return fsBuiltin.open(checkArgString(path, 'path'),
                        convertFlags(flags),
                        convertMode(mode, 438));
};


const read = (fd, buffer, offset, length, position, callback) =>  {
  if (util.isNullOrUndefined(position)) {
    position = -1; // Read from the current position.
  }

  callback = checkArgFunction(callback, 'callback');

  var cb = function(err, bytesRead) {
    callback(err, bytesRead || 0, buffer);
  };

  return fsBuiltin.read(checkArgNumber(fd, 'fd'),
                        checkArgBuffer(buffer, 'buffer'),
                        checkArgNumber(offset, 'offset'),
                        checkArgNumber(length, 'length'),
                        checkArgNumber(position, 'position'),
                        cb);
};


const readSync = (fd, buffer, offset, length, position) =>  {
  if (util.isNullOrUndefined(position)) {
    position = -1; // Read from the current position.
  }

  return fsBuiltin.read(checkArgNumber(fd, 'fd'),
                        checkArgBuffer(buffer, 'buffer'),
                        checkArgNumber(offset, 'offset'),
                        checkArgNumber(length, 'length'),
                        checkArgNumber(position, 'position'));
};


const write = (fd, buffer, offset, length, position, callback) =>  {
  if (util.isFunction(position)) {
    callback = position;
    position = -1; // write at current position.
  } else if (util.isNullOrUndefined(position)) {
    position = -1; // write at current position.
  }

  callback = checkArgFunction(callback, 'callback');

  var cb = function(err, written) {
    callback(err, written, buffer);
  };

  return fsBuiltin.write(checkArgNumber(fd, 'fd'),
                         checkArgBuffer(buffer, 'buffer'),
                         checkArgNumber(offset, 'offset'),
                         checkArgNumber(length, 'length'),
                         checkArgNumber(position, 'position'),
                         cb);
};


const writeSync = (fd, buffer, offset, length, position) =>  {
  if (util.isNullOrUndefined(position)) {
    position = -1; // write at current position.
  }

  return fsBuiltin.write(checkArgNumber(fd, 'fd'),
                         checkArgBuffer(buffer, 'buffer'),
                         checkArgNumber(offset, 'offset'),
                         checkArgNumber(length, 'length'),
                         checkArgNumber(position, 'position'));
};


const readFile = (path, callback) =>  {
  checkArgString(path);
  checkArgFunction(callback);

  var fd;
  var buffers;

  open(path, 'r', function(err, _fd) {
    if (err) {
      return callback(err);
    }

    fd = _fd;
    buffers = [];

    // start read
    localRead();
  });

  var localRead = function() {
    // Read segment of data.
    var buffer = new Buffer(1023);
    read(fd, buffer, 0, 1023, -1, afterRead);
  };

  var afterRead = function(err, bytesRead, buffer) {
    if (err) {
      close(fd, function(err) {
        return callback(err);
      });
    }

    if (bytesRead === 0) {
      // End of file.
      localClose();
    } else {
      // continue reading.
      buffers.push(buffer.slice(0, bytesRead));
      localRead();
    }
  };

  var localClose = function() {
    close(fd, function(err) {
      return callback(err, Buffer.concat(buffers));
    });
  };
};


const readFileSync = (path) =>  {
  // TODO: reading in chunks.. not sure this is needed
  checkArgString(path);

  var fd = openSync(path, 'r', 438);
  var buffers = [];

  while (true) {
    try {
      var buffer = new Buffer(1023);
      var bytesRead = readSync(fd, buffer, 0, 1023);
      if (bytesRead) {
        buffers.push(buffer.slice(0, bytesRead));
      } else {
        break;
      }
    } catch (e) {
      break;
    }
  }
  closeSync(fd);

  return Buffer.concat(buffers);
};


const writeFile = (path, data, callback) =>  {
  checkArgString(path);
  checkArgFunction(callback);

  var fd;
  var len;
  var bytesWritten;
  var buffer = ensureBuffer(data);

  open(path, 'w', function(err, _fd) {
    if (err) {
      return callback(err);
    }

    fd = _fd;
    len = buffer.length;
    bytesWritten = 0;

    localWrite();
  });

  var localWrite = function() {
    var tryN = (len - bytesWritten) >= 1024 ? 1023 : (len - bytesWritten);
    write(fd, buffer, bytesWritten, tryN, bytesWritten, afterWrite);
  };

  var afterWrite = function(err, n) {
    if (err) {
      close(fd, function(err) {
        return callback(err);
      });
    }

    if (n <= 0 || bytesWritten + n === len) {
      // End of buffer
      close(fd, function(err) {
        callback(err);
      });
    } else {
      // continue writing
      bytesWritten += n;
      localWrite();
    }
  };
};


const writeFileSync = (path, data) =>  {
  checkArgString(path);

  var buffer = ensureBuffer(data);
  var fd = openSync(path, 'w');
  var len = buffer.length;
  var bytesWritten = 0;

  while (true) {
    try {
      var tryN = (len - bytesWritten) >= 1024 ? 1023 : (len - bytesWritten);
      var n = writeSync(fd, buffer, bytesWritten, tryN, bytesWritten);
      bytesWritten += n;
      if (bytesWritten === len) {
        break;
      }
    } catch (e) {
      break;
    }
  }
  closeSync(fd);
  return bytesWritten;
};


const mkdir = (path, mode, callback) =>  {
  if (util.isFunction(mode)) callback = mode;
  checkArgString(path, 'path');
  checkArgFunction(callback, 'callback');
  fsBuiltin.mkdir(path, convertMode(mode, 511), callback);
};


const mkdirSync = (path, mode) =>  {
  return fsBuiltin.mkdir(checkArgString(path, 'path'),
                         convertMode(mode, 511));
};


const rmdir = (path, callback) =>  {
  checkArgString(path, 'path');
  checkArgFunction(callback, 'callback');
  fsBuiltin.rmdir(path, callback);
};


const rmdirSync = (path) =>  {
  return fsBuiltin.rmdir(checkArgString(path, 'path'));
};


const unlink = (path, callback) =>  {
  checkArgString(path);
  checkArgFunction(callback);
  fsBuiltin.unlink(path, callback);
};


const unlinkSync = (path) =>  {
  return fsBuiltin.unlink(checkArgString(path, 'path'));
};


const rename = (oldPath, newPath, callback) =>  {
  checkArgString(oldPath);
  checkArgString(newPath);
  checkArgFunction(callback);
  fsBuiltin.rename(oldPath, newPath, callback);
};


const renameSync = (oldPath, newPath) =>  {
  checkArgString(oldPath);
  checkArgString(newPath);
  fsBuiltin.rename(oldPath, newPath);
};


const readdir = (path, callback) =>  {
  checkArgString(path);
  checkArgFunction(callback);
  fsBuiltin.readdir(path, callback);
};


const readdirSync = (path) =>  {
  return fsBuiltin.readdir(checkArgString(path, 'path'));
};

var Readable = stream.Readable;
var Writable = stream.Writable;
var closeFile = function(stream) {
  close(stream._fd, function(err) {
    if (err) {
      throw err;
    }
    stream.emit('close');
  });
};

var ReadStream = function(path, options) {
  if (!(this instanceof ReadStream)) {
    return new ReadStream(path, options);
  }

  options = options || {};

  Readable.call(this, {defaultEncoding: options.encoding || null});

  this.bytesRead = 0;
  this.path = path;
  this._autoClose = util.isNullOrUndefined(options.autoClose) ||
                                           options.autoClose;
  this._fd = options.fd;
  this._buff = new Buffer(options.bufferSize || 4096);

  var self = this;
  if (util.isNullOrUndefined(this._fd)) {
    open(this.path, options.flags || 'r', options.mode || 438,
            function(err, _fd) {
      if (err) {
        throw err;
      }
      self._fd = _fd;
      self.emit('open', self._fd);
      self.doRead();
    });
  }

  this.once('open', function(/* _fd */) {
    this.emit('ready');
  });

  if (this._autoClose) {
    this.on('end', function() {
      closeFile(self);
    });
  }
};


util.inherits(ReadStream, Readable);


ReadStream.prototype.doRead = function() {
  var self = this;
  read(this._fd, this._buff, 0, this._buff.length, null,
          function(err, bytes_read/* , buffer*/) {
    if (err) {
      if (self._autoClose) {
        closeFile(self);
      }
      throw err;
    }

    self.bytesRead += bytes_read;
    if (bytes_read === 0) {
      // Reached end of file.
      // null must be pushed so the 'end' event will be emitted.
      self.push(null);
    } else {
      self.push(bytes_read === self._buff.length ?
                self._buff : self._buff.slice(0, bytes_read));
      self.doRead();
    }
  });
};


var WriteStream = function(path, options) {
  if (!(this instanceof WriteStream)) {
    return new WriteStream(path, options);
  }

  options = options || {};

  Writable.call(this);

  this._fd = options._fd;
  this._autoClose = util.isNullOrUndefined(options.autoClose) ||
                                           options.autoClose;
  this.bytesWritten = 0;

  var self = this;
  if (!this._fd) {
    open(path, options.flags || 'w', options.mode || 438,
            function(err, _fd) {
      if (err) {
        throw err;
      }
      self._fd = _fd;
      self.emit('open', self._fd);
    });
  }

  this.once('open', function(/* _fd */) {
    self.emit('ready');
  });

  if (this._autoClose) {
    this.on('finish', function() {
      closeFile(self);
    });
  }

  this._readyToWrite();
};


util.inherits(WriteStream, Writable);


WriteStream.prototype._write = function(chunk, callback, onwrite) {
  var self = this;
  write(this._fd, chunk, 0, chunk.length,
           function(err, bytes_written/* , buffer */) {
    if (err) {
      if (self._autoClose) {
        closeFile(self);
      }
      throw err;
    }
    this.bytesWritten += bytes_written;

    if (callback) {
      callback();
    }
    onwrite();
  });
};


const createWriteStream = (path, options) =>  {
  return new WriteStream(path, options);
};

const createReadStream = (path, options) =>  {
  return new ReadStream(path, options);
};

function convertFlags(flag) {
  const {
    O_APPEND,
    O_CREAT,
    O_EXCL,
    O_RDONLY,
    O_RDWR,
    O_SYNC,
    O_TRUNC,
    O_WRONLY
  } = constants

  if (typeof flag === 'string') {
    switch (flag) {
      case 'r': return O_RDONLY;
      case 'rs':
      case 'sr': return O_RDONLY | O_SYNC;

      case 'r+': return O_RDWR;
      case 'rs+':
      case 'sr+': return O_RDWR | O_SYNC;

      case 'w': return O_TRUNC | O_CREAT | O_WRONLY;
      case 'wx':
      case 'xw': return O_TRUNC | O_CREAT | O_WRONLY | O_EXCL;

      case 'w+': return O_TRUNC | O_CREAT | O_RDWR;
      case 'wx+':
      case 'xw+': return O_TRUNC | O_CREAT | O_RDWR | O_EXCL;

      case 'a': return O_APPEND | O_CREAT | O_WRONLY;
      case 'ax':
      case 'xa': return O_APPEND | O_CREAT | O_WRONLY | O_EXCL;

      case 'a+': return O_APPEND | O_CREAT | O_RDWR;
      case 'ax+':
      case 'xa+': return O_APPEND | O_CREAT | O_RDWR | O_EXCL;
    }
  }
  throw new TypeError('Bad argument: flags');
}

function convertMode(mode, def) {
  if (util.isNumber(mode)) {
    return mode;
  } else if (util.isString(mode)) {
    return parseInt(mode, 8);
  } else if (def) {
    return convertMode(def);
  }
}


const ensureBuffer = (data) => util.isBuffer(data) ? data : new Buffer(data + '')

const checkArgType = (value, name, checkFunc) => {
  if (!checkFunc(value)) {
    throw new TypeError(`Bad arguments: ${name}`);
  }

  return value;
}

const checkArgBuffer = (value, name) => checkArgType(value, name, util.isBuffer)
const checkArgNumber = (value, name) => checkArgType(value, name, util.isNumber)
const checkArgString = (value, name) => checkArgType(value, name, util.isString)
const checkArgFunction = (value, name) => checkArgType(value, name, util.isFunction)

const promises = {
  close: promisify(close),
  exists: promisify(exists),
  fstat: promisify(fstat),
  mkdir: promisify(mkdir),
  open: promisify(open),
  readdir: promisify(readdir),
  readFile: promisify(readFile),
  read: promisify(read),
  rename: promisify(rename),
  rmdir: promisify(rmdir),
  stat: promisify(stat),
  unlink: promisify(unlink),
  write: promisify(write),
  writeFile: promisify(writeFile),
}

export {
  close,
  closeSync,
  createReadStream,
  createWriteStream,
  exists,
  existsSync,
  fstat,
  fstatSync,
  mkdir,
  mkdirSync,
  open,
  openSync,
  readdir,
  readdirSync,
  readFile,
  readFileSync,
  read,
  readSync,
  rename,
  renameSync,
  rmdir,
  rmdirSync,
  stat,
  statSync,
  unlink,
  unlinkSync,
  write,
  writeSync,
  writeFile,
  writeFileSync,
  promises
}

export default {
  close,
  closeSync,
  createReadStream,
  createWriteStream,
  exists,
  existsSync,
  fstat,
  fstatSync,
  mkdir,
  mkdirSync,
  open,
  openSync,
  readdir,
  readdirSync,
  readFile,
  readFileSync,
  read,
  readSync,
  rename,
  renameSync,
  rmdir,
  rmdirSync,
  stat,
  statSync,
  unlink,
  unlinkSync,
  write,
  writeSync,
  writeFile,
  writeFileSync,
  promises
}
