import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'NUMMY', template: '%s · NUMMY' },
  description: 'NUMMY — Intelligenza, innovazione e crescita. Smart. Simple. For you.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className="dark">
      <body>{children}</body>
    </html>
  );
}
