import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!url) {
      return NextResponse.json({ error: 'URL이 제공되지 않았습니다.' }, { status: 400 });
    }

    // 1. URL 리다이렉트 추적
    const response = await fetch(url, { redirect: 'follow' });
    const finalUrl = response.url;

    // 2. 좌표 및 이름 추출 (중복 제거 및 정규식 통합)
    // 좌표 패턴 대응: @lat,lng 또는 !3d위도!4d경도
    const coordsMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || finalUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    
    // 이름 추출: place/ 뒤의 문자열
    const placeNameMatch = finalUrl.match(/place\/([^\/]+)/) || finalUrl.match(/search\/([^\/]+)/);
    const placeName = placeNameMatch ? decodeURIComponent(placeNameMatch[1].split('/')[0]) : null;

    console.log("Final URL:", finalUrl);
    console.log("Extracted Name:", placeName);
    console.log("Extracted Coords:", coordsMatch);

    if (!coordsMatch) {
      return NextResponse.json({ error: 'URL에서 좌표(위치)를 찾을 수 없습니다.' }, { status: 400 });
    }
    
    // coordsMatch[1], [2]는 @ 패턴, [1], [2]는 !3d!4d 패턴의 매칭 그룹입니다.
    const lat = coordsMatch[1];
    const lng = coordsMatch[2];

    // 3. Nearby Search API 사용 (좌표 기반 탐색)
    const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50&keyword=${encodeURIComponent(placeName || '')}&language=ko&key=${apiKey}`;
    
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.status !== 'OK' || !searchData.results || searchData.results.length === 0) {
      return NextResponse.json({ error: '해당 좌표 주변에서 장소를 찾을 수 없습니다.' }, { status: 400 });
    }

    // 4. 첫 번째 결과가 바로 해당 좌표의 가게임
    const placeId = searchData.results[0].place_id;

    // 5. 상세 정보 호출
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
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}