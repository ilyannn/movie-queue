from sqlalchemy import UUID, Column, ForeignKey, Integer, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Queue(Base):
    __tablename__ = "queues"
    queue_id = Column(Integer, primary_key=True, index=True)
    name = Column(Text, nullable=False)
    languages = Column(Text, nullable=False)
    region = Column(Text, nullable=False)


class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, index=True)
    auth_user_uuid = Column(UUID, nullable=False, index=True)
    queue_id = Column(Integer, ForeignKey("queues.queue_id"))
    locale = Column(Text, nullable=False)


class QueueMember(Base):
    __tablename__ = "queue_members"
    queue_id = Column(Integer, ForeignKey("queues.queue_id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), primary_key=True)
