from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from config import get_settings
from routers import verify, audio, attestation, history


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    app.state.settings = settings
    yield


def create_application() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="Multimodal information integrity system powered by AI and Solana.",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "https://verimatchain-ai.carlosjcastrog.com"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(verify.router, prefix="/api/v1/verify", tags=["Verification"])
    app.include_router(audio.router, prefix="/api/v1/audio", tags=["Audio"])
    app.include_router(attestation.router, prefix="/api/v1/attestation", tags=["Attestation"])
    app.include_router(history.router, prefix="/api/v1/history", tags=["History"])

    @app.get("/health")
    async def health_check():
        return JSONResponse({"status": "healthy", "version": settings.app_version})

    return app


app = create_application()