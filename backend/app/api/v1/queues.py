from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.postgres import Queue, QueueMember, User
from app.schemas.user import UserCreate, UserSchema, UserUpdate

router = APIRouter()


@router.get("/queues/by_user/{auth_user_uuid}")
async def get_user_queues(
    auth_user_uuid: UUID,
    db: Session = Depends(get_db),
):
    """
    Get all queues associated with a user.

    Args:
        auth_user_uuid (UUID): The UUID of the authenticated user
        db (Session): Database session dependency

    Returns:
        list: List of queues the user is a member of

    The response is sorted by personal queue first, then by name.

    Raises:
        HTTPException: 404 error if user is not found
    """
    user = db.query(User).filter(User.auth_user_uuid == auth_user_uuid).first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    queues = (
        db.query(Queue)
        .join(QueueMember, Queue.queue_id == QueueMember.queue_id)
        .filter(QueueMember.user_id == user.user_id)
        .all()
    )

    return [
        {
            "personal": queue.queue_id == user.queue_id,
            "queue_id": queue.queue_id,
            "name": queue.name,
            "languages": queue.languages,
            "region": queue.region,
        }
        for queue in queues
    ].sort(key=lambda x: (not x["personal"], x["name"]))
