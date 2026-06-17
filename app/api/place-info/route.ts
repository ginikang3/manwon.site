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

    const response = await fetch(url, { redirect: 'follow' });
    const finalUrl = response.url;

    // 1. 좌표 추출 (@lat,lng 또는 !3d!4d 패턴 대응)
    const coordsMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || finalUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (!coordsMatch) return NextResponse.json({ error: 'URL에서 좌표를 찾을 수 없습니다.' }, { status: 400 });
    
    const targetLat = parseFloat(coordsMatch[1]);
    const targetLng = parseFloat(coordsMatch[2]);

    const placeNameMatch = finalUrl.match(/place\/([^\/]+)/) || finalUrl.match(/search\/([^\/]+)/);
    const placeName = placeNameMatch ? decodeURIComponent(placeNameMatch[1].split('/')[0]) : "";

    // 2. Nearby Search로 해당 좌표 반경 50m 내 검색 (인기도 무시, 위치 기반)
    const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${targetLat},${targetLng}&radius=50&keyword=${encodeURIComponent(placeName)}&language=ko&key=${apiKey}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.status !== 'OK' || !searchData.results?.length) {
      return NextResponse.json({ error: '해당 위치에서 장소를 찾을 수 없습니다.' }, { status: 400 });
    }

    // 3. 거리 계산 후 가장 가까운 장소 하나만 특정
    const bestPlace = searchData.results.reduce((prev: any, curr: any) => {
      const distPrev = getDistance(targetLat, targetLng, prev.geometry.location.lat, prev.geometry.location.lng);
      const distCurr = getDistance(targetLat, targetLng, curr.geometry.location.lat, curr.geometry.location.lng);
      return distPrev < distCurr ? prev : curr;
    });

    // 4. 상세 정보 호출
    const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${bestPlace.place_id}&key=${apiKey}&language=ko&fields=name,formatted_phone_number,opening_hours,formatted_address,reviews,types,editorial_summary,price_level,rating,user_ratings_total,photos`;
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