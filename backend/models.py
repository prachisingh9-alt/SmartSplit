from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    people = relationship("Person", back_populates="group")

class Person(Base):
    __tablename__ = "people"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    paid = Column(Float)
    group_id = Column(Integer, ForeignKey("groups.id"))
    group = relationship("Group", back_populates="people")