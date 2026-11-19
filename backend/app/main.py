"""FastAPI application factory."""
import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from starlette.exceptions import HTTPException as StarletteHTTPException

from .config import settings
from .db import get_connection
from .responses import fail, ok
from .routers import site
from .security import BodySizeLimitMiddleware, SecurityHeadersMiddleware, limiter
from .seed import seed

logger = logging.getLogger("demo")


# German messages for Pydantic's built-in error types (custom validators already speak German).
_MESSAGES_DE = {
    "missing": "Pflichtfeld",
    "extra_forbidden": "unbekanntes Feld",
    "string_too_short": "ist zu kurz",
    "string_too_long": "ist zu lang",
    "string_pattern_mismatch": "hat ein ungültiges Format",
    "string_type": "muss Text sein",
    "int_parsing": "muss eine ganze Zahl sein",
    "int_type": "muss eine ganze Zahl sein",
    "greater_than_equal": "ist zu klein",
    "less_than_equal": "ist zu groß",
    "literal_error": "ungültige Auswahl",
    "date_from_datetime_parsing": "muss ein gültiges Datum sein",
    "date_parsing": "muss ein gültiges Datum sein",
    "date_type": "muss ein gültiges Datum sein",
    "json_invalid": "ungültiges JSON",
    "model_attributes_type": "ungültige Anfrage",
}
_HTTP_DE = {
    "Not Found": "Nicht gefunden.",
    "Method Not Allowed": "Methode nicht erlaubt.",
}


def _german(err: dict) -> str:
    kind = str(err.get("type", ""))
    if kind == "value_error":
        msg = str(err.get("msg", "")).removeprefix("Value error, ")
        if "email" in msg.lower():
            return "muss eine gültige E-Mail-Adresse sein"
        return msg or "ungültiger Wert"
    return _MESSAGES_DE.get(kind, "ungültiger Wert")


def _format_validation(exc: RequestValidationError) -> str:
    messages = []
    for err in exc.errors():
        field = ".".join(str(p) for p in err.get("loc", ()) if p not in ("body", "query"))
        msg = _german(err)
        messages.append(f"{field}: {msg}" if field else msg)
    return "; ".join(messages) or "Ungültige Anfrage."


def create_app() -> FastAPI:
    app = FastAPI(title=f"{settings.site_name} API", version="1.0.0")
    app.state.limiter = limiter

    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(BodySizeLimitMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
        allow_credentials=False,
    )

    @app.exception_handler(RequestValidationError)
    async def on_validation(_: Request, exc: RequestValidationError):
        return JSONResponse(fail(_format_validation(exc)), status_code=422)

    @app.exception_handler(RateLimitExceeded)
    async def on_rate_limit(_: Request, __: RateLimitExceeded):
        return JSONResponse(fail("Zu viele Anfragen. Bitte versuchen Sie es gleich noch einmal."), status_code=429)

    @app.exception_handler(StarletteHTTPException)
    async def on_http(_: Request, exc: StarletteHTTPException):
        detail = exc.detail if isinstance(exc.detail, str) else "Anfrage fehlgeschlagen."
        detail = _HTTP_DE.get(detail, detail)
        return JSONResponse(fail(detail), status_code=exc.status_code)

    @app.exception_handler(Exception)
    async def on_error(request: Request, exc: Exception):
        logger.exception("Unhandled error on %s", request.url.path, exc_info=exc)
        return JSONResponse(fail("Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut."), status_code=500)

    @app.get("/api/health")
    def health():
        return ok({"status": "ok", "site": settings.site_name})

    app.include_router(site.router, prefix="/api")
    seed(get_connection())
    return app


app = create_app()
