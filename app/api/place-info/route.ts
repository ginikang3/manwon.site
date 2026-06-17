import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!url) return NextResponse.json({ error: 'URL 없음' }, { status: 400 });

    const response = await fetch(url, { redirect: 'follow' });
    const finalUrl = response.url;

    const coordsMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || finalUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    
    // [디버깅 포인트 1] 좌표 추출 실패 시 에러 로그
    if (!coordsMatch) {
      console.error("좌표 추출 실패. URL:", finalUrl);
      return NextResponse.json({ error: '좌표 추출 실패: ' + finalUrl }, { status: 400 });
    }
    
    const lat = coordsMatch[1] || coordsMatch[1]; 
    const lng = coordsMatch[2] || coordsMatch[2];

    const placeNameMatch = finalUrl.match(/place\/([^\/]+)/) || finalUrl.match(/search\/([^\/]+)/);
    const placeName = placeNameMatch ? decodeURIComponent(placeNameMatch[1].split('/')[0]) : "장소";

    const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50&keyword=${encodeURIComponent(placeName)}&language=ko&key=${apiKey}`;
    
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    // [디버깅 포인트 2] 구글 API가 결과를 못 찾았을 때 상세 로그
    if (searchData.status !== 'OK') {
      console.error("구글 API 검색 실패:", searchData.status, searchData.error_message);
      return NextResponse.json({ error: `구글 검색 실패: ${searchData.status}` }, { status: 400 });
    }

    if (!searchData.results || searchData.results.length === 0) {
      return NextResponse.json({ error: '검색 결과 없음' }, { status: 400 });
    }

    const placeId = searchData.results[0].place_id;

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
    console.error("서버 에러:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}