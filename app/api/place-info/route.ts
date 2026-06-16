import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    // 1. URL 리다이렉트 추적
    const response = await fetch(url, { redirect: 'follow' });
    const finalUrl = response.url;

    // 2. URL에서 place_id 직접 추출 (가장 정확한 방법)
    // 구글 지도 URL 패턴에서 !1s 뒤에 오는 것이 place_id입니다.
    const placeIdMatch = finalUrl.match(/!1s([^!]+)/) || finalUrl.match(/1s([^!]+)/);
    const placeId = placeIdMatch ? placeIdMatch[1] : null;

    if (!placeId) {
      return NextResponse.json({ error: '장소 ID를 추출할 수 없습니다. 올바른 구글 지도 URL을 사용하세요.' }, { status: 400 });
    }

    // 3. ID로 상세 정보 즉시 호출 (이름 검색 단계 생략)
    const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&language=ko&fields=name,formatted_phone_number,opening_hours,formatted_address,reviews,types,editorial_summary,price_level,rating,user_ratings_total,photos`;
    const detailRes = await fetch(detailUrl);
    const data = await detailRes.json();

    if (data.status !== 'OK') {
      return NextResponse.json({ error: '장소 정보를 불러올 수 없습니다.' }, { status: 400 });
    }

    return NextResponse.json({
      name: data.result.name,
      phone: data.result.formatted_phone_number || "번호 없음",
      hours: data.result.opening_hours?.weekday_text || ["시간 정보 없음"],
      address: data.result.formatted_address,
      reviews: data.result.reviews || [],
      types: data.result.types || [],
      editorialSummary: data.result.editorial_summary?.overview || "",
      priceLevel: data.result.price_level || 0,
      rating: data.result.rating || 0,
      reviewCount: data.result.user_ratings_total || 0,
      photos: data.result.photos || [],
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}