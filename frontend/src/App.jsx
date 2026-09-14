import { useState } from 'react'

function App(){
  const [message,setMessage] = useState('')
  const [people,setPeople] = useState([])
  const [name,setName] = useState('')
  const [amount,setAmount] = useState('')

  function handleAddPerson() {
    setPeople([...people, { name: name, paid: Number(amount) }])
    setName('')
    setAmount('')
  }

  function handleClick(){
    const paid = {}
    people.forEach((person) => {
      paid[person.name] = person.paid
    })

    const total = people.reduce((sum,person) => sum + person.paid,0)
    const share = total / people.length

    const fairShare = {}
    people.forEach((person) => {
      fairShare[person.name] = share
    })

    fetch('http://127.0.0.1:8000/settle',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        paid:paid,fair_share:fairShare
          })
    })
    .then(response => response.json())
    .then(data => setMessage(JSON.stringify(data.settlements)))
}

 return (
    <div>
      <h1>SmartSplit</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount paid"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleAddPerson}>Add Person</button>

      <ul>
        {people.map((person,index)=>(
          <li key={index}>{person.name} paid {person.paid}</li>
        ))}
      </ul>

      <button onClick={handleClick}>Calculate Settlements</button>
      <p>{message}</p>
    </div>
  )
}

export default App
