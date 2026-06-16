import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    // 1. URL 리다이렉트 최종 경로 확인
    const response = await fetch(url, { redirect: 'follow' });
    const finalUrl = response.url;

    // 2. URL에서 place_id를 직접 추출 시도 (!1s 패턴 사용)
    const placeIdMatch = finalUrl.match(/!1s([^!]+)/) || finalUrl.match(/1s([^!]+)/);
    let placeId = placeIdMatch ? placeIdMatch[1] : null;

    // 3. ID 추출 실패 시 텍스트 기반 검색 수행
    if (!placeId) {
      const placeNameMatch = finalUrl.match(/place\/([^\/]+)/);
      const placeName = placeNameMatch ? decodeURIComponent(placeNameMatch[1]) : null;

      if (!placeName) {
        return NextResponse.json({ error: '장소 정보를 찾을 수 없습니다.' }, { status: 400 });
      }

      const coordsMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      let searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(placeName)}&inputtype=textquery&fields=place_id&key=${apiKey}`;
      
      if (coordsMatch) {
        const [_, lat, lng] = coordsMatch;
        searchUrl += `&locationbias=circle:500@${lat},${lng}`;
      }

      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      if (searchData.status !== 'OK' || !searchData.candidates.length) {
        return NextResponse.json({ error: '장소 검색 결과가 없습니다.' }, { status: 400 });
      }
      placeId = searchData.candidates[0].place_id;
    }

    // 4. 상세 정보 및 리뷰 호출
    const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&language=ko&fields=name,formatted_phone_number,opening_hours,formatted_address,reviews,types,editorial_summary,price_level,rating,user_ratings_total,photos`;
    const detailRes = await fetch(detailUrl);
    const data = await detailRes.json();

    if (!data.result) {
      return NextResponse.json({ error: '장소 상세 정보를 불러올 수 없습니다.' }, { status: 400 });
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