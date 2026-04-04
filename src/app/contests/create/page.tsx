import { ContestCreateContent } from '@/components/contest/create/ContestCreateContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '새 대회 만들기 | GAMERS',
  description: 'GAMERS에서 나만의 게임 대회를 개최하세요.',
};

export default function ContestCreatePage() {
  return <ContestCreateContent />;
}
