from typing import List
from schemas.verify_schema import VerificationResponse
from datetime import datetime, timezone


class InMemoryStore:
    """
    Almacenamiento en memoria para el historial de verificaciones.
    Se resetea al reiniciar el servidor. Para persistencia usar una DB.
    """

    def __init__(self):
        self._verifications: List[dict] = []

    def save(self, result: VerificationResponse) -> None:
        self._verifications.append(result.model_dump())

    def get_all(self) -> List[dict]:
        return list(reversed(self._verifications))

    def get_stats(self) -> dict:
        total = len(self._verifications)
        high_risk = sum(
            1 for v in self._verifications
            if v["risk_level"] in ("high", "critical")
        )
        anchored = sum(
            1 for v in self._verifications
            if v.get("solana_tx_signature")
        )
        synthetic_audio = sum(
            1 for v in self._verifications
            if v.get("audio_analysis") and v["audio_analysis"].get("is_synthetic")
        )
        return {
            "total_verifications": total,
            "high_risk_detected": high_risk,
            "attestations_anchored": anchored,
            "synthetic_audio_found": synthetic_audio,
        }


store = InMemoryStore()