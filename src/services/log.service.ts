/**
 * @file      log.service.ts
 * @brief     Main logger controller.
 */

import {sep} from 'path';
import {inspect} from 'util';
import winston from 'winston';
import {SafeAny} from '../models/object.types';
const {createLogger, format, transports} = winston;
const {combine, metadata, label, colorize, timestamp, align, printf} = format;

export const logger = ({url}: ImportMeta) =>
  createLogger({
    level: process.env.LOG_LEVEL ?? 'info',
    format: combine(
      metadata(),
      label({label: url.split(sep).pop()}),
      colorize(),
      timestamp(),
      align(),
      printf(
        ({metadata, label, timestamp, level, message}) =>
          `${timestamp} [${label}] ${level}: ${message} ${inspect(
            metadata,
            false,
            1,
            true
          )}`
      )
    ),
    transports: [new transports.Console()],
    exitOnError: true,
    silent: false,
  });

export const MessageWithErrorHandlerGenerator =
  (logger: winston.Logger) => (message: string) => (e: SafeAny) => {
    logger.error(message, e);
  };

export const InteractionFailedHandlerGenerator = (logger: winston.Logger) =>
  MessageWithErrorHandlerGenerator(logger)('Interaction failed.');
