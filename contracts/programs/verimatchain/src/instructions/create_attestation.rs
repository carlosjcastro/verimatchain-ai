use anchor_lang::prelude::*;
use crate::state::Attestation;

#[derive(Accounts)]
#[instruction(verification_id: String)]
pub struct CreateAttestation<'info> {
    #[account(
        init,
        payer = authority,
        space = Attestation::SPACE,
        seeds = [b"attestation", verification_id.as_bytes()],
        bump
    )]
    pub attestation: Account<'info, Attestation>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateAttestation>,
    verification_id: String,
    content_hash: String,
    risk_score: f64,
    ipfs_cid: String,
    wallet_address: String,
) -> Result<()> {
    require!(
        verification_id.len() <= Attestation::MAX_VERIFICATION_ID_LEN,
        VeriMatChainError::VerificationIdTooLong
    );
    require!(
        content_hash.len() <= Attestation::MAX_CONTENT_HASH_LEN,
        VeriMatChainError::ContentHashTooLong
    );
    require!(
        ipfs_cid.len() <= Attestation::MAX_IPFS_CID_LEN,
        VeriMatChainError::IpfsCidTooLong
    );
    require!(
        risk_score >= 0.0 && risk_score <= 1.0,
        VeriMatChainError::InvalidRiskScore
    );

    let attestation = &mut ctx.accounts.attestation;
    let clock = Clock::get()?;

    attestation.verification_id = verification_id;
    attestation.content_hash = content_hash;
    attestation.risk_score = risk_score;
    attestation.ipfs_cid = ipfs_cid;
    attestation.wallet_address = wallet_address;
    attestation.authority = ctx.accounts.authority.key();
    attestation.created_at = clock.unix_timestamp;
    attestation.bump = ctx.bumps.attestation;

    emit!(AttestationCreated {
        verification_id: attestation.verification_id.clone(),
        content_hash: attestation.content_hash.clone(),
        risk_score: attestation.risk_score,
        created_at: attestation.created_at,
    });

    Ok(())
}

#[event]
pub struct AttestationCreated {
    pub verification_id: String,
    pub content_hash: String,
    pub risk_score: f64,
    pub created_at: i64,
}

#[error_code]
pub enum VeriMatChainError {
    #[msg("Verification ID exceeds maximum length of 64 characters.")]
    VerificationIdTooLong,
    #[msg("Content hash exceeds maximum length of 64 characters.")]
    ContentHashTooLong,
    #[msg("IPFS CID exceeds maximum length of 64 characters.")]
    IpfsCidTooLong,
    #[msg("Risk score must be between 0.0 and 1.0.")]
    InvalidRiskScore,
    #[msg("Unauthorized: only the original authority may update this attestation.")]
    Unauthorized,
}