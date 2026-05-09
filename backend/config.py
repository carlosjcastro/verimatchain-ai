from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List


class Settings(BaseSettings):
    anthropic_api_key: str
    elevenlabs_api_key: str
    pinata_api_key: str
    pinata_api_secret: str
    pinata_jwt: str
    google_fact_check_api_key: str
    solana_rpc_url: str = "https://api.devnet.solana.com"
    solana_program_id: str
    agent_wallet_private_key: str
    cors_origins: str = "http://localhost:3000"
    app_name: str = "VeriMatChain AI"
    app_version: str = "1.0.0"
    debug: bool = False

    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()