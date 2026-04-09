import type { Metadata } from 'next';
import { Inter, Barlow_Condensed, Space_Grotesk, Koulen } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ClientProviders } from '@/components/providers/client-providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-barlow',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

const koulen = Koulen({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-koulen',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gamers-platform.com'),
  title: {
    default: 'GAMERS | 모든 경쟁이 기억이 되는 곳',
    template: '%s | GAMERS',
  },
  description: '캐주얼부터 정식 리그까지. 당신만의 무대에서 경쟁하세요. 모든 경쟁이 기록되고 기억되는 국내 최대 게이밍 플랫폼 GAMERS.',
  keywords: ['Gaming', 'Esports', 'Tournament', 'Pro Gaming', 'Valorant', 'LoL', 'Community', '게이밍', '이스포츠', '토너먼트', '발로란트', '리그오브레전드', '게임 커뮤니티'],
  authors: [{ name: 'GAMERS Team' }],
  creator: 'GAMERS',
  publisher: 'GAMERS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'GAMERS | 모든 경쟁이 기억이 되는 곳',
    description: '모든 경쟁이 기록되고 기억되는 국내 최대 게이밍 플랫폼 GAMERS. 지금 바로 당신의 첫 대회를 시작하세요.',
    url: 'https://gamers-platform.com',
    siteName: 'GAMERS',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'GAMERS Logo',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GAMERS | 모든 경쟁이 기억이 되는 곳',
    description: '모든 경쟁이 기록되고 기억되는 국내 최대 게이밍 플랫폼 GAMERS.',
    images: ['/logo.png'],
    creator: '@gamers_official',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'GAMERS',
  url: 'https://gamers-platform.com',
  logo: 'https://gamers-platform.com/logo.png',
  description: '국내 최대 실시간 E-스포츠 토너먼트 운영 플랫폼',
  sameAs: [
    'https://twitter.com/gamers_official',
    'https://discord.gg/gamers',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={cn(
          inter.variable,
          barlow.variable,
          spaceGrotesk.variable,
          koulen.variable,
          'min-h-screen bg-background text-foreground font-sans antialiased overflow-x-hidden'
        )}
      >
        <ClientProviders>
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
