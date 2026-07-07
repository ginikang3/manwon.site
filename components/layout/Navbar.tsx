"use client";
import Image from "next/image";
import LoginButton from "@/components/tools/LoginButton";

export default function Navbar() {
  return (
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
          
          {/* 가격 정보 링크 추가 */}
          <a 
            href="/pricing" 
            className="hover:text-lime-300 transition"
          >Pricing</a>
          
          <button 
            onClick={() => document.getElementById('info')?.scrollIntoView({behavior:'smooth'})}
            className="hover:text-lime-300 transition"
          >About</button>
          
          {/* 로그인 버튼이 스스로 상태를 판단함 */}
          <LoginButton />
        </div>
      </div>
    </nav>
  );
}