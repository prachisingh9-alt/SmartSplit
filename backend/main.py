from settlement import calculate_net_balance, simplify_debts, generate_settlements
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

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