# 🏥 Donation Hub - Aleppo Relief Campaign

A modern, secure donation platform built with Next.js 15, Express.js, and MongoDB. This application enables users to submit donation pledges and allows administrators to manage pledges and users with real-time updates.

## ✨ Features

- **Real-time Pledge Feed**: Live updates using Socket.IO
- **Secure Authentication**: JWT with access and refresh tokens
- **Admin Panel**: Complete management interface for pledges and users
- **PII Protection**: Automatic masking of sensitive information
- **Rate Limiting**: Protection against abuse and spam
- **Audit Logging**: Comprehensive security and activity logs
- **Responsive Design**: Modern UI with TailwindCSS and shadcn/ui
- **Docker Support**: Easy deployment with Docker Compose

## 🏗️ Architecture

This is a monorepo containing:

- **Frontend** (`apps/web`): Next.js 15 with App Router, TypeScript, TailwindCSS
- **Backend** (`apps/api`): Express.js with Socket.IO, MongoDB, JWT authentication
- **Shared Types** (`packages/types`): TypeScript definitions shared between frontend and backend
- **Infrastructure** (`infra/`): Docker configurations and deployment scripts

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 8+ (install with `npm install -g pnpm`)
- MongoDB (local or cloud)
- Redis (optional, for rate limiting)

### Why pnpm?

This project uses pnpm for faster, more efficient package management:
- **Faster installs**: Up to 2x faster than npm
- **Disk space efficient**: Shared dependency storage
- **Strict**: Better dependency resolution
- **Monorepo friendly**: Excellent workspace support

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd donation-hub
   
   # Install pnpm if not already installed
   npm install -g pnpm
   
   # Install dependencies
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start the development servers:**
   ```bash
   pnpm run dev
   ```

   This will start:
   - API server on http://localhost:3001
   - Web application on http://localhost:3000

4. **Seed the admin user:**
   ```bash
   pnpm run db:seed
   ```

### Windows Setup

For Windows users, you can use the provided PowerShell scripts:

```powershell
# Quick start (recommended)
.\scripts\quick-start.ps1

# Or step by step
.\scripts\setup.ps1
.\scripts\start-mongodb.ps1
.\scripts\dev.ps1
```

### Troubleshooting Installation Issues

If you encounter network issues with pnpm:

```powershell
# Try the fallback installer
.\scripts\install.ps1

# Or use npm directly
.\scripts\install-npm.ps1

# Or manually with npm
npm install
```

**Common Issues:**
- **Network errors**: Try using npm instead of pnpm
- **Registry issues**: Check your internet connection and firewall
- **Permission errors**: Run PowerShell as Administrator

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/donation-hub 

# JWT Secrets (CHANGE THESE IN PRODUCTION!)
JWT_ACCESS_SECRET=your-super-secret-access-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Admin Seed
ADMIN_EMAIL=admin@donationhub.com
ADMIN_PASSWORD=admin123

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_LOGIN_MAX=5
RATE_LIMIT_PLEDGE_MAX=10

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
SECURITY_LOG_FILE=logs/security.log
```

## 🐳 Docker Deployment

### Using Docker Compose

1. **Build and start all services:**
   ```bash
   cd infra/docker
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Stop services:**
   ```bash
   docker-compose down
   ```

### Services Included

- **MongoDB**: Database with initialization scripts
- **Redis**: Caching and rate limiting
- **API**: Express.js backend
- **Web**: Next.js frontend
- **Nginx**: Reverse proxy with SSL termination

## 📱 Usage

### Public Users

1. **View Campaign**: Visit the homepage to see live pledge feed and statistics
2. **Make a Pledge**: Click "Make a Pledge" to submit a donation
3. **Real-time Updates**: See new pledges appear instantly in the feed

### Administrators

1. **Login**: Access `/admin` with admin credentials
2. **Dashboard**: View campaign statistics and overview
3. **Manage Pledges**: Review, approve, or modify pledges
4. **User Management**: Manage admin users and permissions

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against abuse and DDoS
- **PII Masking**: Automatic masking of sensitive information in public feeds
- **Input Validation**: Comprehensive validation on both client and server
- **Security Headers**: Helmet.js for security headers
- **Audit Logging**: Complete audit trail of all actions
- **CORS Protection**: Configurable cross-origin resource sharing

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### Pledges
- `POST /api/pledges` - Submit new pledge (public)
- `GET /api/pledges/public` - Get public pledges
- `GET /api/pledges/stats` - Get campaign statistics
- `GET /api/pledges` - List all pledges (admin)
- `PUT /api/pledges/:id` - Update pledge (admin)
- `DELETE /api/pledges/:id/erase` - Erase PII (admin)

## 🔌 Socket.IO Events

### Client → Server
- Connection with JWT token for authentication

### Server → Client
- `new-pledge` - New pledge submitted (public feed)
- `stats-update` - Updated campaign statistics
- `pledge-updated` - Pledge status changed (admin only)

## 📊 Database Schema

### User Model
```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  passwordHash: string,
  role: "admin",
  createdAt: Date
}
```

### Pledge Model
```typescript
{
  _id: ObjectId,
  donorName?: string,
  contact?: { email?: string, phone?: string },
  amount: number,
  message?: string,
  status: "pending" | "confirmed" | "cancelled" | "review",
  createdAt: Date
}
```

## 🧪 Development

### Available Scripts

```bash
# Development
pnpm run dev          # Start all services in development mode
pnpm run build        # Build all applications
pnpm run lint         # Lint all code
pnpm run type-check   # Type check all TypeScript

# Database
pnpm run db:seed      # Seed admin user

# Individual services
cd apps/api && pnpm run dev    # API only
cd apps/web && pnpm run dev    # Web only
```

### Project Structure

```
donation-hub/
├── apps/
│   ├── api/                 # Express.js backend
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── middlewares/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── utils/
│   │   │   └── server.ts
│   │   └── package.json
│   └── web/                 # Next.js frontend
│       ├── app/
│       ├── components/
│       ├── lib/
│       └── package.json
├── packages/
│   └── types/               # Shared TypeScript types
├── infra/
│   ├── docker/              # Docker configurations
│   └── nginx/               # Nginx configuration
└── package.json
```

## 🚀 Production Deployment

### Environment Setup

1. **Set strong secrets** in production environment
2. **Use HTTPS** with proper SSL certificates
3. **Configure MongoDB** with authentication
4. **Set up monitoring** and logging
5. **Configure backup** strategies

### Security Checklist

- [ ] Change default JWT secrets
- [ ] Use strong database passwords
- [ ] Enable MongoDB authentication
- [ ] Configure proper CORS origins
- [ ] Set up SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerting
- [ ] Regular security updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the security guidelines

---

**Built with ❤️ for Aleppo relief efforts**
