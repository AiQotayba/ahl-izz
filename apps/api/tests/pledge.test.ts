import request from 'supertest';
import { app } from './app';
import { Pledge } from '../src/models/Pledge';
import { User } from '../src/models/User';
import bcrypt from 'bcryptjs';

describe('Pledge API Tests', () => {
  let testUser: any;
  let accessToken: string;
  let testPledge: any;

  beforeEach(async () => {
    // Create a test admin user
    testUser = await User.create({
      name: 'Test Admin',
      email: 'admin@test.com',
      passwordHash: 'admin123', // Let the pre-save middleware hash it
      role: 'admin'
    });

    // Login to get access token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'admin123'
      });
    
    accessToken = loginResponse.body.data.accessToken;

    // Create a test pledge
    testPledge = await Pledge.create({
      fullName: 'Test Donor',
      email: 'donor@test.com',
      phoneNumber: '+1234567890',
      amount: 100.50,
      message: 'Test donation message',
      pledgeStatus: 'pending',
      paymentMethod: 'pledged'
    });
  });

  describe('POST /api/pledges', () => {
    it('should submit a valid pledge with all fields', async () => {
      const pledgeData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '+1234567890',
        amount: 150.75,
        message: 'Supporting the cause'
      };

      const response = await request(app)
        .post('/api/pledges')
        .send(pledgeData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.fullName).toBe('John Doe');
      expect(response.body.data.amount).toBe(150.75);
      expect(response.body.data.pledgeStatus).toBe('pending');
      expect(response.body.data.paymentMethod).toBe('pledged');
    });

    it('should submit a pledge with minimal required fields', async () => {
      const pledgeData = {
        phoneNumber: '+1234567890',
        amount: 50.00
      };

      const response = await request(app)
        .post('/api/pledges')
        .send(pledgeData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.amount).toBe(50.00);
      expect(response.body.data.pledgeStatus).toBe('pending');
    });

    it('should reject pledge with invalid email', async () => {
      const pledgeData = {
        fullName: 'John Doe',
        email: 'invalid-email',
        phoneNumber: '+1234567890',
        amount: 100.00
      };

      const response = await request(app)
        .post('/api/pledges')
        .send(pledgeData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Validation failed');
    });

    it('should reject pledge with invalid phone number', async () => {
      const pledgeData = {
        fullName: 'John Doe',
        phoneNumber: 'invalid-phone',
        amount: 100.00
      };

      const response = await request(app)
        .post('/api/pledges')
        .send(pledgeData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Validation failed');
    });

    it('should reject pledge with negative amount', async () => {
      const pledgeData = {
        phoneNumber: '+1234567890',
        amount: -10.00
      };

      const response = await request(app)
        .post('/api/pledges')
        .send(pledgeData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Validation failed');
    });

    it('should reject pledge with zero amount', async () => {
      const pledgeData = {
        phoneNumber: '+1234567890',
        amount: 0
      };

      const response = await request(app)
        .post('/api/pledges')
        .send(pledgeData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Validation failed');
    });

    it('should reject pledge with missing required fields', async () => {
      const pledgeData = {
        fullName: 'John Doe'
        // Missing phoneNumber and amount
      };

      const response = await request(app)
        .post('/api/pledges')
        .send(pledgeData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Validation failed');
    });

    it('should reject pledge with too long fullName', async () => {
      const pledgeData = {
        fullName: 'A'.repeat(101), // Too long
        phoneNumber: '+1234567890',
        amount: 100.00
      };

      const response = await request(app)
        .post('/api/pledges')
        .send(pledgeData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Validation failed');
    });

    it('should reject pledge with too long message', async () => {
      const pledgeData = {
        phoneNumber: '+1234567890',
        amount: 100.00,
        message: 'A'.repeat(501) // Too long
      };

      const response = await request(app)
        .post('/api/pledges')
        .send(pledgeData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Validation failed');
    });

    it('should handle server errors gracefully', async () => {
      // Mock Pledge.create to throw an error
      jest.spyOn(Pledge, 'create').mockRejectedValueOnce(new Error('Database error'));

      const pledgeData = {
        phoneNumber: '+1234567890',
        amount: 100.00
      };

      const response = await request(app)
        .post('/api/pledges')
        .send(pledgeData)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Failed to submit pledge');

      // Restore the mock
      jest.restoreAllMocks();
    });
  });

  describe('GET /api/pledges (Admin)', () => {
    it('should get all pledges with pagination', async () => {
      const response = await request(app)
        .get('/api/pledges?page=1&limit=10')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
    });

    it('should filter pledges by status', async () => {
      // Create a confirmed pledge
      await Pledge.create({
        fullName: 'Confirmed Donor',
        phoneNumber: '+1234567891',
        amount: 200.00,
        pledgeStatus: 'confirmed'
      });

      const response = await request(app)
        .get('/api/pledges?pledgeStatus=confirmed')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every((pledge: any) => pledge.pledgeStatus === 'confirmed')).toBe(true);
    });

    it('should sort pledges by amount', async () => {
      const response = await request(app)
        .get('/api/pledges?sortBy=amount&sortOrder=desc')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      const amounts = response.body.data.map((pledge: any) => pledge.amount);
      const sortedAmounts = [...amounts].sort((a, b) => b - a);
      expect(amounts).toEqual(sortedAmounts);
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .get('/api/pledges')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/pledges/:id (Admin)', () => {
    it('should get pledge by ID', async () => {
      const response = await request(app)
        .get(`/api/pledges/${testPledge._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testPledge._id.toString());
      expect(response.body.data.fullName).toBe('Test Donor');
    });

    it('should return 404 for non-existent pledge', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/pledges/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Pledge not found');
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .get(`/api/pledges/${testPledge._id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/pledges/:id (Admin)', () => {
    it('should update pledge status', async () => {
      const response = await request(app)
        .put(`/api/pledges/${testPledge._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          pledgeStatus: 'confirmed'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.pledgeStatus).toBe('confirmed');
    });

    it('should update pledge details', async () => {
      const response = await request(app)
        .put(`/api/pledges/${testPledge._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          fullName: 'Updated Name',
          message: 'Updated message',
          pledgeStatus: 'confirmed'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.fullName).toBe('Updated Name');
      expect(response.body.data.message).toBe('Updated message');
      expect(response.body.data.pledgeStatus).toBe('confirmed');
    });

    it('should update payment method', async () => {
      const response = await request(app)
        .put(`/api/pledges/${testPledge._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          paymentMethod: 'received',
          pledgeStatus: 'confirmed'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.paymentMethod).toBe('received');
      expect(response.body.data.pledgeStatus).toBe('confirmed');
    });

    it('should validate pledge status values', async () => {
      const response = await request(app)
        .put(`/api/pledges/${testPledge._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          pledgeStatus: 'invalid_status'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Validation failed');
    });

    it('should validate payment method values', async () => {
      const response = await request(app)
        .put(`/api/pledges/${testPledge._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          paymentMethod: 'invalid_method'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Validation failed');
    });

    it('should return 404 for non-existent pledge', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/api/pledges/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          pledgeStatus: 'confirmed'
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Pledge not found');
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .put(`/api/pledges/${testPledge._id}`)
        .send({
          pledgeStatus: 'confirmed'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/pledges/:id/erase (Admin)', () => {
    it('should erase PII from pledge', async () => {
      const response = await request(app)
        .delete(`/api/pledges/${testPledge._id}/erase`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('PII erased successfully');

      // Verify PII was erased
      const updatedPledge = await Pledge.findById(testPledge._id);
      expect(updatedPledge?.fullName).toBeUndefined();
      expect(updatedPledge?.email).toBeUndefined();
      expect(updatedPledge?.message).toBeUndefined();
      expect(updatedPledge?.phoneNumber).toBe('[ERASED]');
    });

    it('should return 404 for non-existent pledge', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/pledges/${fakeId}/erase`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Pledge not found');
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .delete(`/api/pledges/${testPledge._id}/erase`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/pledges/excel (Admin)', () => {
    it.skip('should export pledges to Excel', async () => {
      const response = await request(app)
        .get('/api/pledges/excel')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      expect(response.headers['content-disposition']).toContain('attachment');
    });

    it('should handle Excel export errors', async () => {
      // Mock ExcelJS to throw an error
      jest.doMock('exceljs', () => {
        throw new Error('Excel export error');
      });

      const response = await request(app)
        .get('/api/pledges/excel')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });
});
