import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const TextVerifySchema = z.object({
  content: z.string().min(20).max(50000),
  include_fact_check: z.boolean().default(true),
  language: z.string().default("es"),
});

const UrlVerifySchema = z.object({
  url: z.string().url(),
  include_fact_check: z.boolean().default(true),
  include_audio_check: z.boolean().default(false),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") ?? "text";
  const walletAddress = searchParams.get("wallet_address");

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  let schema = mode === "url" ? UrlVerifySchema : TextVerifySchema;
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const endpoint = mode === "url" ? "/api/v1/verify/url" : "/api/v1/verify/text";
  const walletParam = walletAddress ? `?wallet_address=${walletAddress}` : "";

  const upstream = await fetch(`${backendUrl}${endpoint}${walletParam}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}