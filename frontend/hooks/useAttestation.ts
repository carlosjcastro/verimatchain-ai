"use client";

import { useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { apiClient } from "@/lib/api-client";
import type { AttestationResult, VerificationResult } from "@/types";

interface UseAttestationReturn {
  attestation: AttestationResult | null;
  isAnchoring: boolean;
  error: string | null;
  anchor: (result: VerificationResult) => Promise<void>;
}

export function useAttestation(): UseAttestationReturn {
  const { publicKey } = useWallet();
  const [attestation, setAttestation] = useState<AttestationResult | null>(null);
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const anchor = useCallback(
    async (result: VerificationResult) => {
      if (!publicKey) {
        setError("Connect your Solana wallet to create an attestation.");
        return;
      }
      if (!result.ipfs_cid) {
        setError("No IPFS evidence available to anchor.");
        return;
      }

      setIsAnchoring(true);
      setError(null);

      try {
        const data = await apiClient.createAttestation({
          verification_id: result.verification_id,
          content_hash: result.content_hash,
          risk_score: result.risk_score,
          ipfs_cid: result.ipfs_cid,
          wallet_address: publicKey.toBase58(),
        });
        setAttestation(data);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to create attestation.";
        setError(message);
      } finally {
        setIsAnchoring(false);
      }
    },
    [publicKey]
  );

  return { attestation, isAnchoring, error, anchor };
}