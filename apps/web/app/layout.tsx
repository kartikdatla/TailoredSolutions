import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Expert Home Improvements | Electrician, Carpenter & Home Renovation',
  description:
    'Professional electrician, carpenter and home improvement services. Quality craftsmanship for all your home renovation needs. Free consultations available.',
  keywords: [
    'electrician',
    'carpenter',
    'home improvements',
    'renovation',
    'electrical work',
    'carpentry',
    'home repair',
  ],
  openGraph: {
    title: 'Expert Home Improvements',
    description: 'Professional electrician, carpenter and home improvement services',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
