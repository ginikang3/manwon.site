import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    // 1. URL 리다이렉트 추적
    const response = await fetch(url, { redirect: 'follow' });
    const finalUrl = response.url;

    // 2. 좌표 추출 (좌표가 없으면 작동 불가)
    const coordsMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (!coordsMatch) {
      return NextResponse.json({ error: 'URL에서 좌표 정보를 찾을 수 없습니다.' }, { status: 400 });
    }
    const [_, lat, lng] = coordsMatch;

    // 3. 이름 추출
    const placeNameMatch = finalUrl.match(/place\/([^\/]+)/);
    const placeName = placeNameMatch ? decodeURIComponent(placeNameMatch[1].split('/')[0]) : null;

    // 4. Nearby Search API 사용 (이름 검색이 아닌 좌표 기반 탐색)
    // 50m 반경 내에서 keyword와 가장 일치하는 장소를 찾음
    const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50&keyword=${encodeURIComponent(placeName || '')}&language=ko&key=${apiKey}`;
    
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.status !== 'OK' || !searchData.results.length) {
      return NextResponse.json({ error: '해당 좌표 주변에서 장소를 찾을 수 없습니다.' }, { status: 400 });
    }

    // 5. 첫 번째 결과가 바로 해당 좌표의 가게임
    const placeId = searchData.results[0].place_id;

    // 6. 상세 정보 호출
    const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&language=ko&fields=name,formatted_phone_number,opening_hours,formatted_address,reviews,types,editorial_summary,price_level,rating,user_ratings_total,photos`;
    const detailRes = await fetch(detailUrl);
    const data = await detailRes.json();

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