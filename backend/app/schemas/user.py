from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class UserBase(BaseModel):
    queue_id: Optional[int] = None


class UserCreate(UserBase):
    user_name: str
    user_locale: str
    languages: str
    region: str


class UserUpdate(UserBase):
    user_name: Optional[str] = None
    user_locale: Optional[str] = None
    languages: Optional[str] = None
    region: Optional[str] = None


class UserSchema(UserBase):
    auth_user_uuid: UUID
    user_id: int
    user_name: str
    user_locale: str
    languages: str
    region: str

    class Config:
        from_attributes = True
