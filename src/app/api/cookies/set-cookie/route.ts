export async function POST(request: Request) {
  const res = await request.json();

  if (!res.token) throw new Error("No token provided for Set Cookie Endpoint");

  return new Response("Success", {
    status: 200,
    headers: { "Set-Cookie": `token=${res.token}` },
  });
}
