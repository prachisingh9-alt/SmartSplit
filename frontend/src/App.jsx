import './App.css'
import { useState, useEffect } from 'react'

function App(){
  const [settlements, setSettlements] = useState([])
  const [people, setPeople] = useState([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/people')
      .then(response => response.json())
      .then(data => setPeople(data))
  }, [])

  function handleAddPerson() {
    fetch('http://127.0.0.1:8000/people?name=' + name + '&paid=' + amount, {
      method: 'POST'
    })
      .then(response => response.json())
      .then(data => {
        setPeople([...people, data])
        setName('')
        setAmount('')
      })
  }

  function handleClick(){
    const paid = {}
    people.forEach((person) => {
      paid[person.name] = person.paid
    })

    const total = people.reduce((sum, person) => sum + person.paid, 0)
    const share = total / people.length

    const fairShare = {}
    people.forEach((person) => {
      fairShare[person.name] = share
    })

    fetch('http://127.0.0.1:8000/settle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paid: paid, fair_share: fairShare })
    })
      .then(response => response.json())
      .then(data => setSettlements(data.settlements))
  }

  return (
    <div className="app-container">
      <h1 className="app-title">SmartSplit</h1>
      <p className="app-subtitle">Split expenses. Not friendships.</p>

      <div className="card">
        <div className="form-row">
          <input
            className="input-field"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input-field"
            type="number"
            placeholder="Amount paid"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button className="btn btn-secondary" onClick={handleAddPerson}>Add Person</button>
        </div>

        <ul className="people-list">
          {people.map((person, index) => (
            <li className="people-item" key={index}>{person.name} paid ₹{person.paid}</li>
          ))}
        </ul>

        <button className="btn btn-primary" onClick={handleClick}>Calculate Settlements</button>

        {settlements.length > 0 && (
          <div className="settlements-container">
            <h3 className="settlements-title">Settlement Plan</h3>
            {settlements.map((s, index) => (
              <div className="settlement-card" key={index}>
                <span className="debtor">{s[0]}</span>
                <span className="arrow">pays</span>
                <span className="creditor">{s[1]}</span>
                <span className="amount">₹{s[2]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App