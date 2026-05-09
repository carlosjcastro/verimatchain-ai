use anchor_lang::prelude::*;

#[account]
#[derive(Debug)]
pub struct Attestation {
    pub verification_id: String,
    pub content_hash: String,
    pub risk_score: f64,
    pub ipfs_cid: String,
    pub wallet_address: String,
    pub authority: Pubkey,
    pub created_at: i64,
    pub bump: u8,
}

impl Attestation {
    pub const MAX_VERIFICATION_ID_LEN: usize = 64;
    pub const MAX_CONTENT_HASH_LEN: usize = 64;
    pub const MAX_IPFS_CID_LEN: usize = 64;
    pub const MAX_WALLET_ADDRESS_LEN: usize = 44;

    pub const SPACE: usize = 8
        + 4 + Self::MAX_VERIFICATION_ID_LEN
        + 4 + Self::MAX_CONTENT_HASH_LEN
        + 8
        + 4 + Self::MAX_IPFS_CID_LEN
        + 4 + Self::MAX_WALLET_ADDRESS_LEN
        + 32
        + 8
        + 1;
}