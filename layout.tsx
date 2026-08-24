import type {Metadata} from 'next';
import './globals.css'; // Global styles
import InternetConnectionAlert from '@/components/InternetConnectionAlert';

export const metadata: Metadata = {
  title: 'GK Wallet - Smart Payments & Coin Transfer',
  description: 'Fast, secure and real-time digital wallet application.',
  openGraph: {
    title: 'GK Wallet - Smart Payments & Coin Transfer',
    description: 'Fast, secure and real-time digital wallet application.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GK Wallet - Smart Payments & Coin Transfer',
    description: 'Fast, secure and real-time digital wallet application.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <InternetConnectionAlert />
        {children}
      </body>
    </html>
  );
}
