"use client";

export default function LandingPreview({ htmlCode }: { htmlCode: string }) {
  if (!htmlCode) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlCode);
    alert("코드가 복사되었습니다!");
  };

  // Tailwind CDN이 iframe 내부에서 잘 로드되도록 srcDoc을 처리합니다.
  // 특히 스크립트 실행을 허용하는 메타 태그를 보강합니다.
  const processedHtml = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      ${htmlCode}
    </body>
    </html>
  `;

  return (
    <div className="mt-8 w-full space-y-6">
      <div className="h-[600px] border-4 border-gray-200 rounded-lg overflow-hidden shadow-2xl bg-white">
        <iframe
          srcDoc={processedHtml}
          title="AI Landing Page Preview"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>

      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-bold text-gray-400">생성된 HTML 코드</h3>
          <button 
            onClick={handleCopy}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1 rounded transition"
          >
            코드 복사하기
          </button>
        </div>
        <pre className="text-xs font-mono whitespace-pre-wrap break-all max-h-[300px] overflow-y-auto">
          {htmlCode}
        </pre>
      </div>
    </div>
  );
}