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

import { errnoException } from 'internal/errors'
import constants from 'constants'

const { signals } = constants.os;
const { Signal } = import.meta.native
const signalWraps = new Map();

const isSignal = (event) => typeof event === 'string' && signals[event] !== undefined

// Detect presence of a listener for the special signal types
const startListeningIfSignal = (type, process) => {
  if (isSignal(type) && !signalWraps.has(type)) {
    const wrap = new Signal();

    wrap.unref();
    wrap.onsignal = (num) => { process.emit(type, num) }

    const signum = signals[type];
    const err = wrap.start(signum);
    if (err) {
      wrap.close();
      throw errnoException(err, 'uv_signal_start');
    }

    signalWraps.set(type, wrap);
  }
}

const stopListeningIfSignal = (type, process) => {
  const wrap = signalWraps.get(type);
  if (wrap !== undefined && process.listenerCount(type) === 0) {
    wrap.close();
    signalWraps.delete(type);
  }
}

export { startListeningIfSignal, stopListeningIfSignal }
