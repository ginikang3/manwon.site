import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const response = await fetch(url, { redirect: 'follow' });
    const finalUrl = response.url;
    const placeNameMatch = finalUrl.match(/place\/([^\/]+)/);
    const placeName = placeNameMatch ? decodeURIComponent(placeNameMatch[1]) : null;

    if (!placeName) return NextResponse.json({ error: '장소 정보를 찾을 수 없습니다.' }, { status: 400 });

    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(placeName)}&inputtype=textquery&fields=place_id&key=${apiKey}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.status !== 'OK' || !searchData.candidates.length) return NextResponse.json({ error: '장소 검색 결과가 없습니다.' }, { status: 400 });

    const placeId = searchData.candidates[0].place_id;

    // 상세 정보 및 리뷰 호출 (fields에 reviews 추가)
    const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&language=ko&fields=name,formatted_phone_number,opening_hours,formatted_address,reviews,types,editorial_summary,price_level,rating,user_ratings_total,photos`;
    const detailRes = await fetch(detailUrl);
    const data = await detailRes.json();

   return NextResponse.json({
  name: data.result.name,
  phone: data.result.formatted_phone_number || "번호 없음",
  hours: data.result.opening_hours?.weekday_text || ["시간 정보 없음"],
  address: data.result.formatted_address,
  reviews: data.result.reviews || [],
  types: data.result.types || [], // 추가
  editorialSummary: data.result.editorial_summary?.overview || "", // 추가
  priceLevel: data.result.price_level || 0, // 추가
  rating: data.result.rating || 0, // 추가
  reviewCount: data.result.user_ratings_total || 0, // 추가
  photos: data.result.photos || [], // 추가 (사진 참조값 배열)
});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}