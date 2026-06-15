"use client";
import { useState } from 'react';

export default function SearchForm({ onResult }: { onResult: (data: any) => void }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/place-info', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    onResult(data);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input 
        value={url} 
        onChange={(e) => setUrl(e.target.value)}
        className="border p-2 flex-grow" 
        placeholder="구글 맵 URL을 입력하세요" 
      />
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2">
        {loading ? '불러오는 중...' : '검색'}
      </button>
    </form>
  );
}