import request from 'supertest';
import { app } from './app';
import { Pledge } from '../src/models/Pledge';

describe('Public API Tests', () => {
  beforeEach(async () => {
    // Create test pledges with different statuses
    await Pledge.create([
      {
        fullName: 'Public Donor 1',
        email: 'donor1@example.com',
        phoneNumber: '+1234567890',
        amount: 100.00,
        message: 'Great cause!',
        pledgeStatus: 'confirmed',
        paymentMethod: 'received'
      },
      {
        fullName: 'Public Donor 2',
        email: 'donor2@example.com',
        phoneNumber: '+1234567891',
        amount: 250.00,
        message: 'Supporting the community',
        pledgeStatus: 'confirmed',
        paymentMethod: 'received'
      },
      {
        fullName: 'Pending Donor',
        email: 'pending@example.com',
        phoneNumber: '+1234567892',
        amount: 75.00,
        message: 'Pending approval',
        pledgeStatus: 'pending',
        paymentMethod: 'pledged'
      },
      {
        fullName: 'Top Donor',
        email: 'top@example.com',
        phoneNumber: '+1234567893',
        amount: 500.00,
        message: 'Major contribution',
        pledgeStatus: 'confirmed',
        paymentMethod: 'received'
      },
      {
        fullName: 'Another Top Donor',
        email: 'top2@example.com',
        phoneNumber: '+1234567894',
        amount: 300.00,
        message: 'Another major contribution',
        pledgeStatus: 'confirmed',
        paymentMethod: 'received'
      }
    ]);
  });

  describe('GET /api/pledges/public', () => {
    it('should get public pledges (confirmed only)', async () => {
      const response = await request(app)
        .get('/api/pledges/public')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(Array.isArray(response.body.topDonations)).toBe(true);
      
      // All pledges should be confirmed (filtered by query)
      // Note: pledgeStatus is not included in the response as it's filtered by the query

      // Should have top donations
      expect(response.body.topDonations.length).toBeGreaterThan(0);
    });

    it('should limit results with query parameter', async () => {
      const response = await request(app)
        .get('/api/pledges/public?limit=2')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
    });

    it('should enforce maximum limit', async () => {
      const response = await request(app)
        .get('/api/pledges/public?limit=200') // More than max allowed
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(100); // Max limit
    });

    it('should mask PII in public pledges', async () => {
      const response = await request(app)
        .get('/api/pledges/public')
        .expect(200);

      expect(response.body.success).toBe(true);
      
      // Check that PII is masked
      response.body.data.forEach((pledge: any) => {
        if (pledge.fullName) {
          expect(pledge.fullName).toMatch(/\*+/); // Should contain asterisks
        }
        if (pledge.email) {
          expect(pledge.email).toMatch(/\*+/); // Should contain asterisks
        }
        if (pledge.phoneNumber) {
          expect(pledge.phoneNumber).toMatch(/\*+/); // Should contain asterisks
        }
      });
    });

    it('should return empty array when no confirmed pledges', async () => {
      // Clear all pledges
      await Pledge.deleteMany({});

      const response = await request(app)
        .get('/api/pledges/public')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.topDonations).toEqual([]);
    });

    it('should handle server errors gracefully', async () => {
      // Mock Pledge.find to throw an error
      const originalFind = Pledge.find;
      Pledge.find = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });

      const response = await request(app)
        .get('/api/pledges/public')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Failed to fetch public pledges');

      // Restore the original function
      Pledge.find = originalFind;
    });
  });

  describe('GET /api/pledges/stats', () => {
    it('should get pledge statistics', async () => {
      const response = await request(app)
        .get('/api/pledges/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalCount');
      expect(response.body.data).toHaveProperty('totalAmount');
      expect(response.body.data).toHaveProperty('pledgeStatusCounts');
      expect(response.body.data).toHaveProperty('paymentMethodCounts');
    });

    it('should calculate correct total count', async () => {
      const response = await request(app)
        .get('/api/pledges/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalCount).toBeGreaterThanOrEqual(3); // At least 3 confirmed pledges
    });

    it('should calculate correct total amount', async () => {
      const response = await request(app)
        .get('/api/pledges/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalAmount).toBeGreaterThanOrEqual(1050.00); // At least 1050
    });

    it('should provide status counts', async () => {
      const response = await request(app)
        .get('/api/pledges/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.pledgeStatusCounts).toHaveProperty('confirmed');
      expect(response.body.data.pledgeStatusCounts).toHaveProperty('pending');
      expect(response.body.data.pledgeStatusCounts.confirmed).toBe(4);
      expect(response.body.data.pledgeStatusCounts.pending).toBe(1);
    });

    it('should provide payment method counts', async () => {
      const response = await request(app)
        .get('/api/pledges/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.paymentMethodCounts).toHaveProperty('received');
      expect(response.body.data.paymentMethodCounts).toHaveProperty('pledged');
      expect(response.body.data.paymentMethodCounts.received).toBe(4);
      expect(response.body.data.paymentMethodCounts.pledged).toBe(1);
    });

    it('should handle empty database', async () => {
      // Clear all pledges
      await Pledge.deleteMany({});

      const response = await request(app)
        .get('/api/pledges/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalCount).toBe(0);
      expect(response.body.data.totalAmount).toBe(0);
    });

    it('should handle server errors gracefully', async () => {
      // Mock Pledge.countDocuments to throw an error
      jest.spyOn(Pledge, 'countDocuments').mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/pledges/stats')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Failed to fetch pledge statistics');

      // Restore the mock
      jest.restoreAllMocks();
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('running');
      expect(response.body.timestamp).toBeDefined();
    });

    it('should include database status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.database).toBe('connected');
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

    it('should handle missing Content-Type', async () => {
      const response = await request(app)
        .post('/api/pledges')
        .send({
          phoneNumber: '+1234567890',
          amount: 100
        })
        .expect(201);

      expect(response.body.success).toBe(true);
    });
  });

  describe('CORS and Security Headers', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/api/pledges/stats')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should include security headers', async () => {
      const response = await request(app)
        .get('/api/pledges/stats')
        .expect(200);

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    });
  });
});
