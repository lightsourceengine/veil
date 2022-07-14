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

import { promisify } from 'util'
import {
  S_IFMT,
  S_IFDIR,
  S_IFREG,
  S_IFCHR,
  S_IFBLK,
  S_IFIFO,
  S_IFLNK,
  S_IFSOCK,
  O_APPEND,
  O_CREAT,
  O_EXCL,
  O_RDONLY,
  O_RDWR,
  O_SYNC,
  O_TRUNC,
  O_WRONLY
} from 'constants'
import { Readable, Writable } from 'stream'
import { codes } from 'internal/errors'
import { validateFunction } from 'internal/validators'
import { isAbsolute, toNamespacedPath, resolve } from 'path'

const {
  ERR_INVALID_ARG_TYPE,
  ERR_UNKNOWN_ENCODING,
  ERR_FS_INVALID_SYMLINK_TYPE
} = codes
const fsBuiltin = import.meta.native;
const {
  UV_FS_SYMLINK_JUNCTION,
  UV_FS_SYMLINK_DIR,
  setStats
} = fsBuiltin
const isWindows = process.platform === 'win32'
const kNsPerMsBigInt = 10n ** 6n

// string flag -> mask
const kFlagMap = new Map([
  [ 'r', O_RDONLY ],
  [ 'rs', O_RDONLY | O_SYNC ],
  [ 'sr', O_RDONLY | O_SYNC ],
  [ 'r+', O_RDWR ],
  [ 'rs+', O_RDWR | O_SYNC ],
  [ 'sr+', O_RDWR | O_SYNC ],
  [ 'w', O_TRUNC | O_CREAT | O_WRONLY ],
  [ 'wx', O_TRUNC | O_CREAT | O_WRONLY | O_EXCL],
  [ 'xw', O_TRUNC | O_CREAT | O_WRONLY | O_EXCL],
  [ 'w+', O_TRUNC | O_CREAT | O_RDWR ],
  [ 'wx+', O_TRUNC | O_CREAT | O_RDWR | O_EXCL ],
  [ 'xw+', O_TRUNC | O_CREAT | O_RDWR | O_EXCL ],
  [ 'a', O_APPEND | O_CREAT | O_WRONLY ],
  [ 'ax', O_APPEND | O_CREAT | O_WRONLY | O_EXCL ],
  [ 'xa', O_APPEND | O_CREAT | O_WRONLY | O_EXCL ],
  [ 'a+', O_APPEND | O_CREAT | O_RDWR ],
  [ 'ax+', O_APPEND | O_CREAT | O_RDWR | O_EXCL ],
  [ 'xa+', O_APPEND | O_CREAT | O_RDWR | O_EXCL ]
])

const exists = (path, callback) =>  {
  if (typeof path !== 'string' && !Buffer.isBuffer(path)) {
    throw new TypeError('Path should be a string or a buffer');
  }
  if (!path || !path.length) {
    process.nextTick(() => callback?.(false));
    return
  }

  checkArgFunction(callback, 'callback')

  const cb = (err/* , stat */) => callback(!!err)

  fsBuiltin.stat(checkArgString(path, 'path'), cb);
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


const stat = (path, options, callback) =>  {
  const { bigint } = options ?? {}

  callback = maybeCallback(callback || options);

  fsBuiltin.stat(checkArgString(path, 'path'), !!bigint, checkArgFunction(callback, 'callback'));
};


const statSync = (path, options) =>  {
  const { bigint } = options ?? {}

  return fsBuiltin.stat(checkArgString(path, 'path'), !!bigint);
};


const lstat = (path, options, callback) =>  {
  const { bigint } = options ?? {}

  callback = maybeCallback(callback || options);

  fsBuiltin.lstat(checkArgString(path, 'path'), !!bigint, checkArgFunction(callback, 'callback'));
};


const lstatSync = (path, options) =>  {
  const { bigint } = options ?? {}

  return fsBuiltin.lstat(checkArgString(path, 'path'), !!bigint);
};


const fstat = (fd, options, callback) =>  {
  const { bigint } = options ?? {}

  callback = maybeCallback(callback || options);

  fsBuiltin.fstat(checkArgNumber(fd, 'fd'), !!bigint,
                  checkArgFunction(callback, 'callback'));
};


const fstatSync = (fd, options) =>  {
  const { bigint } = options ?? {}

  return fsBuiltin.fstat(checkArgNumber(fd, 'fd'), !!bigint);
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
                 convertFlags(flags ?? 'r'),
                 convertMode(mode, 0o666),
                 checkArgFunction(args[args.length - 1]), 'callback');
};


const openSync = (path, flags, mode) =>  {
  return fsBuiltin.open(checkArgString(path, 'path'),
                        convertFlags(flags ?? 'r'),
                        convertMode(mode, 0o666));
};


const read = (fd, buffer, offset, length, position, callback) =>  {
  position = position ?? -1; // Read from the current position.

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
  position = position ?? -1; // Read from the current position.

  return fsBuiltin.read(checkArgNumber(fd, 'fd'),
                        checkArgBuffer(buffer, 'buffer'),
                        checkArgNumber(offset, 'offset'),
                        checkArgNumber(length, 'length'),
                        checkArgNumber(position, 'position'));
};


const write = (fd, buffer, offset, length, position, callback) =>  {
  if (typeof position === 'function') {
    callback = position;
    position = -1; // write at current position.
  } else if (position === null || position === undefined) {
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
  if (position === null || position === undefined) {
    position = -1; // write at current position.
  }

  return fsBuiltin.write(checkArgNumber(fd, 'fd'),
                         checkArgBuffer(buffer, 'buffer'),
                         checkArgNumber(offset, 'offset'),
                         checkArgNumber(length, 'length'),
                         checkArgNumber(position, 'position'));
};


const readFile = (path, options, callback) =>  {
  checkArgString(path);

  callback = maybeCallback(callback || options);
  options = getOptions(options, { flag: 'r' });

  let fd;
  let buffers;

  open(path, options.flag, (err, _fd) => {
    if (err) {
      return callback(err);
    }

    fd = _fd;
    buffers = [];

    // start read
    localRead();
  });

  const localRead = () => {
    // Read segment of data.
    // TODO: node uses 8192, but nuttx is limited to 1K reads
    const buffer = new Buffer(8192);
    read(fd, buffer, 0, 8192, -1, afterRead);
  };

  const afterRead = (err, bytesRead, buffer) => {
    if (err) {
      close(fd, (err) => callback(err));
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

  const localClose = () => {
    close(fd, (err) => {
      let data

      if (buffers) {
        const { encoding } = options
        const merged = Buffer.concat(buffers)

        data = !encoding ? merged : merged.toString(encoding)
      }

      return callback(err, data)
    });
  };
};


const readFileSync = (path, options = undefined) =>  {
  // TODO: support buffer, url and file handle
  // TODO: this code needs some work!
  checkArgString(path);
  options = getOptions(options, { flag: 'r' })

  const fd = openSync(path, options.flag, 0o666);
  const buffers = [];

  while (true) {
    try {
      // TODO: node uses 8192, but nuttx is limited to 1K reads
      const buffer = new Buffer(8192);
      const bytesRead = readSync(fd, buffer, 0, 8192);

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

  const result = Buffer.concat(buffers)
  const { encoding } = options

  return !encoding ? result : result.toString(encoding)
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
  if (typeof mode === 'function') callback = mode;
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

const closeFile = (stream) => {
  close(stream._fd, (err) => {
    if (err) {
      throw err;
    }
    stream.emit('close');
  });
};


const symlink = (target, path, type, callback)  => {
  let flags

  checkArgString(target);
  checkArgString(path);
  callback = maybeCallback(type || callback)
  type = (typeof type === 'string' ? type : null);

  if (isWindows) {
    if (type === null) {
      // Symlinks targets can be relative to the newly created path.
      // Calculate absolute file name of the symlink target, and check
      // if it is a directory. Ignore resolve error to keep symlink
      // errors consistent between platforms if invalid path is
      // provided.
      let absoluteTarget

      try {
        absoluteTarget = resolve(`${path}`, '..', `${target}`);
      } catch {
        // ignore
      }

      if (absoluteTarget !== undefined) {
        stat(absoluteTarget, (err, stat) => {
          const resolvedType = !err && stat.isDirectory() ? 'dir' : 'file';
          const resolvedFlags = stringToSymlinkType(resolvedType);
          const destination = preprocessSymlinkDestinationWin(target, resolvedType, path);

          fsBuiltin.symlink(destination, toNamespacedPath(path), resolvedFlags, callback);
        });

        return
      }
    }

    flags = stringToSymlinkType(type)
  }

  fsBuiltin.symlink(
    isWindows ? preprocessSymlinkDestinationWin(target, type, path) : path,
    toNamespacedPath(path),
    flags ?? 0,
    callback);
}

const symlinkSync = (target, path, type)  => {
  let flags

  checkArgString(target);
  checkArgString(path);
  type = (typeof type === 'string' ? type : null);

  if (isWindows) {
    if (type === null) {
      // Symlinks targets can be relative to the newly created path.
      // Calculate absolute file name of the symlink target, and check
      // if it is a directory. Ignore resolve error to keep symlink
      // errors consistent between platforms if invalid path is
      // provided.
      let absoluteTarget

      try {
        absoluteTarget = resolve(`${path}`, '..', `${target}`);
      } catch {
        // ignore
      }

      if (absoluteTarget !== undefined) {
        try {
          if (statSync(absoluteTarget).isDirectory()) {
            type = 'dir'
          }
        } catch {
          // ignore
        }
      }
    }

    flags = stringToSymlinkType(type)
  }

  fsBuiltin.symlink(
    isWindows ? preprocessSymlinkDestinationWin(target, type, path) : path,
    toNamespacedPath(path),
    flags ?? 0);
}

// No preprocessing is needed on Unix.
const preprocessSymlinkDestinationWin = (path, type, linkPath) => {
  path = '' + path;
  if (type === 'junction') {
    // Junctions paths need to be absolute and \\?\-prefixed.
    // A relative target is relative to the link's parent directory.
    path = resolve(linkPath, '..', path);
    return toNamespacedPath(path);
  }
  if (isAbsolute(path)) {
    // If the path is absolute, use the \\?\-prefix to enable long filenames
    return toNamespacedPath(path);
  }
  // Windows symlinks don't tolerate forward slashes.
  return path.replace(/\//g, '\\');
}

const stringToSymlinkType = (type) => {
  if (typeof type === 'string') {
    if (type === 'dir') {
      return UV_FS_SYMLINK_DIR
    }

    if (type === 'junction') {
      return UV_FS_SYMLINK_JUNCTION
    }

    if (type !== 'file') {
      throw new ERR_FS_INVALID_SYMLINK_TYPE(type)
    }
  }
  return 0;
}

class ReadStream extends Readable {
  constructor (path, options = {}) {
    super({defaultEncoding: options.encoding || null})

    this.bytesRead = 0;
    this.path = path;
    this._autoClose = (options.autoClose === null || options.autoClose === undefined) ||
      options.autoClose;
    this._fd = options.fd;
    this._buff = new Buffer(options.bufferSize || 4096);

    var self = this;
    if (this._fd === null || this._fd === undefined) {
      open(this.path, options.flags || 'r', options.mode || 0o666,
        function(err, _fd) {
          if (err) {
            throw err;
          }
          self._fd = _fd;
          self.emit('open', self._fd);
          self.doRead();
        });
    }

    this.once('open', (/* _fd */) => this.emit('ready'));

    if (this._autoClose) {
      this.on('end', () => closeFile(self));
    }
  }

  doRead () {
    const self = this;
    read(this._fd, this._buff, 0, this._buff.length, null,
      (err, bytes_read/* , buffer*/) => {
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
  }
}

class WriteStream extends Writable {
  constructor (path, options = {}) {
    super()

    this._fd = options._fd;
    this._autoClose = (options.autoClose === null || options.autoClose === undefined) ||
      options.autoClose;
    this.bytesWritten = 0;

    var self = this;
    if (!this._fd) {
      open(path, options.flags || 'w', options.mode || 0o666,
        function(err, _fd) {
          if (err) {
            throw err;
          }
          self._fd = _fd;
          self.emit('open', self._fd);
        });
    }

    this.once('open', (/* _fd */) => self.emit('ready'));
    this._autoClose && this.on('finish', () => closeFile(self));
    this._readyToWrite();
  }

  _write (chunk, callback, onwrite) {
    const self = this;
    write(this._fd, chunk, 0, chunk.length,
      (err, bytes_written/* , buffer */) => {
        if (err) {
          self._autoClose && closeFile(self);
          throw err;
        }
        this.bytesWritten += bytes_written;

        callback?.();
        onwrite();
      });
  }
}

const createWriteStream = (path, options) =>  {
  return new WriteStream(path, options);
};

const createReadStream = (path, options) =>  {
  return new ReadStream(path, options);
};

function convertFlags(flag) {
  const mask = kFlagMap.get(flag)

  if (mask === undefined) {
    throw new TypeError('Bad argument: flags');
  }

  return mask
}

function convertMode(mode, def) {
  if (typeof mode === 'number') {
    return mode;
  }

  if (typeof mode === 'string') {
    return parseInt(mode, 8);
  }

  if (def) {
    return def;
  }
}


const ensureBuffer = (data) => Buffer.isBuffer(data) ? data : new Buffer(data + '')

const checkArgType = (value, name, checkFunc) => {
  if (!checkFunc(value)) {
    throw TypeError(`Bad arguments: ${name}`);
  }

  return value;
}

const checkArgBuffer = (value, name) => checkArgType(value, name, Buffer.isBuffer)
const checkArgNumber = (value, name) => checkArgType(value, name, (v) => typeof v === 'number')
const checkArgString = (value, name) => checkArgType(value, name, (v) => typeof v === 'string')
const checkArgFunction = (value, name) => checkArgType(value, name, (v) => typeof v === 'function')

const maybeCallback = (cb) => {
  validateFunction(cb, 'cb');

  return cb;
}

const getOptions = (options, defaultOptions) => {
  if (options === null || options === undefined || typeof options === 'function') {
    return defaultOptions;
  }

  if (typeof options === 'string') {
    options = { ...defaultOptions, encoding: options };
  } else if (typeof options !== 'object') {
    throw new ERR_INVALID_ARG_TYPE('options', ['string', 'Object'], options);
  }

  let { encoding } = options
  let invalidEncoding

  if (typeof encoding === 'string') {
    switch(encoding.toLowerCase()) {
      case 'utf8':
      case 'utf-8':
        options.encoding = 'utf8'
        break
      default:
        invalidEncoding = encoding
    }
  } else if (encoding) {
    invalidEncoding = encoding
  }

  if (invalidEncoding) {
    throw new ERR_UNKNOWN_ENCODING(invalidEncoding)
  }

  // TODO: abort signal not supported in veil
  // if (options.signal !== undefined) {
  //   validateAbortSignal(options.signal, 'options.signal');
  // }

  return Object.assign({}, defaultOptions, options);
}

// The Date constructor performs Math.floor() to the timestamp.
// https://www.ecma-international.org/ecma-262/#sec-timeclip
// Since there may be a precision loss when the timestamp is
// converted to a floating point number, we manually round
// the timestamp here before passing it to Date().
// Refs: https://github.com/nodejs/node/pull/12607
const fileTimestampToDate = (timestamp) => new Date(Number(timestamp) + 0.5)

// Some types are not available on Windows
const isStatFlagUnsupportedOnWin = (flag) => flag === S_IFIFO || flag === S_IFBLK || flag === S_IFSOCK

const kCheckModeProperty = Symbol('_checkModeProperty')

class Stats extends Array {
  constructor () {
    super(14)
  }

  get dev() {
    return this[0]
  }

  get ino() {
    return this[1]
  }

  get mode() {
    return this[2]
  }

  get nlink() {
    return this[3]
  }

  get uid() {
    return this[4]
  }

  get gid() {
    return this[5]
  }

  get rdev() {
    return this[6]
  }

  get size() {
    return this[7]
  }

  get blksize() {
    return this[8]
  }

  get blocks() {
    return this[9]
  }

  get atimeMs() {
    return this._toMs(this[10])
  }

  get mtimeMs() {
    return this._toMs(this[11])
  }

  get ctimeMs() {
    return this._toMs(this[12])
  }

  get birthtimeMs() {
    return this._toMs(this[13])
  }

  get atime() {
    return fileTimestampToDate(this[10])
  }

  get mtime() {
    return fileTimestampToDate(this[11])
  }

  get ctime() {
    return fileTimestampToDate(this[12])
  }

  get birthtime() {
    return fileTimestampToDate(this[13])
  }

  isDirectory () {
    return this[kCheckModeProperty](S_IFDIR)
  }

  isFile () {
    return this[kCheckModeProperty](S_IFREG)
  }

  isBlockDevice () {
    return this[kCheckModeProperty](S_IFBLK)
  }

  isCharacterDevice () {
    return this[kCheckModeProperty](S_IFCHR)
  }

  isSymbolicLink () {
    return this[kCheckModeProperty](S_IFLNK)
  }

  isFIFO () {
    return this[kCheckModeProperty](S_IFIFO)
  }

  isSocket () {
    return this[kCheckModeProperty](S_IFSOCK)
  }

  [kCheckModeProperty](property) {
    if (isWindows && isStatFlagUnsupportedOnWin(property)) {
      return false;
    }
    return (this.mode & S_IFMT) === property;
  }

  _toMs(value) {
    return value
  }
}

class BigIntStats extends Stats {
  get atimeNs() {
    return this[10]
  }

  get mtimeNs() {
    return this[11]
  }

  get ctimeNs() {
    return this[12]
  }

  get birthtimeNs() {
    return this[13]
  }

  [kCheckModeProperty] (property) {
    if (isWindows && isStatFlagUnsupportedOnWin(property)) {
      return false;  // Some types are not available on Windows
    }
    return (this.mode & BigInt(S_IFMT)) === BigInt(property);
  }

  _toMs(value) {
    return value / kNsPerMsBigInt
  }
}

setStats(Stats, BigIntStats)

const promises = {
  close: promisify(close),
  exists: promisify(exists),
  fstat: promisify(fstat),
  lstat: promisify(lstat),
  mkdir: promisify(mkdir),
  open: promisify(open),
  readdir: promisify(readdir),
  readFile: promisify(readFile),
  read: promisify(read),
  rename: promisify(rename),
  rmdir: promisify(rmdir),
  stat: promisify(stat),
  symlink: promisify(symlink),
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
  lstat,
  lstatSync,
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
  symlink,
  symlinkSync,
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
  symlink,
  symlinkSync,
  unlink,
  unlinkSync,
  write,
  writeSync,
  writeFile,
  writeFileSync,
  promises
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
