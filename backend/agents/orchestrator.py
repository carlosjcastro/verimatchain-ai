from datetime import datetime, timezone
from typing import Optional

from services.claude_service import ClaudeService
from services.elevenlabs_service import ElevenLabsService
from services.pinata_service import PinataService
from services.fact_check_service import FactCheckService
from services.solana_service import SolanaService
from agents.fact_checker_agent import build_fact_checker_graph, FactCheckerState
from agents.audio_agent import build_audio_agent_graph, AudioAgentState
from schemas.verify_schema import VerificationResponse, AudioAnalysis, BiasIndicator, FactCheckClaim
from storage import store


class VerificationOrchestrator:

    def __init__(self):
        self._claude = ClaudeService()
        self._elevenlabs = ElevenLabsService()
        self._pinata = PinataService()
        self._fact_check = FactCheckService()
        self._solana = SolanaService()

        self._fact_checker = build_fact_checker_graph(
            self._claude, self._fact_check, self._pinata
        )
        self._audio_agent = build_audio_agent_graph(self._elevenlabs)

    async def run_text_verification(
        self,
        content: str,
        language: str = "es",
        include_fact_check: bool = True,
        wallet_address: Optional[str] = None,
    ) -> VerificationResponse:
        initial_state: FactCheckerState = {
            "content": content,
            "content_hash": "",
            "verification_id": "",
            "language": language,
            "include_fact_check": include_fact_check,
            "fact_check_claims": [],
            "fact_check_prompt_text": "",
            "claude_analysis": {},
            "risk_score": 0.5,
            "ipfs_cid": None,
            "on_chain_hash": None,
            "error": None,
        }

        final_state = await self._fact_checker.ainvoke(initial_state)
        analysis = final_state["claude_analysis"]

        tx_signature = None
        if final_state.get("ipfs_cid") and wallet_address:
            tx_signature = await self._solana.anchor_attestation(
                verification_id=final_state["verification_id"],
                content_hash=final_state["content_hash"],
                risk_score=final_state["risk_score"],
                ipfs_cid=final_state["ipfs_cid"],
                wallet_address=wallet_address,
            )

        bias_indicators = [
            BiasIndicator(**b) for b in analysis.get("bias_indicators", [])
        ]
        fact_check_claims = [
            FactCheckClaim(**c) for c in final_state.get("fact_check_claims", [])
        ]

        response = VerificationResponse(
            verification_id=final_state["verification_id"],
            content_hash=final_state["content_hash"],
            risk_score=final_state["risk_score"],
            risk_level=analysis.get("risk_level", "medium"),
            summary=analysis.get("summary", ""),
            bias_indicators=bias_indicators,
            missing_sources=analysis.get("missing_sources", []),
            fact_check_claims=fact_check_claims,
            audio_analysis=None,
            ipfs_cid=final_state.get("ipfs_cid"),
            solana_tx_signature=tx_signature,
            on_chain_hash=final_state.get("on_chain_hash"),
            processed_at=datetime.now(timezone.utc).isoformat(),
            explainability=analysis.get("explainability", ""),
        )

        store.save(response)
        return response

    async def run_audio_classification(self, audio_url: str) -> AudioAnalysis:
        initial_state: AudioAgentState = {
            "audio_url": audio_url,
            "is_synthetic": None,
            "confidence": None,
            "tts_probability": None,
            "cloning_probability": None,
            "model_used": None,
            "error": None,
        }

        final_state = await self._audio_agent.ainvoke(initial_state)

        if final_state.get("error"):
            raise RuntimeError(f"Audio classification failed: {final_state['error']}")

        return AudioAnalysis(
            is_synthetic=final_state["is_synthetic"],
            confidence=final_state["confidence"],
            tts_probability=final_state["tts_probability"],
            cloning_probability=final_state["cloning_probability"],
            model_used=final_state["model_used"],
        )