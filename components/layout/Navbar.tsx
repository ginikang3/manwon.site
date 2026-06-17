"use client";
import Image from "next/image";

export default function Navbar() {
  const handleLogin = () => {
    console.log("로그인 클릭됨");
  };

  return (
    // 배경을 #050706으로 맞추고, 하단 경계선을 아주 어두운 테두리로 변경
    <nav className="fixed top-0 w-full z-[100] bg-[#050706]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center text-lime-300 font-bold text-xl">
          AI Gen
        </div>
        
        <div className="flex items-center gap-8 text-[15px] font-medium text-white/70">
          <button 
            onClick={() => document.getElementById('tool')?.scrollIntoView({behavior:'smooth'})}
            className="hover:text-lime-300 transition"
          >Tool</button>
          <button 
            onClick={() => document.getElementById('info')?.scrollIntoView({behavior:'smooth'})}
            className="hover:text-lime-300 transition"
          >About</button>
          
          {/* 포인트 컬러인 lime-300과 어울리는 버튼 스타일로 변경 */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleLogin();
            }}
            className="bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-xl hover:bg-white/10 transition font-semibold"
          >
            로그인
          </button>
        </div>
      </div>
    </nav>
  );
}