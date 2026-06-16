"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import SearchForm from "@/components/SearchForm";
import LandingPreview from "@/components/LandingPreview";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [placeData, setPlaceData] = useState<any>(null);
  const [htmlCode, setHtmlCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, [supabase]);

  const handleSearchResult = (data: any) => {
    setPlaceData(data);
    setHtmlCode("");
  };

  // Home 내부
const handleLogin = () => {
  const redirectUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000/auth/callback' 
    : 'https://www.man-won.site/auth/callback';
    
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: redirectUrl },
  });
};

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.reload();
  };

  const generateLandingPage = async () => {
    if (!placeData) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeData, userId: user?.id }),
      });
      const data = await res.json();
      if (data?.html) {
        setHtmlCode(data.html);
      } else {
        alert("생성 실패");
      }
    } catch (error) {
      alert("서버 오류");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-white bg-[#050706]">
      {/* soft neon glow background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-lime-400/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-emerald-400/10 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.06),transparent_60%)]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        {/* Header with Login/Logout */}
        <header className="flex justify-between items-center mb-12">
          <div className="text-lime-300 font-bold text-xl">AI Gen</div>
          {!user ? (
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-white/10 transition"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-4 h-4" alt="Google" />
              로그인
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-lime-500/20 border border-lime-500/50 flex items-center justify-center font-bold text-lime-300">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-white/50 hover:text-white transition"
              >
                로그아웃
              </button>
            </div>
          )}
        </header>

        <div className="text-center mb-12">
          <div className="inline-flex px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-lime-300">
            AI Landing Generator
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mt-6 leading-tight">
            Google Places →<br />
            <span className="text-lime-300">자동 랜딩 생성</span>
          </h1>
        </div>

        {/* search card */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-[0_0_80px_rgba(34,197,94,0.08)] max-w-xl mx-auto relative">
          {!user && <div className="absolute inset-0 z-10 cursor-pointer" onClick={handleLogin} />}
          
          <div className="scale-[0.96] origin-top">
            <SearchForm onResult={handleSearchResult} />
          </div>

          {placeData && (
            <div className="mt-6 text-center">
              <div className="text-lg font-semibold text-lime-300">{placeData?.name}</div>
              <button
                onClick={generateLandingPage}
                disabled={loading}
                className="mt-4 w-full h-12 rounded-xl font-semibold bg-gradient-to-r from-lime-400 to-emerald-500 text-black hover:from-lime-300 hover:to-emerald-400 transition shadow-[0_0_30px_rgba(132,204,22,0.25)]"
              >
                {loading ? "생성 중..." : "AI 랜딩페이지 생성"}
              </button>
            </div>
          )}
        </div>

        {htmlCode && (
          <div className="mt-12">
            <LandingPreview htmlCode={htmlCode} />
          </div>
        )}
      </div>
    </main>
  );
}