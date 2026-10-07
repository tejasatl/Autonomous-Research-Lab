import os
from dotenv import load_dotenv

load_dotenv()

from .gemini_llm import GeminiLLM
from .local_llm import LocalLLM
from .groq_llm import GroqLLM
from .openai_llm import OpenAILLM

# Dynamic runtime selection state
_CURRENT_BACKEND = os.getenv("LLM_BACKEND", "gemini").lower()
_CURRENT_MODEL = None
_CUSTOM_API_KEY = None

SUPPORTED_BACKENDS = [
    {
        "id": "gemini",
        "name": "Google Gemini",
        "default_model": "gemini-2.5-flash",
        "available_models": ["gemini-2.5-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
        "requires_key": True,
        "env_key": "GEMINI_API_KEY"
    },
    {
        "id": "local",
        "name": "Local Ollama",
        "default_model": "llama3",
        "available_models": ["llama3", "mistral", "deepseek-r1", "qwen2.5"],
        "requires_key": False,
        "env_key": None
    },
    {
        "id": "groq",
        "name": "Groq Cloud (Ultra Fast)",
        "default_model": "llama-3.3-70b-versatile",
        "available_models": ["llama-3.3-70b-versatile", "mixtral-8x7b-32768"],
        "requires_key": True,
        "env_key": "GROQ_API_KEY"
    },
    {
        "id": "openai",
        "name": "OpenAI",
        "default_model": "gpt-4o-mini",
        "available_models": ["gpt-4o-mini", "gpt-4o"],
        "requires_key": True,
        "env_key": "OPENAI_API_KEY"
    }
]

def set_llm_backend(backend: str, model: str = None, api_key: str = None):
    global _CURRENT_BACKEND, _CURRENT_MODEL, _CUSTOM_API_KEY
    backend_clean = backend.lower().strip()
    if backend_clean in ["ollama", "local"]:
        backend_clean = "local"

    valid_ids = [b["id"] for b in SUPPORTED_BACKENDS]
    if backend_clean not in valid_ids:
        raise ValueError(f"Unsupported LLM backend: '{backend}'. Supported: {valid_ids}")

    _CURRENT_BACKEND = backend_clean
    _CURRENT_MODEL = model
    if api_key:
        _CUSTOM_API_KEY = api_key
        # Also set in environment for child services
        if backend_clean == "gemini":
            os.environ["GEMINI_API_KEY"] = api_key
        elif backend_clean == "groq":
            os.environ["GROQ_API_KEY"] = api_key
        elif backend_clean == "openai":
            os.environ["OPENAI_API_KEY"] = api_key

    os.environ["LLM_BACKEND"] = backend_clean
    return get_llm_info()

def get_llm_info():
    global _CURRENT_BACKEND, _CURRENT_MODEL
    backend_meta = next((b for b in SUPPORTED_BACKENDS if b["id"] == _CURRENT_BACKEND), SUPPORTED_BACKENDS[0])
    model = _CURRENT_MODEL or backend_meta["default_model"]
    has_key = True
    if backend_meta["requires_key"] and backend_meta["env_key"]:
        has_key = bool(os.getenv(backend_meta["env_key"]))

    return {
        "current_backend": _CURRENT_BACKEND,
        "current_model": model,
        "name": backend_meta["name"],
        "has_api_key": has_key,
        "supported_backends": SUPPORTED_BACKENDS
    }

def get_llm():
    global _CURRENT_BACKEND, _CURRENT_MODEL, _CUSTOM_API_KEY
    backend = _CURRENT_BACKEND or os.getenv("LLM_BACKEND", "gemini").lower()

    if backend == "gemini":
        api_key = _CUSTOM_API_KEY or os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY not found. Set it in .env or switch to Local Ollama."
            )
        model = _CURRENT_MODEL or "gemini-2.5-flash"
        return GeminiLLM(api_key=api_key, model=model)

    if backend in ["local", "ollama"]:
        model = _CURRENT_MODEL or "llama3"
        return LocalLLM(model=model)

    if backend == "groq":
        api_key = _CUSTOM_API_KEY or os.getenv("GROQ_API_KEY")
        model = _CURRENT_MODEL or "llama-3.3-70b-versatile"
        return GroqLLM(api_key=api_key, model=model)

    if backend == "openai":
        api_key = _CUSTOM_API_KEY or os.getenv("OPENAI_API_KEY")
        model = _CURRENT_MODEL or "gpt-4o-mini"
        return OpenAILLM(api_key=api_key, model=model)

    raise ValueError(f"Unknown LLM_BACKEND: {backend}")