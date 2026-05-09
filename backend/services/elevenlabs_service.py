import httpx
from config import get_settings


class ElevenLabsService:
    """
    Wraps the ElevenLabs AI Speech Classifier endpoint.
    Responsible only for audio synthetic detection calls.
    """

    BASE_URL = "https://api.elevenlabs.io/v1"

    def __init__(self):
        settings = get_settings()
        self._api_key = settings.elevenlabs_api_key
        self._headers = {
            "xi-api-key": self._api_key,
            "Accept": "application/json",
        }

    async def classify_audio_url(self, audio_url: str) -> dict:
        """
        Downloads the audio from the provided URL and submits it
        to the ElevenLabs speech classifier for synthetic detection.
        """
        async with httpx.AsyncClient(timeout=60.0) as client:
            audio_response = await client.get(audio_url)
            audio_response.raise_for_status()
            audio_bytes = audio_response.content

        content_type = audio_response.headers.get("content-type", "audio/mpeg")
        filename = audio_url.split("/")[-1].split("?")[0] or "audio.mp3"

        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{self.BASE_URL}/speech-classification",
                headers=self._headers,
                files={"file": (filename, audio_bytes, content_type)},
            )
            response.raise_for_status()
            data = response.json()

        is_synthetic = data.get("is_synthetic", False)
        confidence = data.get("confidence", 0.0)
        tts_prob = data.get("tts_probability", 0.0)
        cloning_prob = data.get("cloning_probability", 0.0)

        return {
            "is_synthetic": is_synthetic,
            "confidence": confidence,
            "tts_probability": tts_prob,
            "cloning_probability": cloning_prob,
            "model_used": data.get("model", "elevenlabs-classifier-v1"),
        }