import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    // 1. 리다이렉트 후 최종 URL 확보
    const response = await fetch(url, { redirect: 'follow' });
    const finalUrl = response.url;

    // 2. URL에서 위도, 경도 추출 (정규식 개선)
    // 구글 지도 URL은 보통 /@lat,lng/ 형태를 포함함
    const coordMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    
    // 3. 장소명 추출 (기존 방식 유지하되 보완)
    const placeNameMatch = finalUrl.match(/place\/([^\/]+)/);
    const placeName = placeNameMatch ? decodeURIComponent(placeNameMatch[1].replace(/\+/g, ' ')) : null;

    if (!placeName) return NextResponse.json({ error: '장소 정보를 찾을 수 없습니다.' }, { status: 400 });

    // 4. 위치 기반 검색(Location Bias) 추가
    // 위도/경도가 추출되면 해당 위치 근처의 장소를 우선 검색하도록 API 파라미터 보완
    let searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(placeName)}&inputtype=textquery&fields=place_id&key=${apiKey}`;
    
    if (coordMatch) {
      searchUrl += `&locationbias=point:${coordMatch[1]},${coordMatch[2]}`;
    }

    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.status !== 'OK' || !searchData.candidates.length) {
      return NextResponse.json({ error: '장소 검색 결과가 없습니다.' }, { status: 400 });
    }

    const placeId = searchData.candidates[0].place_id;

    // 5. 상세 정보 호출
    const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&language=ko&fields=name,formatted_phone_number,opening_hours,formatted_address,reviews,types,editorial_summary,price_level,rating,user_ratings_total,photos`;
    const detailRes = await fetch(detailUrl);
    const data = await detailRes.json();

    if (data.status !== 'OK') return NextResponse.json({ error: '장소 상세 정보 호출 실패' }, { status: 500 });

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