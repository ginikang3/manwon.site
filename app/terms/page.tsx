 export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">이용약관 (Terms of Service)</h1>
      <p className="text-sm text-slate-500 mb-6">시행일: 2026년 7월 7일</p>
      
      <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">제 1 조 (목적)</h2>
          <p>본 약관은 man-won.site(이하 "서비스")가 제공하는 AI 기반 랜딩페이지 생성 및 배포 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">제 2 조 (이용계약의 성립)</h2>
          <p>이용계약은 이용자가 본 약관에 동의하고 서비스가 제공하는 계정 생성 절차를 완료함으로써 성립됩니다.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">제 3 조 (서비스의 이용 및 크레딧)</h2>
          <p>1. 이용자는 보유한 크레딧을 소모하여 AI 랜딩페이지 생성 기능을 이용할 수 있습니다.</p>
          <p>2. 서비스는 시스템 점검 등 불가피한 사유가 없는 한 연중무휴 1일 24시간 제공함을 원칙으로 합니다.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">제 4 조 (결제 및 대행)</h2>
          <p>본 서비스의 모든 결제 및 주문 처리는 글로벌 결제 대행사 서비스인 Paddle(Merchant of Record)을 통해 안전하게 위탁되어 처리됩니다.</p>
        </section>
      </div>
    </div>
  );
}