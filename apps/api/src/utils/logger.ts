import winston from 'winston';
import config from '../config';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logsDir = path.dirname(config.LOG_FILE);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const securityLogsDir = path.dirname(config.SECURITY_LOG_FILE);
if (!fs.existsSync(securityLogsDir)) {
  fs.mkdirSync(securityLogsDir, { recursive: true });
}

// Custom format for logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Main application logger
export const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: logFormat,
  defaultMeta: { service: 'donation-hub-api' },
  transports: [
    new winston.transports.File({ 
      filename: config.LOG_FILE,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
});

// Security events logger
export const securityLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  defaultMeta: { service: 'donation-hub-security' },
  transports: [
    new winston.transports.File({ 
      filename: config.SECURITY_LOG_FILE,
      maxsize: 5242880, // 5MB
      maxFiles: 10,
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
});

// Log security events
export const logSecurityEvent = (
  eventType: string,
  actor?: string,
  ip?: string,
  details?: any
) => {
  securityLogger.info('Security Event', {
    eventType,
    actor,
    ip,
    timestamp: new Date().toISOString(),
    details
  });
};

export default logger;

