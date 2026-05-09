from typing import TypedDict, Optional, List
from langgraph.graph import StateGraph, END
from services.claude_service import ClaudeService
from services.fact_check_service import FactCheckService
from services.pinata_service import PinataService
from utils.hashing import compute_content_hash, compute_verification_id, compute_ipfs_anchor_hash
from datetime import datetime, timezone


class FactCheckerState(TypedDict):
    content: str
    content_hash: str
    verification_id: str
    language: str
    include_fact_check: bool
    fact_check_claims: List[dict]
    fact_check_prompt_text: str
    claude_analysis: dict
    risk_score: float
    ipfs_cid: Optional[str]
    on_chain_hash: Optional[str]
    error: Optional[str]


def build_fact_checker_graph(
    claude: ClaudeService,
    fact_check: FactCheckService,
    pinata: PinataService,
) -> StateGraph:
    """
    Builds a LangGraph state machine for the text/URL fact-checking pipeline.
    Each node has a single responsibility (SRP).
    """

    async def node_hash_content(state: FactCheckerState) -> FactCheckerState:
        content_hash = compute_content_hash(state["content"])
        timestamp = datetime.now(timezone.utc).isoformat()
        verification_id = compute_verification_id(content_hash, timestamp)
        return {**state, "content_hash": content_hash, "verification_id": verification_id}

    async def node_fetch_fact_checks(state: FactCheckerState) -> FactCheckerState:
        if not state.get("include_fact_check"):
            return {**state, "fact_check_claims": [], "fact_check_prompt_text": ""}

        query = state["content"][:300]
        claims = await fact_check.search_claims(query, language=state.get("language", "es"))
        prompt_text = fact_check.format_for_prompt(claims)
        return {**state, "fact_check_claims": claims, "fact_check_prompt_text": prompt_text}

    async def node_analyze_with_claude(state: FactCheckerState) -> FactCheckerState:
        try:
            result = await claude.analyze_content(
                state["content"], state.get("fact_check_prompt_text", "")
            )
            return {**state, "claude_analysis": result, "risk_score": result.get("risk_score", 0.5)}
        except Exception as exc:
            import traceback
            traceback.print_exc()
            print(f"CLAUDE ERROR: {exc}")
            return {**state, "error": str(exc), "claude_analysis": {}, "risk_score": 0.5}

    async def node_pin_to_ipfs(state: FactCheckerState) -> FactCheckerState:
        if state.get("error"):
            return state
        try:
            cid = await pinata.pin_verification_evidence(
                verification_id=state["verification_id"],
                content_hash=state["content_hash"],
                risk_score=state["risk_score"],
                analysis_result=state["claude_analysis"],
                original_content_preview=state["content"],
            )
            on_chain_hash = compute_ipfs_anchor_hash(
                state["verification_id"], state["risk_score"], cid
            )
            return {**state, "ipfs_cid": cid, "on_chain_hash": on_chain_hash}
        except Exception:
            return {**state, "ipfs_cid": None, "on_chain_hash": None}

    graph = StateGraph(FactCheckerState)
    graph.add_node("hash_content", node_hash_content)
    graph.add_node("fetch_fact_checks", node_fetch_fact_checks)
    graph.add_node("analyze_with_claude", node_analyze_with_claude)
    graph.add_node("pin_to_ipfs", node_pin_to_ipfs)

    graph.set_entry_point("hash_content")
    graph.add_edge("hash_content", "fetch_fact_checks")
    graph.add_edge("fetch_fact_checks", "analyze_with_claude")
    graph.add_edge("analyze_with_claude", "pin_to_ipfs")
    graph.add_edge("pin_to_ipfs", END)

    return graph.compile()