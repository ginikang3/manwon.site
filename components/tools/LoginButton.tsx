"use client";

import { createClient } from '@/lib/supabase';

export default function LoginButton() {
  const handleLogin = async () => {
    const supabase = createClient();
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
      className="bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-xl hover:bg-white/10 transition font-semibold"
    >
      로그인
    </button>
  );
}