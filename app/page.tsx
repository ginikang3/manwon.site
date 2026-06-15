"use client";
import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import LandingPreview from "@/components/LandingPreview";

export default function Home() {
  const [placeData, setPlaceData] = useState<any>(null);
  const [htmlCode, setHtmlCode] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSearchResult = (data: any) => {
    setPlaceData(data);
    setHtmlCode("");
  };

  const generateLandingPage = async () => {
    if (!placeData) return;

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeData }),
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

        {/* header */}
        <div className="text-center mb-12">
          <div className="inline-flex px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-lime-300">
            AI Landing Generator
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mt-6 leading-tight">
            Google Places →<br />
            <span className="text-lime-300">자동 랜딩 생성</span>
          </h1>

          <p className="text-white/50 mt-4 text-sm md:text-base max-w-xl mx-auto">
            업체 검색하면 바로 마케팅용 사이트 생성
          </p>
        </div>

        {/* search card */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-[0_0_80px_rgba(34,197,94,0.08)] max-w-xl mx-auto">

          <div className="scale-[0.96] origin-top">
            <SearchForm onResult={handleSearchResult} />
          </div>

          {/* result */}
          {placeData && (
            <div className="mt-6 text-center">
              <div className="text-lg font-semibold text-lime-300">
                {placeData?.name}
              </div>

              <button
                onClick={generateLandingPage}
                disabled={loading}
                className="mt-4 w-full h-12 rounded-xl font-semibold bg-gradient-to-r from-lime-400 to-emerald-500 text-black hover:from-lime-300 hover:to-emerald-400 transition shadow-[0_0_30px_rgba(132,204,22,0.25)]"
              >
                {loading ? "생성 중..." : "AI 랜딩페이지 생성"}
              </button>

              <div className="text-xs text-white/40 mt-2">
                자동으로 고급 랜딩페이지 생성됨
              </div>
            </div>
          )}
        </div>

        {/* preview */}
        {htmlCode && (
          <div className="mt-12">
            <LandingPreview htmlCode={htmlCode} />
          </div>
        )}
      </div>
    </main>
  );
}