/* Copyright 2017-present Samsung Electronics Co., Ltd. and other contributors
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

#ifndef IOTJS_MAGIC_STRINGS_H
#define IOTJS_MAGIC_STRINGS_H

#define IOTJS_MAGIC_STRING_ABORT "abort"
#define IOTJS_MAGIC_STRING_ADDHEADER "addHeader"
#if ENABLE_MODULE_UDP
#define IOTJS_MAGIC_STRING_ADDMEMBERSHIP "addMembership"
#endif
#define IOTJS_MAGIC_STRING_ADDRESS "address"
#define IOTJS_MAGIC_STRING_ARCH "arch"
#define IOTJS_MAGIC_STRING_ARGV "argv"
#define IOTJS_MAGIC_STRING_ARGV0 "argv0"
#define IOTJS_MAGIC_STRING_BASE64 "base64"
#if ENABLE_MODULE_CRYPTO
#define IOTJS_MAGIC_STRING_BASE64ENCODE "base64Encode"
#endif
#define IOTJS_MAGIC_STRING_BIND "bind"
#define IOTJS_MAGIC_STRING_BINDING "binding"
#define IOTJS_MAGIC_STRING_BOARD "board"
#define IOTJS_MAGIC_STRING_BUFFER "Buffer"
#define IOTJS_MAGIC_STRING_BUILTINS "builtins"
#define IOTJS_MAGIC_STRING_BYTELENGTH "byteLength"
#define IOTJS_MAGIC_STRING_BYTEPARSED "byteParsed"
#define IOTJS_MAGIC_STRING_FROM_ARRAYBUFFER "fromArrayBuffer"
#if ENABLE_MODULE_HTTPS || ENABLE_MODULE_TLS
#define IOTJS_MAGIC_STRING_CA "ca"
#define IOTJS_MAGIC_STRING_CERT "cert"
#endif
#define IOTJS_MAGIC_STRING_CHDIR "chdir"
#define IOTJS_MAGIC_STRING_CJS "cjs"
#define IOTJS_MAGIC_STRING_CLOSE "close"
#define IOTJS_MAGIC_STRING_CLOSESYNC "closeSync"
#define IOTJS_MAGIC_STRING_CODE "code"
#define IOTJS_MAGIC_STRING_COMPARE "compare"
#define IOTJS_MAGIC_STRING_CONFIG "config"
#define IOTJS_MAGIC_STRING_CONNECT "connect"
#define IOTJS_MAGIC_STRING_COPY "copy"
#if ENABLE_MODULE_HTTPS
#define IOTJS_MAGIC_STRING_CREATEREQUEST "createRequest"
#endif
#define IOTJS_MAGIC_STRING__CREATESTAT "_createStat"
#define IOTJS_MAGIC_STRING_CREATETCP "createTCP"
#define IOTJS_MAGIC_STRING_CWD "cwd"
#define IOTJS_MAGIC_STRING_DATA "data"
#define IOTJS_MAGIC_STRING_DEBUG "debug"
#define IOTJS_MAGIC_STRING_DEBUGGERGETSOURCE "debuggerGetSource"
#define IOTJS_MAGIC_STRING_DEBUGGERWAITSOURCE "debuggerWaitSource"
#define IOTJS_MAGIC_STRING_DEFAULT "default"
#define IOTJS_MAGIC_STRING_DESTROY "destroy"
#define IOTJS_MAGIC_STRING_DEVICE "device"
#define IOTJS_MAGIC_STRING_DOEXIT "doExit"
#if ENABLE_MODULE_UDP
#define IOTJS_MAGIC_STRING_DROPMEMBERSHIP "dropMembership"
#endif
#define IOTJS_MAGIC_STRING_EMIT "emit"
#define IOTJS_MAGIC_STRING_EMIT_READY "emitReady"
#define IOTJS_MAGIC_STRING_EMITEXIT "emitExit"
#if ENABLE_MODULE_TLS
#define IOTJS_MAGIC_STRING_END "end"
#endif
#define IOTJS_MAGIC_STRING_ENV "env"
#define IOTJS_MAGIC_STRING_ERRNAME "errname"
#define IOTJS_MAGIC_STRING_EXEC_PATH "execPath"
#define IOTJS_MAGIC_STRING_EXECUTE "execute"
#define IOTJS_MAGIC_STRING_EXITCODE "exitCode"
#define IOTJS_MAGIC_STRING_EXPORT "export"
#define IOTJS_MAGIC_STRING_EVALUATE "evaluate"
#define IOTJS_MAGIC_STRING_EVALUATE_WITH "evaluateWith"
#define IOTJS_MAGIC_STRING_FAMILY "family"
#define IOTJS_MAGIC_STRING_FINISH "finish"
#define IOTJS_MAGIC_STRING_FORMAT "format"
#define IOTJS_MAGIC_STRING_FROM_BUILTIN "fromBuiltin"
#define IOTJS_MAGIC_STRING_FROM_SYMBOLS "fromSymbols"
#if ENABLE_MODULE_HTTPS
#define IOTJS_MAGIC_STRING_FINISHREQUEST "finishRequest"
#endif
#define IOTJS_MAGIC_STRING_FSTAT "fstat"
#define IOTJS_MAGIC_STRING_LSTAT "lstat"
#define IOTJS_MAGIC_STRING_GC "gc"
#define IOTJS_MAGIC_STRING_GET_NAMESPACE "getNamespace"
#define IOTJS_MAGIC_STRING_GET_REQUESTS "getRequests"
#define IOTJS_MAGIC_STRING_GET_STATE "getState"
#define IOTJS_MAGIC_STRING_GETADDRINFO "getaddrinfo"
#define IOTJS_MAGIC_STRING_GETSOCKNAME "getsockname"
#define IOTJS_MAGIC_STRING_GLOBAL "global"
#define IOTJS_MAGIC_STRING_HANDLER "handler"
#define IOTJS_MAGIC_STRING_HANDLETIMEOUT "handleTimeout"
#define IOTJS_MAGIC_STRING_HEADERS "headers"
#define IOTJS_MAGIC_STRING_HEX "hex"
#define IOTJS_MAGIC_STRING_HOME_U "HOME"
#define IOTJS_MAGIC_STRING_HOMEDIR "homedir"
#define IOTJS_MAGIC_STRING_HOST "host"
#define IOTJS_MAGIC_STRING_HOSTNAME "hostname"
#define IOTJS_MAGIC_STRING_HRTIME "hrtime"
#define IOTJS_MAGIC_STRING_HTTPPARSER "HTTPParser"
#define IOTJS_MAGIC_STRING_HTTP_VERSION_MAJOR "http_major"
#define IOTJS_MAGIC_STRING_HTTP_VERSION_MINOR "http_minor"
#define IOTJS_MAGIC_STRING_ID "id"
#define IOTJS_MAGIC_STRING_IMPORT "import"
#define IOTJS_MAGIC_STRING__INCOMING "_incoming"
#define IOTJS_MAGIC_STRING_IPV4 "IPv4"
#define IOTJS_MAGIC_STRING_IPV6 "IPv6"
#define IOTJS_MAGIC_STRING_ISALIVEEXCEPTFOR "isAliveExceptFor"
#define IOTJS_MAGIC_STRING_ISDEVUP "isDevUp"
#if ENABLE_MODULE_TLS
#define IOTJS_MAGIC_STRING_ISSERVER "isServer"
#endif
#define IOTJS_MAGIC_STRING_KEY "key"
#define IOTJS_MAGIC_STRING_LENGTH "length"
#define IOTJS_MAGIC_STRING_LINK "link"
#define IOTJS_MAGIC_STRING_LISTEN "listen"
#define IOTJS_MAGIC_STRING_LOOPBACK "loopback"
#define IOTJS_MAGIC_STRING_METHOD "method"
#define IOTJS_MAGIC_STRING_METHODS "methods"
#define IOTJS_MAGIC_STRING_MKDIR "mkdir"
#define IOTJS_MAGIC_STRING_MODE "mode"
#define IOTJS_MAGIC_STRING_NATIVE "native"
#define IOTJS_MAGIC_STRING_NOW "now"
#define IOTJS_MAGIC_STRING_ON "on"
#define IOTJS_MAGIC_STRING_ONBODY "OnBody"
#define IOTJS_MAGIC_STRING_ONCLOSE "onclose"
#define IOTJS_MAGIC_STRING_ONCLOSED "onClosed"
#define IOTJS_MAGIC_STRING_ONCONNECTION "onconnection"
#define IOTJS_MAGIC_STRING_ONDATA "onData"
#define IOTJS_MAGIC_STRING_ONEND "onEnd"
#define IOTJS_MAGIC_STRING_ONERROR "onError"
#if ENABLE_MODULE_TLS
#define IOTJS_MAGIC_STRING_ONHANDSHAKEDONE "onhandshakedone"
#endif
#define IOTJS_MAGIC_STRING_ONHEADERSCOMPLETE "OnHeadersComplete"
#define IOTJS_MAGIC_STRING_ONHEADERS "OnHeaders"
#define IOTJS_MAGIC_STRING_ONMESSAGECOMPLETE "OnMessageComplete"
#define IOTJS_MAGIC_STRING_ONMESSAGE "onmessage"
#define IOTJS_MAGIC_STRING__ONNEXTTICK "_onNextTick"
#define IOTJS_MAGIC_STRING_ONREAD "onread"
#define IOTJS_MAGIC_STRING_ONSOCKET "onSocket"
#define IOTJS_MAGIC_STRING_ONTIMEOUT "onTimeout"
#define IOTJS_MAGIC_STRING__ONUNCAUGHTEXCEPTION "_onUncaughtException"
#if ENABLE_MODULE_TLS
#define IOTJS_MAGIC_STRING_ONWRITE "onwrite"
#endif
#define IOTJS_MAGIC_STRING_ONWRITABLE "onWritable"
#define IOTJS_MAGIC_STRING_OPEN "open"
#define IOTJS_MAGIC_STRING_OWNER "owner"
#define IOTJS_MAGIC_STRING_PAUSE "pause"
#define IOTJS_MAGIC_STRING_PERIOD "period"
#define IOTJS_MAGIC_STRING_PID "pid"
#define IOTJS_MAGIC_STRING_PIN "pin"
#define IOTJS_MAGIC_STRING_PLATFORM "platform"
#define IOTJS_MAGIC_STRING_PORT "port"
#define IOTJS_MAGIC_STRING_PRIVATE "_private"
#define IOTJS_MAGIC_STRING_PROCESS "process"
#define IOTJS_MAGIC_STRING_PROTOTYPE "prototype"
#define IOTJS_MAGIC_STRING_READDIR "readdir"
#define IOTJS_MAGIC_STRING_READLINK "readlink"
#define IOTJS_MAGIC_STRING_READPATH "realpath"
#define IOTJS_MAGIC_STRING_READ "read"
#define IOTJS_MAGIC_STRING_READ_FILE_SYNC "readFileSync"
#define IOTJS_MAGIC_STRING_READSOURCE "readSource"
#define IOTJS_MAGIC_STRING_READSTART "readStart"
#define IOTJS_MAGIC_STRING_READSYNC "readSync"
#define IOTJS_MAGIC_STRING_READUINT8 "readUInt8"
#if ENABLE_MODULE_DGRAM
#define IOTJS_MAGIC_STRING_RECVSTART "recvStart"
#define IOTJS_MAGIC_STRING_RECVSTOP "recvStop"
#endif
#define IOTJS_MAGIC_STRING_REF "ref"
#if ENABLE_MODULE_TLS || ENABLE_MODULE_HTTPS
#define IOTJS_MAGIC_STRING_REJECTUNAUTHORIZED "rejectUnauthorized"
#endif
#define IOTJS_MAGIC_STRING_RENAME "rename"
#define IOTJS_MAGIC_STRING_REQUEST_U "REQUEST"
#define IOTJS_MAGIC_STRING_RESPONSE_U "RESPONSE"
#define IOTJS_MAGIC_STRING_RESOLVED "resolved"
#define IOTJS_MAGIC_STRING_RESUME "resume"
#define IOTJS_MAGIC_STRING__REUSEADDR "_reuseAddr"
#define IOTJS_MAGIC_STRING_RMDIR "rmdir"
#if ENABLE_MODULE_CRYPTO
#define IOTJS_MAGIC_STRING_RSAVERIFY "rsaVerify"
#endif
#define IOTJS_MAGIC_STRING_SEND "send"
#define IOTJS_MAGIC_STRING_SENDREQUEST "sendRequest"
#if ENABLE_MODULE_TLS
#define IOTJS_MAGIC_STRING_SERVERNAME "servername"
#endif
#if ENABLE_MODULE_UDP
#define IOTJS_MAGIC_STRING_CONFIGURE "configure"
#endif
#define IOTJS_MAGIC_STRING_SETKEEPALIVE "setKeepAlive"
#define IOTJS_MAGIC_STRING_SET_STATS "setStats"
#define IOTJS_MAGIC_STRING_SETTIMEOUT "setTimeout"
#if ENABLE_MODULE_CRYPTO
#define IOTJS_MAGIC_STRING_SHAENCODE "shaEncode"
#endif
#define IOTJS_MAGIC_STRING_SHOULDKEEPALIVE "shouldkeepalive"
#define IOTJS_MAGIC_STRING_SHUTDOWN "shutdown"
#define IOTJS_MAGIC_STRING_SLICE "slice"
#define IOTJS_MAGIC_STRING_START "start"
#define IOTJS_MAGIC_STRING_STAT "stat"
#define IOTJS_MAGIC_STRING_STATS "stats"
#define IOTJS_MAGIC_STRING_STATUS_MSG "status_msg"
#define IOTJS_MAGIC_STRING_STATUS "status"
#define IOTJS_MAGIC_STRING_STDERR "stderr"
#define IOTJS_MAGIC_STRING_STDOUT "stdout"
#define IOTJS_MAGIC_STRING_STOP "stop"
#define IOTJS_MAGIC_STRING_SYMLINK "symlink"
#define IOTJS_MAGIC_STRING_TIMEORIGIN "timeOrigin"
#if ENABLE_MODULE_TLS
#define IOTJS_MAGIC_STRING_TLSSOCKET "TLSSocket"
#define IOTJS_MAGIC_STRING_TLSCONTEXT "TlsContext"
#define IOTJS_MAGIC_STRING_TLSINIT "TlsInit"
#endif
#define IOTJS_MAGIC_STRING_TMPDIR "tmpdir"
#define IOTJS_MAGIC_STRING_TOSTRING "toString"
#define IOTJS_MAGIC_STRING_TOUSVSTRING "toUSVString"
#define IOTJS_MAGIC_STRING_UNLINK "unlink"
#define IOTJS_MAGIC_STRING_UNREF "unref"
#define IOTJS_MAGIC_STRING_UPGRADE "upgrade"
#define IOTJS_MAGIC_STRING_URL "url"
#define IOTJS_MAGIC_STRING_VERSION "version"
#define IOTJS_MAGIC_STRING_VERSIONS "versions"
#define IOTJS_MAGIC_STRING_WRITEUINT8 "writeUInt8"
#define IOTJS_MAGIC_STRING_WRITE "write"
#define IOTJS_MAGIC_STRING_WRITEDECODE "writeDecode"
#define IOTJS_MAGIC_STRING_WRITESYNC "writeSync"
#if ENABLE_MODULE_HTTPS
#define IOTJS_MAGIC_STRING__WRITE "_write"
#endif
#if ENABLE_MODULE_NAPI
#define IOTJS_MAGIC_STRING_ERROR "Error"
#endif

#endif /* IOTJS_MAGIC_STRINGS_H */
