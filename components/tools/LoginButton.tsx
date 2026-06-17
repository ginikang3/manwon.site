"use client";

import { createClient } from '@/lib/supabase';

// 여기서 className을 props로 받도록 정의해야 합니다.
export default function LoginButton({ className }: { className?: string }) {
  const supabase = createClient();

  const handleLogin = async () => {
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : 'https://www.man-won.site';

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${baseUrl}/auth/callback`,
      },
    });
  };

  return (
    <button 
      onClick={handleLogin}
      // 전달받은 className이 있으면 쓰고, 없으면 기본 스타일을 쓰도록 설정
      className={className || "bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"}
    >
      Google로 로그인
    </button>
  );
}