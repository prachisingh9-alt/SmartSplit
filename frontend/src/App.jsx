import './App.css'
import { useState, useEffect } from 'react'

function App() {
  const [groups, setGroups] = useState([])
  const [activeGroup, setActiveGroup] = useState(null)
  const [groupName, setGroupName] = useState('')
  const [people, setPeople] = useState([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [settlements, setSettlements] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/groups')
      .then(r => r.json())
      .then(data => setGroups(data))
  }, [])

  useEffect(() => {
    if (activeGroup) {
      fetch('http://127.0.0.1:8000/people?group_id=' + activeGroup.id)
        .then(r => r.json())
        .then(data => setPeople(data))
      setSettlements([])
    }
  }, [activeGroup])

  function handleCreateGroup() {
    if (!groupName.trim()){
      alert('Please enter a group name')
      return
    }
    fetch('http://127.0.0.1:8000/groups?name=' + groupName, { method: 'POST' })
      .then(r => r.json())
      .then(data => {
        setGroups([...groups, data])
        setActiveGroup(data)
        setGroupName('')
      })
  }

  function handleAddPerson() {
    if (!name.trim()) {
      alert('Please enter a name')
      return 
    }
    if (!amount ||Number(amount) <= 0){
      alert('Please enter a valid amount greater than 0')
      return
    }
    if(!activeGroup) {
      alert('Please select a group first')
      return
    }
    fetch('http://127.0.0.1:8000/people?name=' + name.trim() + '&paid=' + amount + '&group_id=' + activeGroup.id, { method: 'POST' })
      .then(r => r.json())
      .then(data => {
        setPeople([...people, data])
        setName('')
        setAmount('')
      })
  }

  function handleClick() {
    if (people.length < 2) {
      alert('Add at least 2 people to calculate settlements')
      return
    }
    const paid = {}
    people.forEach(p => { paid[p.name] = p.paid })
    const total = people.reduce((sum, p) => sum + p.paid, 0)
    const share = total / people.length
    const fairShare = {}
    people.forEach(p => { fairShare[p.name] = share })
    fetch('http://127.0.0.1:8000/settle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paid, fair_share: fairShare })
    })
      .then(r => r.json())
      .then(data => setSettlements(data.settlements))
  }

  function handleClear() {
    if (!activeGroup) return
    fetch('http://127.0.0.1:8000/people?group_id=' + activeGroup.id, { method: 'DELETE' })
      .then(r => r.json())
      .then(() => {
        setPeople([])
        setSettlements([])
      })
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
            placeholder="Group name (e.g. Goa Trip)"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
          />
          <button className="btn btn-secondary" onClick={handleCreateGroup}>Create Group</button>
        </div>

        {groups.length > 0 && (
          <div className="groups-row">
            {groups.map(g => (
              <button
                key={g.id}
                className={`group-pill ${activeGroup?.id === g.id ? 'active' : ''}`}
                onClick={() => setActiveGroup(g)}
              >
                {g.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {activeGroup && (
        <div className="card">
          <h3 className="settlements-title">{activeGroup.name}</h3>

          <div className="form-row">
            <input className="input-field" type="text" placeholder="Name"
              value={name} onChange={e => setName(e.target.value)} />
            <input className="input-field" type="number" placeholder="Amount paid"
              value={amount} onChange={e => setAmount(e.target.value)} />
            <button className="btn btn-secondary" onClick={handleAddPerson}>Add</button>
          </div>

          <ul className="people-list">
            {people.map((person, index) => (
              <li className="people-item" key={index}>{person.name} paid ₹{person.paid}</li>
            ))}
          </ul>

          {people.length > 0 && (
            <button className="btn btn-clear" onClick={handleClear}>Clear All</button>
          )}

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
      )}
    </div>
  )
}

export default App