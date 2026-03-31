from fastapi import APIRouter

from app.api.routes.health import router as health_router
from app.api.routes.test_support import router as test_support_router
from app.api.routes.todos import router as todos_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(todos_router)
api_router.include_router(test_support_router)
