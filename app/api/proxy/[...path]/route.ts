import { type NextRequest, NextResponse } from "next/server";

const BE_URL = process.env.API_BE_URL ?? "http://localhost:3000";

const FORWARDED_HEADERS = new Set(["authorization", "content-type", "accept"]);

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const target = `${BE_URL}/${path.join("/")}`;

  const forwardHeaders: Record<string, string> = {};
  for (const [key, value] of req.headers.entries()) {
    if (FORWARDED_HEADERS.has(key.toLowerCase())) {
      forwardHeaders[key] = value;
    }
  }

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const body = hasBody ? await req.text() : undefined;

  let beRes: Response;
  try {
    beRes = await fetch(target, {
      method: req.method,
      headers: forwardHeaders,
      body: body || undefined,
    });
  } catch {
    return NextResponse.json(
      { error: "Backend unreachable" },
      { status: 502 }
    );
  }

  const text = await beRes.text();
  const contentType =
    beRes.headers.get("Content-Type") ?? "application/json";

  return new NextResponse(text || null, {
    status: beRes.status,
    headers: { "Content-Type": contentType },
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
