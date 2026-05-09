use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("6eyP4xSipPiWQPSXF4KcQZrEGvdUotfNTvvkPgs4WhCz");

#[program]
pub mod verimatchain {
    use super::*;

    pub fn create_attestation(
        ctx: Context<CreateAttestation>,
        verification_id: String,
        content_hash: String,
        risk_score: f64,
        ipfs_cid: String,
        wallet_address: String,
    ) -> Result<()> {
        instructions::create_attestation::handler(
            ctx,
            verification_id,
            content_hash,
            risk_score,
            ipfs_cid,
            wallet_address,
        )
    }

    pub fn update_attestation_status(
        ctx: Context<UpdateAttestation>,
        new_risk_score: f64,
    ) -> Result<()> {
        instructions::update_attestation::handler(ctx, new_risk_score)
    }
}