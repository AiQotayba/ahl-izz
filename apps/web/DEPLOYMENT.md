# Vercel Deployment Guide - أهل العز لا ينسون

## 🚀 Quick Deploy to Vercel

### Method 1: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd apps/web
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name: ahlel-izz
# - Directory: ./
# - Override settings? No
```

### Method 2: Deploy via GitHub

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add Vercel deployment files"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `apps/web` folder as root directory

3. **Configure Environment Variables**:
   ```bash
   # In Vercel Dashboard > Project Settings > Environment Variables
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/donation-hub
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
   NEXT_PUBLIC_API_URL=https://your-api-domain.com
   ADMIN_EMAIL=admin@ahlel-izz.com
   ADMIN_PASSWORD=your-secure-password
   ```

## 🔧 Environment Variables

### Required Variables:
```bash
# API Configuration (CRITICAL - Frontend needs this to work)
NEXT_PUBLIC_API_URL=https://your-api-domain.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://ahlel-izz.vercel.app
NEXT_PUBLIC_SITE_NAME=أهل العز لا ينسون

# Contact Information
NEXT_PUBLIC_CONTACT_EMAIL=info@ahlel-izz.com
NEXT_PUBLIC_CONTACT_PHONE=+963-XXX-XXX-XXX

# Socket.IO (if using real-time features)
NEXT_PUBLIC_SOCKET_URL=https://your-api-domain.com
```

### Backend API Variables (if deploying API separately):
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/donation-hub

# JWT Secrets (generate strong secrets)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here

# Admin Configuration
ADMIN_EMAIL=admin@ahlel-izz.com
ADMIN_PASSWORD=your-secure-password

# Security
BCRYPT_ROUNDS=12
CORS_ORIGIN=https://ahlel-izz.vercel.app
```

### Optional Variables:
```bash
# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# Vercel
VERCEL_URL=ahlel-izz.vercel.app
VERCEL_ENV=production
```

## 📁 Project Structure for Vercel

```
apps/web/
├── .vercelignore          # Files to ignore during deployment
├── vercel.json           # Vercel configuration
├── next.config.ts        # Next.js configuration
├── package.json          # Dependencies and scripts
├── app/                  # Next.js App Router
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   ├── donate/           # Donation donate
│   ├── admin/            # Admin panel
│   ├── globals.css       # Global styles
│   ├── sitemap.ts        # SEO sitemap
│   └── manifest.ts       # PWA manifest
├── components/           # React components
├── lib/                  # Utility functions
└── public/               # Static assets
    ├── logo.png          # Campaign logo
    ├── bg2.png           # Background image
    ├── fonts/            # Arabic fonts
    └── robots.txt        # SEO robots
```

## 🌐 Custom Domain Setup

1. **Add Domain in Vercel**:
   - Go to Project Settings > Domains
   - Add your custom domain: `ahlel-izz.com`

2. **Configure DNS**:
   ```
   Type: A
   Name: @
   Value: 76.76.19.61

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **SSL Certificate**:
   - Vercel automatically provides SSL certificates
   - HTTPS will be enabled automatically

## 🔒 Security Configuration

### Headers (configured in vercel.json):
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### CORS Configuration:
```json
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
}
```

## 📊 Performance Optimization

### Vercel Optimizations:
- ✅ **Automatic HTTPS**: SSL certificates
- ✅ **Global CDN**: Fast loading worldwide
- ✅ **Image Optimization**: Next.js Image component
- ✅ **Code Splitting**: Automatic bundle optimization
- ✅ **Edge Functions**: Serverless functions at edge

### Bundle Analysis:
```bash
# Analyze bundle size
npm run build
npm run analyze
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

## 📱 PWA Configuration

The app is configured as a Progressive Web App with:
- ✅ **Manifest**: `app/manifest.ts`
- ✅ **Service Worker**: Automatic with Next.js
- ✅ **Offline Support**: Cached assets
- ✅ **Install Prompt**: Add to home screen

## 🔍 SEO Configuration

- ✅ **Sitemap**: `app/sitemap.ts`
- ✅ **Robots**: `public/robots.txt`
- ✅ **Meta Tags**: Configured in `app/layout.tsx`
- ✅ **Open Graph**: Social media sharing
- ✅ **Structured Data**: JSON-LD for search engines

## 📈 Analytics & Monitoring

### Vercel Analytics:
```bash
# Install Vercel Analytics
npm install @vercel/analytics

# Add to layout.tsx
import { Analytics } from '@vercel/analytics/react'
```

### Error Monitoring:
```bash
# Install Sentry
npm install @sentry/nextjs
```

## 🆘 Troubleshooting

### Common Issues:

1. **CORS Errors**:
   ```
   Error: CORS error fetch sw.js:54
   ```
   **Solution**:
   - ✅ **Set API URL**: Ensure `NEXT_PUBLIC_API_URL` is set in Vercel
   - ✅ **API CORS**: Configure your API to allow your Vercel domain
   - ✅ **Fallback**: The app now shows contact info when API is unavailable

2. **Build Failures**:
   ```bash
   # Check build logs
   vercel logs
   
   # Local build test
   npm run build
   ```

3. **Environment Variables**:
   ```bash
   # Check env vars in Vercel dashboard
   # Ensure all required vars are set
   ```

4. **API Connection**:
   ```bash
   # Verify API URL in environment variables
   # Check CORS configuration
   ```

5. **Network Errors**:
   ```
   Error: لا يمكن الاتصال بالخادم
   ```
   **Solution**:
   - ✅ **Check API Status**: Ensure your API is running
   - ✅ **Update API URL**: Set correct `NEXT_PUBLIC_API_URL`
   - ✅ **Contact Info**: Users can still contact you directly

### Support:
- 📧 **Email**: support@ahlel-izz.com
- 📱 **GitHub Issues**: Create issue in repository
- 📚 **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)

---

**أهل العز لا ينسون** - منصة التبرعات لحملة دعم ريف حلب الجنوبي ❤️
