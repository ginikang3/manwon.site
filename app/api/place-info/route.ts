import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!url) return NextResponse.json({ error: '입력된 URL이 없습니다.' }, { status: 400 });

    const response = await fetch(url, { redirect: 'follow' });
    const finalUrl = response.url;

    // 1. 좌표 추출 디버깅
    const coordsMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || finalUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (!coordsMatch) {
      return NextResponse.json({ error: `좌표 추출 실패. 최종URL: ${finalUrl}` }, { status: 400 });
    }
    
    // 패턴 매칭 보정: @ 패턴은 [1],[2], !3d 패턴은 [1],[2]를 가져옴
    const lat = coordsMatch[1];
    const lng = coordsMatch[2];

    // 2. 이름 추출 디버깅
    const placeNameMatch = finalUrl.match(/place\/([^\/]+)/) || finalUrl.match(/search\/([^\/]+)/);
    const placeName = placeNameMatch ? decodeURIComponent(placeNameMatch[1].split('/')[0]) : "장소";

    // 3. 구글 API 검색 요청
    const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=500&keyword=${encodeURIComponent(placeName)}&language=ko&key=${apiKey}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.status !== 'OK') {
      return NextResponse.json({ error: `구글 API 오류: ${searchData.status}, 메시지: ${searchData.error_message || '없음'}` }, { status: 400 });
    }

    if (!searchData.results || searchData.results.length === 0) {
      return NextResponse.json({ error: '해당 위치 주변에 검색 결과가 없습니다.' }, { status: 400 });
    }

    const placeId = searchData.results[0].place_id;

    // 4. 상세 정보 호출
    const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&language=ko&fields=name,formatted_phone_number,opening_hours,formatted_address,reviews,types,editorial_summary,price_level,rating,user_ratings_total,photos`;
    const detailRes = await fetch(detailUrl);
    const data = await detailRes.json();

    if (!data.result) {
      return NextResponse.json({ error: '상세 정보를 가져올 수 없습니다.' }, { status: 404 });
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
  } catch (error: any) {
    return NextResponse.json({ error: '서버 로직 에러: ' + error.message }, { status: 500 });
  }
}