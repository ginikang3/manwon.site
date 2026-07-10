'use client';

import { useEffect, useState } from 'react';
import { initializePaddle, Paddle } from '@paddle/paddle-js';
import Navbar from "@/components/layout/Navbar";
import ToolSection from "@/components/sections/ToolSection";
import InfoSection from "@/components/sections/InfoSection";

// .env.local에서 관리하는 토큰
const PADDLE_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

export default function Home() {
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);

  useEffect(() => {
    if (!PADDLE_TOKEN) return;

    initializePaddle({ 
      environment: 'sandbox', 
      token: PADDLE_TOKEN 
    }).then((paddleInstance: Paddle | undefined) => {
      if (paddleInstance) {
        setPaddle(paddleInstance);
      }
    });
  }, []);

  const openCheckout = () => {
    if (paddle) {
      paddle.Checkout.open({
        // 앞서 Paddle 대시보드에서 생성하여 복사해둔 Price ID 입력
        items: [{ priceId: 'pri_01kx4z5ch29wa6dt8rwjyhxws9', quantity: 1 }],
      });
    }
  };

  return (
    <main className="min-h-screen text-white bg-[#050706]">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-lime-400/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-emerald-400/10 blur-[140px] rounded-full" />
      </div>

      <Navbar />
      <div className="relative max-w-4xl mx-auto px-4">
        <ToolSection />
        
        {/* 심사 통과용 요금제 안내 섹션 */}
        <div className="my-14 p-8 bg-white/[0.02] border border-white/10 rounded-2xl text-center backdrop-blur-sm">
          <span className="px-3 py-1 text-xs font-semibold text-lime-400 bg-lime-400/10 border border-lime-400/20 rounded-full">
            PRO PLAN
          </span>
          <h3 className="text-2xl font-bold mt-3 mb-2 text-white">프리미엄 크레딧 충전</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            단 $10로 최대 50번의 AI 웹사이트 자동 생성 기회를 얻으세요. 복잡한 제약 없이 즉시 전환됩니다.
          </p>
          <div className="text-3xl font-extrabold mb-6 text-lime-400">
            $10 <span className="text-sm font-normal text-gray-500">/ 50 Credits</span>
          </div>
          <button 
            onClick={openCheckout}
            className="px-8 py-3.5 bg-lime-500 text-black font-bold rounded-xl hover:bg-lime-400 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(132,204,22,0.2)]"
          >
            지금 결제하고 생성하기
          </button>
        </div>

        <InfoSection /> 
      </div>
    </main>
  );
}