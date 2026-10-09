export const runtime = "nodejs";

const locationFor = (photo) => {
  const location = photo.location || {};
  const name = location.name || location.city || location.country;
  return name ? { name, city: location.city || "", country: location.country || "", latitude: location.position?.latitude ?? null, longitude: location.position?.longitude ?? null } : null;
};

export async function GET(request) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  const query = new URL(request.url).searchParams.get("q")?.trim().slice(0, 80) || "Indonesia landscape";
  if (!key) return Response.json({ error: "Layanan foto belum dikonfigurasi." }, { status: 503 });
  const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=24&orientation=landscape`, { headers: { Authorization: `Client-ID ${key}` }, next: { revalidate: 3600 } });
  if (!response.ok) return Response.json({ error: "Unsplash tidak dapat dimuat saat ini." }, { status: response.status });
  const payload = await response.json();
  const detailedPhotos = await Promise.all(payload.results.slice(0, 12).map(async (photo) => {
    const detailResponse = await fetch(photo.links.self, { headers: { Authorization: `Client-ID ${key}` }, next: { revalidate: 3600 } });
    return detailResponse.ok ? detailResponse.json() : photo;
  }));
  const data = detailedPhotos.map((photo) => ({ photo, location: locationFor(photo) })).filter((entry) => entry.location).slice(0, 8).map(({ photo, location }) => ({ id: photo.id, alt: photo.alt_description || photo.description || "Lanskap dari Unsplash", url: photo.urls.regular, author: photo.user.name, profile: photo.user.links.html, link: photo.links.html, location }));
  return Response.json({ source: "unsplash", query, locationPolicy: "unsplash-metadata-only", data });
}
