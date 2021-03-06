/* eslint-disable no-console */

export function getLogger(debugEnabled = true) {
  const logFunc: any = console.log;

  logFunc.debug = (...args: any[]) => {
    if (debugEnabled) {
      console.log('DEBUG:', ...args);
    }
  };

  return logFunc;
}

export const log = getLogger(false);

log.debug('HELLOOOOOO DEBUG');
