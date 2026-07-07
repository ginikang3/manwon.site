// components/sections/InfoSection.tsx
export default function InfoSection() {
  const steps = [
    {
      step: "01",
      title: "구글맵 링크 복사",
      description: "구글 지도에서 홍보하고 싶은 매장이나 장소를 검색한 뒤, 공유 주소(링크)를 복사합니다.",
    },
    {
      step: "02",
      title: "링크 붙여넣기",
      description: "복사한 구글맵 링크를 만원 사이트 생성 창에 붙여넣고 생성 버튼을 누릅니다.",
    },
    {
      step: "03",
      title: "AI 자동 생성 및 배포",
      description: "AI가 매장의 위치, 리뷰, 상세 정보를 분석하여 1분 만에 고퀄리티 웹사이트를 만들고 즉시 배포합니다.",
    },
  ];

  return (
    <section id="info" className="py-24 bg-transparent">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            단 3단계, 1분 만에 완성되는 웹사이트
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            복잡한 코딩이나 디자인 지식은 전혀 필요하지 않습니다. 구글 지도 링크 하나만 있으면 충분합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((item, index) => (
            <div 
              key={index} 
              className="relative flex flex-col p-8 bg-[#1a1d1c] border border-white/10 rounded-2xl shadow-sm"
            >
              <div className="text-4xl font-extrabold text-lime-400 mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}