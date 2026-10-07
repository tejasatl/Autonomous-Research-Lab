"""
Central API Routes module for Autonomous Research Lab.
Exposes modular route definitions and health checks.
"""
from fastapi import APIRouter
from backend.api.director import router as director_router
from backend.auth.auth import router as auth_router

api_router = APIRouter()

api_router.include_router(director_router, prefix="/director", tags=["director"])
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
