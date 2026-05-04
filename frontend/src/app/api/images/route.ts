
export async function GET(req: Request) {
  const url = new URL(req.url);
  const imageName = url.searchParams.get("imageName");
  const basePath = "uploads";

  if (!imageName) {
    return new Response(JSON.stringify({ error: "Image name is required" }), {
      status: 400,
    });
  }

  try {

    const imageUrl =`https://paisaads.in/server/${basePath}/${imageName}`;

    const response = await fetch(imageUrl);

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch image" }), {
        status: response.status,
      });
    }

    const contentType = response.headers.get("Content-Type");
    const headers = new Headers();
    headers.set("Content-Type", contentType ?? "image/png");
    headers.set("Cache-Control", "public, max-age=3600");

    return new Response(response.body, { headers });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error fetching image" }), {
      status: 500,
    });
  }
}
