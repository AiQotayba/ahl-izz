# Vercel Deployment Guide - أهل العز لا ينسون API

## 🚀 Quick Deploy to Vercel

### Method 1: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd apps/api
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name: ahlel-izz-api
# - Directory: ./
# - Override settings? No
```

### Method 2: Deploy via GitHub

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add API Vercel deployment files"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `apps/api` folder as root directory

3. **Configure Environment Variables**:
   ```bash
   # In Vercel Dashboard > Project Settings > Environment Variables
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/donation-hub
   JWT_ACCESS_SECRET=your-super-secret-jwt-access-key-here
   JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key-here
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   CORS_ORIGIN=https://ahlel-izz.vercel.app,https://ahlel-izz.com
   ADMIN_EMAIL=admin@ahlel-izz.com
   ADMIN_PASSWORD=your-secure-password
   ```

## 🔧 Environment Variables

### Required Variables:
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/donation-hub

# JWT Secrets (generate strong secrets)
JWT_ACCESS_SECRET=your-super-secret-jwt-access-key-here
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key-here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### Recommended Variables:
```bash
# CORS Configuration
CORS_ORIGIN=https://ahlel-izz.vercel.app,https://ahlel-izz.com

# Admin Configuration
ADMIN_EMAIL=admin@ahlel-izz.com
ADMIN_PASSWORD=your-secure-password

# Security
BCRYPT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_LOGIN_MAX=5
RATE_LIMIT_PLEDGE_MAX=10
```

### Optional Variables:
```bash
# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
SECURITY_LOG_FILE=logs/security.log

# URLs
SITE_URL=https://ahlel-izz.com
API_URL=https://api.ahlel-izz.com

# Vercel
VERCEL_URL=api.ahlel-izz.vercel.app
VERCEL_ENV=production
```

## 📁 Project Structure for Vercel

```
apps/api/
├── .vercelignore          # Files to ignore during deployment
├── vercel.json           # Vercel configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── src/                  # Source code
│   ├── server.ts         # Main server file
│   ├── config.ts         # Configuration
│   ├── database.ts       # Database connection
│   ├── controllers/      # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middlewares/      # Express middlewares
│   ├── utils/            # Utility functions
│   └── scripts/          # Database scripts
├── tests/                # Test files
└── dist/                 # Built files (generated)
```

## 🌐 Custom Domain Setup

1. **Add Domain in Vercel**:
   - Go to Project Settings > Domains
   - Add your custom domain: `api.ahlel-izz.com`

2. **Configure DNS**:
   ```
   Type: CNAME
   Name: api
   Value: cname.vercel-dns.com
   ```

3. **SSL Certificate**:
   - Vercel automatically provides SSL certificates
   - HTTPS will be enabled automatically

## 🔒 Security Configuration

### CORS Settings:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://ahlel-izz.vercel.app',
  'https://ahlel-izz.com',
  'https://www.ahlel-izz.com'
];
```

### Rate Limiting:
- **General**: 100 requests per 15 minutes
- **Login**: 5 attempts per 15 minutes
- **Pledge**: 10 submissions per 15 minutes

### Headers (configured in server.ts):
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## 📊 Performance Optimization

### Vercel Optimizations:
- ✅ **Automatic HTTPS**: SSL certificates
- ✅ **Global CDN**: Fast response worldwide
- ✅ **Edge Functions**: Serverless functions at edge
- ✅ **Auto-scaling**: Handles traffic spikes
- ✅ **Zero-downtime**: Seamless deployments

### Database Optimization:
```javascript
// MongoDB connection with optimizations
mongoose.connect(MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
  bufferMaxEntries: 0
});
```

## 🚀 Deployment Commands

### Development:
```bash
npm run dev
```

### Production Build:
```bash
npm run build
npm start
```

### Vercel Deploy:
```bash
vercel --prod
```

## 📱 API Endpoints

### Health Check:
```http
GET /health
```

### Authentication:
```http
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

### Pledges:
```http
POST /api/pledges              # Submit pledge
GET /api/pledges/public        # Public pledges
GET /api/pledges/stats         # Statistics
GET /api/pledges               # All pledges (Admin)
GET /api/pledges/:id           # Specific pledge (Admin)
PUT /api/pledges/:id           # Update pledge (Admin)
DELETE /api/pledges/:id/erase  # Erase PII (Admin)
```

## 🔍 Monitoring & Logging

### Vercel Analytics:
```bash
# Install Vercel Analytics
npm install @vercel/analytics
```

### Error Monitoring:
```bash
# Install Sentry
npm install @sentry/node
```

### Log Files:
- `logs/app.log` - Application logs
- `logs/security.log` - Security events

## 🆘 Troubleshooting

### Common Issues:

1. **Build Failures**:
   ```bash
   # Check build logs
   vercel logs
   
   # Local build test
   npm run build
   ```

2. **Database Connection**:
   ```bash
   # Check MongoDB URI
   echo $MONGODB_URI
   
   # Test connection
   curl https://your-api.vercel.app/health
   ```

3. **CORS Errors**:
   ```bash
   # Check CORS_ORIGIN
   echo $CORS_ORIGIN
   
   # Verify allowed origins in server.ts
   ```

4. **JWT Errors**:
   ```bash
   # Check JWT secrets
   echo $JWT_ACCESS_SECRET
   echo $JWT_REFRESH_SECRET
   ```

5. **Rate Limiting**:
   ```bash
   # Check rate limit settings
   # Adjust in environment variables if needed
   ```

### API Testing:
```bash
# Test health endpoint
curl https://your-api.vercel.app/health

# Test pledge submission
curl -X POST https://your-api.vercel.app/api/pledges \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "message": "Test pledge"}'
```

### Support:
- 📧 **Email**: support@ahlel-izz.com
- 📱 **GitHub Issues**: Create issue in repository
- 📚 **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)

---

**أهل العز لا ينسون** - API Server لحملة دعم ريف حلب الجنوبي ❤️
