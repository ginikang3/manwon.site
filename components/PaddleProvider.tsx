'use client';

import { useEffect, useState } from 'react';
import { initializePaddle, Paddle } from '@paddle/paddle-js';

// 환경 변수에서 토큰을 불러옵니다.
const PADDLE_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

export default function PaddleProvider() {
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);

  useEffect(() => {
    if (!PADDLE_TOKEN) {
      console.error("Paddle Client Token is missing!");
      return;
    }

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
        items: [{ priceId: '여기에_복사한_Price_ID_입력', quantity: 1 }],
      });
    }
  };

  return (
    <div>
      <button 
        onClick={openCheckout}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        결제하기
      </button>
    </div>
  );
}