from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone

from schemas.attestation_schema import AttestationRequest, AttestationResponse, AttestationStatus
from services.solana_service import SolanaService

router = APIRouter()


@router.post("/create", response_model=AttestationResponse, status_code=201)
async def create_attestation(body: AttestationRequest) -> AttestationResponse:
    service = SolanaService()

    existing_tx = await service.get_existing_attestation(
        verification_id=body.verification_id,
    )

    if existing_tx:
        explorer_url = service.get_explorer_url(existing_tx)
        return AttestationResponse(
            attestation_id=f"att-{body.verification_id[:12]}",
            verification_id=body.verification_id,
            content_hash=body.content_hash,
            risk_score=body.risk_score,
            ipfs_cid=body.ipfs_cid,
            wallet_address=body.wallet_address,
            tx_signature=existing_tx,
            status=AttestationStatus.CONFIRMED,
            created_at=datetime.now(timezone.utc).isoformat(),
            explorer_url=explorer_url,
        )

    tx_signature = await service.anchor_attestation(
        verification_id=body.verification_id,
        content_hash=body.content_hash,
        risk_score=body.risk_score,
        ipfs_cid=body.ipfs_cid,
        wallet_address=body.wallet_address,
    )

    if not tx_signature:
        raise HTTPException(
            status_code=502,
            detail="Failed to anchor attestation on Solana Devnet.",
        )

    explorer_url = service.get_explorer_url(tx_signature)

    return AttestationResponse(
        attestation_id=f"att-{body.verification_id[:12]}",
        verification_id=body.verification_id,
        content_hash=body.content_hash,
        risk_score=body.risk_score,
        ipfs_cid=body.ipfs_cid,
        wallet_address=body.wallet_address,
        tx_signature=tx_signature,
        status=AttestationStatus.CONFIRMED,
        created_at=datetime.now(timezone.utc).isoformat(),
        explorer_url=explorer_url,
    )