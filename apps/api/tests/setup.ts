import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

let mongoServer: MongoMemoryServer;

// Setup test database
beforeAll(async () => {
  // Close any existing connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  // Start in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect to the in-memory database
  await mongoose.connect(mongoUri);
});

// Clean up after each test
afterEach(async () => {
  // Clear all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Clean up after all tests
afterAll(async () => {
  // Close database connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  
  // Stop the in-memory MongoDB instance
  await mongoServer.stop();
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

// Mock socket.io for tests
jest.mock('../src/socket', () => ({
  setupSocketIO: jest.fn(() => ({
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
    on: jest.fn(),
    use: jest.fn(),
  })),
  emitPledgeUpdated: jest.fn(),
  emitStatsUpdate: jest.fn(),
}));

// Mock global.io for socket tests
global.io = {
  to: jest.fn().mockReturnThis(),
  emit: jest.fn(),
} as any;

// Mock the server startup to prevent port conflicts
jest.mock('../src/server', () => {
  const express = require('express');
  const app = express();
  
  // Add basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Mock the server object
  const mockServer: any = {
    listen: jest.fn((port: any, callback?: any) => {
      if (callback) callback();
      return mockServer;
    }),
    close: jest.fn((callback?: any) => {
      if (callback) callback();
    })
  };
  
  return {
    app,
    server: mockServer
  };
});
