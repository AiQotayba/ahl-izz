// Test setup file
import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/donation-hub-test';
process.env.JWT_ACCESS_SECRET = 'test-access-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_ACCESS_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.CORS_ORIGIN = 'http://localhost:3000';
process.env.BCRYPT_ROUNDS = '4'; // Faster for tests
process.env.LOG_LEVEL = 'error'; // Reduce log noise in tests

// Global test timeout
if (typeof jest !== 'undefined') {
  jest.setTimeout(10000);
}

// Clean up after all tests
if (typeof afterAll !== 'undefined') {
  afterAll(async () => {
    // Close any open connections
    if ((global as any).mongooseConnection) {
      await (global as any).mongooseConnection.close();
    }
  });
}
