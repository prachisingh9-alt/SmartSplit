from settlement import calculate_net_balance, simplify_debts, generate_settlements
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal
from database import engine
from models import Person, Group
import models


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app = FastAPI()
models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "SmartSplit API is running"}

@app.post("/settle")
def settle(paid:dict, fair_share:dict):
    balances = calculate_net_balance(paid,fair_share)
    creditors, debtors = simplify_debts(balances)
    settlements = generate_settlements(creditors,debtors)
    return {"settlements": settlements}

from fastapi import Depends
from models import Person

@app.post("/people")
def add_person(name: str, paid: float, group_id: int, db=Depends(get_db)):
    new_person = Person(name=name, paid=paid)
    db.add(new_person)
    db.commit()
    db.refresh(new_person)
    return new_person

@app.get("/people")
def get_people(group_id: int, db=Depends(get_db)):
    return db.query(Person).filter(Person.group_id == group_id).all()

@app.delete("/people")
def clear_people(group_id: int, db=Depends(get_db)):
    db.query(Person).filter(Person.group_id == group_id).delete()
    db.commit()
    return {"message": "All people cleared"}

@app.post("/groups")
def create_group(name: str, db=Depends(get_db)):
    new_group = Group(name=name)
    db.add(new_group)
    db.commit()
    db.refresh(new_group)
    return new_group

@app.get("/groups")
def get_groups(db=Depends(get_db)):
    return db.query(Group).all()