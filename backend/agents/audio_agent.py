from typing import TypedDict, Optional
from langgraph.graph import StateGraph, END
from services.elevenlabs_service import ElevenLabsService


class AudioAgentState(TypedDict):
    audio_url: str
    is_synthetic: Optional[bool]
    confidence: Optional[float]
    tts_probability: Optional[float]
    cloning_probability: Optional[float]
    model_used: Optional[str]
    error: Optional[str]


def build_audio_agent_graph(elevenlabs: ElevenLabsService) -> StateGraph:
    """
    Builds a LangGraph state machine for the audio synthetic detection pipeline.
    """

    async def node_classify_audio(state: AudioAgentState) -> AudioAgentState:
        try:
            result = await elevenlabs.classify_audio_url(state["audio_url"])
            return {
                **state,
                "is_synthetic": result["is_synthetic"],
                "confidence": result["confidence"],
                "tts_probability": result["tts_probability"],
                "cloning_probability": result["cloning_probability"],
                "model_used": result["model_used"],
                "error": None,
            }
        except Exception as exc:
            return {
                **state,
                "is_synthetic": None,
                "confidence": None,
                "tts_probability": None,
                "cloning_probability": None,
                "model_used": None,
                "error": str(exc),
            }

    graph = StateGraph(AudioAgentState)
    graph.add_node("classify_audio", node_classify_audio)
    graph.set_entry_point("classify_audio")
    graph.add_edge("classify_audio", END)

    return graph.compile()