"use client";
import { useState } from 'react';

export default function SearchForm({ onResult }: { onResult: (data: any) => void }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/place-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      onResult(data); // 결과 데이터를 상위 컴포넌트로 전달
    } catch (error) {
      console.error("검색 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input 
        value={url} 
        onChange={(e) => setUrl(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-lime-500/50 transition" 
        placeholder="구글 맵 URL을 입력하세요" 
      />
      <button 
        type="submit" 
        disabled={loading} 
        className="bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition disabled:opacity-50 whitespace-nowrap"
      >
        {loading ? '...' : '검색'}
      </button>
    </form>
  );
}