// any logging framework is theoretically possible here,
//   but we'll use winston in this case.
// It just needs to export a logger singleton and a function to initialise it
import { format, transports, createLogger, Logger } from "winston";
// get current __dirname
import path from 'node:path';
import util from 'node:util';
import { fileURLToPath } from 'node:url';
const {
  combine,
  colorize,
  printf,
  timestamp,
  uncolorize
} = format;
import { getDateTimeString } from "./utils/index.js"; // set up the logging configuration, can be overridden by environment variables
import { Format } from "logform";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_LOG_LEVEL = process.env.LOG_LEVEL ?? "info";
const DEFAULT_LOG_FILENAME = process.env.LOG_FILENAME ?? `$output-log-${getDateTimeString()}.txt`;
const DEFAULT_LOG_DIRNAME = process.env.LOG_DIRNAME ?? path.resolve(__dirname, "../logs");

/**
 * @typedef {object} Options
 * @property {string} [logLevel] - the log level to use e.g. "info", "debug", "error", "warn"
 * @property {string} [fileName] - the filename to use for the log file
 * @property {string} [dirName] - the directory name to use for the log file
 * @property {WinstonFormat} [winstonLogFormat] - the winston log format to use
 */

export type Options = {
  logLevel?: string;
  fileName?: string;
  dirName?: string;
  winstonLogFormat?: Format;
}

/**
 * Get a winston log format function for the provided transform function.
 * the default transform function is:
 *
 *     (logMessageInfo) => `${logMessageInfo.timestamp} [${logMessageInfo.level}]: ${logMessageInfo.message}`
 *
 * @param {TransformFunction} logFormatFunction
 * @returns {Format} - a winston log format
 */
export const getWinstonLogFormatForFunction = (
  // skipcq: JS-0323
  logFormatFunction = (logMessageInfo: any) => {
    const args = logMessageInfo[Symbol.for("splat")];
    const strArgs = (args || [])
      // skipcq: JS-0323
      .map((arg: any) => {
        return util.inspect(arg, {
          colors: true,
        });
      })
      .join(" ");
    return `${logMessageInfo.timestamp} [${logMessageInfo.level}]: ${logMessageInfo.message} ${strArgs}`;
  }
) => {
  return printf(logFormatFunction);
};

/**
 * Get a logging configuration object for the provided options, for use in the reconfigureLogger function
 * @param {LoggerOptions} options - options for the logging configuration
 * @returns {LoggerOptions} - a winston logger options object for use in the reconfigureLogger function
 */
export const getLoggingConfigFromOptions = (options: Options = {}) => {
  const {
    logLevel = DEFAULT_LOG_LEVEL,
    fileName = DEFAULT_LOG_FILENAME,
    dirName = DEFAULT_LOG_DIRNAME,
    winstonLogFormat = getWinstonLogFormatForFunction()
  } = options;
  return {
    level: logLevel,
    transports: [new transports.File({
      filename: fileName,
      dirname: dirName,
      format: combine(timestamp(), winstonLogFormat,  uncolorize())
    }), new transports.Console({
      handleExceptions: true,
      format: combine(colorize(), timestamp(), winstonLogFormat)
    })]
  };
};

/**
 * @type {WinstonLoggerOptions}
 */
let loggingConfig = getLoggingConfigFromOptions({
  logLevel: DEFAULT_LOG_LEVEL,
  fileName: DEFAULT_LOG_FILENAME,
  dirName: DEFAULT_LOG_DIRNAME,
  winstonLogFormat: getWinstonLogFormatForFunction()
});

// a singleton to refer to the logger
/**
 * @type {winston.Logger}
 */
// skipcq: JS-E1009
export let logger: Logger;

/**
 * gets the current logging config
 * @returns {WinstonLoggerOptions}
 */
export const getLoggingConfig = () => loggingConfig;

/**
 * re-initialise the logger with the provided config
 * @param {WinstonLoggerOptions} config
 */
export const reconfigureLogger = (config = loggingConfig) => {
  if (config) {
    loggingConfig = config;
  }
  logger = createLogger(config);
};

// initialise the logger automatically when this module is loaded
reconfigureLogger();
