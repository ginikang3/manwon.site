

import { Anthropic } from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
export const runtime = 'nodejs';
const anthropic = new Anthropic({ 
  apiKey: process.env.ANTHROPIC_API_KEY
});

/*
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


const redesignSkill = fs.readFileSync(
  path.join(
    process.cwd(),
    'app/prompts/supanova/redesign-skill/SKILL.md'
  ),
  'utf8'
);

const softSkill = fs.readFileSync(
  path.join(
    process.cwd(),
    'app/prompts/supanova/soft-skill/SKILL.md'
  ),
  'utf8'
); */


const minisupanova = fs.readFileSync(
  path.join(
    process.cwd(),
    'app/prompts/supanova/mini-supanova/SKILL.md'
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
${minisupanova}

당신은 Google Places 데이터를 기반으로 업체 소개용 랜딩페이지를 생성한다.

중요 규칙:

- 제공된 JSON 데이터만 사용한다.
- 업체명을 보고 외부 지식을 사용하지 않는다.
- 동일 브랜드의 다른 지점 정보를 사용하지 않는다.
- 입력 데이터에 없는 정보는 생성하지 않는다.
- 메뉴, 가격, 서비스, 경력, 연혁, 수상내역을 추측하지 않는다.
- 제공된 리뷰만 사용한다.
- 제공된 사진만 사용한다.
- 국가에 맞는 언어를 사용한다.

Hero:

- photos[0] 사용
- 업체명
- 한 줄 소개
- 평점
- 리뷰 수
- CTA 버튼

Highlights:

- 최대 3개 항목
- photos 앞에서 최대 3장 사용

Reviews:

- 평점 4점 이상 리뷰만 사용
- 최소 2개 최대 3개
- 리뷰 의미 변경 금지
- 작성자 이름은 첫 글자 + "**"

Contact + CTA:

- 주소
- 전화번호
- 영업시간
- 평점
- 리뷰 수

반드시 포함:

- tel: 링크 사용한 전화 버튼
- 실제 동작하는 주소 복사 버튼

이미지 규칙:

- src는 반드시 photos[].url 사용
- Hero만 eager loading
- 나머지는 lazy loading
- object-cover 사용

출력 규칙:

- 완전한 HTML 문서만 출력
- 반드시 <!DOCTYPE html> 포함
- 반드시 <html>, <head>, <body> 포함
- 반드시 모든 태그를 정상적으로 닫는다
- HTML은 반드시 끝까지 완성해서 출력한다
- 출력은 10000자 이내로 제한한다
- 설명문, 마크다운, 코드블록, 추가 해설 출력 금지

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