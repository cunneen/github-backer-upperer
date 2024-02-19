/**
 * A shared module that provides a global logger that can be used by other modules.
 * @module global-logger
 */
// skipcq: JS-0323
const refToGlobal = global as any;

/**
 * get the global logger
 */
export const getLogger = () => {
  if (!refToGlobal.logger) {
    refToGlobal.logger = console;
  }
  return refToGlobal.logger;
};
/**
 * supply a different logger to use for logging. Do this before requiring any other modules.
 */
// skipcq: JS-0323
export const setLogger = (newLogger: any) => {
  refToGlobal.logger = newLogger;
};
