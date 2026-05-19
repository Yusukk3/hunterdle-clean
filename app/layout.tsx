import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HunterDle',
  description: 'Jogo fan-made de adivinhação anime-only de Hunter x Hunter',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
