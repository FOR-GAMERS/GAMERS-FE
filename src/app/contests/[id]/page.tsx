"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ContestHero from "@/components/contests/detail/ContestHero";
import ContestBody from "@/components/contests/detail/ContestBody";
import ContestComments from "@/components/contests/detail/ContestComments";

// Mock Data (Simulate API Response)
const MOCK_CONTEST = {
  id: "1",
  title: "VALORANT CHAMPS 2024",
  thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2940&auto=format&fit=crop",
  status: "모집중",
  gameType: "VALORANT",
  description: `
# VALORANT 2024 CHAMPIONSHIP

최고의 팀을 가리기 위한 여정이 시작됩니다.

## 📅 대회 일정
- **모집 기간**: 2024.03.01 ~ 2024.03.14
- **예선**: 2024.03.16 (토) 13:00 ~
- **본선**: 2024.03.23 (토) 15:00 ~

## 🏆 상금 규모
- 1위: 10,000 VP + 우승 뱃지
- 2위: 5,000 VP
- 3위: 2,000 VP

## 📝 참가 규칙
1. 본인 명의의 한국 서버 계정 소유자
2. 티어 제한 없음 (아이언 ~ 레디언트 모두 참여 가능)
3. 디스코드 채널 입장 필수

## ⚠️ 주의사항
대회 당일 불참 시 향후 참가에 불이익이 있을 수 있습니다.
  `,
  currentParticipants: 12,
  maxParticipants: 16,
  entryFee: 0,
  prizePool: "17,000 VP",
  deadline: "D-3",
  comments: [
    {
      id: "c1",
      authorId: "user-123", // Match current user for demo
      author: "GamersKing",
      content: "이번 대회 우승은 우리 팀이 가져갑니다!",
      createdAt: "3시간 전",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
    },
    {
      id: "c2",
      authorId: "user-999",
      author: "NewbiePlayer",
      content: "티어 제한 진짜 없나요? 브론즈도 참여 가능한지 궁금합니다.",
      createdAt: "1일 전"
    }
  ]
};

// Mock Current User
const MOCK_CURRENT_USER = {
    id: "user-123",
    name: "GamersKing",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
};

export default function ContestDetailPage() {
  const params = useParams(); // Get contest ID
  // In a real app, fetch data using params.id
  
  const [data, setData] = useState(MOCK_CONTEST);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Toggle for demo

  const handleJoin = () => {
    alert("참가 신청이 완료되었습니다! (Demo)");
    setData(prev => ({
        ...prev,
        currentParticipants: prev.currentParticipants + 1
    }));
  };

  return (
    <main className="min-h-screen bg-deep-black text-white pb-32">
      {/* 1. Hero Section */}
      <ContestHero 
        title={data.title}
        thumbnailUrl={data.thumbnailUrl}
        status={data.status}
        gameType={data.gameType}
      />

      {/* 2. Body Section (Content + Sticky CTA) */}
      <ContestBody 
        description={data.description}
        ctaProps={{
            currentParticipants: data.currentParticipants,
            maxParticipants: data.maxParticipants,
            entryFee: data.entryFee,
            prizePool: data.prizePool,
            deadline: data.deadline,
            onJoin: handleJoin,
            isLoggedIn: isLoggedIn
        }}
      />

      {/* 3. Comments Section */}
      <ContestComments 
        comments={data.comments} 
        isLoggedIn={isLoggedIn}
        currentUser={MOCK_CURRENT_USER}
      />
    </main>
  );
}
