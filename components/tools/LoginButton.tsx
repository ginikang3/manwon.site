"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

export default function LoginButton() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setIsLoggedIn(!!session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setIsLoggedIn(!!session));
    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleAuth = async () => {
    if (isLoggedIn) {
      await supabase.auth.signOut();
      window.location.reload();
    } else {
      const baseUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000' 
        : 'https://www.man-won.site';

      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${baseUrl}/auth/callback` },
      });
    }
  };

  return (
    <button 
      onClick={handleAuth}
      className="bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-xl hover:bg-white/10 transition font-semibold"
    >
      {isLoggedIn === null ? "..." : isLoggedIn ? "로그아웃" : "로그인"}
    </button>
  );
}