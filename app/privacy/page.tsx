export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">개인정보 처리방침 (Privacy Policy)</h1>
      <p className="text-sm text-slate-500 mb-6">시행일: 2026년 7월 7일</p>

      <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">1. 수집하는 개인정보 항목</h2>
          <p>서비스는 회원가입 및 서비스 제공을 위해 아래와 같은 개인정보를 수집합니다.</p>
          <p className="mt-1 font-medium">- 수집항목: 이메일 주소, 프로필 이미지, 로그인 식별 정보(소셜 로그인 연동 데이터)</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">2. 개인정보의 수집 및 이용 목적</h2>
          <p>- 이용자 식별 및 회원 관리</p>
          <p>- 크레딧 잔액 관리 및 서비스 기능 제공</p>
          <p>- 결제 내역 확인 및 고객 상담 처리</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">3. 결제 데이터의 처리</h2>
          <p>이용자의 신용카드 정보, 결제 세부 정보는 결제 대행사인 Paddle에 의해 직접 수집 및 처리되며, 본 서비스의 데이터베이스에는 이용자의 금융 정보가 직접 저장되지 않습니다.</p>
        </section>
      </div>
    </div>
  );
}