def calculate_net_balance(paid,fair_share):
    balances={}
    for person in paid:
        balances[person] = paid[person] - fair_share[person]
    return balances

def simplify_debts(balances):
    creditors = []
    debtors = []

    for person in balances:
        amount = balances[person]
        if amount > 0:
            creditors.append([person,amount])
        elif amount < 0:
            debtors.append([person,amount])
    return creditors, debtors

def generate_settlements(creditors,debtors):
    settlements = []

    while creditors and debtors:
        creditor = creditors[0]
        debtor = debtors[0]

        creditor_name, credit_amount = creditor
        debtor_name, debt_amount = debtor

        payment = min(credit_amount , -debt_amount)

        settlements.append([debtor_name,creditor_name,payment])

        creditor[1] -= payment
        debtor[1] += payment

        if creditor[1] == 0:
            creditors.pop(0)
        if debtor[1] == 0:
            debtors.pop(0)   
    return settlements

if __name__ == "__main__":
    paid = {"Prachi": 7000, "Riya": 2000, "Ananya": 1000, "Sneha": 0}
    fair_share = {"Prachi": 2500, "Riya": 2500, "Ananya": 2500, "Sneha": 2500}
    balances = calculate_net_balance(paid,fair_share)
    print(balances)

    creditors, debtors = simplify_debts(balances)
    print("Creditors:", creditors)
    print("Debtors:", debtors)

    settlements = generate_settlements(creditors, debtors)
    print("Settlements:", settlements)
