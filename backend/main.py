from settlement import calculate_net_balance, simplify_debts, generate_settlements
from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "SmartSplit API is running"}

@app.post("/settle")
def settle(paid:dict, fair_share:dict):
    balances = calculate_net_balance(paid,fair_share)
    creditors, debtors = simplify_debts(balances)
    settlements = generate_settlements(creditors,debtors)
    return {"settlements": settlements}