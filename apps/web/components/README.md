# Components Documentation - حملة أهل العز لا ينسون

## UI Components

### Input
مكون Input محسن يدعم:
- ✅ عرض كلمة المرور
- ✅ دعم أرقام الهواتف
- ✅ عرض الأيقونات
- ✅ عرض الحقول الاختيارية
- ✅ عرض الحقول المطلوبة
- ✅ دعم RTL/LTR
- ✅ رسائل الخطأ

```tsx
<Input
  label="اسم المستخدم"
  required
  icon={<User className="h-4 w-4" />}
  error={errors.username?.message}
  dir="rtl"
  {...register('username')}
/>
```

### PhoneInputField
مكون خاص بأرقام الهواتف:
- ✅ دعم جميع الدول
- ✅ تنسيق تلقائي
- ✅ دعم RTL/LTR
- ✅ رسائل الخطأ

```tsx
<PhoneInputField
  label="رقم الهاتف"
  value={phone}
  onChange={setPhone}
  error={errors.phone?.message}
  dir="ltr"
/>
```

### Textarea
مكون Textarea محسن:
- ✅ دعم RTL/LTR
- ✅ رسائل الخطأ
- ✅ تسميات واضحة

```tsx
<Textarea
  label="الرسالة"
  optional
  error={errors.message?.message}
  dir="rtl"
  {...register('message')}
/>
```

## Design System

### Colors
- Primary: `#1E7B6B` (Teal)
- Secondary: `#2F4F4F` (Dark Teal)
- Accent: `#B89B2F` (Gold)
- Success: `#20B2AA` (Light Sea Green)

### Typography
- Font Family: Somar (Arabic)
- RTL Support: Default
- Font Weights: 300, 400, 500, 700

### Spacing
- Consistent spacing using Tailwind classes
- 8px base unit
- Responsive design

## Standards Applied

✅ **v0 Plugin Standards**
- RTL support for all components
- Mobile-first responsive design
- Consistent error handling
- Accessibility features
- TypeScript support

✅ **SEO Optimization**
- Proper meta tags
- Open Graph support
- Sitemap generation
- Robots.txt

✅ **Performance**
- Code splitting
- Lazy loading
- Optimized images
- Minimal bundle size