import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const AttestationSchema = z.object({
  verification_id: z.string().min(1),
  content_hash: z.string().length(64),
  risk_score: z.number().min(0).max(1),
  ipfs_cid: z.string().min(1),
  wallet_address: z.string().min(32).max(44),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = AttestationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const upstream = await fetch(`${backendUrl}/api/v1/attestation/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}