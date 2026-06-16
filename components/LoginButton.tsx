"use client";

import { createClient } from '@/lib/supabase';

export default function LoginButton() {
  const supabase = createClient();

  const handleLogin = async () => {
    // 운영 환경에 맞춘 명시적 리다이렉트 주소
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
      className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
    >
      Google로 로그인
    </button>
  );
}