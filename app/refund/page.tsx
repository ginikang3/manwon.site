    export default function RefundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">환불정책 (Refund Policy)</h1>
      <p className="text-sm text-slate-500 mb-6">시행일: 2026년 7월 7일</p>

      <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">1. 디지털 콘텐츠 및 크레딧 환불 규칙</h2>
          <p>본 서비스가 제공하는 크레딧 및 AI 생성 결과물은 전자상거래법상 복제가 가능한 디지털 콘텐츠에 해당합니다. 구매 후 크레딧을 단 1회라도 소모하여 콘텐츠 생성을 진행한 경우, 상품의 가치가 소모된 것으로 간주하여 환불이 불가능합니다.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">2. 미사용 크레딧의 환불</h2>
          <p>구매 후 크레딧을 전혀 사용하지 않은 경우에 한하여, 구매일로부터 14일 이내에 결제 대행사(Paddle) 또는 당사 고객센터를 통해 환불을 요청하실 수 있습니다. 단, 결제 대행사 수수료 등이 차감되어 환불될 수 있습니다.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">3. 문의 채널</h2>
          <p>환불 및 결제 관련 승인 취소 문의는 서비스 내 고객 지원 채널 또는 Paddle 지원 페이지를 통해 접수해 주시기 바랍니다.</p>
        </section>
      </div>
    </div>
  );
}