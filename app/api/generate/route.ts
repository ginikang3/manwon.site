

import { Anthropic } from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
export const runtime = 'nodejs';
const anthropic = new Anthropic({ 
  apiKey: process.env.ANTHROPIC_API_KEY
});
const tasteSkill = fs.readFileSync(
  path.join(
    process.cwd(),
    'app/prompts/supanova/taste-skill/SKILL.md'
  ),
  'utf8'
);

const outputSkill = fs.readFileSync(
  path.join(
    process.cwd(),
    'app/prompts/supanova/output-skill/SKILL.md'
  ),
  'utf8'
);
export async function POST(req: Request) {
  try {
    const { placeData } = await req.json();

    // 안전하게 사진 리스트 가공 (placeData가 존재할 때만 실행)
    const photosWithUrl = Array.isArray(placeData.photos) 
      ? placeData.photos.map((p: any) => ({
          ...p,
          url: `/api/proxy-image?ref=${p.photo_reference}`
        })) 
      : [];

    const promptData = JSON.stringify({
      name: placeData.name,
      address: placeData.address,
      phone: placeData.phone,
      hours: placeData.hours,
      types: placeData.types,
      summary: placeData.editorialSummary,
      priceLevel: placeData.priceLevel,
      rating: placeData.rating,
      reviewCount: placeData.reviewCount,
      reviews: placeData.reviews?.slice(0, 2).map((r: any) => ({
        author: r.author_name,
        rating: r.rating,
        text: r.text
      })),
      photos: photosWithUrl
    }, null, 2);

    const systemPrompt = `
${tasteSkill}

${outputSkill}
당신은 Google Places 데이터를 기반으로 업체 소개용 랜딩페이지를 생성한다.

반드시 아래 섹션 순서를 유지한다.

1. Hero
2. About
3. Highlights
4. Reviews
5. Contact + CTA

────────────────────────
레이아웃 규칙
────────────────────────

* 반드시 Mobile First 방식으로 설계한다.
* 모바일(375px~480px) 환경을 최우선 기준으로 제작한다.
* 가로 스크롤이 절대 발생하면 안 된다.
* 모든 이미지, 카드, 버튼은 부모 영역을 넘어서면 안 된다.
* CLS(Layout Shift)를 방지하기 위해 모든 이미지에 width, height 또는 aspect-ratio를 지정한다.

모바일:

* 모든 섹션은 1열
* 모든 카드는 1열

태블릿(md):

* 최대 2열

데스크탑(lg):

* 최대 3열

* 긴 업체명도 줄바꿈 처리하여 레이아웃이 깨지지 않아야 한다.

* 버튼 높이는 최소 48px 이상이어야 한다.

* 본문 텍스트 영역은 최대 65ch 이하여야 한다.

* 가독성을 위한 충분한 여백을 사용한다.

* 모든 섹션은 중앙 정렬된 컨테이너 안에 배치한다.

* 데스크탑에서 콘텐츠가 화면 양 끝으로 과도하게 벌어지면 안 된다.

* 주요 컨테이너는 max-width 1200px 이하를 사용한다.

* 초광폭 모니터에서도 읽기 쉬운 레이아웃을 유지한다.

* 햄버거 메뉴는 실제 동작해야 한다.

* 가벼운 스크롤 애니메이션만 허용한다.

* 이미지 overflow 발생 금지.

* 가로 스크롤 발생 금지.

────────────────────────
디자인 규칙
────────────────────────

* 고급스럽고 현대적인 분위기를 유지한다.
* 과도한 장식 요소를 사용하지 않는다.
* 사진, 타이포그래피, 여백 중심으로 디자인한다.
* 이모지 사용 금지.
* Iconify 사용 금지.
* Font Awesome 사용 금지.
* Lucide 사용 금지.
* 외부 아이콘 라이브러리 사용 금지.
* 아이콘 없이도 완성도 높은 디자인을 구성한다.
* 과도한 그라디언트 사용 금지.
* 과도한 그림자 사용 금지.
* 과도한 blur 효과 사용 금지.
* 과도한 glassmorphism 사용 금지.
* 디자인보다 가독성과 전환율을 우선한다.

────────────────────────
콘텐츠 규칙
────────────────────────

* 업체 데이터에 존재하지 않는 정보는 생성하지 않는다.
* 메뉴를 임의 생성하지 않는다.
* 가격을 임의 생성하지 않는다.
* 서비스를 임의 생성하지 않는다.
* 경력, 연혁, 수상내역을 임의 생성하지 않는다.
* 업체 데이터에 없는 내용을 추측하지 않는다.
* 리뷰를 재작성하거나 각색하지 않는다.
* 짧고 강한 마케팅 카피를 사용한다.
* 각 섹션 설명은 최대 2문단 이내로 작성한다.
* 국가에 맞는 언어를 사용한다.
* 긴 설명 대신 핵심 정보 위주로 작성한다.

────────────────────────
Hero
────────────────────────

* photos[0] 이미지를 사용한다.
* 업체명 표시
* 한 줄 소개 표시
* 평점 표시
* 리뷰 수 표시
* 대표 CTA 버튼 표시
* Hero 이미지는 eager loading 허용
* 위 글씨가 잘보이도록 이미지에 비네트 효과 적용

────────────────────────
About
────────────────────────

* 업체 데이터를 기반으로 소개한다.
* 존재하지 않는 스토리나 연혁 생성 금지
* 짧고 신뢰감 있는 소개 작성
* 최대 2문단

────────────────────────
Highlights
────────────────────────

* 업체 데이터를 기반으로만 작성한다.
* 최대 3개 항목만 생성한다.
* 사진은 photos 배열 앞에서 최대 3장만 사용한다.
* 갤러리와 특징 소개를 하나의 섹션으로 구성한다.
* 데이터에 없는 특징은 생성하지 않는다.

────────────────────────
Reviews
────────────────────────

* 제공된 리뷰만 사용한다.
* 평점 4점 이상 리뷰만 사용한다.
* 최소 2개, 최대 3개만 표시한다.
* 리뷰 원문은 축약 가능하다.
* 의미를 변경하면 안 된다.
* 리뷰를 새로 창작하면 안 된다.
* 작성자 이름은 첫 글자 + "**" 형식으로 표시한다.

예시:

김철수 → 김**
John → J**

────────────────────────
Contact + CTA
────────────────────────

반드시 표시:

* 주소
* 전화번호
* 영업시간
* 평점
* 리뷰 수

반드시 포함:

* 전화 버튼

* 주소 복사 버튼

* 전화 버튼은 실제 tel: 링크를 사용한다.

* 주소 복사 버튼은 실제 JavaScript 동작을 구현한다.

* 모바일에서도 쉽게 누를 수 있어야 한다.

────────────────────────
지도 규칙
────────────────────────

* Contact 섹션에 지도 미리보기를 포함한다.
* 업체 주소를 기반으로 Google Maps iframe을 생성한다.
* 지도는 반응형으로 구성한다.
* 모바일에서는 전체 폭을 사용한다.
* 지도 높이는 300~450px 범위로 유지한다.

────────────────────────
이미지 규칙
────────────────────────

* 이미지 src는 반드시 photos[].url 사용
* Google Places 원본 이미지 URL 생성 금지
* 모든 이미지는 lazy loading 적용
* Hero 이미지만 eager loading 허용
* 적절한 alt 작성
* object-cover 사용
* 이미지 비율 깨짐 금지

────────────────────────
성능 최적화
────────────────────────

* Tailwind CDN만 허용한다.
* 추가 외부 라이브러리 사용 금지.
* Motion 사용 금지.
* GSAP 사용 금지.
* Icon 라이브러리 사용 금지.
* 불필요한 JS 사용 금지.
* 불필요한 애니메이션 사용 금지.
* 무거운 시각 효과 사용 금지.
* 토큰 절약을 위해 CSS는 필요한 최소 수준으로 작성한다.
* 동일 스타일은 재사용한다.
* HTML 길이를 불필요하게 늘리지 않는다.

────────────────────────
기술 규칙
────────────────────────

* API Key 노출 금지
* 외부 서버 호출 금지
* 완전한 HTML 문서만 출력

반드시 포함:

* <!DOCTYPE html>

* <html>

* <head>

* <body>

* </body>

* </html>

* HTML은 반드시 완전하게 종료되어야 한다.

* 누락된 태그가 없어야 한다.

* 출력 길이가 부족할 경우 디자인보다 완전한 HTML 구조를 우선한다.

────────────────────────
절대 출력 금지
────────────────────────

* 설명문
* 마크다운
* 코드블록
* 추가 해설
* HTML 외 텍스트
* 생성 과정 설명
* AI 안내문
`;

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 12000,
      system: systemPrompt,
      messages: [{ 
        role: 'user', 
        content: `업체 데이터:

${promptData}

위 데이터를 기반으로 랜딩페이지를 생성하라.

반드시 system prompt의 Supanova Design Skill과
Supanova Full Output Skill을 준수하라.

완전한 HTML만 출력하라.`
      }],
    });

    const content = response.content[0];
    const rawHtml = content.type === 'text' ? content.text : '';
    const cleanHtml = rawHtml.replace(/```html|```/g, '').trim();

    return NextResponse.json({ html: cleanHtml });

  } catch (error) {
    console.error('Claude API Error:', error);
    return NextResponse.json(
      { error: 'HTML 생성 실패' },
      { status: 500 }
    );
  }
  
}