import json
import struct
import hashlib
from typing import Optional

from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Confirmed
from solana.rpc.types import TxOpts
from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solders.system_program import ID as SYSTEM_PROGRAM_ID
from solders.instruction import Instruction, AccountMeta
from solders.transaction import Transaction
from solders.message import Message

from config import get_settings


def _encode_string(s: str) -> bytes:
    encoded = s.encode("utf-8")
    return struct.pack("<I", len(encoded)) + encoded


def _encode_f64(v: float) -> bytes:
    return struct.pack("<d", v)


def _discriminator(name: str) -> bytes:
    h = hashlib.sha256(f"global:{name}".encode()).digest()
    return h[:8]


class SolanaService:
    """
    Handles all Solana blockchain interactions using solders directly.
    Builds and submits Anchor-compatible instructions without anchorpy.
    """

    def __init__(self):
        settings = get_settings()
        self._rpc_url = settings.solana_rpc_url
        self._program_id = Pubkey.from_string(settings.solana_program_id)
        raw_key = json.loads(settings.agent_wallet_private_key)
        self._keypair = Keypair.from_bytes(bytes(raw_key))

    async def anchor_attestation(
        self,
        verification_id: str,
        content_hash: str,
        risk_score: float,
        ipfs_cid: str,
        wallet_address: str,
    ) -> Optional[str]:
        client = AsyncClient(self._rpc_url, commitment=Confirmed)

        try:
            seeds = [
                b"attestation",
                verification_id.encode("utf-8")[:32],
            ]
            pda, _bump = Pubkey.find_program_address(seeds, self._program_id)

            data = (
                _discriminator("create_attestation")
                + _encode_string(verification_id)
                + _encode_string(content_hash)
                + _encode_f64(risk_score)
                + _encode_string(ipfs_cid)
                + _encode_string(wallet_address)
            )

            accounts = [
                AccountMeta(pubkey=pda, is_signer=False, is_writable=True),
                AccountMeta(pubkey=self._keypair.pubkey(), is_signer=True, is_writable=True),
                AccountMeta(pubkey=SYSTEM_PROGRAM_ID, is_signer=False, is_writable=False),
            ]

            instruction = Instruction(
                program_id=self._program_id,
                accounts=accounts,
                data=bytes(data),
            )

            blockhash_resp = await client.get_latest_blockhash()
            blockhash = blockhash_resp.value.blockhash

            msg = Message.new_with_blockhash(
                [instruction],
                self._keypair.pubkey(),
                blockhash,
            )

            tx = Transaction([self._keypair], msg, blockhash)

            result = await client.send_transaction(
                tx,
                opts=TxOpts(skip_preflight=False, preflight_commitment=Confirmed),
            )

            signature = str(result.value)
            print(f"SOLANA TX: {signature}")
            return signature

        except Exception as exc:
            import traceback
            traceback.print_exc()
            print(f"SOLANA ERROR: {exc}")
            return None
        finally:
            await client.close()

    async def get_existing_attestation(
        self,
        verification_id: str,
    ) -> Optional[str]:
        """
        Checks if a PDA already exists for this verification_id.
        Returns a reference string if found, None otherwise.
        """
        client = AsyncClient(self._rpc_url, commitment=Confirmed)
        try:
            seeds = [
                b"attestation",
                verification_id.encode("utf-8")[:32],
            ]
            pda, _bump = Pubkey.find_program_address(seeds, self._program_id)
            account_info = await client.get_account_info(pda)
            if account_info.value is not None:
                return f"existing:{verification_id[:32]}"
            return None
        except Exception:
            return None
        finally:
            await client.close()

    def get_explorer_url(self, tx_signature: str) -> str:
        if tx_signature.startswith("existing:"):
            verification_id = tx_signature.replace("existing:", "")
            seeds = [b"attestation", verification_id.encode("utf-8")[:32]]
            pda, _ = Pubkey.find_program_address(seeds, self._program_id)
            return f"https://explorer.solana.com/address/{str(pda)}?cluster=devnet"
        return f"https://explorer.solana.com/tx/{tx_signature}?cluster=devnet"