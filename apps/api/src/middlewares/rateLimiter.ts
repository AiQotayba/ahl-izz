import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import config from '../config';
import { logSecurityEvent } from '../utils/logger';

// General rate limiter
export const generalRateLimit = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logSecurityEvent('rate_limit_exceeded', undefined, req.ip, {
      path: req.path,
      method: req.method,
      limit: config.RATE_LIMIT_MAX_REQUESTS,
      windowMs: config.RATE_LIMIT_WINDOW_MS
    });
    
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later'
    });
  }
});

// Strict rate limiter for login attempts
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.RATE_LIMIT_LOGIN_MAX,
  message: {
    success: false,
    error: 'Too many login attempts, please try again in 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req: Request, res: Response) => {
    logSecurityEvent('rate_limit_exceeded', undefined, req.ip, {
      path: req.path,
      method: req.method,
      limit: config.RATE_LIMIT_LOGIN_MAX,
      windowMs: 15 * 60 * 1000,
      type: 'login'
    });
    
    res.status(429).json({
      success: false,
      error: 'Too many login attempts, please try again in 15 minutes'
    });
  }
});

// Rate limiter for pledge submissions
export const pledgeRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: config.RATE_LIMIT_PLEDGE_MAX,
  message: {
    success: false,
    error: 'Too many pledge submissions, please try again in an hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logSecurityEvent('rate_limit_exceeded', undefined, req.ip, {
      path: req.path,
      method: req.method,
      limit: config.RATE_LIMIT_PLEDGE_MAX,
      windowMs: 60 * 60 * 1000,
      type: 'pledge'
    });
    
    res.status(429).json({
      success: false,
      error: 'Too many pledge submissions, please try again in an hour'
    });
  }
});

// Rate limiter for admin actions
export const adminRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // More generous for admin actions
  message: {
    success: false,
    error: 'Too many admin requests, please slow down'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logSecurityEvent('rate_limit_exceeded', req.user?._id, req.ip, {
      path: req.path,
      method: req.method,
      limit: 50,
      windowMs: 5 * 60 * 1000,
      type: 'admin'
    });
    
    res.status(429).json({
      success: false,
      error: 'Too many admin requests, please slow down'
    });
  }
});

