from pydantic import BaseModel, HttpUrl, field_validator, model_validator
from typing import Optional, List
from enum import Enum


class ContentType(str, Enum):
    TEXT = "text"
    URL = "url"
    AUDIO_URL = "audio_url"


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class BiasIndicator(BaseModel):
    type: str
    description: str
    severity: float
    excerpt: Optional[str] = None


class FactCheckClaim(BaseModel):
    claim: str
    rating: str
    source: str
    url: Optional[str] = None
    publisher: Optional[str] = None


class AudioAnalysis(BaseModel):
    is_synthetic: bool
    confidence: float
    model_used: Optional[str] = None
    cloning_probability: float
    tts_probability: float


class VerifyTextRequest(BaseModel):
    content: str
    content_type: ContentType = ContentType.TEXT
    language: Optional[str] = "es"
    include_fact_check: bool = True

    @field_validator("content")
    @classmethod
    def content_must_not_be_empty(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Content cannot be empty.")
        if len(stripped) < 20:
            raise ValueError("Content must be at least 20 characters long.")
        if len(stripped) > 50000:
            raise ValueError("Content exceeds maximum length of 50,000 characters.")
        return stripped


class VerifyUrlRequest(BaseModel):
    url: HttpUrl
    include_audio_check: bool = False
    include_fact_check: bool = True


class VerificationResponse(BaseModel):
    verification_id: str
    content_hash: str
    risk_score: float
    risk_level: RiskLevel
    summary: str
    bias_indicators: List[BiasIndicator]
    missing_sources: List[str]
    fact_check_claims: List[FactCheckClaim]
    audio_analysis: Optional[AudioAnalysis] = None
    ipfs_cid: Optional[str] = None
    solana_tx_signature: Optional[str] = None
    on_chain_hash: Optional[str] = None
    processed_at: str
    explainability: str