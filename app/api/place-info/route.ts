import { NextResponse } from 'next/server';

// 두 좌표 사이의 거리를 계산하는 함수 (Haversine Formula)
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371e3; // 지구 반경 (미터)
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!url) return NextResponse.json({ error: '입력된 URL이 없습니다.' }, { status: 400 });

    const response = await fetch(url, { redirect: 'follow' });
    const finalUrl = response.url;

    // [1단계] 좌표 추출 검증
    const coordsMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || finalUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (!coordsMatch) {
      return NextResponse.json({ error: `[1단계 실패] URL에서 좌표 추출 불가. 최종 주소: ${finalUrl}` }, { status: 400 });
    }
    
    const targetLat = parseFloat(coordsMatch[1]);
    const targetLng = parseFloat(coordsMatch[2]);

    // [2단계] 이름 추출 및 쿼리 파라미터 정제
    const placeNameMatch = finalUrl.match(/place\/([^\/]+)/) || finalUrl.match(/search\/([^\/]+)/);
    let placeName = placeNameMatch ? decodeURIComponent(placeNameMatch[1].split('/')[0]).replace(/\+/g, ' ') : "";
    // 뒤에 붙은 주소창 파라미터(?hl=ko 등) 제거 안전장치
    if (placeName.includes('?')) {
      placeName = placeName.split('?')[0];
    }

    // [3단계] Nearby Search 요청 및 구글 날것의 에러 캡처
    const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${targetLat},${targetLng}&radius=500&keyword=${encodeURIComponent(placeName)}&language=ko&key=${apiKey}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.status !== 'OK') {
      return NextResponse.json({ 
        error: `[3단계 실패] 구글 API 상태: ${searchData.status}, 메시지: ${searchData.error_message || '없음'}, 검색어: ${placeName}` 
      }, { status: 400 });
    }

    if (!searchData.results?.length) {
      return NextResponse.json({ error: `[3단계 실패] 반경 500m 내에 '${placeName}' 결과 없음.` }, { status: 400 });
    }

    // [4단계] 거리 계산 후 최단거리 장소 특정
    const bestPlace = searchData.results.reduce((prev: any, curr: any) => {
      const distPrev = getDistance(targetLat, targetLng, prev.geometry.location.lat, prev.geometry.location.lng);
      const distCurr = getDistance(targetLat, targetLng, curr.geometry.location.lat, curr.geometry.location.lng);
      return distPrev < distCurr ? prev : curr;
    });

    // [5단계] 상세 정보 호출
    const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${bestPlace.place_id}&key=${apiKey}&language=ko&fields=name,formatted_phone_number,opening_hours,formatted_address,reviews,types,editorial_summary,price_level,rating,user_ratings_total,photos`;
    const detailRes = await fetch(detailUrl);
    const data = await detailRes.json();

    if (data.status !== 'OK') {
      return NextResponse.json({ error: `[5단계 실패] 상세정보 로드 실패: ${data.status}` }, { status: 400 });
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
    console.error(error);
    return NextResponse.json({ error: '서버 에러: ' + error.message }, { status: 500 });
  }
}