import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/contexts/app-provider';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Locker',
  description: 'Securely manage your credentials and messages.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js" strategy="lazyOnload" />
      </head>
      <body className="font-body antialiased bg-background">
        <AppProvider>
          {children}
        </AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
