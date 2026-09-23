# SmartSplit 💸

A full-stack expense splitting web app that calculates the **minimum number of transactions** needed to settle debts within a group — no awkward math, no unnecessary payments.

## The Problem It Solves

When a group of friends share expenses (trips, dinners, rent), the naive approach results in many back-and-forth payments. SmartSplit uses a **greedy graph-based algorithm** to reduce these to the absolute minimum number of transactions.

**Example:** 4 people, 6 possible payments → SmartSplit reduces it to just 3.

## Tech Stack

- **Backend:** Python, FastAPI, SQLAlchemy
- **Database:** PostgreSQL
- **Frontend:** React, Vite
- **Algorithm:** Greedy debt-simplification (net balance → creditor/debtor split → minimum settlements)

## How the Algorithm Works

1. Calculate each person's **net balance** = amount paid − fair share
2. Split into **creditors** (positive balance, owed money) and **debtors** (negative balance, owe money)
3. Greedily match the largest debtor with the largest creditor, transfer the minimum of the two amounts, repeat until all balances are zero

## Project Structure


## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/people` | Add a person with amount paid |
| GET | `/people` | Retrieve all saved people |
| DELETE | `/people` | Clear all people |
| POST | `/settle` | Calculate minimum settlements |

## Running Locally

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Database
Requires PostgreSQL running locally on port 5432 with a database named `smartsplit`.