import logging
import time
import httpx
from jose import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from api.database import database, user_table
from api.models.user import User
from api.config import config

logger = logging.getLogger(__name__)
bearer_scheme = HTTPBearer()


JWKS_URL = f"{config.LOGTO_ISSUER}/jwks"
_jwks_cache = None
_jwks_cache_time = 0
CACHE_TTL = 600  # 10 minutes

def get_jwks():
    """Fetch JWKS (Logtos public keys), cache for CACHE_TTL seconds."""
    global _jwks_cache, _jwks_cache_time
    now = time.time()
    if not _jwks_cache or now - _jwks_cache_time > CACHE_TTL:
        resp = httpx.get(JWKS_URL, timeout=5)
        resp.raise_for_status()
        _jwks_cache = resp.json()
        _jwks_cache_time = now
    return _jwks_cache

def verify_token(credentials=Depends(bearer_scheme)) -> dict:
    """Verify bearer token from Authorization header."""
    token = credentials.credentials  # Extract the token string

    try:
        jwks = get_jwks()
        claims = jwt.decode(
            token,
            jwks,
            algorithms=["ES256", "ES384", "ES512", "RS256"],
            audience=config.LOGTO_AUDIENCE,
            issuer=config.LOGTO_ISSUER,
            options={"verify_aud": True, "verify_iss": True},
        )
        return claims
    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

async def get_current_user(claims=Depends(verify_token)):  # verify_token = your JWT checker
    logtoid = claims["sub"]
    print("Logto ID:", logtoid)
    query = user_table.select().where(user_table.c.logtoid == logtoid)
    user = await database.fetch_one(query)

    if not user:
        # Create if doesn’t exist
        insert = user_table.insert().values(
            logtoid=logtoid,
            email=claims.get("email"),
            name=claims.get("name"),
        )
        await database.execute(insert)
        user = await database.fetch_one(query)

    return User(**user)