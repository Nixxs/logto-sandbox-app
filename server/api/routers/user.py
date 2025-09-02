import logging
from fastapi import APIRouter, Depends
from api.models.user import User
from api.security import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/user", response_model=User)
async def get_user_info(current_user: User = Depends(get_current_user)):
    return current_user

