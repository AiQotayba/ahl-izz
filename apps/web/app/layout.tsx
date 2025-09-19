import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'أهل العز لا ينسون - دعم ريف حلب الجنوبي',
  description: 'انضم لحملة أهل العز لا ينسون لدعم التعليم والصحة ومياه الشرب في ريف حلب الجنوبي. ساهم في إعادة بناء المستقبل',
  keywords: ['أهل العز لا ينسون', 'ريف حلب الجنوبي', 'التعليم', 'الصحة', 'مياه الشرب', 'تبرع', 'حلب', 'إغاثة', 'خيرية', 'مساعدة', 'donation', 'aleppo', 'relief', 'charity', 'help'],
  authors: [{ name: 'فريق حملة أهل العز لا ينسون' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'أهل العز لا ينسون - دعم ريف حلب الجنوبي',
    description: 'انضم لحملة أهل العز لا ينسون لدعم التعليم والصحة ومياه الشرب في ريف حلب الجنوبي. ساهم في إعادة بناء المستقبل',
    type: 'website',
    locale: 'ar',
  },
};

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1E7B6B" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

