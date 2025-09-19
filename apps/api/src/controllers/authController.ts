import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User';
import { SecurityLog } from '../models/SecurityLog';
import config from '../config';
import { logSecurityEvent } from '../utils/logger';

// Validation rules
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
];

// Generate JWT tokens
const generateTokens = (userId: string, email: string, role: string) => {
  const accessToken = jwt.sign(
    { userId, email, role },
    config.JWT_ACCESS_SECRET,
    { expiresIn: config.JWT_ACCESS_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { userId, email, role },
    config.JWT_REFRESH_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

// Login controller
export const login = async (
  req: Request<{}, any, any>,
  res: Response<any>
): Promise<void> => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logSecurityEvent('login_failure', undefined, req.ip, {
        email: req.body.email,
        errors: errors.array()
      });

      res.status(400).json({
        success: false,
        error: 'Validation failed',
        data: errors.array()
      });
      return;
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      logSecurityEvent('login_failure', undefined, req.ip, {
        email,
        reason: 'User not found'
      });

      res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
      return;
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      logSecurityEvent('login_failure', user._id, req.ip, {
        email,
        reason: 'Invalid password'
      });

      res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
      return;
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      user._id,
      user.email,
      user.role
    );

    // Log successful login
    logSecurityEvent('login_success', user._id, req.ip, {
      email: user.email,
      role: user.role
    });

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        },
        accessToken
      }
    });

  } catch (error) {
    logSecurityEvent('login_failure', undefined, req.ip, {
      email: req.body.email,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Refresh token controller
export const refreshToken = async (
  req: Request,
  res: Response<any>
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        error: 'Refresh token not provided'
      });
      return;
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET) as any;

    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      logSecurityEvent('token_invalid', decoded.userId, req.ip, {
        reason: 'User not found during refresh'
      });

      res.clearCookie('refreshToken');
      res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
      return;
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      config.JWT_ACCESS_SECRET,
      { expiresIn: config.JWT_ACCESS_EXPIRES_IN }
    );

    logSecurityEvent('token_refresh', user._id, req.ip, {
      email: user.email
    });

    res.json({
      success: true,
      data: { accessToken }
    });

  } catch (error) {
    logSecurityEvent('token_invalid', undefined, req.ip, {
      error: error instanceof Error ? error.message : 'Unknown error',
      type: 'refresh'
    });

    res.clearCookie('refreshToken');
    res.status(401).json({
      success: false,
      error: 'Invalid refresh token'
    });
  }
};

// Logout controller
export const logout = async (
  req: Request,
  res: Response<any>
): Promise<void> => {
  try {
    logSecurityEvent('login_success', req.user?._id, req.ip, {
      action: 'logout'
    });

    res.clearCookie('refreshToken');
    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Seed admin user (development only)
export const seedAdmin = async (
  req: Request,
  res: Response<any>
): Promise<void> => {
  try {
    if (config.NODE_ENV === 'production') {
      res.status(403).json({
        success: false,
        error: 'Admin seeding is not allowed in production'
      });
      return;
    }

    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
      return;
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      res.status(409).json({
        success: false,
        error: 'Admin user already exists'
      });
      return;
    }

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email,
      passwordHash: password, // Will be hashed by pre-save middleware
      role: 'admin'
    });

    await admin.save();

    logSecurityEvent('admin_action', admin._id, req.ip, {
      action: 'admin_seeded',
      email
    });

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create admin user'
    });
  }
};

