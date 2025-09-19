# 🧪 Donation Hub API Testing Guide

This guide explains how to test the Donation Hub API endpoints and Socket.IO functionality.

## 📋 Prerequisites

1. **API Server Running**: Make sure the API server is running on `http://localhost:3001`
2. **MongoDB Running**: Ensure MongoDB is accessible
3. **Admin User Seeded**: Run the seed script to create an admin user

## 🔧 Setup

### 1. Start the API Server
```bash
cd apps/api
npm run dev
```

### 2. Seed Admin User
```bash
npm run db:seed
```

### 3. Verify Health Check
```bash
curl http://localhost:3001/health
```

## 📝 Testing Methods

### 1. HTTP File Testing (Recommended)

Use the `api.http` file with VS Code REST Client extension or IntelliJ HTTP Client:

1. Open `apps/api/api.http` in VS Code
2. Install "REST Client" extension if not already installed
3. Click "Send Request" above each endpoint

### 2. cURL Commands

```bash
# Health check
curl http://localhost:3001/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@donationhub.com","password":"admin123"}'

# Submit pledge
curl -X POST http://localhost:3001/api/pledges \
  -H "Content-Type: application/json" \
  -d '{"donorName":"Test User","contact":{"email":"test@example.com"},"amount":100}'
```

### 3. Socket.IO Testing

Open `apps/api/socket-test.html` in your browser for interactive Socket.IO testing.

## 🧪 Test Scenarios

### Authentication Tests

1. **Login Test**
   - Test with valid credentials
   - Test with invalid credentials
   - Test rate limiting (multiple failed attempts)

2. **Token Refresh**
   - Test refresh token functionality
   - Test with expired tokens

### Pledge Tests

1. **Public Pledge Submission**
   - Submit with all fields
   - Submit with minimal fields
   - Test validation (invalid email, negative amount)
   - Test rate limiting

2. **Admin Pledge Management**
   - List all pledges
   - Update pledge status
   - Erase PII from pledges

### Socket.IO Tests

1. **Connection Tests**
   - Connect without authentication
   - Connect with valid token
   - Test reconnection

2. **Event Tests**
   - Listen for new pledges
   - Listen for stats updates
   - Test admin-only events

## 📊 Expected Responses

### Successful Login
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "Admin User",
      "email": "admin@donationhub.com",
      "role": "admin",
      "createdAt": "..."
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Successful Pledge Submission
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "donorName": "John Doe",
    "amount": 100.5,
    "message": "Supporting Aleppo relief",
    "status": "pending",
    "createdAt": "..."
  },
  "message": "Pledge submitted successfully"
}
```

### Socket.IO Events

**New Pledge Event:**
```json
{
  "pledge": {
    "_id": "...",
    "donorName": "J***e",  // Masked
    "amount": 100.5,
    "createdAt": "..."
  }
}
```

**Stats Update Event:**
```json
{
  "totalCount": 25,
  "totalAmount": 2500.75
}
```

## 🚨 Error Testing

### Validation Errors
- Invalid email format
- Missing required fields
- Amount out of range
- Message too long

### Authentication Errors
- Missing token
- Invalid token
- Expired token
- Insufficient permissions

### Rate Limiting
- Submit multiple pledges quickly
- Multiple login attempts
- Excessive API requests

## 🔍 Debugging

### Check Logs
```bash
# API logs
tail -f apps/api/logs/app.log

# Security logs
tail -f apps/api/logs/security.log
```

### MongoDB Queries
```javascript
// Connect to MongoDB
use donation-hub

// Check pledges
db.pledges.find().pretty()

// Check users
db.users.find().pretty()

// Check security logs
db.securitylogs.find().sort({timestamp: -1}).limit(10).pretty()
```

### Common Issues

1. **Connection Refused**
   - Check if API server is running
   - Verify port 3001 is not blocked

2. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check connection string in .env

3. **Authentication Errors**
   - Verify admin user exists
   - Check JWT secrets in .env

4. **Socket.IO Connection Issues**
   - Check CORS settings
   - Verify WebSocket support

## 📈 Performance Testing

### Load Testing with Artillery
```bash
# Install Artillery
npm install -g artillery

# Run load test
artillery quick --count 100 --num 10 http://localhost:3001/api/pledges/stats
```

### Memory Usage
```bash
# Monitor Node.js process
ps aux | grep node

# Check MongoDB memory
db.serverStatus().mem
```

## 🛡️ Security Testing

### Input Validation
- SQL injection attempts
- XSS payloads
- Large payloads
- Special characters

### Authentication Bypass
- Missing authorization headers
- Invalid JWT tokens
- Token manipulation

### Rate Limiting
- Burst requests
- Sustained high load
- Different IP addresses

## 📝 Test Checklist

- [ ] Health check endpoint
- [ ] Admin login/logout
- [ ] Pledge submission (valid/invalid)
- [ ] Public pledge feed
- [ ] Statistics endpoint
- [ ] Admin pledge management
- [ ] Socket.IO connection
- [ ] Real-time events
- [ ] Rate limiting
- [ ] Input validation
- [ ] Error handling
- [ ] Security headers

## 🎯 Automated Testing

For automated testing, consider using:

- **Jest** for unit tests
- **Supertest** for API testing
- **Socket.IO Client** for WebSocket tests
- **Artillery** for load testing

Example test structure:
```
apps/api/
├── src/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── load/
└── jest.config.js
```

## 📞 Support

If you encounter issues:

1. Check the logs in `apps/api/logs/`
2. Verify environment variables in `.env`
3. Ensure all dependencies are installed
4. Check MongoDB connection
5. Review the API documentation in the code

For additional help, refer to the main README.md file.
