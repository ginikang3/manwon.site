"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import SearchForm from "@/components/tools/SearchForm";
import LandingPreview from "@/components/tools/LandingPreview";

export default function ToolSection() {
  const [placeData, setPlaceData] = useState<any>(null);
  const [htmlCode, setHtmlCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSearchResult = (data: any) => {
    setPlaceData(data);
    setHtmlCode("");
  };

  const generateLandingPage = async () => {
    // 1. 인증 상태 확인 (최소한의 검증만 수행)
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      alert("로그인이 필요합니다.");
      return;
    }
    
    if (!placeData) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeData, userId: session.user.id }),
      });
      const data = await res.json();
      if (data?.html) setHtmlCode(data.html);
      else alert("생성 실패");
    } catch (error) {
      alert("서버 오류");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="tool" className="py-20">
      <div className="text-center mb-12">
        <div className="inline-flex px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-lime-300">AI Landing Generator</div>
        <h1 className="text-4xl md:text-5xl font-bold mt-6 leading-tight">
          Google Places →<br /><span className="text-lime-300">자동 랜딩 생성</span>
        </h1>
      </div>

      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-[0_0_80px_rgba(34,197,94,0.08)] max-w-xl mx-auto relative">
        <div className="scale-[0.96] origin-top"><SearchForm onResult={handleSearchResult} /></div>
        {placeData && (
          <div className="mt-6 text-center">
            <div className="text-lg font-semibold text-lime-300">{placeData?.name}</div>
            <div className="mt-2 text-sm text-white/60 break-all">{placeData?.address}</div>
            <button onClick={generateLandingPage} disabled={loading} className="mt-4 w-full h-12 rounded-xl font-semibold bg-gradient-to-r from-lime-400 to-emerald-500 text-black hover:from-lime-300 hover:to-emerald-400 transition">
              {loading ? "생성 중..." : "AI 랜딩페이지 생성"}
            </button>
          </div>
        )}
      </div>
      {htmlCode && <div className="mt-12"><LandingPreview htmlCode={htmlCode} /></div>}
    </section>
  );
}