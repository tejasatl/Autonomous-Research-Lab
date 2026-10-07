import os
from functools import lru_cache
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

load_dotenv()


class Settings(BaseSettings):

    # ==========================
    # Application
    # ==========================

    APP_NAME: str = "Autonomous Research Lab"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # ==========================
    # API
    # ==========================

    HOST: str = "127.0.0.1"
    PORT: int = 8000

    # ==========================
    # Security
    # ==========================

    SECRET_KEY: str = "AUTONOMOUS_RESEARCH_LAB_SECRET_KEY_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # ==========================
    # Frontend
    # ==========================

    FRONTEND_URL: str = "http://localhost:5173"

    # ==========================
    # Neo4j
    # ==========================

    NEO4J_URI: str = "neo4j://127.0.0.1:7687"
    NEO4J_USERNAME: str = Field(default="neo4j", alias="NEO4J_USER")
    NEO4J_PASSWORD: str = "password"

    # ==========================
    # AI Models
    # ==========================

    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    HF_TOKEN: str = ""
    LLM_BACKEND: str = "gemini"

    # ==========================
    # Logging
    # ==========================

    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",
        populate_by_name=True
    )


@lru_cache
def get_settings():
    return Settings()


settings = get_settings()

# Module-level exports for backwards compatibility
NEO4J_URI = settings.NEO4J_URI
NEO4J_USER = settings.NEO4J_USERNAME
NEO4J_PASSWORD = settings.NEO4J_PASSWORD
GEMINI_API_KEY = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
SECRET_KEY = settings.SECRET_KEY
FRONTEND_URL = settings.FRONTEND_URL