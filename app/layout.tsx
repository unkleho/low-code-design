import { Metadata } from 'next';
import '../styles/globals.css';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Codesign',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Script src="https://cdn.tailwindcss.com"></Script>

      <body>{children}</body>
    </html>
  );
}
