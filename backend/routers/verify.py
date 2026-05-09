from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional

from schemas.verify_schema import VerifyTextRequest, VerifyUrlRequest, VerificationResponse
from agents.orchestrator import VerificationOrchestrator
from utils.content_extractor import extract_content_from_url


router = APIRouter()


def get_orchestrator() -> VerificationOrchestrator:
    return VerificationOrchestrator()


@router.post("/text", response_model=VerificationResponse, status_code=200)
async def verify_text(
    body: VerifyTextRequest,
    wallet_address: Optional[str] = Query(None),
    orchestrator: VerificationOrchestrator = Depends(get_orchestrator),
) -> VerificationResponse:
    """
    Analyzes raw text content for information integrity.
    Runs the full LangGraph pipeline: hashing -> fact-check RAG -> Claude analysis -> IPFS -> Solana.
    """
    result = await orchestrator.run_text_verification(
        content=body.content,
        language=body.language or "es",
        include_fact_check=body.include_fact_check,
        wallet_address=wallet_address,
    )
    return result


@router.post("/url", response_model=VerificationResponse, status_code=200)
async def verify_url(
    body: VerifyUrlRequest,
    wallet_address: Optional[str] = Query(None),
    orchestrator: VerificationOrchestrator = Depends(get_orchestrator),
) -> VerificationResponse:
    """
    Fetches and analyzes content from a given URL.
    """
    content = await extract_content_from_url(str(body.url))
    if not content:
        raise HTTPException(
            status_code=422,
            detail="Could not extract meaningful content from the provided URL.",
        )

    result = await orchestrator.run_text_verification(
        content=content,
        language="es",
        include_fact_check=body.include_fact_check,
        wallet_address=wallet_address,
    )
    return result