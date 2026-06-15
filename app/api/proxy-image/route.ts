import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const photoRef = searchParams.get('ref');
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) return new NextResponse('API Key is undefined!', { status: 500 });
  if (!photoRef) return new NextResponse('Missing ref', { status: 400 });

  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photo_reference=${photoRef}&key=${apiKey}`;
  
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();

  return new NextResponse(Buffer.from(buffer), {
    headers: { 'Content-Type': 'image/jpeg' }
  });
}