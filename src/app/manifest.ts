import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GAMERS | 모든 경쟁이 기억이 되는 곳',
    short_name: 'GAMERS',
    description: '국내 최대 실시간 E-스포츠 토너먼트 운영 플랫폼',
    start_url: '/',
    display: 'standalone',
    background_color: '#030303',
    theme_color: '#00F5A0',
    icons: [
      {
        src: '/logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
