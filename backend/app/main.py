from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import users, queues

app = FastAPI(title="Movie Queue API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/api/v1")
app.include_router(queues.router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "message": "Movie Queue API",
        "versions": [1],
    }
