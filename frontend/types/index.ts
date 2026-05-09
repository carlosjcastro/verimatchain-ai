export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface BiasIndicator {
  type: string;
  description: string;
  severity: number;
  excerpt?: string;
}

export interface FactCheckClaim {
  claim: string;
  rating: string;
  source: string;
  url?: string;
  publisher?: string;
}

export interface AudioAnalysis {
  is_synthetic: boolean;
  confidence: number;
  model_used?: string;
  cloning_probability: number;
  tts_probability: number;
}

export interface VerificationResult {
  verification_id: string;
  content_hash: string;
  risk_score: number;
  risk_level: RiskLevel;
  summary: string;
  bias_indicators: BiasIndicator[];
  missing_sources: string[];
  fact_check_claims: FactCheckClaim[];
  audio_analysis?: AudioAnalysis;
  ipfs_cid?: string;
  solana_tx_signature?: string;
  on_chain_hash?: string;
  processed_at: string;
  explainability: string;
}

export interface AttestationResult {
  attestation_id: string;
  verification_id: string;
  content_hash: string;
  risk_score: number;
  ipfs_cid: string;
  wallet_address: string;
  tx_signature?: string;
  status: "pending" | "confirmed" | "failed";
  created_at: string;
  explorer_url?: string;
}

export type VerifyMode = "text" | "url";

export interface VerifyFormState {
  mode: VerifyMode;
  content: string;
  url: string;
  includeFactCheck: boolean;
  includeAudioCheck: boolean;
}