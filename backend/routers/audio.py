from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl

from agents.orchestrator import VerificationOrchestrator
from schemas.verify_schema import AudioAnalysis


router = APIRouter()


class AudioClassifyRequest(BaseModel):
    audio_url: HttpUrl


@router.post("/classify", response_model=AudioAnalysis, status_code=200)
async def classify_audio(body: AudioClassifyRequest) -> AudioAnalysis:
    """
    Submits an audio file URL to the ElevenLabs AI Speech Classifier.
    Returns synthetic detection scores including TTS and voice cloning probability.
    """
    orchestrator = VerificationOrchestrator()
    try:
        result = await orchestrator.run_audio_classification(str(body.audio_url))
        return result
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc))