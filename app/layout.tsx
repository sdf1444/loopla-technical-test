import { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import Providers from '../components/Providers'; // Wraps app with Emotion + MUI providers

// Load custom Google fonts with CSS variable bindings
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      {/* Apply font variables on <body> so they can be used globally */}
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Wrap the app with global providers (theme, cache, baseline styles) */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}