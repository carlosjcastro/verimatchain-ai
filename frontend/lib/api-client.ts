import type { VerificationResult, AttestationResult } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Unknown error" }));
    throw new Error(
      error.detail ?? `Request failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  verifyText: (
    content: string,
    includeFactCheck: boolean,
    walletAddress?: string,
  ): Promise<VerificationResult> => {
    const params = walletAddress ? `?wallet_address=${walletAddress}` : "";
    return request<VerificationResult>(`/api/v1/verify/text${params}`, {
      method: "POST",
      body: JSON.stringify({ content, include_fact_check: includeFactCheck }),
    });
  },

  verifyUrl: (
    url: string,
    includeFactCheck: boolean,
    includeAudioCheck: boolean,
    walletAddress?: string,
  ): Promise<VerificationResult> => {
    const params = walletAddress ? `?wallet_address=${walletAddress}` : "";
    return request<VerificationResult>(`/api/v1/verify/url${params}`, {
      method: "POST",
      body: JSON.stringify({
        url,
        include_fact_check: includeFactCheck,
        include_audio_check: includeAudioCheck,
      }),
    });
  },

  createAttestation: (payload: {
    verification_id: string;
    content_hash: string;
    risk_score: number;
    ipfs_cid: string;
    wallet_address: string;
  }): Promise<AttestationResult> => {
    return request<AttestationResult>("/api/v1/attestation/create", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getVerifications: (): Promise<{ verifications: VerificationResult[] }> => {
    return request<{ verifications: VerificationResult[] }>(
      "/api/v1/history/verifications",
    );
  },

  getStats: (): Promise<{
    total_verifications: number;
    high_risk_detected: number;
    attestations_anchored: number;
    synthetic_audio_found: number;
  }> => {
    return request("/api/v1/history/stats");
  },
};
