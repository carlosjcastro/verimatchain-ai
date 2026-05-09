use anchor_lang::prelude::*;
use crate::state::Attestation;
use crate::instructions::create_attestation::VeriMatChainError;

#[derive(Accounts)]
pub struct UpdateAttestation<'info> {
    #[account(mut)]
    pub attestation: Account<'info, Attestation>,

    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<UpdateAttestation>, new_risk_score: f64) -> Result<()> {
    require!(
        ctx.accounts.attestation.authority == ctx.accounts.authority.key(),
        VeriMatChainError::Unauthorized
    );
    require!(
        new_risk_score >= 0.0 && new_risk_score <= 1.0,
        VeriMatChainError::InvalidRiskScore
    );

    ctx.accounts.attestation.risk_score = new_risk_score;
    Ok(())
}