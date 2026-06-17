import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    // 1. URL 리다이렉트 추적
    const response = await fetch(url, { redirect: 'follow' });
    const finalUrl = response.url;

    // 2. URL에서 이름 및 좌표 추출
    const placeNameMatch = finalUrl.match(/place\/([^\/]+)/);
    const placeName = placeNameMatch ? decodeURIComponent(placeNameMatch[1].split('/')[0]) : null;
    
    // URL에서 @lat,lng 정보 추출 (강력한 위치 힌트)
    const coordsMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);

    if (!placeName) {
      return NextResponse.json({ error: '장소 정보를 찾을 수 없습니다.' }, { status: 400 });
    }

    // 3. Location Bias를 적용한 검색 (이름 + 좌표 기반)
    // 50m 반경 내에서 찾도록 설정하여 검색 엔진의 인기순 정렬을 무력화함
    let searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(placeName)}&inputtype=textquery&fields=place_id`;
    
    if (coordsMatch) {
      const [_, lat, lng] = coordsMatch;
      searchUrl += `&locationbias=circle:50@${lat},${lng}`;
    }
    searchUrl += `&key=${apiKey}`;

    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.status !== 'OK' || !searchData.candidates.length) {
      return NextResponse.json({ error: '장소 검색 결과가 없습니다.' }, { status: 400 });
    }

    const placeId = searchData.candidates[0].place_id;

    // 4. 상세 정보 호출
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