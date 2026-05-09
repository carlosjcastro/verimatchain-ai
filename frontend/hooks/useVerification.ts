"use client";

import { useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { apiClient } from "@/lib/api-client";
import type { VerificationResult, VerifyFormState } from "@/types";

interface UseVerificationReturn {
  result: VerificationResult | null;
  isLoading: boolean;
  error: string | null;
  verify: (formState: VerifyFormState) => Promise<void>;
  reset: () => void;
}

export function useVerification(): UseVerificationReturn {
  const { publicKey } = useWallet();
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verify = useCallback(
    async (formState: VerifyFormState) => {
      setIsLoading(true);
      setError(null);
      setResult(null);

      const walletAddress = publicKey?.toBase58();

      try {
        let data: VerificationResult;

        if (formState.mode === "text") {
          data = await apiClient.verifyText(
            formState.content,
            formState.includeFactCheck,
            walletAddress
          );
        } else {
          data = await apiClient.verifyUrl(
            formState.url,
            formState.includeFactCheck,
            formState.includeAudioCheck,
            walletAddress
          );
        }

        setResult(data);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [publicKey]
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { result, isLoading, error, verify, reset };
}