import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Verichain } from "../target/types/verimatchain";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { assert } from "chai";

describe("verimatchain", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Verichain as Program<Verichain>;

  const verificationId = "test-verification-id-001";
  const contentHash = "a".repeat(64);
  const riskScore = 0.72;
  const ipfsCid = "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";
  const walletAddress = provider.wallet.publicKey.toBase58();

  let attestationPda: PublicKey;
  let bump: number;

  before(async () => {
    [attestationPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("attestation"), Buffer.from(verificationId)],
      program.programId
    );
  });

  it("Creates an attestation on-chain", async () => {
    const tx = await program.methods
      .createAttestation(verificationId, contentHash, riskScore, ipfsCid, walletAddress)
      .accounts({
        attestation: attestationPda,
        authority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Transaction signature:", tx);

    const account = await program.account.attestation.fetch(attestationPda);

    assert.equal(account.verificationId, verificationId);
    assert.equal(account.contentHash, contentHash);
    assert.approximately(account.riskScore, riskScore, 0.001);
    assert.equal(account.ipfsCid, ipfsCid);
    assert.equal(account.walletAddress, walletAddress);
    assert.equal(account.authority.toBase58(), provider.wallet.publicKey.toBase58());
  });

  it("Rejects a risk score outside 0.0-1.0 range", async () => {
    const [badPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("attestation"), Buffer.from("bad-id")],
      program.programId
    );

    try {
      await program.methods
        .createAttestation("bad-id", contentHash, 1.5, ipfsCid, walletAddress)
        .accounts({
          attestation: badPda,
          authority: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      assert.fail("Should have thrown an error");
    } catch (err: any) {
      assert.include(err.message, "InvalidRiskScore");
    }
  });
});