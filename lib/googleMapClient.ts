export async function getPlaceDetails(placeId: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&language=ko`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.status !== "OK") throw new Error("Failed to fetch place data");
  
  return {
    name: data.result.name,
    phone: data.result.formatted_phone_number,
    hours: data.result.opening_hours?.weekday_text,
    address: data.result.formatted_address,
  };
}