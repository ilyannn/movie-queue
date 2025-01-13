from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.postgres import Queue, QueueMember, User
from app.schemas.user import UserCreate, UserSchema, UserUpdate

router = APIRouter()


@router.get("/users/{auth_user_uuid}", response_model=UserSchema)
async def get_user(
    auth_user_uuid: UUID,
    db: Session = Depends(get_db),
):
    """
    Get user details including associated queue information.

    Args:
        auth_user_uuid (UUID): The UUID of the authenticated user
        db (Session, optional): Database session. Defaults to Depends(get_db)

    Returns:
        dict: User details containing:
            - user_id: The internal user ID
            - auth_user_uuid: The authentication UUID
            - queue_id: The associated queue ID
            - user_name: Name from the associated queue
            - user_locale: User interface language setting
            - languages: Language preference from queue
            - region: Region setting from queue

    Raises:
        HTTPException: 404 error if user is not found
    """
    user = db.query(User).filter(User.auth_user_uuid == auth_user_uuid).first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    queue = db.query(Queue).filter(Queue.queue_id == user.queue_id).first()
    return {
        "user_id": user.user_id,
        "auth_user_uuid": user.auth_user_uuid,
        "queue_id": user.queue_id,
        "user_name": queue.name,
        "user_locale": user.locale,
        "languages": queue.languages,
        "region": queue.region,
    }


@router.put("/users/{auth_user_uuid}", response_model=UserSchema)
async def create_or_update_user(
    auth_user_uuid: UUID,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
):
    """
    Creates a new user or updates an existing one based on the auth_user_uuid.

    This function performs the following:
    1. If user doesn't exist:
        - Validates required fields
        - Creates a new queue
        - Creates a new user
        - Creates queue membership
    2. If user exists:
        - Updates queue and user attributes

    Args:
         auth_user_uuid (UUID): Unique identifier from authentication system
         user_data (UserUpdate): Pydantic model containing user data to create/update
         db (Session): Database session dependency

    Returns:
         dict: Updated user information

    Raises:
         HTTPException: If required fields are missing during user creation (422)
    """
    user = db.query(User).filter(User.auth_user_uuid == auth_user_uuid).first()

    if not user:
        user_data_dict = user_data.model_dump(exclude_unset=True)

        for field, info in UserCreate.__pydantic_fields__.items():
            if info.is_required() and user_data_dict[field] is None:
                raise HTTPException(
                    status_code=422, detail=f"Missing required field: {field}"
                )

        # Create new queue
        new_queue = Queue(
            name=user_data.user_name,
            languages=user_data.languages,
            region=user_data.region,
        )

        db.add(new_queue)
        db.flush()

        # Create new user
        user = User(
            auth_user_uuid=auth_user_uuid,
            locale=user_data.user_locale,
            queue_id=new_queue.queue_id,
        )
        db.add(user)

        db.flush()

        # Create queue membership
        queue_member = QueueMember(queue_id=new_queue.queue_id, user_id=user.user_id)
        db.add(queue_member)
    else:
        # Update existing user
        queue = db.query(Queue).filter(Queue.queue_id == user.queue_id).first()

        for key, value in user_data.model_dump(exclude_unset=True).items():
            match key:
                case "user_name":
                    setattr(queue, "name", value)
                case "user_locale":
                    setattr(user, "locale", value)
                case "languages" | "region":
                    setattr(queue, key, value)
                case _:
                    setattr(user, key, value)

    db.commit()
    return await get_user(auth_user_uuid, db=db)


@router.delete("/users/{auth_user_uuid}")
async def delete_user(
    auth_user_uuid: UUID,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.auth_user_uuid == auth_user_uuid).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Delete queue membership
    db.query(QueueMember).filter(QueueMember.user_id == user.user_id).delete()

    # Delete the queue if this was the only member
    queue_members = (
        db.query(QueueMember).filter(QueueMember.queue_id == user.queue_id).count()
    )
    if queue_members == 0:
        db.query(Queue).filter(Queue.queue_id == user.queue_id).delete()

    # Delete the user
    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}
