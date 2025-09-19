# أهل العز لا ينسون - API Server

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/ahlel-izz)

## نظرة عامة

API Server لحملة "أهل العز لا ينسون" لدعم ريف حلب الجنوبي في مجالات التعليم والصحة ومياه الشرب.

🌐 **Live Demo**: [api.ahlel-izz.vercel.app](https://api.ahlel-izz.vercel.app)

## الميزات الرئيسية

### 🔐 المصادقة والأمان
- **JWT Authentication**: مصادقة آمنة باستخدام JWT
- **Rate Limiting**: حماية من الهجمات والاستخدام المفرط
- **CORS Protection**: حماية من طلبات المواقع الأخرى
- **Input Validation**: التحقق من صحة البيانات المدخلة
- **Security Logging**: تسجيل الأحداث الأمنية

### 📊 إدارة التبرعات
- **Pledge Submission**: إرسال التبرعات
- **Public Feed**: عرض التبرعات العامة
- **Statistics**: إحصائيات التبرعات
- **Admin Panel**: لوحة تحكم الإدارة
- **PII Protection**: حماية البيانات الشخصية

### 🔄 Real-time Features
- **Socket.IO**: تحديثات فورية للتبرعات
- **Live Statistics**: إحصائيات مباشرة
- **Real-time Notifications**: إشعارات فورية

## التقنيات المستخدمة

### Backend
- **Node.js**: بيئة تشغيل JavaScript
- **Express.js**: إطار عمل الويب
- **TypeScript**: لغة البرمجة
- **MongoDB**: قاعدة البيانات
- **Mongoose**: ODM لـ MongoDB
- **Socket.IO**: التواصل الفوري

### الأمان
- **JWT**: مصادقة المستخدمين
- **bcrypt**: تشفير كلمات المرور
- **Helmet**: أمان HTTP headers
- **CORS**: حماية الطلبات
- **Rate Limiting**: حماية من الهجمات

### الأدوات
- **Winston**: نظام التسجيل
- **Jest**: اختبار الوحدة
- **ESLint**: فحص الكود
- **Morgan**: تسجيل الطلبات

## التشغيل

### التطوير
```bash
# تثبيت التبعيات
npm install

# تشغيل في وضع التطوير
npm run dev

# تشغيل الاختبارات
npm test
```

### البناء
```bash
# بناء المشروع
npm run build

# تشغيل في الإنتاج
npm start
```

## 🚀 النشر على Vercel

### النشر السريع
```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# النشر
vercel --prod
```

### متغيرات البيئة المطلوبة
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/donation-hub

# JWT Secrets
JWT_ACCESS_SECRET=your-super-secret-jwt-access-key-here
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key-here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=https://ahlel-izz.vercel.app,https://ahlel-izz.com

# Admin Configuration
ADMIN_EMAIL=admin@ahlel-izz.com
ADMIN_PASSWORD=your-secure-password
```

## API Endpoints

### Health Check
```http
GET /health
```

### Authentication
```http
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

### Pledges
```http
POST /api/pledges              # إرسال تبرع
GET /api/pledges/public        # التبرعات العامة
GET /api/pledges/stats         # إحصائيات التبرعات
GET /api/pledges               # جميع التبرعات (Admin)
GET /api/pledges/:id           # تبرع محدد (Admin)
PUT /api/pledges/:id           # تحديث تبرع (Admin)
DELETE /api/pledges/:id/erase  # حذف بيانات شخصية (Admin)
```

## Socket.IO Events

### Client Events
- `pledge:submit` - إرسال تبرع جديد
- `pledge:update` - تحديث تبرع

### Server Events
- `pledge:new` - تبرع جديد
- `pledge:updated` - تبرع محدث
- `stats:updated` - إحصائيات محدثة

## الأمان

### Rate Limiting
- **General**: 100 طلب في 15 دقيقة
- **Login**: 5 محاولات في 15 دقيقة
- **Pledge**: 10 تبرعات في 15 دقيقة

### CORS
- **Allowed Origins**: 
  - `http://localhost:3000` (Development)
  - `https://ahlel-izz.vercel.app` (Production)
  - `https://ahlel-izz.com` (Custom Domain)

### Data Protection
- **PII Masking**: إخفاء البيانات الشخصية
- **Input Sanitization**: تنظيف البيانات المدخلة
- **SQL Injection Protection**: حماية من حقن SQL

## الاختبار

```bash
# تشغيل جميع الاختبارات
npm test

# تشغيل الاختبارات مع التغطية
npm run test:coverage

# تشغيل الاختبارات في وضع المراقبة
npm run test:watch
```

## التسجيل

### Log Files
- `logs/app.log` - سجل التطبيق العام
- `logs/security.log` - سجل الأحداث الأمنية

### Log Levels
- `error` - الأخطاء
- `warn` - التحذيرات
- `info` - المعلومات
- `debug` - التصحيح

## استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ قاعدة البيانات**:
   ```bash
   # تحقق من MONGODB_URI
   echo $MONGODB_URI
   ```

2. **خطأ CORS**:
   ```bash
   # تحقق من CORS_ORIGIN
   echo $CORS_ORIGIN
   ```

3. **خطأ JWT**:
   ```bash
   # تحقق من JWT secrets
   echo $JWT_ACCESS_SECRET
   ```

### الدعم
- 📧 **Email**: support@ahlel-izz.com
- 📱 **GitHub Issues**: إنشاء issue في المستودع
- 📚 **API Docs**: [api.ahlel-izz.com/docs](https://api.ahlel-izz.com/docs)

---

**أهل العز لا ينسون** - API Server لحملة دعم ريف حلب الجنوبي ❤️
