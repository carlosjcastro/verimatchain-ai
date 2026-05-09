import hashlib
import json
from datetime import datetime, timezone
from typing import Optional


def compute_content_hash(content: str) -> str:
    normalized = content.strip().lower()
    encoded = normalized.encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def compute_verification_id(content_hash: str, timestamp: Optional[str] = None) -> str:
    if timestamp is None:
        timestamp = datetime.now(timezone.utc).isoformat()
    combined = f"{content_hash}:{timestamp}"
    return hashlib.sha256(combined.encode("utf-8")).hexdigest()[:32]


def compute_ipfs_anchor_hash(verification_id: str, risk_score: float, ipfs_cid: str) -> str:
    payload = json.dumps(
        {"verification_id": verification_id, "risk_score": round(risk_score, 4), "ipfs_cid": ipfs_cid},
        sort_keys=True,
    )
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()