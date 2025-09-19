# أهل العز لا ينسون - منصة التبرعات

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/ahlel-izz)

## نظرة عامة

منصة تبرعات مخصصة لحملة "أهل العز لا ينسون" لدعم ريف حلب الجنوبي في مجالات التعليم والصحة ومياه الشرب.

🌐 **Live Demo**: [ahlel-izz.vercel.app](https://ahlel-izz.vercel.app)

## الميزات الرئيسية

### 🎯 أهداف الحملة
- **دعم التعليم**: إعادة تأهيل المدارس وتوفير المستلزمات المدرسية
- **تعزيز الصحة**: دعم المراكز الطبية وتأمين الأدوية والخدمات العلاجية
- **تأمين المياه**: إصلاح الشبكات وتأهيل مصادر المياه

### 🚀 الميزات التقنية
- **تصميم متجاوب**: يعمل على جميع الأجهزة (Mobile First)
- **دعم RTL**: دعم كامل للغة العربية
- **واجهة حديثة**: تصميم عصري مع Tailwind CSS
- **أمان عالي**: تشفير البيانات وحماية المعلومات الشخصية
- **SEO محسن**: تحسين محركات البحث
- **PWA**: تطبيق ويب تقدمي

## التقنيات المستخدمة

### Frontend
- **Next.js 15** (App Router)
- **React 18** مع TypeScript
- **Tailwind CSS** للتصميم
- **ShadCN UI** للمكونات
- **React Hook Form** + **Zod** للتحقق من البيانات
- **React Phone Number Input** لأرقام الهواتف
- **Framer Motion** للحركات
- **Sonner** للإشعارات

### Backend
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **Socket.IO** للتفاعل المباشر
- **JWT** للمصادقة
- **Winston** للتسجيل

## هيكل المشروع

```
apps/web/
├── app/                    # صفحات Next.js
│   ├── form/              # صفحة التبرع
│   ├── admin/             # لوحة الإدارة
│   ├── globals.css        # الأنماط العامة
│   ├── layout.tsx         # التخطيط الرئيسي
│   ├── page.tsx           # الصفحة الرئيسية
│   ├── loading.tsx        # صفحة التحميل
│   ├── error.tsx          # صفحة الخطأ
│   ├── not-found.tsx      # صفحة 404
│   ├── sitemap.ts         # خريطة الموقع
│   └── manifest.ts        # ملف التطبيق
├── components/            # المكونات
│   ├── ui/               # مكونات واجهة المستخدم
│   │   ├── input.tsx     # حقل الإدخال المحسن
│   │   ├── phone-input.tsx # حقل الهاتف
│   │   ├── textarea.tsx  # منطقة النص
│   │   └── ...
│   ├── Logo.tsx          # شعار الحملة
│   ├── LiveDonations.tsx # التبرعات المباشرة
│   ├── TopDonations.tsx  # أكبر المساهمين
│   ├── TotalDonations.tsx # إجمالي التبرعات
│   └── DonorsCount.tsx   # عدد المتبرعين
├── lib/                  # المكتبات المساعدة
└── public/              # الملفات العامة
    ├── fonts/           # خطوط Somar
    ├── logo.png         # شعار الحملة
    └── bg2.png          # خلفية الموقع
```

## المكونات المحسنة

### Input Component
```tsx
<Input
  label="اسم المتبرع"
  required
  icon={<User className="h-4 w-4" />}
  error={errors.username?.message}
  dir="rtl"
  {...register('username')}
/>
```

### Phone Input Component
```tsx
<PhoneInputField
  label="رقم الهاتف"
  value={phone}
  onChange={setPhone}
  error={errors.phone?.message}
  dir="ltr"
/>
```

## الألوان والتصميم

### نظام الألوان
- **Primary**: `#1E7B6B` (Teal)
- **Secondary**: `#2F4F4F` (Dark Teal)
- **Accent**: `#B89B2F` (Gold)
- **Success**: `#20B2AA` (Light Sea Green)

### الخطوط
- **Somar**: خط عربي مخصص
- **أوزان الخط**: 300, 400, 500, 700

## التشغيل

### التطوير
```bash
npm run dev
```

### البناء
```bash
npm run build
```

### الإنتاج
```bash
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

### النشر عبر GitHub
1. ادفع الكود إلى GitHub
2. اذهب إلى [vercel.com](https://vercel.com)
3. استورد المشروع من GitHub
4. اختر مجلد `apps/web` كجذر المشروع
5. أضف متغيرات البيئة المطلوبة

### متغيرات البيئة المطلوبة
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/donation-hub
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
NEXT_PUBLIC_API_URL=https://your-api-domain.com
ADMIN_EMAIL=admin@ahlel-izz.com
ADMIN_PASSWORD=your-secure-password
```

📖 **دليل النشر الكامل**: راجع [DEPLOYMENT.md](./DEPLOYMENT.md)

## SEO والتحسين

- ✅ **Meta Tags**: محسنة للعربية
- ✅ **Open Graph**: دعم كامل
- ✅ **Sitemap**: تلقائي
- ✅ **Robots.txt**: محسن
- ✅ **PWA**: تطبيق ويب تقدمي
- ✅ **Performance**: محسن للأداء

## الأمان

- ✅ **HTTPS**: تشفير البيانات
- ✅ **JWT**: مصادقة آمنة
- ✅ **Rate Limiting**: حماية من الهجمات
- ✅ **Input Validation**: التحقق من البيانات
- ✅ **PII Masking**: حماية المعلومات الشخصية

## المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. Commit التغييرات
4. Push للفرع
5. إنشاء Pull Request

## الترخيص

هذا المشروع مخصص لحملة "أهل العز لا ينسون" - جميع الحقوق محفوظة.

---

**أهل العز لا ينسون واجبهم تجاه مجتمعهم** ❤️
