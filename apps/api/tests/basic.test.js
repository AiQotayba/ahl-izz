// Basic API tests for Donation Hub
// Run with: npm test

const request = require('supertest');
const app = require('../src/server').app;

describe('Donation Hub API Tests', () => {
  
  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('running');
    });
  });

  describe('Authentication', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@donationhub.com',
          password: 'admin123'
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('admin@donationhub.com');
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@donationhub.com',
          password: 'wrongpassword'
        })
        .expect(401);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid');
    });
  });

  describe('Pledge Submission', () => {
    it('should submit a valid pledge', async () => {
      const pledgeData = {
        donorName: 'Test User',
        contact: {
          email: 'test@example.com'
        },
        amount: 100.50,
        message: 'Test pledge'
      };

      const response = await request(app)
        .post('/api/pledges')
        .send(pledgeData)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.amount).toBe(100.50);
      expect(response.body.data.status).toBe('pending');
    });

    it('should reject pledge with invalid email', async () => {
      const pledgeData = {
        donorName: 'Test User',
        contact: {
          email: 'invalid-email'
        },
        amount: 100.50
      };

      const response = await request(app)
        .post('/api/pledges')
        .send(pledgeData)
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });

    it('should reject pledge with negative amount', async () => {
      const pledgeData = {
        contact: {
          email: 'test@example.com'
        },
        amount: -10
      };

      const response = await request(app)
        .post('/api/pledges')
        .send(pledgeData)
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });
  });

  describe('Public Endpoints', () => {
    it('should get public pledges', async () => {
      const response = await request(app)
        .get('/api/pledges/public')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should get pledge statistics', async () => {
      const response = await request(app)
        .get('/api/pledges/stats')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.totalCount).toBeDefined();
      expect(response.body.data.totalAmount).toBeDefined();
    });
  });

  describe('Admin Endpoints', () => {
    let accessToken;

    beforeAll(async () => {
      // Login to get access token
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@donationhub.com',
          password: 'admin123'
        });
      
      accessToken = response.body.data.accessToken;
    });

    it('should get all pledges (admin)', async () => {
      const response = await request(app)
        .get('/api/pledges')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should reject admin request without token', async () => {
      const response = await request(app)
        .get('/api/pledges')
        .expect(401);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('token');
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limiting to login attempts', async () => {
      // Make multiple login attempts
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          request(app)
            .post('/api/auth/login')
            .send({
              email: 'admin@donationhub.com',
              password: 'wrongpassword'
            })
        );
      }

      const responses = await Promise.all(promises);
      
      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/pledges')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });
  });
});

// Helper function to clean up test data
afterAll(async () => {
  // Clean up test pledges if needed
  // This would require database access
});
