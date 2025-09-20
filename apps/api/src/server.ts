import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { config } from './config';
import { connectDatabase } from './database';
import { logger } from './utils/logger';
import { setupSocketIO } from './socket';

// Import routes
import authRoutes from './routes/auth';
import pledgeRoutes from './routes/pledges';

const app = express();
const server = createServer(app);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3100',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'https://ahl-izz.vercel.app',
  'https://ahlel-izz.com',
  'https://www.ahlel-izz.com',
  'https://aleppo-azz.vercel.app',
  'https://aleppo-azz.com',
  'https://www.aleppo-azz.com'
];

// Add custom origins from environment
if (config.CORS_ORIGIN) {
  const customOrigins = config.CORS_ORIGIN.split(',').map((origin: string) => origin.trim());
  allowedOrigins.push(...customOrigins);
}

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // In development, allow all origins
    if (config.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // Log the rejected origin for debugging
    logger.warn(`CORS: Rejected origin: ${origin}`);
    logger.info(`CORS: Allowed origins: ${allowedOrigins.join(', ')}`);

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count']
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Logging middleware
if (config.NODE_ENV === 'development') {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim())
    }
  }));
}


// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'أهل العز لا ينسون - API يعمل بنجاح',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: config.NODE_ENV,
      version: '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cors: {
        allowedOrigins: allowedOrigins.slice(0, 3) // Show first 3 for security
      }
    }
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'أهل العز لا ينسون - API',
    data: {
      name: 'أهل العز لا ينسون API',
      description: 'منصة التبرعات لدعم ريف حلب الجنوبي',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        auth: '/api/auth',
        pledges: '/api/pledges',
        public: '/api/pledges/public',
        stats: '/api/pledges/stats'
      },
      documentation: 'https://github.com/your-repo/docs'
    }
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/pledges', pledgeRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', error);

  res.status(500).json({
    success: false,
    error: config.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message
  });
});

// Setup Socket.IO
const io = setupSocketIO(server);

// Make io available globally for use in controllers
declare global {
  var io: any;
}
global.io = io;

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start HTTP server
    server.listen(config.PORT, () => {
      logger.info(`🚀 Server running on port ${config.PORT}`);
      logger.info(`📊 Environment: ${config.NODE_ENV}`);
      logger.info(`🔗 CORS Origin: ${config.CORS_ORIGIN}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export { app, server, io };


