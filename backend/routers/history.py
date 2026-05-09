from fastapi import APIRouter
from storage import store

router = APIRouter()


@router.get("/verifications", status_code=200)
async def get_verifications():
    return {"verifications": store.get_all()}


@router.get("/stats", status_code=200)
async def get_stats():
    return store.get_stats()