export default function LandingPreview({ htmlCode }: { htmlCode: string }) {
  if (!htmlCode) return null;

  return (
    <div className="mt-8 w-full space-y-6">
      {/* 1. 디자인 미리보기 */}
      <div className="h-[600px] border-4 border-gray-200 rounded-lg overflow-hidden shadow-2xl">
        <iframe
          srcDoc={htmlCode}
          title="AI Landing Page Preview"
          className="w-full h-full border-none"
        />
      </div>

      {/* 2. 코드 확인 창 (추가됨) */}
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <h3 className="text-sm font-bold mb-2 text-gray-400">생성된 HTML 코드</h3>
        <pre className="text-xs font-mono whitespace-pre-wrap break-all">
          {htmlCode}
        </pre>
      </div>
    </div>
  );
}