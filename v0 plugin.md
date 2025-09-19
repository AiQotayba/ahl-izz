
# Tech Stack

- Nextjs (App Router)
- React
- Tailwindcss 
- Skeleton UI & supprted RTL
- Framer Motion
- Sonner
- ShadCN UI
- React Query
- React Hook Form
- supprted all components RTL & LTR for languages
- data validation with zod
- Responsive Design (mobile first)
- notifications
   
## note
not always use use-toast and replace it with sonner

## Rules files structure 
```yaml
/app
  - default support RTL all content
  - default support SEO-important pages
  - default support CSR and SSR
  - default support lazy loading
  - default support code splitting 
  - max files 400 lines
  - create files *.test.tsx for components
  - Automated testing coverage (minimum 80%)
  - Content Security Policy (CSP)
  /page.tsx 
    - For SEO-important pages:
      - Use Server-Side Rendering (SSR)
      - Move client-side components (using hooks/animations) to separate files
    - For non-SEO pages:
      - Can use Client-Side Rendering (CSR) or SSR freely 
    - data fetching
      - use react-query if client-side
      - use swr if server-side
  /loading.tsx # use for loading skeleton
  /error.tsx # use for error page
  /layout.tsx # use for layout
  /not-found.tsx # use for 404 page 
  ... # this rules for all pages
```
## Table Core
```ts
interface TableCoreProps {
  data: any[];
  columns: Column[];
  rowKey?: string;
  isLoading?: boolean;
  isError?: boolean;
  ...
}

function TableCore({
  data,
  columns,
  rowKey = "id",
}){
  return(
    <>
    </>
  )
}

```


# عند اضافة مكونات UI
- input يجب ان تدعم افتراضيا  
  - اضهار كلمة المرور 
  - ان تدعم ارقام الهواتف عن طريق مكتبة react-phone-number-input
  - اضهار ايقونات
  - اضهار حقل اخياري
  - اضهار حقل مطلوب

# SEO
- add files for SEO-important pages
- add files `robots.txt` and `sitemap.xml` and `favicon.ico` and `manifest.json` 
- ...



---
   
## translation structure
```ts
// /locales/ar.json
{
    "help": "مساعدة"
}

// /locales/en.json
{
    "help": "Help"
}
any-file.tsx
import { getTranslations , getLocale } from "@/lib/i18"
const t = getTranslations("")

<p>{t("common.help")}</p>

// /lib/i18.ts
// example code
import type { Locale } from "@/lib/types"; // تأكد من تعريف نوع Locale

// تعريف ذكي لتحميل ملفات الترجمة
const translationsCache: Record<Locale, any> = {}; // تخزين مؤقت للترجمات

export const getLocale = (): Locale => {
  // منطق تحديد اللغة (مثال: من localStorage أو navigator)
  return localStorage.getItem("locale") || "en";
};

export const getTranslations = (namespace: string) => (path: string) => {
  const locale = getLocale();

  // تحميل الترجمة إذا لم تكن موجودة في التخزين المؤقت
  if (!translationsCache[locale]) {
    try {
      // استيراد ديناميكي للملفات (Next.js أو Webpack)
      translationsCache[locale] = require(`../public/locales/${locale}/${namespace}.json`);
    } catch (error) {
      console.error("Error loading translations:", error);
      return path; // إرجاع المسار كقيمة افتراضية
    }
  }

  // استخراج القيمة باستخدام split لتجنب أخطاء الكتابة
  return path.split(".").reduce((obj, key) => obj?.[key], translationsCache[locale]) || path;
};
... useLocale , ... useTranslations ,...
```