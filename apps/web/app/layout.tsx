import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Donation Hub - Aleppo Relief Campaign',
  description: 'Support the Aleppo relief campaign with your donations',
  keywords: ['donation', 'aleppo', 'relief', 'charity', 'help'],
  authors: [{ name: 'Donation Hub Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" style={{ background: "linear-gradient(146deg, #014341 -35.09%, #0AAE89 81.05%)" }}>
          {children}
        </div>
      </body>
    </html>
  );
}

