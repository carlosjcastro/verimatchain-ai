from pydantic import BaseModel
from typing import Optional
from enum import Enum


class AttestationStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    FAILED = "failed"


class AttestationRequest(BaseModel):
    verification_id: str
    content_hash: str
    risk_score: float
    ipfs_cid: str
    wallet_address: str


class AttestationResponse(BaseModel):
    attestation_id: str
    verification_id: str
    content_hash: str
    risk_score: float
    ipfs_cid: str
    wallet_address: str
    tx_signature: Optional[str] = None
    status: AttestationStatus
    created_at: str
    explorer_url: Optional[str] = None