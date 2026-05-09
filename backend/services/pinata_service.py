import json
import httpx
from datetime import datetime, timezone
from config import get_settings


class PinataService:
    """
    Stores verification evidence on IPFS via Pinata.
    Returns a Content Identifier (CID) that serves as a permanent, censorship-resistant record.
    """

    BASE_URL = "https://api.pinata.cloud"

    def __init__(self):
        settings = get_settings()
        self._jwt = settings.pinata_jwt

    async def pin_verification_evidence(
        self,
        verification_id: str,
        content_hash: str,
        risk_score: float,
        analysis_result: dict,
        original_content_preview: str,
    ) -> str:
        """
        Pins a JSON document containing the full verification evidence to IPFS.
        Returns the IPFS CID.
        """
        payload = {
            "verimatchain_version": "1.0.0",
            "verification_id": verification_id,
            "content_hash": content_hash,
            "risk_score": risk_score,
            "risk_level": analysis_result.get("risk_level", "unknown"),
            "summary": analysis_result.get("summary", ""),
            "bias_indicators": analysis_result.get("bias_indicators", []),
            "missing_sources": analysis_result.get("missing_sources", []),
            "explainability": analysis_result.get("explainability", ""),
            "content_preview": original_content_preview[:500],
            "pinned_at": datetime.now(timezone.utc).isoformat(),
        }

        metadata = {
            "name": f"verimatchain-{verification_id}",
            "keyvalues": {
                "verification_id": verification_id,
                "risk_level": analysis_result.get("risk_level", "unknown"),
            },
        }

        request_body = {
            "pinataContent": payload,
            "pinataMetadata": metadata,
            "pinataOptions": {"cidVersion": 1},
        }

        headers = {
            "Authorization": f"Bearer {self._jwt}",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{self.BASE_URL}/pinning/pinJSONToIPFS",
                headers=headers,
                content=json.dumps(request_body),
            )
            response.raise_for_status()
            data = response.json()

        return data["IpfsHash"]