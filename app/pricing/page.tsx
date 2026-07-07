'use client';

import { useEffect, useState } from 'react';
import { initializePaddle, Paddle } from '@paddle/paddle-js';

const PADDLE_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

export default function PricingPage() {
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
        items: [{ priceId: 'pri_01kwyngb4rjvbr2dfd341rqbfb', quantity: 1 }],
      });
    }
  };

  return (
    <main className="min-h-screen text-white bg-[#050706] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 bg-white/[0.02] border border-white/10 rounded-2xl text-center backdrop-blur-sm">
        <span className="px-3 py-1 text-xs font-semibold text-lime-400 bg-lime-400/10 border border-lime-400/20 rounded-full">
          PRO PLAN
        </span>
        <h3 className="text-2xl font-bold mt-3 mb-2 text-white">프리미엄 크레딧 충전</h3>
        <p className="text-gray-400 text-sm mb-6">
          단 $10로 최대 50번의 AI 웹사이트 자동 생성 기회를 얻으세요.
        </p>
        <div className="text-3xl font-extrabold mb-6 text-lime-400">
          $10 <span className="text-sm font-normal text-gray-500">/ 50 Credits</span>
        </div>
        <button 
          onClick={openCheckout}
          className="w-full px-8 py-3.5 bg-lime-500 text-black font-bold rounded-xl hover:bg-lime-400 active:scale-[0.98] transition-all"
        >
          지금 결제하기
        </button>
        <div className="mt-6">
          <a href="/" className="text-sm text-gray-500 hover:text-white transition">
            ← 홈으로 돌아가기
          </a>
        </div>
      </div>
    </main>
  );
}