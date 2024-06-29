export async function POST(request: Request) {
  const res = await request.json();

  if (!res.name)
    throw new Error("No token provided for Delete Cookie Endpoint");

  return new Response("Success", {
    status: 200,
    headers: { "Set-Cookie": `${res.name}=; Max-Age=0` },
  });
}
