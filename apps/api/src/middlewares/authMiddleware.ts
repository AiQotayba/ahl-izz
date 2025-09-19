import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
// import { IJWTPayload, IApiResponse } from '@donation-hub/types';
import config from '../config';
import { logSecurityEvent } from '../utils/logger';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response<any>,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      logSecurityEvent('unauthorized_access', undefined, req.ip, {
        path: req.path,
        method: req.method,
        reason: 'No token provided'
      });
      
      res.status(401).json({
        success: false,
        error: 'Access token required'
      });
      return;
    }

    const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as any;
    
    // Verify user still exists
    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) {
      logSecurityEvent('token_invalid', decoded.userId, req.ip, {
        reason: 'User not found',
        path: req.path
      });
      
      res.status(401).json({
        success: false,
        error: 'Invalid token - user not found'
      });
      return;
    }

    req.user = {
      _id: user._id,
      email: user.email,
      role: user.role
    };  

    next();
  } catch (error) {
    logSecurityEvent('token_invalid', undefined, req.ip, {
      error: error instanceof Error ? error.message : 'Unknown error',
      path: req.path
    });
    
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

export const requireAdmin = (
  req: Request,
  res: Response<any>,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'admin') {
    logSecurityEvent('unauthorized_access', req.user?._id, req.ip, {
      path: req.path,
      method: req.method,
      reason: 'Insufficient permissions',
      userRole: req.user?.role
    });
    
    res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
    return;
  }
  
  next();
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as any;
      const user = await User.findById(decoded.userId).select('-passwordHash');
      
      if (user) {
        req.user = {
          _id: user._id,
          email: user.email,
          role: user.role
        };
      }
    }
  } catch (error) {
    // Ignore token errors for optional auth
  }
  
  next();
};

